/**
 * Staff roles on mesark.net, stored on users.role (MESA calls its staff admins):
 *   player  everyone who signs in
 *   staff   "Admin": works tickets
 *   lead    "Lead Admin": runs things day to day: change log, caves, stats, adds/removes admins
 *   owner   everything, including finance and choosing leads
 * The first owner is claimed once, by the oldest account on the site (the owner signed in first
 * when sign-in went live), so no IDs or secrets live in this public repo.
 */
import { query } from "@/lib/db";
import type { User } from "@/lib/auth";

export const ROLES = ["player", "staff", "lead", "owner"] as const;
export type Role = (typeof ROLES)[number];
export const ROLE_LABEL: Record<Role, string> = { player: "Player", staff: "Admin", lead: "Lead Admin", owner: "Owner" };
export const ROLE_HELP: Record<Role, string> = {
  player: "No staff access",
  staff: "Works tickets",
  lead: "Runs content and the admin team",
  owner: "Everything, incl. finance",
};
const RANK: Record<Role, number> = { player: 0, staff: 1, lead: 2, owner: 3 };
const rank = (u: User | null) => (u ? (RANK[u.role as Role] ?? 0) : 0);

export const isStaff = (u: User | null): u is User => rank(u) >= RANK.staff;
/** Lead admins and owners: editors, stats, the Team page. */
export const isLead = (u: User | null): u is User => rank(u) >= RANK.lead;
export const isOwner = (u: User | null): u is User => rank(u) >= RANK.owner;

/** Roles this person may hand out (and change away from) on the Team page. */
export const assignableRoles = (actor: User): Role[] =>
  isOwner(actor) ? [...ROLES] : isLead(actor) ? ["player", "staff"] : [];

/** True while nobody is owner yet and this user is the oldest account. */
export async function canClaimOwner(u: User) {
  const [r] = await query<{ owners: number; first: string | null }>(
    `select (count(*) filter (where role = 'owner'))::int as owners,
            (select steam_id from users order by created_at, steam_id limit 1) as first
       from users`,
  );
  return r.owners === 0 && r.first === u.steam_id;
}

/** Makes `u` owner if the claim conditions still hold (checked atomically in SQL). */
export async function claimOwner(u: User) {
  const rows = await query(
    `update users set role = 'owner'
      where steam_id = $1
        and steam_id = (select steam_id from users order by created_at, steam_id limit 1)
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
      order by case role when 'owner' then 0 when 'lead' then 1 when 'staff' then 2 else 3 end, last_login desc
      limit 500`,
  );

/**
 * Changes a role. Owners can set any role (the last owner can't step down). Lead admins
 * can only move people between Player and Admin.
 */
export async function setRole(actor: User, steamId: string, role: Role): Promise<string | null> {
  if (!ROLES.includes(role)) return "Unknown role.";
  const allowed = assignableRoles(actor);
  if (!allowed.length) return "Only owners and lead admins can change roles.";

  const [target] = await query<{ role: Role }>(`select role from users where steam_id = $1`, [steamId]);
  if (!target) return "That account doesn't exist.";
  if (!allowed.includes(role) || !allowed.includes(target.role)) {
    return "Lead admins can add and remove admins. Only the owner can change lead admins and owners.";
  }
  if (steamId === actor.steam_id && target.role === "owner" && role !== "owner") {
    const [r] = await query<{ owners: number }>(`select count(*)::int as owners from users where role = 'owner'`);
    if (r.owners <= 1) return "You're the only owner. Make someone else owner first.";
  }
  await query(`update users set role = $2 where steam_id = $1`, [steamId, role]);
  return null;
}
