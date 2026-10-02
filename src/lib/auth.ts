/**
 * "Sign in through Steam" (Steam OpenID 2.0) and database-backed sessions.
 *
 * Steam does the login on its own site and sends back a signed claim of the player's
 * SteamID64; we confirm it with Steam (check_authentication) before trusting it. No
 * passwords or API keys touch mesark.net. The session cookie holds a random token; the
 * database stores only its SHA-256, so a leaked table can't be replayed as cookies.
 */
import { cookies } from "next/headers";
import { query } from "@/lib/db";

export const STEAM_OPENID = "https://steamcommunity.com/openid/login";
export const SESSION_COOKIE = "__Host-mesa_session";
export const STATE_COOKIE = "__Host-mesa_oid";
export const SESSION_DAYS = 30;
const CLAIMED_ID = /^https:\/\/steamcommunity\.com\/openid\/id\/(7656\d{13})$/;

export interface User {
  steam_id: string;
  persona: string | null;
  avatar: string | null;
  discord_id: string | null;
  discord_name: string | null;
  role: "player" | "staff" | "lead" | "owner";
  created_at: string;
}

const b64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

export const randomToken = (n = 32) => b64url(crypto.getRandomValues(new Uint8Array(n)));

async function sha256(s: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Where to send the browser to sign in. `returnTo` must be our callback URL incl. ?state=. */
export function steamLoginUrl(origin: string, returnTo: string) {
  const p = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnTo,
    "openid.realm": origin,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });
  return `${STEAM_OPENID}?${p}`;
}

/**
 * Checks Steam's reply and returns the SteamID64, or null. `expectedReturnTo` is the
 * callback URL we sent (Steam echoes it back signed).
 */
export async function verifySteamReply(
  params: URLSearchParams,
  expectedReturnTo: string,
  fetchImpl: typeof fetch = fetch,
): Promise<string | null> {
  if (params.get("openid.mode") !== "id_res") return null;
  if (params.get("openid.op_endpoint") !== STEAM_OPENID) return null;
  if (params.get("openid.return_to") !== expectedReturnTo) return null;
  const claimed = params.get("openid.claimed_id") ?? "";
  const match = CLAIMED_ID.exec(claimed);
  if (!match || params.get("openid.identity") !== claimed) return null;

  const check = new URLSearchParams();
  for (const [k, v] of params) if (k.startsWith("openid.")) check.set(k, v);
  check.set("openid.mode", "check_authentication");
  try {
    const res = await fetchImpl(STEAM_OPENID, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: check.toString(),
      cache: "no-store",
    });
    const text = await res.text();
    return /(^|\n)is_valid:true(\n|$)/.test(text) ? match[1] : null;
  } catch {
    return null;
  }
}

/** Public Steam profile name and avatar (no API key needed). */
export async function steamProfile(steamId: string): Promise<{ persona: string | null; avatar: string | null }> {
  try {
    const res = await fetch(`https://steamcommunity.com/profiles/${steamId}?xml=1`, { cache: "no-store" });
    const xml = await res.text();
    const tag = (name: string) => new RegExp(`<${name}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${name}>`).exec(xml)?.[1]?.trim() || null;
    const avatar = tag("avatarMedium");
    return { persona: tag("steamID"), avatar: avatar?.startsWith("https://") ? avatar : null };
  } catch {
    return { persona: null, avatar: null };
  }
}

export async function upsertUser(steamId: string, persona: string | null, avatar: string | null) {
  await query(
    `insert into users (steam_id, persona, avatar) values ($1, $2, $3)
     on conflict (steam_id) do update
       set persona = coalesce($2, users.persona), avatar = coalesce($3, users.avatar), last_login = now()`,
    [steamId, persona, avatar],
  );
}

/** Creates a session and returns the cookie token. */
export async function createSession(steamId: string) {
  const token = randomToken();
  await query(`delete from sessions where steam_id = $1 and expires_at < now()`, [steamId]);
  await query(
    `insert into sessions (id_hash, steam_id, expires_at) values ($1, $2, now() + make_interval(days => $3::int))`,
    [await sha256(token), steamId, SESSION_DAYS],
  );
  return token;
}

export async function userForToken(token: string | undefined): Promise<User | null> {
  if (!token) return null;
  const rows = await query<User>(
    `select u.steam_id, u.persona, u.avatar, u.discord_id, u.discord_name, u.role, u.created_at
       from sessions s join users u on u.steam_id = s.steam_id
      where s.id_hash = $1 and s.expires_at > now()`,
    [await sha256(token)],
  );
  return rows[0] ?? null;
}

export async function endSession(token: string | undefined) {
  if (token) await query(`delete from sessions where id_hash = $1`, [await sha256(token)]);
}

/** Removes the account and every session (privacy: "delete my data"). */
export async function deleteAccount(steamId: string) {
  await query(`delete from users where steam_id = $1`, [steamId]);
}

/** The signed-in user for this request (server components, route handlers). */
export async function currentUser(): Promise<User | null> {
  // cookies() stays outside the try: Next.js signals "this page is dynamic" by throwing from it.
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    return await userForToken(token);
  } catch (e) {
    console.error("session lookup failed", e);
    return null;
  }
}

/** __Host- cookies must be Secure (browsers accept that on http://localhost too). */
export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge,
});
