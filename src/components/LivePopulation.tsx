import type { PopulationData } from "@/lib/bot";

const ORDER = ["MESA Solos", "MESA Duos", "MESA 3 MAN", "MESA 4 MAN", "MESA 100x"];
const LABEL: Record<string, string> = {
  "MESA Solos": "Solo",
  "MESA Duos": "Duo",
  "MESA 3 MAN": "3 Man",
  "MESA 4 MAN": "4 Man",
  "MESA 100x": "100x",
};

/** "112 players online now" banner with a chip per cluster. Renders nothing without fresh data. */
export function LivePopulation({ pop }: { pop: PopulationData | null }) {
  if (!pop) return null;
  const chips = ORDER.filter((c) => pop.clusters[c]).map((c) => ({ name: LABEL[c], ...pop.clusters[c] }));
  const events = Object.entries(pop.clusters)
    .filter(([c, v]) => !ORDER.includes(c) && v.players > 0)
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
