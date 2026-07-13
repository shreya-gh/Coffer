const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const { fetchOG, isValidUrl, isReachable } = require("../utils/fetchOG");
const checkDuplicate = require("../utils/checkDuplicate");
const verifyLink = require("../utils/verifyLink");

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// GET /api/recs — fetch all approved recs
router.get("/", async (req, res) => {
  const { category, sort } = req.query;

  let query = supabase
    .from("recommendations")
    .select(`
      id,
      title,
      category,
      submitter_name,
      one_word,
      description,
      link,
      og_image,
      og_title,
      submitted_at
    `)
    .eq("status", "approved");

  // filter by category if provided
  if (category) {
    query = query.eq("category", category);
  }

  // sort by likes or date
  if (sort === "liked") {
    query = query.order("submitted_at", { ascending: false });
  } else {
    query = query.order("submitted_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ recs: data });
});

// GET /api/recs/:id — fetch a single rec
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("recommendations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Rec not found" });
  }

  return res.json({ rec: data });
});

// POST /api/recs — submit a new rec
router.post("/", async (req, res) => {
  const { title, category, submitter_name,one_word: one_word, description, link, user_id } =
    req.body;

  // 1 — validate required fields
  if (!title || !category || !submitter_name ||!one_word || !description || !user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // 2 — check for duplicate
  const duplicate = await checkDuplicate(title, category);
  if (duplicate && duplicate.isDuplicate) {
    return res.status(409).json({
      error: "Possible duplicate",
      matchedTitle: duplicate.matchedTitle,
      matchedId: duplicate.matchedId,
    });
  }

  // 3 — handle link if provided
  let ogData = { og_image: null, og_title: null, og_description: null };
  if (link) {
    if (!isValidUrl(link)) {
      return res.status(400).json({ error: "Invalid URL format" });
    }
    const reachable = await isReachable(link);
    if (!reachable) {
      return res.status(400).json({ error: "Website is not reachable" });
    }

  const safety = await verifyLink(link);
    if (!safety.safe) {
      return res.status(400).json({ error: `Link rejected: ${safety.reason}` });
    }
    ogData = await fetchOG(link);
  }

  // 4 — auto create user if they don't exist yet
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("id", user_id)
    .single();

  if (!existingUser) {
    await supabase.from("users").insert({
      id: user_id,
      display_name: submitter_name,
    });
  } else {
    // update last seen and submission count
    await supabase
      .from("users")
      .update({
        last_seen: new Date().toISOString(),
        submission_count: existingUser.submission_count + 1,
      })
      .eq("id", user_id);
  }

  // 5 — insert the rec
  const { data, error } = await supabase
    .from("recommendations")
    .insert({
      title,
      category,
      submitter_name,
      one_word: one_word || null,
      description,
      link: link || null,
      user_id,
      og_image: ogData.og_image,
      og_title: ogData.og_title,
      og_description: ogData.og_description,
      status: "approved", // change to 'pending' when approval system is activated
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ rec: data });
});

// GET /api/recs/user/:userId — fetch all recs by a specific user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("recommendations")
    .select(`
      id,
      title,
      category,
      description,
      one_word,
      link,
      og_image,
      submitted_at,
      status
    `)
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ recs: data });
});
module.exports = router;