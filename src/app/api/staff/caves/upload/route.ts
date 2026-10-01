import { put } from "@vercel/blob";
import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@/lib/auth";
import { caveSlug } from "@/lib/caveStore";
import { isLead } from "@/lib/staff";

// Vercel caps a function's request body at 4.5 MB.
const MAX_BYTES = 4 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/gif": "gif", "video/mp4": "mp4", "video/webm": "webm" };

/** Uploads a cave walkthrough clip (lead admins). Returns the site URL the clip is served from. */
export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!isLead(user)) return NextResponse.json({ error: "Only lead admins and the owner can upload clips." }, { status: 403 });

  const form = await request.formData();
  const file = form.get("file");
  const map = String(form.get("map") ?? "");
  if (!(file instanceof File)) return NextResponse.json({ error: "Pick a clip to upload." }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ error: "Clips must be a GIF, MP4 or WebM." }, { status: 400 });
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `That clip is ${(file.size / 1048576).toFixed(1)} MB; the limit is 4 MB. Trim it or export it as MP4.` },
      { status: 400 },
    );
  }
  if (!/^[a-z0-9-]+$/.test(map)) return NextResponse.json({ error: "Unknown map." }, { status: 400 });

  const pathname = `caves/${map}/${caveSlug(String(form.get("name") ?? "cave"))}-${Date.now().toString(36)}.${ext}`;
  try {
    await put(pathname, file, { access: "private", contentType: file.type, addRandomSuffix: false });
  } catch (e) {
    console.error("cave clip upload failed", e);
    return NextResponse.json({ error: "The upload failed on our side. Try again in a minute." }, { status: 502 });
  }
  return NextResponse.json({ url: `/api/caves/clip/${pathname}` });
}
