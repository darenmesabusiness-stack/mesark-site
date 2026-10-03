import { getRankings, rankingQuery } from "@/lib/rankings";
import { mapWindow, publishedLocations } from "@/lib/mesaMapStore";
import { publicName, windowState, type MesaTribe, type MapWindow } from "@/lib/mesaMap";

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
        location: location ? { map: location.map, lat: location.lat, lon: location.lon, observed_at: location.observed_at } : null };
    }) };
}
