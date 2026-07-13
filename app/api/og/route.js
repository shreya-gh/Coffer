import { fetchOG, isValidUrl, isReachable } from "@/lib/fetchOG";
import verifyLink from "@/lib/verifyLink";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return Response.json({ error: "No URL provided" }, { status: 400 });
  }

  if (!isValidUrl(url)) {
    return Response.json({ error: "Invalid URL format" }, { status: 400 });
  }

  const reachable = await isReachable(url);
  if (!reachable) {
    return Response.json({ error: "Website is not reachable" }, { status: 400 });
  }

  const safety = await verifyLink(url);
  if (!safety.safe) {
    return Response.json({ error: `Link rejected: ${safety.reason}` }, { status: 400 });
  }

  const data = await fetchOG(url);
  return Response.json(data);
}