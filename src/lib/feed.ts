import { unstable_cache } from "next/cache";
import { botGetPublic } from "@/lib/bot";

/**
 * Public game events from the bot (plugin databases, copied every 2 min): vault/boss spawns,
 * rare-dino sightings and raids. Raids only appear an hour after they end (owner rule), and the
 * bot never sends logins, transfers or anything that tracks a player.
 */
export type FeedItem =
  | { kind: "loot" | "sighting"; cluster: string; map: string; title: string; lat: number | null; lon: number | null; at: number }
  | { kind: "raid"; cluster: string; map: string; at: number; attacker: string | null; victim: string | null; structures: number }
  | { kind: "boss"; cluster: string; map: string; at: number; tribe: string | null; boss: string };

export type FeedData = { items: FeedItem[]; generated: number };

export const getFeed = unstable_cache(
  async (): Promise<FeedData | null> => {
    const res = await botGetPublic<FeedData>("/v1/feed");
    return res.ok ? res.data : null;
  },
  ["feed-v1"],
  { revalidate: 60 },
);

const MAP_NAMES: Record<string, string> = {
  TheIsland: "The Island",
  TheCenter: "The Center",
  ScorchedEarth: "Scorched Earth",
  CrystalIsles: "Crystal Isles",
  LostIsland: "Lost Island",
  Gen2: "Genesis 2",
  Genesis: "Genesis 1",
  MesaPrime: "MESA City",
  BossMap: "Boss Map",
};

/** "TheIsland" / "Aberration_P" → "The Island" / "Aberration". */
export function prettyMap(raw: string): string {
  const k = raw.replace(/_P$/, "");
  return MAP_NAMES[k] ?? k.replace(/([a-z])([A-Z])/g, "$1 $2");
}

/** "MESA Solos" → "Solo", "MESA 3 MAN" → "3 Man". */
export function prettyCluster(raw: string): string {
  return raw
    .replace(/^MESA\s+/i, "")
    .replace(/^Solos$/i, "Solo")
    .replace(/^Duos$/i, "Duo")
    .replace(/MAN$/i, "Man");
}

/** "4 min ago", "2 h ago", "yesterday". */
export function ago(ts: number, now: number): string {
  const m = Math.max(0, Math.round((now - ts) / 60));
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return h < 48 ? "yesterday" : `${Math.round(h / 24)} days ago`;
}
