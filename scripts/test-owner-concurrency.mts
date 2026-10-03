/** Real multi-connection PostgreSQL tests. CI supplies a disposable local database. */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import { Pool } from "pg";
import { query, useDriver, type Transaction } from "../src/lib/db";
import { createSession, deleteAccount, upsertUser, userForToken } from "../src/lib/auth";
import { setRole } from "../src/lib/staff";

const url = new URL(process.env.OWNER_TEST_DATABASE_URL ?? "http://missing");
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(url.hostname), "Use a disposable local PostgreSQL database");
assert.equal(url.pathname, "/mesa_owner_test", "This script must not run against an application database");
const schema = `owner_test_${randomUUID().replaceAll("-", "")}`;
const admin = new Pool({ connectionString: url.href, max: 1 });
await admin.query(`create schema ${schema}`);
const pool = new Pool({ connectionString: url.href, options: `-c search_path=${schema}`, max: 8 });
let failBeforeCommit = false;
const transaction: Transaction = async (statements) => {
  const client = await pool.connect();
  try {
    await client.query("begin isolation level read committed");
    const results = [];
    for (const { text, params } of statements) results.push((await client.query(text, params)).rows);
    if (failBeforeCommit) await client.query("select 1 / 0");
    await client.query("commit");
    return results;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
};
useDriver(async (text, params) => (await pool.query(text, params)).rows as never, transaction);

async function account(id: string, role: string) {
  await upsertUser(id, id, null);
  await query("update users set role = $2 where steam_id = $1", [id, role]);
  return (await userForToken(await createSession(id)))!;
}

async function waitForBlocked(count: number) {
  for (let n = 0; n < 100; n++) {
    const result = await pool.query<{ count: number }>(
      `select count(*)::int as count from pg_locks
       where locktype = 'advisory' and classid = 1296388929 and objid = 1 and not granted
         and database = (select oid from pg_database where datname = current_database())`,
    );
    if (result.rows[0].count >= count) return;
    await delay(20);
  }
  assert.fail(`Expected ${count} concurrent requests waiting for the ownership lock`);
}

/** Queue requests in a known order behind a held lock, then release both together. */
async function race<A, B>(first: () => Promise<A>, second: () => Promise<B>): Promise<[A, B]> {
  const blocker = await pool.connect();
  const pending: Promise<unknown>[] = [];
  try {
    await blocker.query("begin");
    await blocker.query("select pg_advisory_xact_lock(1296388929, 1)");
    pending.push(first());
    await waitForBlocked(1);
    pending.push(second());
    await waitForBlocked(2);
  } finally {
    await blocker.query("rollback");
    blocker.release();
    await Promise.allSettled(pending);
  }
  return await Promise.all(pending) as [A, B];
}

const ownerCount = async () => (await query<{ count: number }>("select count(*)::int from users where role = 'owner'"))[0].count;
try {
  let a = await account("owner-a", "owner");
  let b = await account("owner-b", "owner");
  const demotions = await race(() => setRole(a, a.steam_id, "player"), () => setRole(b, b.steam_id, "player"));
  assert.equal(demotions[0], null);
  assert.match(demotions[1]!, /only owner/);
  assert.equal(await ownerCount(), 1);

  a = await account("owner-a", "owner");
  const deletions = await race(() => deleteAccount(a.steam_id), () => deleteAccount(b.steam_id));
  assert.deepEqual(deletions, [{ deleted: true, blocked: false }, { deleted: false, blocked: true }]);
  assert.equal(await ownerCount(), 1);

  a = await account("owner-a", "owner");
  const mixed = await race(() => deleteAccount(a.steam_id), () => setRole(b, b.steam_id, "player"));
  assert.equal(mixed[0].deleted, true);
  assert.match(mixed[1]!, /only owner/);
  assert.equal(await ownerCount(), 1);

  a = await account("owner-a", "owner");
  const reverse = await race(() => setRole(a, a.steam_id, "player"), () => deleteAccount(b.steam_id));
  assert.equal(reverse[0], null);
  assert.equal(reverse[1].blocked, true);

  a = await account("owner-a", "owner");
  const player = await account("player", "player");
  const revoked = await race(() => setRole(a, b.steam_id, "player"), () => setRole(b, player.steam_id, "owner"));
  assert.equal(revoked[0], null);
  assert.match(revoked[1]!, /Only owners and lead admins/);
  assert.equal(await ownerCount(), 1);

  b = await account("owner-b", "owner");
  const deletedActor = await race(() => deleteAccount(b.steam_id), () => setRole(b, player.steam_id, "owner"));
  assert.equal(deletedActor[0].deleted, true);
  assert.match(deletedActor[1]!, /Only owners and lead admins/);

  const lead = await account("lead", "lead");
  const promotedTarget = await race(() => setRole(a, player.steam_id, "owner"), () => setRole(lead, player.steam_id, "staff"));
  assert.equal(promotedTarget[0], null);
  assert.match(promotedTarget[1]!, /Only the owner/);
  assert.equal(await ownerCount(), 2);

  failBeforeCommit = true;
  await assert.rejects(() => deleteAccount(a.steam_id), /division by zero/);
  failBeforeCommit = false;
  assert.equal(await ownerCount(), 2, "a failed transaction rolls back account deletion");
  assert.equal(await setRole(a, player.steam_id, "staff"), null, "rollback releases the lock");
  assert.equal(await ownerCount(), 1);
  console.log("ownership concurrency tests passed: 7 forced races and rollback");
} finally {
  await pool.end();
  await admin.query(`drop schema ${schema} cascade`);
  await admin.end();
}
