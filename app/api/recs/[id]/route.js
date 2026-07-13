import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function GET(request, { params }) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("recommendations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return Response.json({ error: "Rec not found" }, { status: 404 });
  }

  return Response.json({ rec: data });
}