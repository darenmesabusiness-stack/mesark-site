import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";

/** Who's signed in, for the navbar (pages stay static; this is fetched after load). */
export async function GET() {
  const enabled = dbConfigured();
  const user = enabled ? await currentUser() : null;
  return NextResponse.json(
    { enabled, user: user ? { persona: user.persona, avatar: user.avatar } : null },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
