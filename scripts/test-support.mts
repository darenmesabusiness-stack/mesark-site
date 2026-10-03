import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import {
  useDriver as installDriver,
  query,
  type Transaction,
} from "../src/lib/db";
import { upsertUser, type User } from "../src/lib/auth";
import {
  createSupport,
  readSupport,
  replySupport,
  actSupport,
  setSupportAccess,
  parseSupport,
  listSupport,
} from "../src/lib/supportStore";
import {
  reserveUpload,
  completeUpload,
  authorizedUpload,
} from "../src/lib/supportUploads";
import { parseHof, saveHof, publishedHof, hofSeed } from "../src/lib/hofStore";
const pg = new PGlite();
const transaction: Transaction = (statements) =>
  pg.transaction(async (tx) => {
    const rows: Record<string, unknown>[][] = [];
    for (const s of statements)
      rows.push(
        (await tx.query(s.text, s.params ?? [])).rows as Record<
          string,
          unknown
        >[],
      );
    return rows;
  });
installDriver(
  async (text, params = []) => (await pg.query(text, params)).rows as never,
  transaction,
);
async function account(
  n: number,
  role: User["role"] = "player",
  linked = true,
) {
  const id = `76561198000000${String(n).padStart(3, "0")}`;
  await upsertUser(id, `Test ${n}`, null);
  await query("update users set role=$2,discord_id=$3 where steam_id=$1", [
    id,
    role,
    linked ? `discord-${n}` : null,
  ]);
  return (await query<User>("select * from users where steam_id=$1", [id]))[0];
}
const owner = await account(1, "owner"),
  lead = await account(2, "lead"),
  staff = await account(3, "staff");
const player = await account(4),
  other = await account(5),
  unlinked = await account(6, "player", false);
const input = (type = "general") => ({
  id: randomUUID(),
  type,
  cluster: "Solo",
  body: "Support test",
  details: {} as Record<string, string>,
});
const general = input();
assert.equal(await createSupport(unlinked, input()), null);
assert.equal(await createSupport(player, general), general.id);
assert.equal(
  await createSupport(player, general),
  general.id,
  "creation retries do not duplicate",
);
assert.equal(
  await createSupport(player, { ...general, body: "changed" }),
  null,
);
assert.equal(await createSupport(other, general), null);
assert.equal((await listSupport(player)).length, 1);
assert.equal(await readSupport(other, general.id), null);
assert.equal(
  await readSupport(staff, general.id),
  null,
  "staff have no default broad permissions",
);
assert.ok(await readSupport(lead, general.id));
assert.equal(
  await setSupportAccess(lead, staff.steam_id, "Solo", "general", true),
  false,
);
assert.equal(
  await setSupportAccess(owner, staff.steam_id, "Solo", "general", true),
  true,
);
assert.ok(await readSupport(staff, general.id));
const request = randomUUID();
assert.equal(
  await replySupport(player, general.id, request, "Player evidence"),
  true,
);
assert.equal(
  await replySupport(player, general.id, request, "Player evidence"),
  true,
);
assert.equal(
  await replySupport(player, general.id, request, "Different evidence"),
  false,
);
assert.equal(
  await replySupport(other, general.id, randomUUID(), "attack"),
  false,
);
assert.equal(
  await replySupport(player, general.id, randomUUID(), "secret", true),
  false,
);
assert.equal(
  await replySupport(
    staff,
    general.id,
    randomUUID(),
    "Staff confidential",
    true,
  ),
  true,
);
assert.equal(
  (await readSupport(player, general.id))!.messages.some((m) => m.private),
  false,
);
assert.equal(
  (await readSupport(staff, general.id))!.messages.some((m) => m.private),
  true,
);
const bm = input("bm_permanent"),
  hof = {
    ...input("hof"),
    details: {
      tribe: "Verified later",
      season: "12",
      location: "Private",
      members: "Private IDs",
    },
  };
assert.equal(await createSupport(other, bm), bm.id);
assert.equal(await createSupport(other, hof), hof.id);
assert.equal(
  await readSupport(lead, bm.id),
  null,
  "black market is independently restricted",
);
assert.equal(await readSupport(staff, hof.id), null);
assert.ok(await readSupport(lead, hof.id));
await setSupportAccess(owner, staff.steam_id, "MESA", "bm_permanent", true);
assert.ok(await readSupport(staff, bm.id));
const report = input("report_staff");
assert.equal(await createSupport(other, report), report.id);
await setSupportAccess(owner, staff.steam_id, "*", "report_staff", true);
assert.equal(
  await readSupport(staff, report.id),
  null,
  "staff reports cannot be widened to ordinary staff",
);
assert.equal(
  await createSupport(other, input()),
  null,
  "three open-ticket cap",
);
const upload = randomUUID();
assert.equal(
  await reserveUpload(other, general.id, upload, "x.png", "image/png", 100),
  null,
);
assert.equal(
  await reserveUpload(player, general.id, upload, "x.png", "image/png", 100),
  `support/${general.id}/${upload}.png`,
);
assert.equal(
  await reserveUpload(player, general.id, upload, "x.png", "image/png", 101),
  null,
);
assert.equal(
  await authorizedUpload(player, upload),
  null,
  "pending upload is not downloadable",
);
assert.equal(
  await completeUpload(
    upload,
    other.steam_id,
    `support/${general.id}/${upload}.png`,
  ),
  false,
);
assert.equal(
  await completeUpload(
    upload,
    player.steam_id,
    `support/${general.id}/${upload}.png`,
  ),
  true,
);
assert.ok(await authorizedUpload(player, upload));
assert.equal(await authorizedUpload(other, upload), null);
assert.equal(
  await reserveUpload(
    player,
    general.id,
    randomUUID(),
    "x.svg",
    "image/svg+xml",
    10,
  ),
  null,
);
assert.equal(
  await reserveUpload(
    player,
    general.id,
    randomUUID(),
    "x.png",
    "image/png",
    33554433,
  ),
  null,
);
assert.equal(
  await actSupport(staff, general.id, "claim", "", randomUUID()),
  true,
);
assert.equal(
  await actSupport(lead, general.id, "claim", "", randomUUID()),
  false,
  "claim cannot steal another assignment",
);
assert.equal(
  await actSupport(staff, general.id, "transfer", lead.steam_id, randomUUID()),
  false,
);
assert.equal(
  await actSupport(lead, general.id, "transfer", other.steam_id, randomUUID()),
  false,
  "transfer requires target access",
);
assert.equal(
  await actSupport(lead, general.id, "transfer", lead.steam_id, randomUUID()),
  true,
);
const close = randomUUID();
assert.equal(
  await actSupport(lead, general.id, "close", "Resolved", close),
  true,
);
assert.equal(
  await actSupport(lead, general.id, "close", "Resolved", close),
  true,
  "close replay is idempotent",
);
assert.equal(
  await replySupport(player, general.id, randomUUID(), "after close"),
  false,
);
assert.equal(
  await reserveUpload(
    player,
    general.id,
    randomUUID(),
    "x.png",
    "image/png",
    10,
  ),
  null,
);
assert.ok(
  await authorizedUpload(player, upload),
  "closed-ticket evidence remains available",
);
assert.equal(
  await actSupport(staff, general.id, "reopen", "", randomUUID()),
  false,
);
assert.equal(
  await actSupport(lead, general.id, "reopen", "", randomUUID()),
  true,
);
await setSupportAccess(owner, staff.steam_id, "Solo", "general", false);
assert.equal(await readSupport(staff, general.id), null);
assert.equal(
  await authorizedUpload(staff, upload),
  null,
  "revoking responsibility revokes file access",
);
await query("update users set role='player' where steam_id=$1", [
  lead.steam_id,
]);
assert.equal(
  await actSupport(lead, general.id, "close", "", randomUUID()),
  false,
  "stale session role cannot authorize",
);
await query("update users set discord_id=null where steam_id=$1", [
  player.steam_id,
]);
assert.equal(
  await replySupport(player, general.id, randomUUID(), "unlinked"),
  false,
);
assert.equal(await createSupport(player, input()), null);
assert.ok((await query("select * from support_access_audit")).length >= 4);
const form = new FormData();
for (const [k, v] of Object.entries({
  request_id: randomUUID(),
  type: "hof",
  cluster: "Solo",
  body: "Application",
}))
  form.set(k, v);
assert.equal(parseSupport(form), null, "HOF requires structured information");
for (const [k, v] of Object.entries({
  tribe: "Tribe",
  season: "1",
  location: "Private",
  members: "Player",
  tour: "https://youtube.com/watch?v=public",
}))
  form.set(k, v);
assert.ok(parseSupport(form));
form.set("tour", "javascript:alert(1)");
assert.equal(parseSupport(form), null);
const winnerForm = new FormData();
for (const [key, value] of Object.entries({
  id: randomUUID(),
  tribe: "Public winners",
  season: "96",
  cluster: "3 Man",
  date: "2026-10-03",
  art: "/art/ark/hall.jpg",
  members: "Public member | https://discord.com/users/123456789123456789",
  video: "https://youtu.be/abcdefghijk",
}))
  winnerForm.set(key, value);
const winner = parseHof(winnerForm)!;
assert.ok(winner);
assert.equal(await saveHof(player, winner, true), false);
assert.equal(
  await saveHof(lead, winner, true),
  false,
  "demoted lead cannot publish",
);
assert.equal(await saveHof(owner, winner, true), true);
assert.ok((await publishedHof()).some((w) => w.id === winner.id));
assert.equal(await saveHof(owner, winner, false), true);
assert.ok(!(await publishedHof()).some((w) => w.id === winner.id));
const official = hofSeed.winners[0];
await saveHof(owner, official, false);
assert.ok(
  !(await publishedHof()).some((w) => w.id === official.id),
  "hidden imported winner does not reappear",
);
assert.equal((await query("select * from hof_audit")).length, 3);
winnerForm.set("members", "Private ID | 76561198000000004");
assert.equal(parseHof(winnerForm), null);
winnerForm.set("members", "Public | 123456789123456789");
winnerForm.set("video", "javascript:alert(1)");
assert.equal(parseHof(winnerForm), null);
assert.ok(
  !/7656\d{13}/.test(JSON.stringify(hofSeed)),
  "public archive contains no Steam IDs",
);
await pg.close();
console.log(
  "Website support: ownership, restricted queues, fresh roles, idempotency, controls, attachments and validation passed.",
);
