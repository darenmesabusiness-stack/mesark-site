/**
 * Exercises Steam sign-in checks and sessions against an in-memory Postgres (PGlite),
 * with Steam's reply faked. Run: npx tsx scripts/test-auth.mts
 */
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { useDriver, query } from "../src/lib/db";
import {
  STEAM_OPENID,
  createSession,
  deleteAccount,
  endSession,
  steamLoginUrl,
  upsertUser,
  userForToken,
  verifySteamReply,
} from "../src/lib/auth";
import { canClaimOwner, claimOwner, setRole } from "../src/lib/staff";

const pg = new PGlite();
useDriver(async (text, params = []) => (await pg.query(text, params as unknown[])).rows as never);

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

// Staff roles: the only account can claim owner once; admins manage roles.
await upsertUser("76561198000000010", "Owner", null);
const owner = (await userForToken(await createSession("76561198000000010")))!;
assert.equal(await canClaimOwner(owner), true);
await upsertUser("76561198000000011", "Second", null);
assert.equal(await canClaimOwner(owner), false, "no claim once a second account exists");
assert.equal(await claimOwner(owner), false);
await query("delete from users where steam_id = '76561198000000011'");
assert.equal(await claimOwner(owner), true);
const boss = (await userForToken(await createSession("76561198000000010")))!;
assert.equal(boss.role, "owner");
assert.equal(await claimOwner(boss), false, "claim works only once");
await upsertUser("76561198000000012", "Mod", null);
const mod = (await userForToken(await createSession("76561198000000012")))!;
assert.equal(await setRole(mod, "76561198000000012", "owner"), "Only owners can change roles.");
assert.equal(await setRole(boss, "76561198000000012", "staff"), null);
assert.equal(await setRole(boss, "76561198000000012", "admin" as never), "Unknown role.");
assert.match(String(await setRole(boss, "76561198000000010", "player")), /only owner/);
assert.equal(await setRole(boss, "76561198000000099", "staff"), "That account doesn't exist.");
assert.equal((await userForToken(await createSession("76561198000000012")))!.role, "staff");

// Legacy "admin" rows become "owner" when the schema runs.
await query("update users set role = 'admin' where steam_id = '76561198000000010'");
useDriver(async (text, params = []) => (await pg.query(text, params as unknown[])).rows as never); // re-run schema
assert.equal((await query<{ role: string }>("select role from users where steam_id = '76561198000000010'"))[0].role, "owner");

console.log("auth + staff tests passed");
