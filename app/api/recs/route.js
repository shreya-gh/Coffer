import { createClient } from "@supabase/supabase-js";
import { fetchOG, isValidUrl, isReachable } from "@/lib/fetchOG";
import checkDuplicate from "@/lib/checkDuplicate";
import verifyLink from "@/lib/verifyLink";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let query = supabase
    .from("recommendations")
    .select(`
      id,
      title,
      category,
      submitter_name,
      description,
      one_word,
      link,
      og_image,
      og_title,
      submitted_at
    `)
    .eq("status", "approved")
    .order("submitted_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ recs: data });
}

export async function POST(request) {
  const body = await request.json();
  const { title, category, submitter_name, description, one_word, link, user_id } = body;

  if (!title || !category || !submitter_name || !description || !user_id) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const duplicate = await checkDuplicate(title, category);
  if (duplicate && duplicate.isDuplicate) {
    return Response.json({
      error: "Possible duplicate",
      matchedTitle: duplicate.matchedTitle,
      matchedId: duplicate.matchedId,
    }, { status: 409 });
  }

  let ogData = { og_image: null, og_title: null, og_description: null };
  if (link) {
    if (!isValidUrl(link)) {
      return Response.json({ error: "Invalid URL format" }, { status: 400 });
    }
    const reachable = await isReachable(link);
    if (!reachable) {
      return Response.json({ error: "Website is not reachable" }, { status: 400 });
    }
    const safety = await verifyLink(link);
    if (!safety.safe) {
      return Response.json({ error: `Link rejected: ${safety.reason}` }, { status: 400 });
    }
    ogData = await fetchOG(link);
  }

  const { data: existingUser } = await supabase
    .from("users")
    .select("id, submission_count")
    .eq("id", user_id)
    .single();

  if (!existingUser) {
    await supabase.from("users").insert({
      id: user_id,
      display_name: submitter_name,
    });
  } else {
    await supabase
      .from("users")
      .update({
        last_seen: new Date().toISOString(),
        submission_count: existingUser.submission_count + 1,
      })
      .eq("id", user_id);
  }

  const { data, error } = await supabase
    .from("recommendations")
    .insert({
      title,
      category,
      submitter_name,
      description,
      one_word: one_word || null,
      link: link || null,
      user_id,
      og_image: ogData.og_image,
      og_title: ogData.og_title,
      og_description: ogData.og_description,
      status: "approved",
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ rec: data }, { status: 201 });
}