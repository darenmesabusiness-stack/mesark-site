import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@/lib/auth";
import { claimOwner } from "@/lib/staff";

/** One-time setup: the only account on the site becomes the owner. */
export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const user = await currentUser();
  if (!user) return NextResponse.redirect(`${origin}/staff`, 303);
  const ok = await claimOwner(user);
  if (ok) console.log("staff: owner access claimed");
  return NextResponse.redirect(`${origin}/staff?${ok ? "claimed=1" : "error=claim"}`, 303);
}
