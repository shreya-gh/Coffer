const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// GET /api/likes/:recId — get like count and whether user liked it
router.get("/:recId", async (req, res) => {
  const { recId } = req.params;
  const { user_id } = req.query;

  // get total like count
  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("rec_id", recId);

  // check if this user liked it
  let userLiked = false;
  if (user_id) {
    const { data } = await supabase
      .from("likes")
      .select("id")
      .eq("rec_id", recId)
      .eq("user_id", user_id)
      .single();
    userLiked = !!data;
  }

  return res.json({ count: count || 0, userLiked });
});

// POST /api/likes — toggle like on or off
router.post("/", async (req, res) => {
  const { rec_id, user_id } = req.body;

  if (!rec_id || !user_id) {
    return res.status(400).json({ error: "Missing rec_id or user_id" });
  }

  // check if already liked
  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("rec_id", rec_id)
    .eq("user_id", user_id)
    .single();

  if (existing) {
    // unlike — remove the row
    await supabase.from("likes").delete().eq("id", existing.id);
    return res.json({ liked: false });
  } else {
    // like — insert a row
    await supabase.from("likes").insert({ rec_id, user_id });
    return res.json({ liked: true });
  }
});

module.exports = router;