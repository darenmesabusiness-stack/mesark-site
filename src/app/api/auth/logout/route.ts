import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, cookieOptions, endSession } from "@/lib/auth";

/** Sign out (form POST from /account; SameSite=Lax keeps other sites from triggering it). */
export async function POST(request: NextRequest) {
  try {
    await endSession(request.cookies.get(SESSION_COOKIE)?.value);
  } catch (e) {
    console.error("sign-out failed", e);
  }
  const res = NextResponse.redirect(`${request.nextUrl.origin}/account`, 303);
  res.cookies.set(SESSION_COOKIE, "", cookieOptions(0));
  return res;
}
