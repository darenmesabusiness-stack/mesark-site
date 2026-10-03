import type { PopulationData } from "@/lib/bot";

// Bot cluster names → the names players use. 3 Man and 4 Man are one "3/4 Man" cluster to players.
export const CLUSTER_GROUPS: { name: string; clusters: string[] }[] = [
  { name: "Solo", clusters: ["MESA Solos"] },
  { name: "Duo", clusters: ["MESA Duos"] },
  { name: "3/4 Man", clusters: ["MESA 3 MAN", "MESA 4 MAN"] },
  { name: "100x", clusters: ["MESA 100x"] },
];
const GROUPED = new Set(CLUSTER_GROUPS.flatMap((g) => g.clusters));

/** "112 players online now" banner with a chip per cluster. Renders nothing without fresh data. */
export function LivePopulation({ pop }: { pop: PopulationData | null }) {
  if (!pop) return null;
  const chips = CLUSTER_GROUPS.filter((g) => g.clusters.some((c) => pop.clusters[c])).map((g) => ({
    name: g.name,
    players: g.clusters.reduce((n, c) => n + (pop.clusters[c]?.players ?? 0), 0),
  }));
  const events = Object.entries(pop.clusters)
    .filter(([c, v]) => !GROUPED.has(c) && v.players > 0)
    .map(([c, v]) => ({ name: c.replace(/^MESA /, ""), players: v.players }));
  const updated = pop.updated ? new Date(pop.updated * 1000) : null;
  return (
    <section aria-label="Players online" className="border border-border bg-bg-card/60 px-5 py-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden /> Live
          </p>
          <p className="font-display mt-1 text-5xl font-black leading-none tabular-nums">
            {pop.online.toLocaleString()} <span className="text-2xl text-text-muted">players online</span>
          </p>
          <p className="mt-2 text-xs text-text-muted">
            Peak in the last 24 h: {pop.peak_24h.toLocaleString()}
            {updated && <> · updated {updated.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" })} ET</>}
          </p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {[...chips, ...events].map((c) => (
            <li key={c.name} className="border border-border bg-bg-primary/50 px-3 py-1.5 text-sm">
              <span className="text-text-muted">{c.name}</span> <span className="font-mono font-semibold tabular-nums text-text-primary">{c.players}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
