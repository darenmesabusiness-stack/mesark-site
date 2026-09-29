import { clusters as serverClusters } from "@/data/servers";
import { wipeSchedules } from "@/data/wipes";

export interface ClusterProfile {
  /** Must match the `name` in servers.ts and `cluster` in wipes.ts */
  key: string;
  name: string;
  tribe: string;
  tagline: string;
  art: string;
  /** Tailwind object-position class tuned per artwork */
  focus: string;
}

export const clusterProfiles: ClusterProfile[] = [
  {
    key: "Solo",
    name: "Solo",
    tribe: "1 player",
    tagline: "1-man tribes. Pure skill, no teammates to rely on.",
    art: "/art/solo.jpg",
    focus: "object-[40%_30%]",
  },
  {
    key: "Duo",
    name: "Duo",
    tribe: "2 players",
    tagline: "2-man tribes. Tight coordination, high stakes.",
    art: "/art/duo.jpg",
    focus: "object-[50%_30%]",
  },
  {
    key: "3/6 Man",
    name: "3/6 Man",
    tribe: "3–6 players",
    tagline: "Rotating tribe size. Competitive seasons with HOF rewards.",
    art: "/art/threesix.jpg",
    focus: "object-[40%_35%]",
  },
  {
    key: "100x",
    name: "100x",
    tribe: "2–6 players",
    tagline: "Fast-paced chaos. Instant taming, 100x rates.",
    art: "/art/hundredx.jpg",
    focus: "object-[45%_35%]",
  },
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Server count for a cluster, derived from the live IP list so it never drifts. */
export function serverCount(key: string): number {
  return serverClusters.find((c) => c.name === key)?.servers.length ?? 0;
}

/** Human wipe day for a cluster, e.g. "Every Monday". */
export function wipeDay(key: string): string {
  const s = wipeSchedules.find((w) => w.cluster === key);
  return s ? `Every ${DAY_NAMES[s.dayOfWeek]}` : "";
}
