import { CLUSTERS, isBlockedName } from "@/lib/leaderboard";

export const PLAYER_SORTS = [
  "Kills",
  "Deaths",
  "Tamed Dino Kills",
  "Time Played",
] as const;
export const TRIBE_SORTS = ["Tribe Score", ...PLAYER_SORTS] as const;
export type RankingQuery = ReturnType<typeof rankingQuery>;

export function rankingQuery(
  params: Record<string, string | string[] | undefined>,
) {
  const value = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : "";
  const mode = value("view") === "tribes" ? "tribes" : "players";
  const cluster = CLUSTERS.some((c) => c.key === value("cluster"))
    ? value("cluster")
    : mode === "tribes"
      ? "SOLO"
      : "ALL";
  const sorts: readonly string[] =
    mode === "tribes" ? TRIBE_SORTS : PLAYER_SORTS;
  const sort = sorts.includes(value("sort")) ? value("sort") : sorts[0];
  const pageText = value("page");
  const page = /^\d{1,4}$/.test(pageText)
    ? Math.min(Number(pageText), 1000)
    : 0;
  return { mode, cluster, sort, page, search: value("q").trim().slice(0, 40) };
}

export function rankingHref(
  query: RankingQuery,
  changes: Partial<RankingQuery> = {},
) {
  const next = { ...query, ...changes };
  const params = new URLSearchParams({
    view: next.mode,
    cluster: next.cluster,
    sort: next.sort,
  });
  if (next.search) params.set("q", next.search);
  if (next.page) params.set("page", String(next.page));
  return `/leaderboards?${params}`;
}

/** Only the public fields used by this page cross the API boundary. */
export interface RankingRow {
  name: string;
  rank: number;
  kills: number;
  deaths: number;
  dinoKills: number;
  playTime: number;
  score: number;
  tribeId: number | null;
}

export async function getRankings(
  query: RankingQuery,
): Promise<{ rows: RankingRow[]; pages: number } | null> {
  const params = new URLSearchParams({
    cluster: query.cluster,
    filter: query.sort,
    page: String(query.page),
    search: query.search,
  });
  const route =
    query.mode === "tribes"
      ? "tribe_rankings"
      : query.cluster === "ALL"
        ? "player_rankings/all"
        : "player_rankings";
  try {
    const response = await fetch(
      `https://leaderboards.mesark.net/api/ark/${route}?${params}`,
      {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!response.ok) return null;
    const data = await response.json();
    if (!Array.isArray(data.ranking_data) || !data.pagination) return null;
    const number = (value: unknown) =>
      Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
    const rows: RankingRow[] = [];
    for (const item of data.ranking_data.slice(0, 20)) {
      if (!item || typeof item !== "object") continue;
      const name = query.mode === "tribes" ? item.TribeName : item.PlayerName;
      if (
        typeof name !== "string" ||
        !name.trim() ||
        isBlockedName(name) ||
        /7656\d{13}/.test(name)
      )
        continue;
      const id = Number(item.TribeID);
      rows.push({
        name,
        rank: number(item.rank),
        kills: number(item.PlayerKills ?? item.TotalKills),
        deaths: number(item.DeathByPlayer ?? item.TotalDeaths),
        dinoKills: number(item.DinoKills ?? item.TotalTameKills),
        playTime: number(item.PlayTime ?? item.TotalPlayTime),
        score: number(item.DamageScore),
        tribeId:
          query.mode === "tribes" && Number.isSafeInteger(id) && id > 0
            ? id
            : null,
      });
    }
    return {
      rows,
      pages: Math.min(1001, Math.ceil(number(data.pagination.total_pages))),
    };
  } catch {
    return null;
  }
}
