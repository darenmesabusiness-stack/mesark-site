/**
 * Staff roles on mesark.net, stored on users.role (MESA calls its staff admins):
 *   player  everyone who signs in
 *   staff   "Admin": works tickets
 *   lead    "Lead Admin": runs things day to day: change log, caves, stats, adds/removes admins
 *   owner   everything, including finance and choosing leads
 * Initial setup is complete. Ownership is assigned by an existing owner; recovery
 * requires an operator with database access, never a public account claim.
 */
import { ownershipQuery, query } from "@/lib/db";
import type { User } from "@/lib/auth";

export const ROLES = ["player", "moderator", "staff", "lead", "owner"] as const;
export type Role = (typeof ROLES)[number];
export const ROLE_LABEL: Record<Role, string> = { player: "Player", moderator: "Moderator", staff: "Admin", lead: "Lead Admin", owner: "Owner" };
export const ROLE_HELP: Record<Role, string> = {
  player: "No staff access",
  moderator: "Question support and own monthly rewards",
  staff: "Works tickets",
  lead: "Runs content and the admin team",
  owner: "Everything, incl. finance",
};
const RANK: Record<Role, number> = { player: 0, moderator: 0, staff: 1, lead: 2, owner: 3 };
const rank = (u: User | null) => (u ? (RANK[u.role as Role] ?? 0) : 0);

export const isStaff = (u: User | null): u is User => rank(u) >= RANK.staff;
export const canSupport = (u: User | null): u is User => Boolean(u && (u.role === "moderator" || isStaff(u)));
/** Lead admins and owners: editors, stats, the Team page. */
export const isLead = (u: User | null): u is User => rank(u) >= RANK.lead;
export const isOwner = (u: User | null): u is User => rank(u) >= RANK.owner;

/** Roles this person may hand out (and change away from) on the Team page. */
export const assignableRoles = (actor: User): Role[] =>
  isOwner(actor) ? [...ROLES] : isLead(actor) ? ["player", "moderator", "staff"] : [];

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
  // Re-read both roles under the lock: the actor may have been demoted or deleted
  // since their session was loaded at the start of this request.
  const [result] = await ownershipQuery<{ error: string | null }>(
    `with context as (
       select (select role from users where steam_id = $1) as actor_role,
              (select role from users where steam_id = $2) as target_role,
              (select count(*) from users where role = 'owner') as owners
     ), decision as (
       select case
         when actor_role is null or actor_role not in ('owner', 'lead')
           then 'Only owners and lead admins can change roles.'
         when target_role is null then 'That account doesn''t exist.'
         when actor_role = 'lead' and (target_role not in ('player', 'moderator', 'staff') or $3 not in ('player', 'moderator', 'staff'))
           then 'Lead admins can add and remove admins. Only the owner can change lead admins and owners.'
         when target_role = 'owner' and $3 <> 'owner' and owners <= 1
           then 'This is the only owner. Make someone else owner first.'
         else null end as error from context
     ), changed as (
       update users set role = $3 where steam_id = $2 and (select error from decision) is null
       returning steam_id
     )
     select error from decision`,
    [actor.steam_id, steamId, role],
  );
  return result.error;
}
