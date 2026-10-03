import { getRankings, rankingQuery } from "@/lib/rankings";
import { mapWindow, publishedLocations } from "@/lib/mesaMapStore";
import { publicName, windowState, type MesaTribe, type MapWindow } from "@/lib/mesaMap";
import { caveMaps } from "@/data/caves";
import { gpsToPin } from "@/data/cave-calibration";

/** Reuse the cave maps' calibrated rulers; GPS is not a raw image percentage. */
export function homeMapImage(mapName: string, lat: number, lon: number) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < 0 || lat > 100 || lon < 0 || lon > 100) return null;
  const map = caveMaps.find(m => m.name === mapName);
  const pin = map && gpsToPin(map.slug, lat, lon);
  if (!map?.image || !pin || pin.x < 0 || pin.x > 100 || pin.y < 0 || pin.y > 100) return null;
  return { ...map.image, ...pin };
}

export async function getMesaMap(cluster: string) {
  const window = await mapWindow(cluster), state = windowState(window, Date.now());
  if (!state.open) return { ...state, expires: null, tribes: [] as MesaTribe[], unavailable: false };
  const [rankings, locations] = await Promise.all([
    getRankings(rankingQuery({ view: "tribes", cluster, sort: "Tribe Score" })),
    publishedLocations(cluster, window as MapWindow).catch(() => []),
  ]);
  const current = await mapWindow(cluster);
  if (current?.wiped_at !== window?.wiped_at || !windowState(current, Date.now()).open)
    return { ...windowState(current, Date.now()), expires: null, tribes: [] as MesaTribe[], unavailable: false };
  return { ...state, expires: current!.expires_at, unavailable: rankings === null, tribes: (rankings?.rows ?? [])
    .filter(r => r.tribeId !== null && r.rank >= 1 && r.rank <= 10 && r.score > 0 && publicName(r.name)).slice(0, 10).map(r => {
      const location = locations.find(l => Number(l.tribe_id) === r.tribeId);
      return { id: r.tribeId!, name: r.name, rank: r.rank, score: r.score, kills: r.kills, deaths: r.deaths,
        location: location ? { map: location.map, lat: location.lat, lon: location.lon, observed_at: location.observed_at,
          mapImage: homeMapImage(location.map, location.lat, location.lon) } : null };
    }) };
}
