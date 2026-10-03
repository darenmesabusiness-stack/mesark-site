import { dbConfigured, ownershipQuery, query } from "@/lib/db";
import { DAY, type MapWindow, type TribeLocation, windowState } from "@/lib/mesaMap";
import { CLUSTERS } from "@/lib/leaderboard";
import { caveMaps } from "@/data/caves";

/** Local review only: never used by production or Vercel preview builds. */
export const mapPreview = () => process.env.NODE_ENV === "development" && Boolean(process.env.MESA_MAP_WINDOW_FILE);

export async function mapWindow(cluster: string): Promise<MapWindow | null> {
  if (mapPreview()) {
    try {
      const { readFile } = await import("node:fs/promises");
      const rows: MapWindow[] = JSON.parse(await readFile(process.env.MESA_MAP_WINDOW_FILE!, "utf8"));
      return rows.find(r => r.cluster === cluster) ?? null;
    } catch { return null; }
  }
  if (!dbConfigured()) return null;
  try {
    const [row] = await query<MapWindow>("select cluster, wiped_at::text, expires_at::text from mesa_map_wipes where cluster = $1", [cluster]);
    return row ?? null;
  } catch { return null; }
}

export function currentMapState(window: MapWindow | null) { return windowState(window, Date.now()); }

/** Fresh gate before reading any location; never cache a revealed base across wipes. */
export async function publishedLocations(cluster: string, window: MapWindow, now = Date.now()): Promise<TribeLocation[]> {
  if (mapPreview()) return [];
  if (!windowState(window, now).open) return [];
  return query<TribeLocation>(`select l.tribe_id, l.map, l.lat, l.lon, l.observed_at::text
    from mesa_map_locations l join mesa_map_wipes w on w.cluster = l.cluster and w.wiped_at = l.wiped_at
    where w.cluster = $1 and w.wiped_at = $2::timestamptz
      and w.wiped_at + interval '24 hours' <= now() and w.expires_at > now()`, [cluster, window.wiped_at]);
}

export async function confirmMapWipe(actor: string, cluster: string, wiped: string, expiry: string) {
  const start = Date.parse(wiped), end = Date.parse(expiry), now = Date.now();
  if (!CLUSTERS.some(c => c.key === cluster) || !Number.isFinite(start) || !Number.isFinite(end) || start > now || start < now - 35 * DAY || end <= now || end <= start + DAY || end > start + 35 * DAY)
    return "Enter a completed wipe and the next wipe time, in UTC. The window must be between 24 hours and 35 days.";
  const rows = await ownershipQuery(`with saved as (
    insert into mesa_map_wipes (cluster, wiped_at, expires_at, updated_by)
    select $2, $3::timestamptz, $4::timestamptz, $1 from users where steam_id = $1 and role in ('owner', 'lead')
    on conflict (cluster) do update set wiped_at = excluded.wiped_at, expires_at = excluded.expires_at, updated_by = excluded.updated_by, updated_at = now()
    returning cluster
  ), audited as (
    insert into mesa_map_audit(actor, cluster, action, data)
    select $1, cluster, 'confirm_wipe', jsonb_build_object('wiped_at', $3::text, 'expires_at', $4::text) from saved returning id
  ) select id from audited`, [actor, cluster, new Date(start).toISOString(), new Date(end).toISOString()]);
  return rows.length ? null : "Lead access is required.";
}

export async function saveMapLocation(actor: string, input: { cluster: string; wiped: string; tribe: number; map: string; lat: number; lon: number; observed: string; source: string; remove: boolean }) {
  if (!CLUSTERS.some(c => c.key === input.cluster) || !Number.isSafeInteger(input.tribe) || input.tribe <= 0) return "Choose a valid cluster and tribe.";
  if (!input.remove && (!caveMaps.some(m => m.name === input.map) || !Number.isFinite(input.lat) || !Number.isFinite(input.lon) || input.lat < 0 || input.lat > 100 || input.lon < 0 || input.lon > 100 || !input.source.trim() || input.source.length > 1000 || !Number.isFinite(Date.parse(input.observed)) || Date.parse(input.observed) > Date.now())) return "Enter a real map, GPS between 0 and 100, observation time and private verification source.";
  if (!Number.isFinite(Date.parse(input.wiped))) return "Confirm this wipe first.";
  const params = [actor, input.cluster, input.wiped, input.tribe, input.map, input.lat, input.lon, input.observed || input.wiped, input.source];
  const authorized = `exists(select 1 from users where steam_id = $1 and role in ('owner', 'lead'))
    and exists(select 1 from mesa_map_wipes where cluster = $2 and wiped_at = $3::timestamptz and expires_at > now())`;
  const mutation = input.remove ? `delete from mesa_map_locations where cluster = $2 and wiped_at = $3::timestamptz and tribe_id = $4 and ${authorized} returning tribe_id` :
    `insert into mesa_map_locations(cluster, wiped_at, tribe_id, map, lat, lon, observed_at, source, updated_by)
    select $2, $3::timestamptz, $4, $5, $6, $7, $8::timestamptz, $9, $1 where ${authorized} and $8::timestamptz >= $3::timestamptz
    on conflict (cluster, wiped_at, tribe_id) do update set map = excluded.map, lat = excluded.lat, lon = excluded.lon, observed_at = excluded.observed_at, source = excluded.source, updated_by = excluded.updated_by returning tribe_id`;
  // DELETE needs only four parameters; do not send unused placeholders to Postgres.
  const rows = await ownershipQuery(`with saved as (${mutation}), audited as (
    insert into mesa_map_audit(actor, cluster, action, data)
    select $1, $2, '${input.remove ? "remove_location" : "save_location"}', jsonb_build_object('tribe_id', tribe_id) from saved returning id
  ) select id from audited`, input.remove ? params.slice(0, 4) : params);
  return rows.length ? null : "Access changed, the wipe changed, or the observation predates this wipe. Refresh and try again.";
}
