import { CLUSTERS, isBlockedName } from "@/lib/leaderboard";

export const DAY = 86_400_000;
export interface MapWindow { cluster: string; wiped_at: string; expires_at: string }
export interface TribeLocation { tribe_id: number; map: string; lat: number; lon: number; observed_at: string }
export interface MesaTribe {
  id: number; name: string; rank: number; score: number; kills: number; deaths: number;
  location: (Omit<TribeLocation, "tribe_id"> & {
    mapImage?: { src: string; w: number; h: number; x: number; y: number } | null;
  }) | null;
}

/** No scheduled-wipe inference: late wipes must not reveal bases early. */
export function windowState(window: MapWindow | null, now: number) {
  if (!window) return { open: false, unlock: null };
  const wiped = Date.parse(window.wiped_at), expiry = Date.parse(window.expires_at);
  if (!Number.isFinite(wiped) || !Number.isFinite(expiry) || expiry <= wiped + DAY || now >= expiry)
    return { open: false, unlock: null };
  return { open: now >= wiped + DAY, unlock: new Date(wiped + DAY).toISOString() };
}

export function publicName(name: unknown): name is string {
  return typeof name === "string" && Boolean(name.trim()) && !isBlockedName(name) && !/7656\d{13}/.test(name);
}

export const mapCluster = (value: unknown) => CLUSTERS.find(c => c.key === value) ?? CLUSTERS[0];

const COLORS = ["#ff9759", "#59d7cc", "#b8a1ff", "#ffd477", "#78baff", "#f594bd", "#a7d76f", "#d9a989", "#93a6da", "#e3dbba"];
export function tribeColor(id: number) { return COLORS[Math.abs(id) % COLORS.length]; }
export function tribeColors(tribes: MesaTribe[]) {
  const colors = new Map<number, string>(), used = new Set<number>();
  for (const tribe of [...tribes].sort((a, b) => a.id - b.id)) {
    let index = Math.abs(tribe.id) % COLORS.length;
    while (used.has(index)) index = (index + 1) % COLORS.length;
    used.add(index); colors.set(tribe.id, COLORS[index]);
  }
  return colors;
}

/** Circle area follows score, with a minimum readable/clickable size for low scores. */
export function packTribes(tribes: MesaTribe[]) {
  const max = Math.max(1, ...tribes.map(t => t.score));
  const packed: { tribe: MesaTribe; x: number; y: number; radius: number }[] = [];
  for (const tribe of [...tribes].sort((a, b) => b.score - a.score || a.id - b.id)) {
    const radius = Math.max(32, 68 * Math.sqrt(tribe.score / max));
    let position: { x: number; y: number } | null = null;
    for (let step = 0; step < 20_000; step++) {
      const angle = step * 2.3999632297, distance = 2.8 * Math.sqrt(step);
      const x = 400 + Math.cos(angle) * distance, y = 250 + Math.sin(angle) * distance;
      if (x < radius + 12 || x > 788 - radius || y < radius + 12 || y > 488 - radius) continue;
      if (packed.every(p => Math.hypot(p.x - x, p.y - y) >= p.radius + radius + 12)) { position = { x, y }; break; }
    }
    if (!position) throw new Error("Tribe bubbles cannot fit");
    packed.push({ tribe, ...position, radius });
  }
  return packed;
}
