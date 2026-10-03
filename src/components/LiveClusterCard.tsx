import type { ClusterSettings, NamedValue } from "@/lib/settings";
import { wipeLabel } from "@/lib/settings";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-1.5">
      <div className="text-xs uppercase tracking-wider text-text-muted/80 mb-0.5">{label}</div>
      <div className="text-sm font-bold text-accent leading-tight">{value}</div>
    </div>
  );
}

function Drawer({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  if (!count) return null;
  return (
    <details className="group border-t border-border/60 first-of-type:border-t-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-2.5 text-sm text-text-primary hover:text-accent [&::-webkit-details-marker]:hidden">
        <span className="font-semibold">{title}</span>
        <span className="flex items-center gap-2 text-xs text-text-muted">
          {count}
          <svg className="h-3.5 w-3.5 transition group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </summary>
      <div className="pb-3">{children}</div>
    </details>
  );
}

function ValueList({ items }: { items: NamedValue[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
      {items.map((i) => (
        <div key={i.name} className="flex justify-between gap-3 border-b border-border/30 py-1 text-xs">
          <span className="text-text-muted">{i.name}</span>
          <span className="font-mono text-text-primary">{i.value}</span>
        </div>
      ))}
    </div>
  );
}

function NameList({ names }: { names: string[] }) {
  return <p className="text-xs leading-relaxed text-text-muted">{names.join(" · ")}</p>;
}

/** One cluster, read live from its game servers' configs. */
export function LiveClusterCard({ c }: { c: ClusterSettings }) {
  const stats = [...c.rates, ...c.limits];
  return (
    <div id={`cluster-${c.id}`} className="relative scroll-mt-24 rounded-xl border border-accent/30 bg-gradient-to-br from-accent/[0.06] to-transparent p-5 transition hover:border-accent/50">
      <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-2xl font-extrabold tracking-wide text-text-primary">{c.name}</h3>
        {c.next_wipe && (
          <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Next wipe {wipeLabel(c.next_wipe)}
          </span>
        )}
      </div>
      <p className="mb-3 text-xs text-text-muted">
        {c.wipe_cadence && <>Wipes {c.wipe_cadence}. </>}
        {c.maps.length} maps: {c.maps.join(", ")}
      </p>
      <div className="grid grid-cols-2 gap-x-3 sm:grid-cols-4">
        {stats.map((s) => <Stat key={s.label} label={s.label} value={s.value} />)}
      </div>
      <div className="mt-3">
        <Drawer title="Harvest rates by resource" count={c.harvest.length}><ValueList items={c.harvest} /></Drawer>
        <Drawer title="Stack sizes" count={c.stacks.length}><ValueList items={c.stacks} /></Drawer>
        <Drawer title="Dinos you can't tame" count={c.disabled_tames.length}><NameList names={c.disabled_tames} /></Drawer>
        <Drawer title="Disabled engrams" count={c.disabled_engrams.length}><NameList names={c.disabled_engrams} /></Drawer>
      </div>
    </div>
  );
}
