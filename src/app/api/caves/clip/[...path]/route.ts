import { get } from "@vercel/blob";
import type { NextRequest } from "next/server";

/**
 * Serves cave clips uploaded in the staff cave editor. The Blob store is private, so clips are
 * streamed through here. Names are unique per upload, so they're cached for a year. Byte ranges
 * are passed through, which Safari needs to play MP4s.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const pathname = (await params).path.join("/");
  if (!/^caves\/[a-z0-9-]+\/[a-z0-9-]+\.(gif|mp4|webm)$/.test(pathname)) return new Response("Not found", { status: 404 });

  const range = request.headers.get("range");
  let blob;
  try {
    blob = await get(pathname, { access: "private", ...(range ? { headers: { range } } : {}) });
  } catch (e) {
    console.error("cave clip read failed", e);
    return new Response("Clip unavailable", { status: 502 });
  }
  if (!blob || blob.statusCode !== 200) return new Response("Not found", { status: 404 });

  const headers = new Headers({
    "Content-Type": blob.blob.contentType,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "CDN-Cache-Control": "public, max-age=31536000, immutable",
  });
  for (const h of ["content-length", "content-range", "etag", "last-modified"]) {
    const v = blob.headers.get(h);
    if (v) headers.set(h, v);
  }
  return new Response(blob.stream, { status: blob.headers.get("content-range") ? 206 : 200, headers });
}
