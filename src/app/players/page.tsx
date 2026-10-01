import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PageHeader } from "@/components/PageHeader";
import {
  CLUSTERS,
  clusterByKey,
  fixText,
  kd,
  num,
  playerHref,
  searchPlayers,
  searchTribes,
  tribeHref,
  type TribeRow,
} from "@/lib/leaderboard";

export const metadata = pageMeta({
  title: "Player & Tribe Profiles",
  description: "Look up any MESARK player or tribe.",
});

/** Leaderboard names arrive as stored in the game DB; the server names some clusters differently. */
const clusterName = (display: string) =>
  ({ Solos: "Solo", Duos: "Duo", "3/6 Man": "3/4 Man", "2/6 Man 100x": "100x" })[display] ?? display;

export default async function PlayersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 40);
  const [players, ...tribesPerCluster] = await Promise.all([
    searchPlayers(q),
    ...CLUSTERS.map((c) => searchTribes(c.key, q)),
  ]);
  const tribes = CLUSTERS.map((c, i) => ({
    cluster: c,
    rows: (tribesPerCluster[i] ?? []).slice(0, q ? 8 : 5),
  }));
  const failed = players === null;

  return (
    <>
      <PageHeader
        title="Profiles"
        subtitle="Every survivor and tribe on MESA. Ranks, K/D and rosters, plus a link that turns into a stat card when you paste it in Discord."
        image="/art/ark/duo.jpg"
        focus="object-[50%_35%]"
        kicker="Players & tribes"
      />

      <div className="mx-auto max-w-6xl px-4 pb-24">
        <form action="/players" method="get" className="flex gap-2" role="search">
          <label className="relative flex-1">
            <span className="sr-only">Player or tribe name</span>
            <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Player or tribe name"
              autoComplete="off"
              className="w-full border border-border bg-bg-card/60 py-3.5 pl-12 pr-4 text-base placeholder:text-text-muted/60 focus:border-accent/50 focus:outline-none"
            />
          </label>
          <button type="submit" className="clip-corner-sm bg-accent px-6 font-display text-xl font-extrabold uppercase tracking-wide text-bg-primary transition hover:bg-accent/90">
            Search
          </button>
        </form>

        {failed && (
          <p className="mt-6 border border-border bg-bg-card/60 p-4 text-sm text-text-muted">
            The leaderboard isn&apos;t answering right now. Try again in a minute.
          </p>
        )}

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section>
            <p className="hud-label !text-accent">{q ? `Players matching “${q}”` : "All clusters"}</p>
            <h2 className="font-display mt-1 text-5xl font-black">{q ? "Players" : "Top killers"}</h2>
            <ol className="mt-4 divide-y divide-border/70 border-y border-border">
              {(players?.rows ?? []).slice(0, q ? 20 : 10).map((p) => (
                <li key={p.PlayerName}>
                  <Link href={playerHref(p.PlayerName)} className="group flex items-center gap-4 py-3 transition hover:bg-accent/[0.05]">
                    <span className="w-10 shrink-0 text-right font-mono text-xs text-text-muted">#{p.rank}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold group-hover:text-accent">{fixText(p.PlayerName)}</span>
                      <span className="font-mono text-[11px] text-text-muted">{p.clusters.map(clusterName).join(" · ")}</span>
                    </span>
                    <span className="text-right">
                      <span className="font-display block text-2xl font-black">{num(p.PlayerKills)}</span>
                      <span className="hud-label !text-[9px]">kills · {kd(p.PlayerKills, p.DeathByPlayer)} K/D</span>
                    </span>
                  </Link>
                </li>
              ))}
              {players && players.rows.length === 0 && <li className="py-4 text-sm text-text-muted">No players match that name.</li>}
            </ol>
          </section>

          <section>
            <p className="hud-label !text-accent">{q ? `Tribes matching “${q}”` : "By tribe score"}</p>
            <h2 className="font-display mt-1 text-5xl font-black">{q ? "Tribes" : "Top tribes"}</h2>
            <div className="mt-4 space-y-6">
              {tribes.map(({ cluster, rows }) =>
                rows.length ? (
                  <div key={cluster.key}>
                    <h3 className="font-display text-2xl font-extrabold text-text-primary/85">{cluster.name}</h3>
                    <ol className="mt-1 divide-y divide-border/70 border-y border-border">
                      {rows.map((t) => (
                        <TribeLine key={t.TribeID} t={t} clusterKey={cluster.key} />
                      ))}
                    </ol>
                  </div>
                ) : null,
              )}
              {tribes.every((t) => t.rows.length === 0) && !failed && <p className="text-sm text-text-muted">No tribes match that name.</p>}
            </div>
          </section>
        </div>

        <p className="mt-12 border-t border-border pt-6 text-sm text-text-muted">
          Stats come from the live{" "}
          <a href="https://leaderboards.mesark.net" className="text-text-primary underline decoration-accent/50 underline-offset-4 hover:text-accent">
            leaderboards
          </a>{" "}
          and refresh every few minutes. Profiles show names as typed in game; names that break the{" "}
          <Link href="/rules" className="text-text-primary underline decoration-accent/50 underline-offset-4 hover:text-accent">
            rules
          </Link>{" "}
          don&apos;t get a page.
        </p>
      </div>
    </>
  );
}

function TribeLine({ t, clusterKey }: { t: TribeRow; clusterKey: string }) {
  return (
    <li>
      <Link href={tribeHref(clusterKey, t.TribeID)} className="group flex items-center gap-4 py-2.5 transition hover:bg-accent/[0.05]">
        <span className="w-10 shrink-0 text-right font-mono text-xs text-text-muted">#{t.rank}</span>
        <span className="min-w-0 flex-1 truncate font-semibold group-hover:text-accent">{fixText(t.TribeName)}</span>
        <span className="text-right">
          <span className="font-display block text-xl font-black">{num(t.DamageScore)}</span>
          <span className="hud-label !text-[9px]">
            score · {clusterByKey(clusterKey)?.name}
          </span>
        </span>
      </Link>
    </li>
  );
}
