import { NextResponse, type NextRequest } from "next/server";
import { STATE_COOKIE, cookieOptions, randomToken, steamLoginUrl } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";

/** Starts "Sign in through Steam": a one-time state in a cookie, then off to Steam. */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  if (!dbConfigured()) return NextResponse.redirect(`${origin}/account?error=off`);

  const state = randomToken(16);
  const returnTo = `${origin}/api/auth/steam/callback?state=${state}`;
  const res = NextResponse.redirect(steamLoginUrl(origin, returnTo));
  res.cookies.set(STATE_COOKIE, state, cookieOptions(600));
  return res;
}
