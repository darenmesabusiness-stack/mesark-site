import { unstable_cache } from "next/cache";
import { botGetPublic, type PopulationData } from "@/lib/bot";
import type { Cluster } from "@/data/servers";

/**
 * Live players per server from the bot (game machines' perf sampler, counts only, every 2 min).
 * Cached for a minute so the public pages never wait on the bot; null when it's unavailable,
 * and pages then render without counts.
 */
export const getPopulation = unstable_cache(
  async (): Promise<PopulationData | null> => {
    const res = await botGetPublic<PopulationData>("/v1/population?hours=24");
    return res.ok && res.data.fresh ? res.data : null;
  },
  ["population-v1"],
  { revalidate: 60 },
);

// Site cluster name → the bot's cluster name (from the machines' server configs).
const CLUSTER_ALIAS: Record<string, string> = {
  "3/4 Man": "MESA 3 MAN",
  "100x": "MESA 100x",
  Duo: "MESA Duos",
  Solo: "MESA Solos",
};

/** "The Island 1" / "Island" → "island", "Gen 2" / "Gen2" / "Genesis 2" → "genesis2", "Trade Map" → "tradingoutpost". */
export function mapKey(name: string): string {
  let k = name.toLowerCase().trim();
  k = k.replace(/^the /, "").replace(/ 1$/, "").replace(/^mesa (?=boss map|city)/, "");
  k = k.replace(/^gen ?2$|^genesis 2$/, "genesis2").replace(/^gen ?1$/, "genesis");
  k = k.replace(/^trade map$/, "trading outpost");
  return k.replace(/[^a-z0-9]/g, "");
}

export type LiveCounts = {
  servers: Record<string, number>; // `${siteCluster}|${siteMap}` → players
  clusters: Record<string, number>; // siteCluster → players on listed servers
};

/** Match the bot's live counts to the site's server list by cluster + map name. */
export function liveCounts(pop: PopulationData | null, clusters: Cluster[]): LiveCounts | null {
  if (!pop) return null;
  const byKey = new Map<string, number>();
  for (const s of pop.servers) byKey.set(`${s.cluster}|${mapKey(s.map)}`, s.players);
  const out: LiveCounts = { servers: {}, clusters: {} };
  for (const c of clusters) {
    const botCluster = CLUSTER_ALIAS[c.name];
    if (!botCluster) continue;
    for (const s of c.servers) {
      const n = byKey.get(`${botCluster}|${mapKey(s.map)}`);
      if (n === undefined) continue;
      out.servers[`${c.name}|${s.map}`] = n;
      out.clusters[c.name] = (out.clusters[c.name] ?? 0) + n;
    }
  }
  return out;
}
