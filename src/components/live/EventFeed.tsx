import { ago, prettyCluster, prettyMap, type FeedItem } from "@/lib/feed";

const KIND = {
  loot: { label: "Vault", tone: "text-amber-300 border-amber-300/40" },
  sighting: { label: "Rare dino", tone: "text-teal border-teal/40" },
  raid: { label: "Raid", tone: "text-accent border-accent/50" },
} as const;

function where(map: string, lat: number | null, lon: number | null) {
  const coords = lat !== null && lon !== null ? ` (${lat.toFixed(0)}, ${lon.toFixed(0)})` : "";
  return `${prettyMap(map)}${coords}`;
}

/** Newest-first list of public game events. */
export function EventFeed({ items, now }: { items: FeedItem[]; now: number }) {
  if (!items.length) {
    return (
      <div className="border border-border bg-bg-card/60 px-5 py-8 text-center">
        <p className="font-display text-3xl font-black">Quiet right now</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
          Vault spawns, rare dinos and raids show up here as they happen. Raids appear an hour after they end, so nothing in progress gets
          given away.
        </p>
      </div>
    );
  }
  return (
    <ol className="divide-y divide-border/70 border border-border">
      {items.map((e, i) => {
        const k = KIND[e.kind];
        return (
          <li key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-bg-card/40 px-4 py-3">
            <span className={`w-24 shrink-0 border px-2 py-0.5 text-center font-mono text-[10px] uppercase tracking-wider ${k.tone}`}>{k.label}</span>
            <p className="min-w-0 flex-1 text-sm">
              {e.kind === "raid" ? (
                <>
                  <strong className="font-semibold">{e.attacker ?? "A tribe"}</strong> destroyed{" "}
                  <strong className="font-mono text-accent">{e.structures}</strong> structures of{" "}
                  <strong className="font-semibold">{e.victim ?? "another tribe"}</strong> on {prettyMap(e.map)}
                </>
              ) : (
                <>
                  <strong className="font-semibold">{e.title}</strong> {e.kind === "loot" ? "appeared" : "spotted"} on {where(e.map, e.lat, e.lon)}
                </>
              )}
            </p>
            <span className="shrink-0 font-mono text-[11px] text-text-muted">
              {prettyCluster(e.cluster)} · {ago(e.at, now)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
