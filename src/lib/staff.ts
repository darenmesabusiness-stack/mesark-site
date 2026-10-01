/**
 * Staff roles on mesark.net. Roles live on the users table: player (default), staff, admin.
 * Admins manage roles on /staff/team. The very first admin is claimed once, by the only
 * account that exists (the owner signs in first), so no IDs or secrets live in this public repo.
 */
import { query } from "@/lib/db";
import type { User } from "@/lib/auth";

export const ROLES = ["player", "staff", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const isStaff = (u: User | null): u is User => !!u && (u.role === "staff" || u.role === "admin");
export const isAdmin = (u: User | null): u is User => !!u && u.role === "admin";

/** True while nobody is admin yet and this user is the only account. */
export async function canClaimOwner(u: User) {
  const [r] = await query<{ users: number; admins: number }>(
    `select count(*)::int as users, (count(*) filter (where role = 'admin'))::int as admins from users`,
  );
  return r.admins === 0 && r.users === 1 && u.role !== "admin";
}

/** Makes `u` admin if the claim conditions still hold (checked atomically in SQL). */
export async function claimOwner(u: User) {
  const rows = await query(
    `update users set role = 'admin'
      where steam_id = $1
        and (select count(*) from users) = 1
        and not exists (select 1 from users where role = 'admin')
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
      order by case role when 'admin' then 0 when 'staff' then 1 else 2 end, last_login desc
      limit 500`,
  );

/** Changes a role. Admin only; the last admin can't demote themselves. */
export async function setRole(actor: User, steamId: string, role: Role): Promise<string | null> {
  if (!isAdmin(actor)) return "Only admins can change roles.";
  if (!ROLES.includes(role)) return "Unknown role.";
  if (steamId === actor.steam_id && role !== "admin") {
    const [r] = await query<{ admins: number }>(`select count(*)::int as admins from users where role = 'admin'`);
    if (r.admins <= 1) return "You're the only admin. Make someone else admin first.";
  }
  const rows = await query(`update users set role = $2 where steam_id = $1 returning steam_id`, [steamId, role]);
  return rows.length ? null : "That account doesn't exist.";
}
