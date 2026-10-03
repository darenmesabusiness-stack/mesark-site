import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { useDriver, query, type Transaction } from "../src/lib/db";
import { profileInput, saveAccountProfile, accountProfile, publishedProfile } from "../src/lib/account-profile";

const pg = new PGlite();
const tx: Transaction = statements => pg.transaction(async db => {
  const out: Record<string,unknown>[][] = [];
  for (const {text,params=[]} of statements) out.push((await db.query(text,params)).rows as Record<string,unknown>[]);
  return out;
});
useDriver(async (text,params=[]) => (await pg.query(text,params)).rows as never, tx);
const first='76561199000000001', second='76561199000000002';
await query("insert into users(steam_id,persona) values($1,'First'),($2,'Second')",[first,second]);
const saved=await saveAccountProfile(first,profileInput('Hello survivors','teal',false));
assert.equal(await publishedProfile(saved.id),null,'unpublished profiles stay private');
assert.equal(await accountProfile(second),null,'other account unchanged');
const updated=await saveAccountProfile(first,profileInput('<script>plain text</script>','gold',true));
assert.equal(updated.id,saved.id,'profile URL survives edits');
assert.equal((await publishedProfile(updated.id))?.persona,'First');
assert.equal((await accountProfile(first))?.accent,'gold');
assert.equal(await publishedProfile('invalid'),null);
for(const input of [['a'.repeat(281),'ember',true],['Bio','arbitrary-css',true],['Bio','ember','yes']])
  assert.throws(()=>profileInput(...input as [unknown,unknown,unknown]));
await saveAccountProfile(first,profileInput('','ember',false));
assert.equal(await publishedProfile(saved.id),null,'unpublishing withdraws public reads');
await query('delete from users where steam_id=$1',[first]);
assert.equal(await accountProfile(first),null,'account deletion cascades');
await assert.rejects(saveAccountProfile(first,profileInput('','ember',false)),'deleted identities cannot create profiles');
await pg.close();
console.log('account profile ownership, opt-in visibility, input and deletion tests passed');
