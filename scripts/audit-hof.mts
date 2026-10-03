/** Verify public honors cover the archived public source without leaking private fields.
 * This proves import coverage at the source date, not current Discord role membership.
 */
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import seed from "../src/data/hofMembers.json";
import { publicName } from "../src/lib/mesaMap";

const raw = JSON.parse(await fs.readFile("out/website-support/hof-source.json", "utf8")) as typeof seed;
const keys = (value: object, allowed: string[]) => {
  assert.ok(Object.keys(value).every(key => allowed.includes(key)), "Unexpected non-public field");
};
const unique = (rows: {id: string}[]) => {
  const ids = rows.map(row => row.id);
  assert.equal(new Set(ids).size, ids.length, "Duplicate source identity");
  return ids.sort();
};
keys(seed, ["updated", "source", "winners", "honorees"]);
assert.deepEqual(unique(seed.honorees), unique(raw.honorees), "All source honorees must be represented");
assert.deepEqual(unique(seed.winners), unique(raw.winners), "All source winner announcements must be represented");
for (const member of [...seed.honorees, ...seed.winners.flatMap(w => w.members)]) {
  keys(member, ["id", "name", "honors"]);
  assert.ok(/^\d{17,20}$/.test(member.id));
  assert.ok(publicName(member.name), "Unsafe public member name");
  assert.ok(member.name.length <= 100 && member.honors.every(h => typeof h === "string"));
}
for (const member of seed.honorees) {
  assert.deepEqual(member.honors, raw.honorees.find(m => m.id === member.id)!.honors, "Honors must remain source-backed");
}
for (const winner of seed.winners) {
  keys(winner, ["id", "tribe", "season", "cluster", "date", "members", "video", "source"]);
  assert.ok(publicName(winner.tribe));
  assert.ok(Number.isFinite(Date.parse(winner.date)) && Date.parse(winner.date) <= Date.now());
  assert.equal(winner.source, `${seed.source}/${winner.id}`);
  assert.deepEqual(unique(winner.members), unique(raw.winners.find(w => w.id === winner.id)!.members));
}
const dates = seed.winners.map(w => w.date).sort();
const report = { checkedAt: new Date().toISOString(), sourceDate: seed.updated,
  honorees: seed.honorees.length, winnerAnnouncements: seed.winners.length,
  earliestAnnouncement: dates[0], latestAnnouncement: dates.at(-1),
  sourceCoverage: "all archived members, honors and winner rosters represented", publicFieldAllowlist: "passed",
  limitation: "Does not prove membership changes after the archived source snapshot." };
await fs.mkdir("out/review", {recursive:true});
await fs.writeFile("out/review/hof-source-audit.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report));
