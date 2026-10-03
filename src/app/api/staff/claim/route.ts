import { NextResponse } from "next/server";

/** Initial setup is complete. This must never reopen when owners disappear. */
export async function POST() {
  return NextResponse.json({ error: "Owner setup is closed." }, { status: 410 });
}
