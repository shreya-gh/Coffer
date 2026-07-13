const ogs = require("open-graph-scraper");
const axios = require("axios");

// Step 1 — check if URL format is valid
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Step 2 — check if URL is actually reachable
async function isReachable(url) {
  try {
    await axios.head(url, { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

// Step 3 — fetch OG metadata
async function fetchOG(url) {
  if (!isValidUrl(url)) {
    return { error: "Invalid URL format" };
  }

  const reachable = await isReachable(url);
  if (!reachable) {
    return { error: "Website is not reachable" };
  }

  try {
    const { result } = await ogs({ url });
    return {
      og_image: result.ogImage?.[0]?.url || null,
      og_title: result.ogTitle || null,
      og_description: result.ogDescription || null,
    };
  } catch {
    // site was reachable but had no OG tags — that's fine
    return {
      og_image: null,
      og_title: null,
      og_description: null,
    };
  }
}

module.exports = { fetchOG, isValidUrl, isReachable };