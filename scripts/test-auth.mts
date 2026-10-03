/**
 * Exercises Steam sign-in checks and sessions against an in-memory Postgres (PGlite),
 * with Steam's reply faked. Run: npx tsx scripts/test-auth.mts
 */
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { useDriver as setDriver, query, type Transaction } from "../src/lib/db";
import { NextRequest } from "next/server";
import { POST as claim } from "../src/app/api/staff/claim/route";
import { POST as deleteRoute } from "../src/app/api/auth/delete/route";
import {
  STEAM_OPENID,
  SESSION_COOKIE,
  createSession,
  deleteAccount,
  endSession,
  steamLoginUrl,
  upsertUser,
  userForToken,
  verifySteamReply,
} from "../src/lib/auth";
import { setRole } from "../src/lib/staff";

const pg = new PGlite();
const transaction: Transaction = (statements) => pg.transaction(async (tx) => {
  const results: Record<string, unknown>[][] = [];
  for (const { text, params = [] } of statements) results.push((await tx.query(text, params)).rows as Record<string, unknown>[]);
  return results;
});
const installDriver = () => setDriver(async (text, params = []) => (await pg.query(text, params)).rows as never, transaction);
installDriver();
assert.equal((await claim()).status, 410, "setup is closed even before any accounts exist");

const origin = "https://mesark.net";
const returnTo = `${origin}/api/auth/steam/callback?state=abc`;
const steamId = "76561198000000001";

// Login URL carries realm + return address.
const login = new URL(steamLoginUrl(origin, returnTo));
assert.equal(login.origin + login.pathname, STEAM_OPENID);
assert.equal(login.searchParams.get("openid.realm"), origin);
assert.equal(login.searchParams.get("openid.return_to"), returnTo);

const reply = (over: Record<string, string> = {}) =>
  new URLSearchParams({
    state: "abc",
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "id_res",
    "openid.op_endpoint": STEAM_OPENID,
    "openid.claimed_id": `https://steamcommunity.com/openid/id/${steamId}`,
    "openid.identity": `https://steamcommunity.com/openid/id/${steamId}`,
    "openid.return_to": returnTo,
    "openid.response_nonce": "2026-10-01T10:00:00Zxyz",
    "openid.assoc_handle": "1234567890",
    "openid.signed": "signed,op_endpoint,claimed_id,identity,return_to,response_nonce,assoc_handle",
    "openid.sig": "sig",
    ...over,
  });

let posted = "";
const steamSays = (valid: boolean) =>
  (async (_url: unknown, init?: RequestInit) => {
    posted = String(init?.body);
    return new Response(`ns:http://specs.openid.net/auth/2.0\nis_valid:${valid}\n`);
  }) as typeof fetch;

assert.equal(await verifySteamReply(reply(), returnTo, steamSays(true)), steamId);
assert.ok(posted.includes("openid.mode=check_authentication"), "re-posts to Steam in check mode");
assert.ok(!posted.includes("state="), "only openid.* fields go back to Steam");
assert.equal(await verifySteamReply(reply(), returnTo, steamSays(false)), null, "Steam says invalid");
assert.equal(await verifySteamReply(reply({ "openid.op_endpoint": "https://evil.example/openid/login" }), returnTo, steamSays(true)), null);
assert.equal(await verifySteamReply(reply({ "openid.return_to": "https://evil.example/cb" }), returnTo, steamSays(true)), null);
assert.equal(await verifySteamReply(reply({ "openid.claimed_id": "https://evil.example/openid/id/76561198000000001" }), returnTo, steamSays(true)), null);
assert.equal(await verifySteamReply(reply({ "openid.identity": "https://steamcommunity.com/openid/id/76561198000000002" }), returnTo, steamSays(true)), null);
assert.equal(await verifySteamReply(reply({ "openid.mode": "cancel" }), returnTo, steamSays(true)), null);

// Users + sessions.
await upsertUser(steamId, "Harv", "https://avatars.steamstatic.com/a.jpg");
await upsertUser(steamId, null, null); // re-login keeps name/avatar
const token = await createSession(steamId);
const u = await userForToken(token);
assert.equal(u?.steam_id, steamId);
assert.equal(u?.persona, "Harv");
assert.equal(u?.role, "player");
assert.equal(await userForToken("not-a-real-token"), null);
const stored = await query<{ id_hash: string }>("select id_hash from sessions");
assert.ok(stored.every((r) => r.id_hash !== token && r.id_hash.length === 64), "only the token's hash is stored");

await query("update sessions set expires_at = now() - interval '1 minute'");
assert.equal(await userForToken(token), null, "expired session is rejected");

const t2 = await createSession(steamId);
assert.equal((await query("select 1 from sessions")).length, 1, "expired sessions are cleaned on next sign-in");
await endSession(t2);
assert.equal(await userForToken(t2), null, "sign-out ends the session");

const t3 = await createSession(steamId);
await deleteAccount(steamId);
assert.equal(await userForToken(t3), null);
assert.equal((await query("select 1 from users")).length, 0, "account deleted");
assert.equal((await query("select 1 from sessions")).length, 0, "sessions deleted with the account");

// Setup has finished: only an operator can seed/recover an owner in an empty DB.
await upsertUser("76561198000000010", "Owner", null);
await upsertUser("76561198000000011", "Second", null);
assert.equal((await claim()).status, 410, "oldest account cannot claim ownership");
assert.equal((await query("select 1 from users where role = 'owner'")).length, 0);
await query("update users set role = 'owner' where steam_id = '76561198000000010'");
await query("delete from users where steam_id = '76561198000000011'");
const boss = (await userForToken(await createSession("76561198000000010")))!;
assert.equal(boss.role, "owner");
await upsertUser("76561198000000012", "Mod", null);
const mod = (await userForToken(await createSession("76561198000000012")))!;
assert.equal(await setRole(mod, "76561198000000012", "owner"), "Only owners and lead admins can change roles.");
assert.equal(await setRole(boss, "76561198000000012", "staff"), null);
assert.equal(await setRole(boss, "76561198000000012", "admin" as never), "Unknown role.");
assert.match(String(await setRole(boss, "76561198000000010", "player")), /only owner/);
assert.equal(await setRole(boss, "76561198000000099", "staff"), "That account doesn't exist.");
assert.equal((await userForToken(await createSession("76561198000000012")))!.role, "staff");

// Lead admins move people between Player and Admin only.
await upsertUser("76561198000000013", "Lead", null);
assert.equal(await setRole(boss, "76561198000000013", "lead"), null);
const lead = (await userForToken(await createSession("76561198000000013")))!;
assert.equal(lead.role, "lead");
await upsertUser("76561198000000014", "Newbie", null);
assert.equal(await setRole(lead, "76561198000000014", "staff"), null, "lead adds an admin");
assert.equal(await setRole(lead, "76561198000000014", "player"), null, "lead removes an admin");
assert.match(String(await setRole(lead, "76561198000000014", "lead")), /Only the owner/);
assert.match(String(await setRole(lead, "76561198000000010", "player")), /Only the owner/, "lead can't touch the owner");
assert.match(String(await setRole(lead, "76561198000000013", "player")), /Only the owner/, "lead can't change own role");

// Legacy "admin" rows become "owner" when the schema runs.
await query("update users set role = 'admin' where steam_id = '76561198000000010'");
installDriver(); // re-run schema
assert.equal((await query<{ role: string }>("select role from users where steam_id = '76561198000000010'"))[0].role, "owner");

// A blocked deletion retains sessions and Discord linkage, including at the HTTP boundary.
await query("update users set discord_id = 'test-discord', discord_name = 'Test' where steam_id = $1", [boss.steam_id]);
const ownerToken = await createSession(boss.steam_id);
assert.deepEqual(await deleteAccount(boss.steam_id), { deleted: false, blocked: true });
const request = (cookie: string, confirmed = true) => new NextRequest(`${origin}/api/auth/delete`, {
  method: "POST",
  headers: { cookie: `${SESSION_COOKIE}=${cookie}`, "Content-Type": "application/x-www-form-urlencoded" },
  body: confirmed ? "confirm=yes" : "",
});
const rejected = await deleteRoute(request(ownerToken));
assert.equal(rejected.status, 303);
assert.equal(rejected.headers.get("location"), `${origin}/account?error=last_owner`);
assert.equal(rejected.headers.get("set-cookie"), null, "blocked deletion does not sign out the owner");
assert.equal((await userForToken(ownerToken))?.discord_id, "test-discord", "blocked deletion preserves the link");
assert.equal((await deleteRoute(request(ownerToken, false))).headers.get("location"), `${origin}/account?error=confirm`);

// Caller objects are snapshots, never authority: revoked roles cannot be reused.
assert.equal(await setRole(boss, lead.steam_id, "player"), null);
assert.match(String(await setRole(lead, mod.steam_id, "staff")), /Only owners and lead admins/);
assert.equal(await setRole(boss, mod.steam_id, "owner"), null);
const otherOwner = (await userForToken(await createSession(mod.steam_id)))!;
assert.equal(await setRole(boss, boss.steam_id, "player"), null, "ownership can be transferred");
assert.match(String(await setRole(boss, otherOwner.steam_id, "player")), /Only owners and lead admins/);
assert.deepEqual(await deleteAccount(otherOwner.steam_id), { deleted: false, blocked: true });

// Valid deletion clears all sessions. Use an unlinked ordinary account to avoid network calls.
const leadToken = await createSession(lead.steam_id);
const accepted = await deleteRoute(request(leadToken));
assert.equal(accepted.headers.get("location"), `${origin}/account?deleted=1`);
assert.match(accepted.headers.get("set-cookie") ?? "", /Max-Age=0/);
assert.equal(await userForToken(leadToken), null);
assert.match(String(await setRole(lead, boss.steam_id, "owner")), /Only owners and lead admins/);

// PGlite serializes transactions; these verify both operation orders, not multi-connection locking.
await setRole(otherOwner, boss.steam_id, "owner");
const deletes = await Promise.all([deleteAccount(boss.steam_id), deleteAccount(otherOwner.steam_id)]);
assert.equal(deletes.filter((r) => r.deleted).length, 1);
assert.equal(deletes.filter((r) => r.blocked).length, 1);
assert.equal((await query("select 1 from users where role = 'owner'")).length, 1);

// Even an operator-side removal of every owner cannot reopen public setup.
await query("delete from users where role = 'owner'");
assert.equal((await claim()).status, 410);
assert.equal((await query("select 1 from users where role = 'owner'")).length, 0);
await pg.close();
console.log("auth + staff tests passed");
