import axios from "axios";
import { promises as dns } from "dns";

// Extract domain from URL
function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

// Google Safe Browsing 
async function checkSafeBrowsing(url) {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;
  if (!apiKey) return { safe: true }; // skip if no key configured

  try {
    const res = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      {
        client: {
          clientId: "coffer",
          clientVersion: "1.0.0",
        },
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "POTENTIALLY_HARMFUL_APPLICATION",
          ],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }],
        },
      }
    );

    const matches = res.data.matches;
    if (matches && matches.length > 0) {
      return {
        safe: false,
        reason: "flagged by Google Safe Browsing as unsafe",
      };
    }

    return { safe: true };
  } catch {
    return { safe: true }; // if API fails, don't block submission
  }
}

// Spamhaus DBL 
async function checkSpamhaus(url) {
  const domain = getDomain(url);
  if (!domain) return { safe: true };

  
  const query = `${domain}.dbl.spamhaus.org`;

  try {
    const result = await dns.resolve4(query);

    // Spamhaus c:
    // 127.0.1.2 = spam 
    // 127.0.1.4 = phishing 
    // 127.0.1.5 = malware 
    // 127.0.1.6 = botnet 
    // 127.0.1.102
    // 127.0.1.103 
    if (result && result.length > 0) {
      return {
        safe: false,
        reason: "domain flagged by Spamhaus as spam or unsafe",
      };
    }

    return { safe: true };
  } catch {
    // NXDOMAIN 
    return { safe: true };
  }
}

//  parallel check
async function verifyLink(url) {
  const [safeBrowsing, spamhaus] = await Promise.all([
    checkSafeBrowsing(url),
    checkSpamhaus(url),
  ]);

  if (!safeBrowsing.safe) {
    return { safe: false, reason: safeBrowsing.reason };
  }

  if (!spamhaus.safe) {
    return { safe: false, reason: spamhaus.reason };
  }

  return { safe: true };
}

export default verifyLink;