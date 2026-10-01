/**
 * Caves on /maps: the built-in caves from the Discord export (src/data/caves.ts) plus edits from
 * the staff cave editor. A saved edit replaces the built-in cave with the same id, adds a new one,
 * or hides one. Pin positions are worked out from the GPS with each map's calibration.
 */
import { unstable_cache } from "next/cache";
import { caveMaps as builtIn, type Cave, type CaveMap } from "@/data/caves";
import { gpsToPin } from "@/data/cave-calibration";
import { dbConfigured, query } from "@/lib/db";

export const CAVES_TAG = "caves";

interface EditRow {
  map: string;
  cave_id: string;
  data: Cave;
  hidden: boolean;
  updated_at: string;
  editor: string | null;
}

async function edits(): Promise<EditRow[]> {
  return query<EditRow>(
    `select e.map, e.cave_id, e.data, e.hidden, e.updated_at, u.persona as editor
       from cave_edits e left join users u on u.steam_id = e.updated_by`,
  );
}

/** Built-in caves with the editor's changes applied (uncached; pages use `publishedCaveMaps`). */
export async function loadCaveMaps(): Promise<CaveMap[]> {
  const maps: CaveMap[] = builtIn.map((m) => ({ ...m, caves: [...m.caves] }));
  if (!dbConfigured()) return maps;
  let rows: EditRow[] = [];
  try {
    rows = await edits();
  } catch (e) {
    console.error("caves: reading edits failed", e);
    return maps;
  }
  for (const r of rows) {
    const m = maps.find((x) => x.slug === r.map);
    if (!m) continue;
    const i = m.caves.findIndex((c) => c.id === r.cave_id);
    if (r.hidden) {
      if (i >= 0) m.caves.splice(i, 1);
    } else if (i >= 0) {
      m.caves[i] = r.data;
    } else {
      m.caves.push(r.data);
    }
  }
  return maps;
}

export const publishedCaveMaps = unstable_cache(loadCaveMaps, ["cave-maps"], { tags: [CAVES_TAG], revalidate: 3600 });

export type CaveStatus = "original" | "edited" | "new" | "hidden";
export interface StaffCave {
  id: string;
  name: string;
  status: CaveStatus;
  lat: number;
  lon: number;
  hasClip: boolean;
  updatedAt: string | null;
  editor: string | null;
}

/** Every cave on a map for the editor's list, including hidden ones. */
export async function staffCaves(mapSlug: string): Promise<StaffCave[]> {
  const map = builtIn.find((m) => m.slug === mapSlug);
  if (!map) return [];
  const rows = (await edits()).filter((r) => r.map === mapSlug);
  const byId = new Map(rows.map((r) => [r.cave_id, r]));
  const out: StaffCave[] = map.caves.map((c) => {
    const r = byId.get(c.id);
    const d = r && !r.hidden ? r.data : c;
    return {
      id: c.id,
      name: d.name,
      status: r ? (r.hidden ? "hidden" : "edited") : "original",
      lat: d.lat,
      lon: d.lon,
      hasClip: !!d.video,
      updatedAt: r?.updated_at ?? null,
      editor: r?.editor ?? null,
    };
  });
  for (const r of rows) {
    if (map.caves.some((c) => c.id === r.cave_id)) continue;
    out.push({
      id: r.cave_id,
      name: r.data.name,
      status: r.hidden ? "hidden" : "new",
      lat: r.data.lat,
      lon: r.data.lon,
      hasClip: !!r.data.video,
      updatedAt: r.updated_at,
      editor: r.editor,
    });
  }
  return out;
}

/** The cave as the editor should open it: saved edit, else built-in, else null. */
export async function editableCave(mapSlug: string, id: string): Promise<{ cave: Cave; status: CaveStatus } | null> {
  const [r] = await query<EditRow>(`select map, cave_id, data, hidden, updated_at, null as editor from cave_edits where map = $1 and cave_id = $2`, [mapSlug, id]);
  const original = builtIn.find((m) => m.slug === mapSlug)?.caves.find((c) => c.id === id);
  if (r) return { cave: r.data, status: r.hidden ? "hidden" : original ? "edited" : "new" };
  return original ? { cave: original, status: "original" } : null;
}

export const caveSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "cave";

export interface CaveInput {
  map: string;
  id: string | null; // null = new cave
  name: string;
  lat: number;
  lon: number;
  notes: string[];
  spi: string | null;
  video: string | null;
}

/** Validates and saves a cave (live straight away). Returns { error } or { id }. */
export async function saveCave(editor: string, input: CaveInput): Promise<{ error: string } | { id: string }> {
  const map = builtIn.find((m) => m.slug === input.map);
  if (!map) return { error: "Unknown map." };
  const name = input.name.trim().replace(/\s+/g, " ");
  if (!name) return { error: "Give the cave a name." };
  if (!Number.isFinite(input.lat) || !Number.isFinite(input.lon) || input.lat < 0 || input.lat > 100 || input.lon < 0 || input.lon > 100) {
    return { error: "GPS must be two numbers between 0 and 100 (lat, lon), as shown in game." };
  }
  // Clips are either built-in files (/maps/...) or uploads served by /api/caves/clip/...
  if (input.video && !/^\/(maps|api\/caves\/clip)\//.test(input.video)) return { error: "The clip link isn't valid. Upload the clip again." };

  let id = input.id;
  if (!id) {
    // New cave: an id from its name that isn't taken on this map yet.
    const taken = new Set([...map.caves.map((c) => c.id), ...(await edits()).filter((r) => r.map === map.slug).map((r) => r.cave_id)]);
    const base = caveSlug(name);
    id = base;
    for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
  }
  const original = map.caves.find((c) => c.id === id);
  const lat = Math.round(input.lat * 10) / 10;
  const lon = Math.round(input.lon * 10) / 10;
  const pin = map.image ? gpsToPin(map.slug, lat, lon) : null;
  const cave: Cave = {
    id,
    name,
    lat,
    lon,
    ...(pin ? { x: pin.x, y: pin.y } : {}),
    notes: input.notes.map((n) => n.trim().replace(/^[-•]\s*/, "")).filter(Boolean),
    spi: input.spi?.trim() || null,
    ...(input.video ? { video: input.video } : {}),
    // Keep the built-in poster only while the built-in clip is still the one in use.
    ...(original?.poster && input.video === original.video ? { poster: original.poster } : {}),
  };
  await query(
    `insert into cave_edits (map, cave_id, data, hidden, updated_at, updated_by) values ($1, $2, $3::jsonb, false, now(), $4)
     on conflict (map, cave_id) do update set data = excluded.data, hidden = false, updated_at = now(), updated_by = excluded.updated_by`,
    [map.slug, id, JSON.stringify(cave), editor],
  );
  return { id };
}

/** Hides a cave from /maps (built-in or new); restoreCave undoes it. */
export async function hideCave(editor: string, mapSlug: string, id: string) {
  const current = await editableCave(mapSlug, id);
  if (!current) return;
  await query(
    `insert into cave_edits (map, cave_id, data, hidden, updated_at, updated_by) values ($1, $2, $3::jsonb, true, now(), $4)
     on conflict (map, cave_id) do update set hidden = true, updated_at = now(), updated_by = excluded.updated_by`,
    [mapSlug, id, JSON.stringify(current.cave), editor],
  );
}

/** Drops the editor's version: a built-in cave goes back to its original, a new cave is removed. */
export async function restoreCave(mapSlug: string, id: string) {
  await query(`delete from cave_edits where map = $1 and cave_id = $2`, [mapSlug, id]);
}

/** Shows a hidden cave again with its last saved details. */
export async function unhideCave(editor: string, mapSlug: string, id: string) {
  await query(`update cave_edits set hidden = false, updated_at = now(), updated_by = $3 where map = $1 and cave_id = $2`, [mapSlug, id, editor]);
}
