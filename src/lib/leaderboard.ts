/**
 * Server-side reads from the leaderboard API (leaderboards.mesark.net). Its CORS only
 * allows the leaderboard itself, so these run in server components only. Responses are
 * cached for 5 min here (and 3 min upstream), which keeps us far under its rate limit.
 * The API only ever returns public columns: never Steam IDs (see /privacy).
 */

const API = "https://leaderboards.mesark.net/api/ark";
const REVALIDATE = 300;

/** Leaderboard cluster keys → the names and art used on mesark.net. */
export const CLUSTERS = [
  { key: "SOLO", slug: "solo", name: "Solo", art: "/art/ark/solo.jpg", focus: "object-[50%_35%]" },
  { key: "DUO", slug: "duo", name: "Duo", art: "/art/ark/duo.jpg", focus: "object-[50%_35%]" },
  { key: "3MAN", slug: "3-4-man", name: "3/4 Man", art: "/art/ark/threesix.jpg", focus: "object-[50%_35%]" },
  { key: "100", slug: "100x", name: "100x", art: "/art/ark/hundredx-king.jpg", focus: "object-[50%_25%]" },
] as const;
export type Cluster = (typeof CLUSTERS)[number];
export const clusterByKey = (key: string) => CLUSTERS.find((c) => c.key === key);
export const clusterBySlug = (slug: string) => CLUSTERS.find((c) => c.slug === slug);

export interface PlayerCluster {
  cluster: string;
  kills: number;
  deaths: number;
  dinoKills: number;
  wildDinoKills: number;
  dinosTamed: number;
  deathsByDino: number;
  deathsByWildDino: number;
  playTime: number;
  tribeId: number | null;
  tribeName: string | null;
  killsRank: number;
  totalPlayers: number;
}
export interface PlayerDetail {
  avatar?: string | null;
  playerName: string;
  clusters: PlayerCluster[];
}
export interface TribeMember {
  PlayerName: string;
  PlayerKills: number;
  DeathByPlayer: number;
  DinoKills: number;
  WildDinoKills: number;
  DinosTamed: number;
  PlayTime: number;
}
export interface TribeDetail {
  cluster: string;
  tribeId: number;
  tribeName: string;
  damageScore: number;
  scoreRank: number;
  totalTribes: number;
  members: TribeMember[];
}
export interface PlayerRow {
  avatar?: string | null;
  PlayerName: string;
  PlayerKills: number;
  DeathByPlayer: number;
  DinoKills: number;
  PlayTime: number;
  clusters: string[];
  rank: number;
}
export interface TribeRow {
  TribeID: number;
  TribeName: string;
  DamageScore: number;
  TotalKills: string;
  TotalDeaths: string;
  rank: number;
}

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const getPlayer = (name: string) =>
  get<PlayerDetail>(`/player_rankings/detail?name=${encodeURIComponent(name)}`);

export const getTribe = (clusterKey: string, tribeId: number) =>
  get<TribeDetail>(`/tribe_rankings/detail?cluster=${encodeURIComponent(clusterKey)}&tribeId=${tribeId}`);

/** All-cluster player kill ranking; `search` matches part of a name. */
export async function searchPlayers(search = "", page = 0) {
  const d = await get<{ ranking_data: PlayerRow[]; pagination: { total_records: number } }>(
    `/player_rankings/all?page=${page}&search=${encodeURIComponent(search)}`,
  );
  return d ? { rows: d.ranking_data.filter((r) => !isBlockedName(r.PlayerName)), total: d.pagination.total_records } : null;
}

/** Tribe-score ranking on one cluster; `search` matches part of a tribe name. */
export async function searchTribes(clusterKey: string, search = "") {
  const d = await get<{ ranking_data: TribeRow[] }>(
    `/tribe_rankings?cluster=${encodeURIComponent(clusterKey)}&search=${encodeURIComponent(search)}&filter=Tribe%20Score`,
  );
  return d ? d.ranking_data.filter((r) => !isBlockedName(r.TribeName)) : null;
}

// ── Profiles ─────────────────────────────────────────────────────────────────

/** Profile URLs carry the name exactly as the game DB stores it. */
export async function playerFromParams(params: Promise<{ name: string }>) {
  const { name: raw } = await params;
  let name = raw;
  try {
    name = decodeURIComponent(raw);
  } catch {}
  if (isBlockedName(name)) return null;
  return getPlayer(name);
}

export function playerTotals(clusters: PlayerCluster[]) {
  const sum = (k: keyof PlayerCluster) => clusters.reduce((n, c) => n + (Number(c[k]) || 0), 0);
  const best = [...clusters].sort((a, b) => b.kills - a.kills || a.killsRank - b.killsRank)[0];
  return {
    kills: sum("kills"),
    deaths: sum("deaths"),
    dinoKills: sum("dinoKills"),
    wildDinoKills: sum("wildDinoKills"),
    dinosTamed: sum("dinosTamed"),
    playTime: sum("playTime"),
    best,
  };
}

export async function tribeFromParams(params: Promise<{ cluster: string; id: string }>) {
  const { cluster: slug, id } = await params;
  const cluster = clusterBySlug(slug);
  const tribeId = Number(id);
  if (!cluster || !Number.isSafeInteger(tribeId)) return null;
  const tribe = await getTribe(cluster.key, tribeId);
  if (!tribe || isBlockedName(tribe.tribeName)) return null;
  return { cluster, tribe };
}

export function tribeTotals(members: TribeMember[]) {
  const sum = (k: keyof TribeMember) => members.reduce((n, m) => n + (Number(m[k]) || 0), 0);
  return {
    kills: sum("PlayerKills"),
    deaths: sum("DeathByPlayer"),
    dinoKills: sum("DinoKills"),
    wildDinoKills: sum("WildDinoKills"),
    dinosTamed: sum("DinosTamed"),
    playTime: sum("PlayTime"),
  };
}

// ── Names ────────────────────────────────────────────────────────────────────

/** The game DB hands back UTF-8 read as Latin-1 ("FÃ¼r"); repair it for display. */
export function fixText(s: string | null | undefined): string {
  if (!s) return "";
  if (!/[ÃÂ][\u0080-¿]/.test(s)) return s;
  const bytes = Uint8Array.from([...s].map((ch) => ch.charCodeAt(0) & 0xff));
  const out = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  return out.includes("�") ? s : out;
}

/**
 * Player-chosen names we won't give a public page or share card on mesark.net.
 * Matched after undoing l33t spellings, so "NlGG3R" style dodges still hit.
 */
// Long stems match anywhere ("2 n...s 1 b"); short ones only as whole words, so
// "FRANKKK", "Nazir", "raccoon", "Grape" and "Torpedo" stay.
const STEMS = ["nigg", "niglet", "faggot", "fagot", "tranny", "retard", "hitler", "wetback", "beaner", "towelhead"];
const WORDS = /^(nazi|kkk|gook|kike|chink|fag|spic|coon|rape|rapist|pedo|pedophile)s?$/;
const LEET: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", $: "s", "!": "i", "|": "i" };

export function isBlockedName(name: string | null | undefined): boolean {
  if (!name) return false;
  const base = fixText(name)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
  if (/(^|\D)14\W?88(\D|$)/.test(base)) return true;
  const mapped = [...base].map((c) => LEET[c] ?? c).join("");
  for (const form of [mapped, mapped.replace(/l/g, "i")]) {
    // "nlgger"
    const plain = form.replace(/[^a-z]/g, "");
    if (STEMS.some((w) => plain.includes(w))) return true;
    if (form.split(/[^a-z]+/).some((t) => WORDS.test(t))) return true;
  }
  return false;
}

// ── Formatting ───────────────────────────────────────────────────────────────

export const hours = (minutes: number) => Math.round(minutes / 60).toLocaleString("en-US");
export const kd = (kills: number, deaths: number) => (deaths ? kills / deaths : kills).toFixed(2);
export const num = (n: number | string) => Number(n).toLocaleString("en-US");
export const playerHref = (name: string) => `/players/${encodeURIComponent(name)}`;
export const tribeHref = (clusterKey: string, tribeId: number) =>
  `/tribes/${clusterByKey(clusterKey)?.slug ?? clusterKey.toLowerCase()}/${tribeId}`;
