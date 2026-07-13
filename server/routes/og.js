const express = require("express");
const { fetchOG, isReachable, isValidUrl } = require("../utils/fetchOG");

const router = express.Router();

router.get("/", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  const reachable = await isReachable(url);
  if (!reachable) {
    return res.status(400).json({ error: "Website is not reachable" });
  }

  const data = await fetchOG(url);
  return res.json(data);
});

module.exports = router;