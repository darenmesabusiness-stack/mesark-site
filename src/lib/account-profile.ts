import { getVercelOidcToken } from "@vercel/oidc";
import { query } from "@/lib/db";
import { isBlockedName, type PlayerCluster } from "@/lib/leaderboard";

import { PROFILE_ACCENTS, type ProfileAccent, type AccountProfile } from "@/lib/account-profile-options";
export type AccountStats = { clusters: (PlayerCluster & { playerName: string })[]; unavailable: string[] };

export function profileInput(bio: unknown, accent: unknown, published: unknown, shareLinks: unknown = false) {
  if (typeof bio !== "string" || bio.trim().length > 280 || isBlockedName(bio) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(bio))
    throw new Error("Use a short bio of up to 280 characters without offensive language.");
  if (typeof accent !== "string" || !Object.hasOwn(PROFILE_ACCENTS, accent))
    throw new Error("Choose one of the profile colors.");
  if (typeof published !== "boolean") throw new Error("Choose whether your profile is public.");
  if (typeof shareLinks !== "boolean") throw new Error("Choose whether to share your linked profiles.");
  return { bio: bio.trim(), accent: accent as ProfileAccent, published, share_links: shareLinks };
}

export async function accountProfile(steamId: string): Promise<AccountProfile | null> {
  const rows = await query<AccountProfile>("select id, bio, accent, published, share_links from player_profiles where steam_id=$1", [steamId]);
  return rows[0] ?? null;
}

export async function saveAccountProfile(steamId: string, input: ReturnType<typeof profileInput>) {
  // Only a server-authenticated identity is passed here; no form-supplied owner or ID.
  const [profile] = await query<AccountProfile>(`insert into player_profiles(id, steam_id, bio, accent, published, share_links)
    select $1, steam_id, $3, $4, $5, $6 from users where steam_id=$2
    on conflict(steam_id) do update set bio=$3, accent=$4, published=$5, share_links=$6
    returning id, bio, accent, published, share_links`, [crypto.randomUUID(), steamId, input.bio, input.accent, input.published, input.share_links]);
  if (!profile) throw new Error("Sign in again to save your profile.");
  return profile;
}

/** Internal identity stays server-side; public URLs contain a random profile UUID. */
export async function publishedProfile(id: string) {
  if (!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(id)) return null;
  const [profile] = await query<AccountProfile & { steam_id: string; persona: string | null; avatar: string | null; discord_id: string | null }>(
    `select p.id, p.bio, p.accent, p.published, p.share_links, u.steam_id, u.persona, u.avatar, u.discord_id
     from player_profiles p join users u using(steam_id) where p.id=$1 and p.published=true`, [id]);
  return profile ?? null;
}

/** Exact verified Discord link; only opt-in public profiles may be discovered. */
export async function publicProfileForDiscord(discordId: string) {
  const [profile] = await query<{id:string}>(`select p.id from player_profiles p join users u using(steam_id)
    where u.discord_id=$1 and p.published=true and p.share_links=true`, [discordId]);
  return profile ?? null;
}

export async function accountStats(steamId: string): Promise<AccountStats | null> {
  try {
    const token = await getVercelOidcToken();
    const res = await fetch("https://leaderboards.mesark.net/api/ark/account-profile", {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ steamId }), cache: "no-store", signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return null;
    return await res.json() as AccountStats;
  } catch { return null; }
}
