import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function GET(request, { params }) {
  const { userId } = await params;

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
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ recs: data });
}