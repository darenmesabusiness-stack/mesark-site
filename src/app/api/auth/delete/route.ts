import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, cookieOptions, deleteAccount, userForToken } from "@/lib/auth";
import { botPost } from "@/lib/bot";

/** Deletes the signed-in account and all its sessions. Needs the confirm box ticked. */
export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const form = await request.formData();
  if (form.get("confirm") !== "yes") return NextResponse.redirect(`${origin}/account?error=confirm`, 303);

  const user = await userForToken(request.cookies.get(SESSION_COOKIE)?.value).catch(() => null);
  if (!user) return NextResponse.redirect(`${origin}/account`, 303);

  const result = await deleteAccount(user.steam_id);
  if (result.blocked) return NextResponse.redirect(`${origin}/account?error=last_owner`, 303);

  // Drop the Discord link the bot keeps too (best effort: the account goes either way).
  if (result.deleted && user.discord_id) {
    const res = await botPost("/v1/link/remove", user);
    if (!res.ok) console.error("discord unlink at bot failed on delete", res.error);
  }
  const res = NextResponse.redirect(`${origin}/account?deleted=1`, 303);
  res.cookies.set(SESSION_COOKIE, "", cookieOptions(0));
  return res;
}
