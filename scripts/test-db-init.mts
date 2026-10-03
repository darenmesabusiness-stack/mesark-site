import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { query, useDriver, type Transaction } from "../src/lib/db";

const pg = new PGlite();
let batches = 0;
let fail = true;
let schemaRequests = 0;
const transaction: Transaction = async (statements) => {
  batches++;
  if (fail) { fail = false; throw new Error("temporary database outage"); }
  return pg.transaction(async (tx) => {
    const results: Record<string, unknown>[][] = [];
    for (const { text, params = [] } of statements) results.push((await tx.query(text, params)).rows as Record<string, unknown>[]);
    return results;
  });
};
useDriver(async (text, params = []) => {
  if (/^(create|alter|update users set role)/.test(text)) schemaRequests++;
  return (await pg.query(text, params)).rows as never;
}, transaction);
await assert.rejects(query("select 1"), /temporary database outage/);
await Promise.all([query("select role from users"), query("select id_hash from sessions")]);
assert.equal(batches, 2, "failed initialization retries once, shared by concurrent requests");
assert.equal(schemaRequests, 0, "schema setup has no separate HTTP requests");
await query("select discord_name from users");
assert.equal(batches, 2, "warm requests do not repeat initialization");
await pg.close();
console.log("batched database initialization + retry tests passed");
