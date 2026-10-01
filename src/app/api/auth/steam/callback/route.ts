import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_DAYS,
  STATE_COOKIE,
  cookieOptions,
  createSession,
  steamProfile,
  upsertUser,
  verifySteamReply,
} from "@/lib/auth";

/** Steam sends the player back here; confirm the claim with Steam, then start a session. */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const params = request.nextUrl.searchParams;
  const state = params.get("state") ?? "";
  const fail = (why: string) => {
    const res = NextResponse.redirect(`${origin}/account?error=${why}`);
    res.cookies.set(STATE_COOKIE, "", cookieOptions(0));
    return res;
  };

  if (!state || state !== request.cookies.get(STATE_COOKIE)?.value) return fail("expired");

  const steamId = await verifySteamReply(params, `${origin}/api/auth/steam/callback?state=${state}`);
  if (!steamId) return fail("steam");

  try {
    const profile = await steamProfile(steamId);
    await upsertUser(steamId, profile.persona, profile.avatar);
    const token = await createSession(steamId);
    const res = NextResponse.redirect(`${origin}/account?welcome=1`);
    res.cookies.set(SESSION_COOKIE, token, cookieOptions(SESSION_DAYS * 86400));
    res.cookies.set(STATE_COOKIE, "", cookieOptions(0));
    return res;
  } catch (e) {
    console.error("steam sign-in failed", e);
    return fail("server");
  }
}
