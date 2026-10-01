/**
 * Staff roles on mesark.net, stored on users.role:
 *   player  everyone who signs in
 *   staff   shown as "Admin": works tickets (MESA calls its staff admins)
 *   owner   changes everything: editors, team, finance
 * The first owner is claimed once, by the only account on the site, so no IDs or secrets
 * live in this public repo. Owners manage roles on /staff/team.
 */
import { query } from "@/lib/db";
import type { User } from "@/lib/auth";

export const ROLES = ["player", "staff", "owner"] as const;
export type Role = (typeof ROLES)[number];
export const ROLE_LABEL: Record<Role, string> = { player: "Player", staff: "Admin", owner: "Owner" };
export const ROLE_HELP: Record<Role, string> = {
  player: "No staff access",
  staff: "Works tickets",
  owner: "Changes everything",
};

export const isStaff = (u: User | null): u is User => !!u && (u.role === "staff" || u.role === "owner");
export const isOwner = (u: User | null): u is User => !!u && u.role === "owner";

/** True while nobody is owner yet and this user is the only account. */
export async function canClaimOwner(u: User) {
  const [r] = await query<{ users: number; owners: number }>(
    `select count(*)::int as users, (count(*) filter (where role = 'owner'))::int as owners from users`,
  );
  return r.owners === 0 && r.users === 1 && u.role !== "owner";
}

/** Makes `u` owner if the claim conditions still hold (checked atomically in SQL). */
export async function claimOwner(u: User) {
  const rows = await query(
    `update users set role = 'owner'
      where steam_id = $1
        and (select count(*) from users) = 1
        and not exists (select 1 from users where role = 'owner')
      returning steam_id`,
    [u.steam_id],
  );
  return rows.length === 1;
}

export interface TeamRow {
  steam_id: string;
  persona: string | null;
  avatar: string | null;
  role: Role;
  created_at: string;
  last_login: string;
}

export const listAccounts = () =>
  query<TeamRow>(
    `select steam_id, persona, avatar, role, created_at, last_login from users
      order by case role when 'owner' then 0 when 'staff' then 1 else 2 end, last_login desc
      limit 500`,
  );

/** Changes a role. Owners only; the last owner can't step down. */
export async function setRole(actor: User, steamId: string, role: Role): Promise<string | null> {
  if (!isOwner(actor)) return "Only owners can change roles.";
  if (!ROLES.includes(role)) return "Unknown role.";
  if (steamId === actor.steam_id && role !== "owner") {
    const [r] = await query<{ owners: number }>(`select count(*)::int as owners from users where role = 'owner'`);
    if (r.owners <= 1) return "You're the only owner. Make someone else owner first.";
  }
  const rows = await query(`update users set role = $2 where steam_id = $1 returning steam_id`, [steamId, role]);
  return rows.length ? null : "That account doesn't exist.";
}
