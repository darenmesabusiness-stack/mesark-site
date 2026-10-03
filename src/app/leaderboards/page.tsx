import Link from "next/link";
import { RankingMedal, RankingPodium } from "@/components/RankingMedal";
import { SteamAvatar } from "@/components/profiles/SteamAvatar";
import { PageHeader } from "@/components/PageHeader";
import { pageMeta } from "@/lib/seo";
import {
  CLUSTERS,
  fixText,
  hours,
  kd,
  num,
  playerHref,
  tribeHref,
} from "@/lib/leaderboard";
import {
  getRankings,
  PLAYER_SORTS,
  rankingHref,
  rankingQuery,
  TRIBE_SORTS,
} from "@/lib/rankings";

export const metadata = pageMeta({
  title: "Leaderboards",
  description:
    "MESA player rankings and tribe scores. Search, compare clusters and open survivor profiles.",
});

export default async function LeaderboardsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = rankingQuery(await searchParams);
  const data = await getRankings(query);
  const tribes = query.mode === "tribes";
  const sorts = tribes ? TRIBE_SORTS : PLAYER_SORTS;
  const selectedCluster = CLUSTERS.find(
    (cluster) => cluster.key === query.cluster,
  );
  const control =
    "w-full border border-border bg-bg-card px-3 py-3 text-sm focus:border-accent/50 focus:outline-none";
  const tab =
    "clip-corner-sm border px-5 py-3 font-display text-xl font-extrabold transition";
  return (
    <>
      <PageHeader
        title="Leaderboards"
        subtitle="Player rankings and tribe scores. All here on MESA."
        image={selectedCluster?.art ?? "/art/ark/duo.jpg"}
        focus={selectedCluster?.focus ?? "object-[50%_35%]"}
        kicker="Community"
      />
      <div className="mx-auto max-w-6xl px-4 pb-24">
        <nav aria-label="Leaderboard type" className="flex gap-3">
          <Link
            href={rankingHref(query, {
              mode: "players",
              sort: "Kills",
              page: 0,
            })}
            aria-current={!tribes ? "page" : undefined}
            className={`${tab} ${!tribes ? "border-accent bg-accent text-bg-primary" : "border-border hover:border-accent/50"}`}
          >
            Players
          </Link>
          <Link
            href={rankingHref(query, {
              mode: "tribes",
              cluster: query.cluster === "ALL" ? "SOLO" : query.cluster,
              sort: "Tribe Score",
              page: 0,
            })}
            aria-current={tribes ? "page" : undefined}
            className={`${tab} ${tribes ? "border-accent bg-accent text-bg-primary" : "border-border hover:border-accent/50"}`}
          >
            Tribes
          </Link>
        </nav>
        <form
          key={`${query.mode}:${query.cluster}:${query.sort}:${query.search}`}
          action="/leaderboards"
          method="get"
          role="search"
          aria-label="Filter leaderboards"
          className="mt-6 grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto]"
        >
          <input type="hidden" name="view" value={query.mode} />
          <label className="space-y-2">
            <span className="hud-label">Cluster</span>
            <select
              name="cluster"
              defaultValue={query.cluster}
              className={control}
            >
              {!tribes && <option value="ALL">All clusters</option>}
              {CLUSTERS.map((cluster) => (
                <option key={cluster.key} value={cluster.key}>
                  {cluster.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="hud-label">Rank by</span>
            <select name="sort" defaultValue={query.sort} className={control}>
              {sorts.map((sort) => (
                <option key={sort}>{sort}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="hud-label">
              {tribes ? "Tribe name" : "Player name"}
            </span>
            <input
              name="q"
              type="search"
              defaultValue={query.search}
              maxLength={40}
              placeholder={tribes ? "Search tribes…" : "Search players…"}
              className={control}
            />
          </label>
          <button
            type="submit"
            className="clip-corner-sm bg-accent px-6 py-3 font-display text-xl font-extrabold text-bg-primary hover:bg-accent/90"
          >
            Apply
          </button>
        </form>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-3xl font-black">
            {selectedCluster?.name ?? "All clusters"} · {query.sort}
          </h2>
          <p className="text-xs text-text-muted">
            Refreshes every few minutes · select a name for its profile
          </p>
        </div>
        {!data ? (
          <p
            role="status"
            className="mt-5 border border-border bg-bg-card/60 p-5 text-sm text-text-muted"
          >
            Rankings are temporarily unavailable.{" "}
            <Link
              href={rankingHref(query)}
              className="text-accent underline underline-offset-4"
              prefetch={false}
            >
              Try again
            </Link>{" "}
            in a minute.
          </p>
        ) : (
          <>
            <RankingPodium rows={data.rows} query={query} />
            <div className="mt-5 overflow-x-auto border-y border-border">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  {tribes ? "Tribe" : "Player"} rankings by {query.sort}
                  {query.search ? ` matching ${query.search}` : ""}
                </caption>
                <thead className="border-b border-border bg-bg-card/60 text-xs text-text-muted">
                  <tr>
                    <th scope="col" className="px-3 py-3">
                      Rank
                    </th>
                    <th scope="col" className="min-w-40 px-3 py-3">
                      {tribes ? "Tribe" : "Player"}
                    </th>
                    {tribes && (
                      <th scope="col" className="px-3 py-3 text-right">
                        Score
                      </th>
                    )}
                    <th scope="col" className="px-3 py-3 text-right">
                      Kills
                    </th>
                    <th scope="col" className="px-3 py-3 text-right">
                      Deaths
                    </th>
                    <th scope="col" className="px-3 py-3 text-right">
                      K/D
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3 py-3 text-right"
                    >
                      Dino kills
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-3 py-3 text-right"
                    >
                      Hours
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {data.rows.map((row, index) => (
                    <tr
                      key={`${row.tribeId ?? row.name}:${index}`}
                      className={row.rank === 1 ? "bg-[#e4b64b]/[0.08]" : row.rank === 2 ? "bg-[#b3c4d4]/[0.06]" : row.rank === 3 ? "bg-[#bd8051]/[0.08]" : "hover:bg-accent/[0.05]"}
                    >
                      <td className="px-3 py-4 font-mono text-text-muted">
                        <RankingMedal rank={row.rank} />
                      </td>
                      <th
                        scope="row"
                        className="max-w-72 break-words px-3 py-4 font-semibold"
                      >
                        {tribes && row.tribeId === null ? (
                          fixText(row.name)
                        ) : (
                          <Link
                            href={
                              tribes
                                ? tribeHref(query.cluster, row.tribeId!)
                                : playerHref(row.name)
                            }
                            className="flex items-center gap-3 hover:text-accent"
                          >
                            {!tribes && <SteamAvatar avatar={row.avatar} name={fixText(row.name)} />}
                            {fixText(row.name)}
                          </Link>
                        )}
                      </th>
                      {tribes && (
                        <td className="px-3 py-4 text-right font-mono">
                          {num(row.score)}
                        </td>
                      )}
                      <td className="px-3 py-4 text-right font-mono">
                        {num(row.kills)}
                      </td>
                      <td className="px-3 py-4 text-right font-mono">
                        {num(row.deaths)}
                      </td>
                      <td className="px-3 py-4 text-right font-mono">
                        {kd(row.kills, row.deaths)}
                      </td>
                      <td className="px-3 py-4 text-right font-mono">
                        {num(row.dinoKills)}
                      </td>
                      <td className="px-3 py-4 text-right font-mono">
                        {hours(row.playTime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!data.rows.length && (
                <p className="p-5 text-sm text-text-muted">
                  {query.search
                    ? "No matching names. Try another search or cluster."
                    : "No rankings on this page yet. Try another cluster or check back after players join."}
                </p>
              )}
            </div>
            {(data.pages > 1 || query.page > 0) && (
              <nav
                aria-label="Leaderboard pages"
                className="mt-6 flex items-center justify-between gap-3 text-sm"
              >
                {query.page > 0 ? (
                  <Link
                    href={rankingHref(query, { page: query.page - 1 })}
                    className="border border-border px-4 py-2 hover:border-accent/50"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span />
                )}
                <span className="text-text-muted">
                  Page {query.page + 1}
                  {data.pages ? ` of ${data.pages}` : ""}
                </span>
                {query.page + 1 < data.pages ? (
                  <Link
                    href={rankingHref(query, { page: query.page + 1 })}
                    className="border border-border px-4 py-2 hover:border-accent/50"
                  >
                    Next →
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            )}
          </>
        )}
        <p className="mt-8 text-sm text-text-muted">
          Names and statistics come from the game servers.{" "}
          <Link href="/players" className="text-accent hover:underline">
            Search player & tribe profiles →
          </Link>
        </p>
      </div>
    </>
  );
}
