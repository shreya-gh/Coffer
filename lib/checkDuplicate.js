import Fuse from "fuse.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function checkDuplicate(title, category) {
  //  approved recs in  same category
  const { data, error } = await supabase
    .from("recommendations")
    .select("id, title")
    .eq("category", category);

  if (error || !data || data.length === 0) {
    return null; // no existing recs
  }

  // fuzzy match title
  const fuse = new Fuse(data, {
    keys: ["title"],
    threshold: 0.3, 
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

export default checkDuplicate;