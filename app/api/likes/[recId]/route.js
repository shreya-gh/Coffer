import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function GET(request, { params }) {
  const { recId } = await params;
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");

  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("rec_id", recId);

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

  return Response.json({ count: count || 0, userLiked });
}

export async function POST(request, { params }) {
  const { recId } = await params;
  const body = await request.json();
  const { user_id } = body;

  if (!user_id) {
    return Response.json({ error: "Missing user_id" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("rec_id", recId)
    .eq("user_id", user_id)
    .single();

  if (existing) {
    await supabase.from("likes").delete().eq("id", existing.id);
    return Response.json({ liked: false });
  } else {
    await supabase.from("likes").insert({ rec_id: recId, user_id });
    return Response.json({ liked: true });
  }
}