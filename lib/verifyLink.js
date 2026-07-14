import axios from "axios";
import { promises as dns } from "dns";

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
    return { safe: true }; //  don't block submission
  }
}


async function verifyLink(url) {
  return await checkSafeBrowsing(url);
}


export default verifyLink;