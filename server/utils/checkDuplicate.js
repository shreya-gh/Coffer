const Fuse = require("fuse.js");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function checkDuplicate(title, category) {
  // fetch all approved recs in the same category
  const { data, error } = await supabase
    .from("recommendations")
    .select("id, title")
    .eq("category", category);

  if (error || !data || data.length === 0) {
    return null; // no existing recs, no duplicate possible
  }

  // fuzzy match the incoming title against existing ones
  const fuse = new Fuse(data, {
    keys: ["title"],
    threshold: 0.3, // 0 = exact match only, 1 = match anything
  });

  const matches = fuse.search(title);

  if (matches.length > 0) {
    return {
      isDuplicate: true,
      matchedTitle: matches[0].item.title,
      matchedId: matches[0].item.id,
      score: matches[0].score,
    };
  }

  return { isDuplicate: false };
}

module.exports = checkDuplicate;