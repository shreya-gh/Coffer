import ogs from "open-graph-scraper";
import axios from "axios";

//check if URL format  valid
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

//  if URL  reachable
async function isReachable(url) {
  try {
    await axios.head(url, { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

//  OG metadata
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
    
    return {
      og_image: null,
      og_title: null,
      og_description: null,
    };
  }
}

export { fetchOG, isValidUrl, isReachable };