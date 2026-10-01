/**
 * Cave editor: GPS <-> pin maths against every built-in cave, and storage against an in-memory
 * Postgres. Run: npx tsx scripts/test-caves.mts
 */
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { useDriver } from "../src/lib/db";
import { upsertUser } from "../src/lib/auth";
import { caveMaps } from "../src/data/caves";
import { gpsToPin, pinToGps } from "../src/data/cave-calibration";
import { editableCave, hideCave, loadCaveMaps, restoreCave, saveCave, staffCaves, unhideCave } from "../src/lib/caveStore";

// 1. The editor's pin maths matches the pins on /maps for every cave.
let pins = 0;
for (const m of caveMaps) {
  for (const c of m.caves) {
    if (c.x === undefined || c.y === undefined) continue;
    const p = gpsToPin(m.slug, c.lat, c.lon)!;
    assert.ok(Math.abs(p.x - c.x) < 0.01 && Math.abs(p.y - c.y) < 0.01, `${m.slug}/${c.id} pin`);
    const g = pinToGps(m.slug, c.x, c.y)!;
    assert.ok(Math.abs(g.lat - c.lat) <= 0.1 && Math.abs(g.lon - c.lon) <= 0.1, `${m.slug}/${c.id} gps back`);
    pins++;
  }
}

// 2. Storage.
const pg = new PGlite();
useDriver(async (text, params = []) => (await pg.query(text, params as unknown[])).rows as never);
await upsertUser("76561198000000013", "Lead", null);
const lead = "76561198000000013";
const island = caveMaps.find((m) => m.slug === "the-island")!;
const count = async () => (await loadCaveMaps()).find((m) => m.slug === "the-island")!.caves.length;
const builtInCount = island.caves.length;
assert.equal(await count(), builtInCount);

assert.match(JSON.stringify(await saveCave(lead, { map: "the-island", id: null, name: "Test Cave", lat: 120, lon: 50, notes: [], spi: null, video: null })), /GPS must be/);
assert.match(JSON.stringify(await saveCave(lead, { map: "the-island", id: null, name: "Test Cave", lat: 50, lon: 50, notes: [], spi: null, video: "https://evil.example/x.mp4" })), /clip link/);
assert.match(JSON.stringify(await saveCave(lead, { map: "the-island", id: null, name: "  ", lat: 50, lon: 50, notes: [], spi: null, video: null })), /name/);

// New cave: slug id, pin from GPS, notes cleaned.
const r1 = await saveCave(lead, { map: "the-island", id: null, name: "Test Cave", lat: 50.04, lon: 49.96, notes: ["- Rex sized choke", "", "Flyers allowed"], spi: " ", video: "/api/caves/clip/caves/the-island/test-cave-abc.mp4" });
assert.deepEqual(r1, { id: "test-cave" });
const added = (await loadCaveMaps()).find((m) => m.slug === "the-island")!.caves.find((c) => c.id === "test-cave")!;
assert.equal(added.lat, 50);
assert.equal(added.lon, 50);
assert.deepEqual(added.notes, ["Rex sized choke", "Flyers allowed"]);
assert.equal(added.spi, null);
assert.deepEqual({ x: added.x, y: added.y }, gpsToPin("the-island", 50, 50));
assert.equal(await count(), builtInCount + 1);
assert.deepEqual(await saveCave(lead, { map: "the-island", id: null, name: "Test Cave", lat: 40, lon: 40, notes: [], spi: null, video: null }), { id: "test-cave-2" });

// Editing a built-in cave overrides it; its poster stays only while its clip does.
const orig = island.caves[0];
await saveCave(lead, { map: "the-island", id: orig.id, name: orig.name + " (edited)", lat: orig.lat, lon: orig.lon, notes: orig.notes, spi: orig.spi ?? null, video: orig.video ?? null });
let edited = (await editableCave("the-island", orig.id))!;
assert.equal(edited.status, "edited");
assert.equal(edited.cave.name, orig.name + " (edited)");
assert.equal(edited.cave.poster, orig.poster);
await saveCave(lead, { map: "the-island", id: orig.id, name: orig.name, lat: orig.lat, lon: orig.lon, notes: orig.notes, spi: null, video: "/api/caves/clip/caves/the-island/new.gif" });
edited = (await editableCave("the-island", orig.id))!;
assert.equal(edited.cave.poster, undefined, "a new clip drops the old poster");
assert.equal(await count(), builtInCount + 2, "editing doesn't add a cave");

// Hide / show again / undo edits.
await hideCave(lead, "the-island", orig.id);
assert.equal(await count(), builtInCount + 1);
assert.equal((await staffCaves("the-island")).find((c) => c.id === orig.id)?.status, "hidden");
await unhideCave(lead, "the-island", orig.id);
assert.equal(await count(), builtInCount + 2);
await restoreCave("the-island", orig.id);
assert.equal((await editableCave("the-island", orig.id))!.status, "original");
assert.deepEqual((await loadCaveMaps()).find((m) => m.slug === "the-island")!.caves.find((c) => c.id === orig.id), orig);
await restoreCave("the-island", "test-cave");
assert.equal(await editableCave("the-island", "test-cave"), null, "undoing a new cave removes it");

// MESA City has no map art: no pin coordinates.
const city = await saveCave(lead, { map: "mesa-city", id: null, name: "New Bunker", lat: 30, lon: 30, notes: [], spi: null, video: null });
const cityCave = (await editableCave("mesa-city", (city as { id: string }).id))!.cave;
assert.equal(cityCave.x, undefined);

console.log(`cave tests passed (${pins} pins match their GPS)`);
