import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { currentUser } from "@/lib/auth";
import {
  completeUpload,
  MAX_UPLOAD,
  reserveUpload,
} from "@/lib/supportUploads";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, payload) => {
        if (request.headers.get("origin") !== new URL(request.url).origin)
          throw new Error("Invalid origin");
        const user = await currentUser();
        if (!user?.discord_id)
          throw new Error("Sign in and link Discord first");
        const p = JSON.parse(payload ?? "{}");
        const reserved = await reserveUpload(
          user,
          String(p.ticket ?? ""),
          String(p.id ?? ""),
          String(p.name ?? ""),
          String(p.mime ?? ""),
          Number(p.bytes),
        );
        if (!reserved || reserved !== pathname)
          throw new Error("Ticket closed, access changed, or limit reached");
        return {
          allowedContentTypes: [p.mime],
          maximumSizeInBytes: Math.min(Number(p.bytes), MAX_UPLOAD),
          validUntil: Date.now() + 10 * 60 * 1000,
          addRandomSuffix: false,
          allowOverwrite: false,
          tokenPayload: JSON.stringify({
            id: p.id,
            actor: user.steam_id,
            pathname,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const p = JSON.parse(tokenPayload ?? "{}");
        if (
          blob.pathname !== p.pathname ||
          !(await completeUpload(p.id, p.actor, p.pathname))
        )
          throw new Error("Upload access changed");
      },
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        error:
          "Upload unavailable. Check ticket access, file type and size, then retry.",
      },
      { status: 400 },
    );
  }
}
