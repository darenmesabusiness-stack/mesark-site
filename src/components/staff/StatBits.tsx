import Link from "next/link";
import { PERIODS } from "@/lib/bot";

/** One headline number. */
export function Tile({ label, value, note }: { label: string; value: React.ReactNode; note?: React.ReactNode }) {
  return (
    <div className="bg-bg-card p-4 sm:p-5">
      <p className="hud-label !text-[10px]">{label}</p>
      <p className="font-display mt-2 text-4xl font-black tabular-nums leading-none">{value}</p>
      {note && <p className="mt-2 text-xs text-text-muted">{note}</p>}
    </div>
  );
}

export function Tiles({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-px border border-border bg-border lg:grid-cols-4">{children}</div>;
}

export function Section({ title, note, children }: { title: string; note?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="font-display text-3xl font-black sm:text-4xl">{title}</h2>
        {note && <p className="text-xs text-text-muted">{note}</p>}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** 7 / 30 / 90 day switch; keeps any other query params. */
export function PeriodPicker({ path, days, extra }: { path: string; days: number; extra?: Record<string, string> }) {
  return (
    <div className="flex gap-2" role="group" aria-label="Period">
      {PERIODS.map((p) => (
        <Link
          key={p}
          href={{ pathname: path, query: { ...extra, days: String(p) } }}
          aria-current={p === days ? "true" : undefined}
          className={`border px-3 py-1 font-mono text-xs uppercase tracking-wider transition ${
            p === days ? "border-accent bg-accent text-bg-primary" : "border-border text-text-primary/80 hover:border-accent/50"
          }`}
        >
          {p} days
        </Link>
      ))}
    </div>
  );
}

export function BridgeError({ error }: { error: string }) {
  return <p className="border-l-2 border-accent bg-bg-card/80 px-4 py-3 text-sm">{error}</p>;
}

/** Bars to scale from zero. Labels: the max value on the axis and first/last x labels. */
export function BarChart({ data, format = (n) => String(n), height = 140, label }: { data: { x: string; y: number }[]; format?: (n: number) => string; height?: number; label: string }) {
  if (!data.length) return <p className="text-sm text-text-muted">No data for this period.</p>;
  const max = Math.max(...data.map((d) => d.y), 1);
  const w = 1000;
  const gap = data.length > 60 ? 1 : 3;
  const bw = (w - gap * (data.length - 1)) / data.length;
  return (
    <figure className="border border-border bg-bg-card/60 p-4">
      <div className="flex items-start gap-3">
        <div className="flex flex-col justify-between text-right font-mono text-[10px] text-text-muted" style={{ height }}>
          <span>{format(max)}</span>
          <span>0</span>
        </div>
        <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="w-full min-w-0" style={{ height }} role="img" aria-label={label}>
          <line x1="0" x2={w} y1={height - 0.5} y2={height - 0.5} stroke="currentColor" className="text-border" />
          {data.map((d, i) => {
            const h = (d.y / max) * (height - 2);
            return (
              <rect key={d.x} x={i * (bw + gap)} y={height - 1 - h} width={bw} height={h} className="fill-accent">
                <title>{`${d.x}: ${format(d.y)}`}</title>
              </rect>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-2 flex justify-between pl-10 font-mono text-[10px] text-text-muted">
        <span>{data[0].x}</span>
        <span>{data[data.length - 1].x}</span>
      </figcaption>
    </figure>
  );
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Hours offset of America/New_York from UTC right now (-4 in summer, -5 in winter). */
function etOffset(): number {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", timeZoneName: "shortOffset" }).formatToParts(new Date());
  const m = parts.find((p) => p.type === "timeZoneName")?.value.match(/GMT([+-]\d+)/);
  return m ? Number(m[1]) : -5;
}

/** Tickets by weekday and hour, shifted from UTC to Eastern time. */
export function Heatmap({ grid }: { grid: number[][] }) {
  const off = etOffset();
  const et: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  grid.forEach((row, d) =>
    row.forEach((n, h) => {
      let hh = h + off;
      let dd = d;
      if (hh < 0) {
        hh += 24;
        dd = (d + 6) % 7;
      } else if (hh > 23) {
        hh -= 24;
        dd = (d + 1) % 7;
      }
      et[dd][hh] += n;
    }),
  );
  const max = Math.max(...et.flat(), 1);
  return (
    <div className="overflow-x-auto border border-border bg-bg-card/60 p-4">
      <table className="min-w-[640px] border-separate border-spacing-[3px] font-mono text-[10px] text-text-muted">
        <thead>
          <tr>
            <th />
            {Array.from({ length: 24 }, (_, h) => (
              <th key={h} className="font-normal">
                {h % 3 === 0 ? (h === 0 ? "12a" : h < 12 ? `${h}a` : h === 12 ? "12p" : `${h - 12}p`) : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {et.map((row, d) => (
            <tr key={d}>
              <th className="pr-2 text-left font-normal">{DAYS[d]}</th>
              {row.map((n, h) => (
                <td key={h} title={`${DAYS[d]} ${h}:00 ET: ${n} tickets`} className="h-5 w-5 bg-accent" style={{ opacity: n ? 0.12 + 0.88 * (n / max) : 0.04 }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-[11px] text-text-muted">New tickets by hour, Eastern time. Darker = busier (busiest hour: {max}).</p>
    </div>
  );
}

/** Simple striped table wrapper that scrolls sideways on phones. */
export function Table({ head, children, minWidth = 640 }: { head: React.ReactNode[]; children: React.ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <thead className="bg-bg-secondary">
          <tr className="hud-label !text-[10px]">
            {head.map((h, i) => (
              <th key={i} className="px-3 py-3 font-normal first:pl-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70">{children}</tbody>
      </table>
    </div>
  );
}
