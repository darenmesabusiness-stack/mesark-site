import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { query, useDriver as setDriver, type Transaction } from "../src/lib/db";
import { DAY, packTribes, tribeColors, windowState, type MesaTribe } from "../src/lib/mesaMap";
import { confirmMapWipe, saveMapLocation, publishedLocations, mapWindow } from "../src/lib/mesaMapStore";
import { getMesaMap, homeMapImage } from "../src/lib/mesaMapData";
import { GET } from "../src/app/api/mesa-map/tribe/route";

const pg = new PGlite();
// A known cave's recorded image pin proves alignment with the existing map rulers.
const knownPin = homeMapImage("The Island", 72.9, 44.8)!;
assert.equal(knownPin.src, "/maps/the-island/map.webp");
assert.ok(Math.abs(knownPin.x - 47.153) < .01 && Math.abs(knownPin.y - 69.657) < .01);
assert.equal(homeMapImage("Unknown map", 50, 50), null);
assert.equal(homeMapImage("The Island", NaN, 50), null);
assert.equal(homeMapImage("The Island", 101, 50), null);
assert.equal(homeMapImage("The Island", 0, 0), null, "out-of-image GPS must not be clamped to a false home pin");
const transaction: Transaction = statements => pg.transaction(async tx => {
  const results: Record<string, unknown>[][] = [];
  for (const { text, params = [] } of statements) results.push((await tx.query(text, params)).rows as Record<string, unknown>[]);
  return results;
});
setDriver(async (text, params = []) => (await pg.query(text, params)).rows as never, transaction);
const now = Date.now(), wiped = new Date(now - 2 * DAY).toISOString(), expiry = new Date(now + 3 * DAY).toISOString();
await query("insert into users(steam_id, role) values ('owner', 'owner'), ('lead', 'lead'), ('admin', 'staff'), ('player', 'player')");
assert.ok(await confirmMapWipe("admin", "SOLO", wiped, expiry), "ordinary admins cannot reveal bases");
assert.equal(await mapWindow("SOLO"), null);
assert.equal(await confirmMapWipe("lead", "SOLO", wiped, expiry), null);
let window = (await mapWindow("SOLO"))!;
assert.equal(windowState(window, Date.parse(wiped) + DAY - 1).open, false);
assert.equal(windowState(window, Date.parse(wiped) + DAY).open, true);
assert.equal(windowState(window, Date.parse(expiry)).open, false);
assert.equal(windowState(null, now).open, false);
const location = { cluster: "SOLO", wiped: window.wiped_at, tribe: 1, map: "The Island", lat: 41.2, lon: 68.4, observed: new Date(now - DAY).toISOString(), source: "private staff verification", remove: false };
assert.ok(await saveMapLocation("player", location));
assert.equal(await saveMapLocation("lead", location), null);
assert.equal((await publishedLocations("SOLO", window, now)).length, 1);
assert.equal((await publishedLocations("SOLO", window, Date.parse(wiped) + DAY - 1)).length, 0);
assert.ok(await saveMapLocation("lead", { ...location, lat: NaN }));
assert.ok(await saveMapLocation("lead", { ...location, lat: 101 }));
assert.ok(await saveMapLocation("lead", { ...location, observed: new Date(now - 3 * DAY).toISOString() }));
assert.ok(await saveMapLocation("lead", { ...location, wiped: new Date(now - 4 * DAY).toISOString() }));
const originalFetch = globalThis.fetch;
globalThis.fetch = async url => String(url).includes("/detail?") ? Response.json({ tribeName: "Tribe One", members: [{ PlayerName: "Survivor", SteamID: "76561190000000000", privateEvidence: "private" }, { PlayerName: "76561190000000000" }] }) : Response.json({ ranking_data: Array.from({length: 11}, (_, i) => ({ TribeID: i + 1, TribeName: `Tribe ${i+1}`, DamageScore: 1000 - i * 50, rank: i + 1 })), pagination: { total_pages: 1 } });
try {
  const data = await getMesaMap("SOLO");
  assert.equal(data.tribes.length, 10);
  assert.equal(data.tribes[0].location?.lat, 41.2);
  assert.equal(data.tribes[0].location?.mapImage?.src, "/maps/the-island/map.webp");
  assert.ok(!JSON.stringify(data).includes("private staff"), "verification evidence stays private");
  const roster = await GET(new Request("https://mesark.net/api/mesa-map/tribe?cluster=SOLO&tribe=1"));
  assert.deepEqual(await roster.json(), { members: ["Survivor"] });
  assert.equal(roster.headers.get("cache-control"), "no-store");
  assert.equal((await GET(new Request("https://mesark.net/api/mesa-map/tribe?cluster=SOLO&tribe=11"))).status, 404);
  // Wipe starts again: recycled tribe IDs cannot reveal last wipe's base.
  const fresh = new Date(now - 1_000).toISOString();
  assert.equal(await confirmMapWipe("owner", "SOLO", fresh, expiry), null);
  window = (await mapWindow("SOLO"))!;
  assert.deepEqual((await getMesaMap("SOLO")).tribes, []);
  assert.equal((await GET(new Request("https://mesark.net/api/mesa-map/tribe?cluster=SOLO&tribe=1"))).status, 404);
  await query("update users set role = 'player' where steam_id = 'lead'");
  assert.ok(await saveMapLocation("lead", { ...location, wiped: window.wiped_at }));
  assert.ok(await confirmMapWipe("lead", "DUO", wiped, expiry), "fresh database role controls stale sessions");
  assert.equal(await confirmMapWipe("owner", "SOLO", new Date(now - DAY * 1.5).toISOString(), expiry), null);
  assert.deepEqual((await getMesaMap("SOLO")).tribes[0].location, null, "old coordinates never cross wipes");
  assert.ok((await query("select * from mesa_map_audit")).length >= 4);
} finally { globalThis.fetch = originalFetch; }
for (const scores of [Array(10).fill(100), Array(10).fill(0), [1e9, 1, 1, 1, 1, 1, 1, 1, 1, 1]]) {
  const tribes: MesaTribe[] = scores.map((score, i) => ({ id: i * 10 + 1, name: `Tribe ${i}`, rank: i + 1, score, kills: 0, deaths: 0, location: null }));
  const packed = packTribes(tribes);
  assert.equal(packed.length, 10);
  assert.equal(new Set(tribeColors(tribes).values()).size, 10);
  for (const p of packed) {
    assert.ok(p.x - p.radius >= 0 && p.x + p.radius <= 800 && p.y - p.radius >= 0 && p.y + p.radius <= 500);
    for (const q of packed) if (q !== p) assert.ok(Math.hypot(p.x-q.x, p.y-q.y) >= p.radius+q.radius+11.9);
  }
}
await pg.close();
console.log("Mesa Map: wipe boundaries, fresh roles, private evidence, recycled IDs, roster privacy and bubble layout passed.");
