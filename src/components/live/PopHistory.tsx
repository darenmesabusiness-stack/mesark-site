import type { PopulationData } from "@/lib/bot";
import { CLUSTER_GROUPS } from "@/components/LivePopulation";

/** Network players per hour, last 24 h (stacked total of every cluster's average). */
export function PopHistory({ pop }: { pop: PopulationData }) {
  const byHour = new Map<number, number>();
  for (const series of Object.values(pop.history)) {
    for (const p of series) byHour.set(p.hour, (byHour.get(p.hour) ?? 0) + p.avg);
  }
  const hours = [...byHour.keys()].sort((a, b) => a - b).slice(-24);
  if (hours.length < 2) {
    return <p className="text-sm text-text-muted">Population history starts building now. Check back in a few hours.</p>;
  }
  const vals = hours.map((h) => byHour.get(h) ?? 0);
  const max = Math.max(...vals, 1);
  const w = 600;
  const h = 120;
  const step = w / (vals.length - 1);
  const pts = vals.map((v, i) => `${(i * step).toFixed(1)},${(h - (v / max) * (h - 8)).toFixed(1)}`);
  const fmt = (ts: number) => new Date(ts * 1000).toLocaleTimeString("en-US", { hour: "numeric", timeZone: "America/New_York" });
  // Peak per player-facing cluster: sum the group's hourly averages, then take the highest hour.
  const peaks = CLUSTER_GROUPS.map((g) => {
    const perHour = new Map<number, number>();
    for (const c of g.clusters) for (const p of pop.history[c] ?? []) perHour.set(p.hour, (perHour.get(p.hour) ?? 0) + p.avg);
    return { name: g.name, peak: perHour.size ? Math.max(...perHour.values()) : null };
  }).filter((g) => g.peak !== null);
  return (
    <figure className="border border-border bg-bg-card/60 p-4">
      <div className="flex items-start gap-3">
        <div className="flex flex-col justify-between text-right font-mono text-sm text-text-muted" style={{ height: h }}>
          <span>{Math.round(max)}</span>
          <span>0</span>
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full min-w-0" style={{ height: h }} role="img" aria-label="Players online per hour, last 24 hours">
          <polygon points={`0,${h} ${pts.join(" ")} ${w},${h}`} className="fill-accent/15" />
          <polyline points={pts.join(" ")} fill="none" className="stroke-accent" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <figcaption className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-sm text-text-muted sm:grid-cols-[auto_1fr_auto] sm:pl-8">
        <span>{fmt(hours[0])} ET</span>
        <span className="col-span-2 row-start-1 text-center sm:col-span-1 sm:col-start-2">Players online, hourly average</span>
        <span className="text-right">{fmt(hours[hours.length - 1])} ET</span>
      </figcaption>
      {peaks.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-border/60 pt-3 text-sm text-text-muted">
          {peaks.map((g) => (
            <li key={g.name}>
              {g.name} peak <span className="font-mono text-text-primary">{Math.round(g.peak!)}</span>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
