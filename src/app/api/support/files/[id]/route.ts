import { get } from "@vercel/blob";
import { currentUser } from "@/lib/auth";
import { authorizedUpload } from "@/lib/supportUploads";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await currentUser();
  if (!user) return new Response("Not found", { status: 404 });
  const file = await authorizedUpload(user, (await params).id);
  if (!file) return new Response("Not found", { status: 404 });
  try {
    const blob = await get(file.pathname, { access: "private" });
    if (!blob || blob.statusCode !== 200)
      return new Response("Not found", { status: 404 });
    return new Response(blob.stream, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
        "Cache-Control": "private, no-store",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "sandbox; default-src 'none'",
      },
    });
  } catch {
    return new Response("File unavailable", { status: 502 });
  }
}
