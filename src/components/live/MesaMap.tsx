"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { packTribes, tribeColors, type MesaTribe } from "@/lib/mesaMap";
import { fixText, num, playerHref, tribeHref } from "@/lib/leaderboard";

export function MesaMap({ cluster, tribes, expiresAt }: { cluster: string; tribes: MesaTribe[]; expiresAt: string | null }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [roster, setRoster] = useState<{ key: string; names: string[] | null } | null>(null);
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    if (!expiresAt) return;
    let timer: ReturnType<typeof setTimeout>;
    const check = () => {
      const remaining = Date.parse(expiresAt) - Date.now();
      if (remaining <= 0) setExpired(true);
      else timer = setTimeout(check, Math.min(remaining, 86_400_000));
    };
    timer = setTimeout(check, 0);
    return () => clearTimeout(timer);
  }, [expiresAt]);
  const tribe = tribes.find(t => t.id === selected);
  const key = `${cluster}:${selected}`;
  useEffect(() => {
    if (selected === null) return;
    const controller = new AbortController();
    fetch(`/api/mesa-map/tribe?cluster=${encodeURIComponent(cluster)}&tribe=${selected}`, { signal: controller.signal })
      .then(async r => { if (!r.ok) throw new Error("Roster unavailable"); return r.json(); })
      .then(data => setRoster({ key, names: data.members }))
      .catch(() => { if (!controller.signal.aborted) setRoster({ key, names: null }); });
    return () => controller.abort();
  }, [cluster, selected, key]);
  const bubbles = packTribes(tribes);
  const colors = tribeColors(tribes);
  const tribeColor = (id: number) => colors.get(id);
  if (expired) return <p className="border border-border p-5 text-text-muted">This wipe&apos;s map has closed. Refresh for the next wipe&apos;s opening time.</p>;
  if (!tribes.length) return <p className="border border-border p-5 text-text-muted">No tribe scores recorded yet this wipe.</p>;
  return <div className="border border-border bg-bg-card/60">
    <div className="flex flex-wrap justify-between gap-2 border-b border-border px-5 py-4 text-sm text-text-muted">
      <p>Top {tribes.length} tribes · Bigger bubble, higher tribe score</p>
      <p>Score map · bubble positions are not base locations</p>
    </div>
    <div className="overflow-x-auto" aria-label="Tribe score bubbles">
      <svg viewBox="0 0 800 500" className="w-full min-w-[640px]" role="group" aria-label={`${cluster} Mesa Map`}>
        <defs><pattern id="mesa-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity=".08" /></pattern></defs>
        <rect width="800" height="500" fill="url(#mesa-grid)" />
        {bubbles.map(({ tribe: t, x, y, radius }) => <g key={t.id} role="button" tabIndex={0} aria-label={`Open ${fixText(t.name)}, rank ${t.rank}, ${num(t.score)} tribe score`} aria-pressed={selected === t.id}
          onClick={() => setSelected(t.id)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(t.id); } }}
          className="cursor-pointer outline-none [&:focus-visible>circle]:stroke-white [&:hover>circle]:stroke-white">
          <title>{`${fixText(t.name)} · ${num(t.score)} score`}</title>
          <circle cx={x} cy={y} r={radius} fill={tribeColor(t.id)} fillOpacity={selected === t.id ? .38 : .18} stroke={selected === t.id ? "#fff" : tribeColor(t.id)} strokeWidth="2" />
          <text x={x} y={y - 6} textAnchor="middle" fill="white" fontSize="16" pointerEvents="none">{fixText(t.name).length > Math.floor(radius / 4) ? `${fixText(t.name).slice(0, Math.floor(radius / 4) - 1)}…` : fixText(t.name)}</text>
          <text x={x} y={y + 19} textAnchor="middle" fill={tribeColor(t.id)} fontSize="15" pointerEvents="none">{num(t.score)}</text>
        </g>)}
      </svg>
    </div>
    <div className="flex flex-wrap gap-2 border-t border-border p-4" aria-label="Choose a tribe">
      {tribes.map(t => <button key={t.id} type="button" onClick={() => setSelected(t.id)} aria-pressed={selected === t.id}
        className={`min-h-11 border px-3 py-2 text-sm transition ${selected === t.id ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"}`}>
        <span aria-hidden className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: tribeColor(t.id) }} />#{t.rank} {fixText(t.name)}
      </button>)}
    </div>
    <section aria-live="polite" className="border-t border-border p-5 sm:p-6">
      {tribe ? <>
        <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="break-words font-display text-3xl font-bold">{fixText(tribe.name)}</h3>
          <Link className="text-sm text-accent underline underline-offset-4" href={tribeHref(cluster, tribe.id)}>Full tribe profile →</Link></div>
        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">{[["Cluster rank", `#${tribe.rank}`], ["Tribe score", num(tribe.score)], ["Player kills", num(tribe.kills)], ["Player deaths", num(tribe.deaths)]].map(([label, value]) => <div key={label}><dt className="text-sm text-text-muted">{label}</dt><dd className="mt-1 font-mono text-xl">{value}</dd></div>)}</dl>
        <div className="mt-5 text-sm text-text-muted">{tribe.location ? <><p className="text-text-primary">{tribe.location.map} · Approximate GPS {tribe.location.lat.toFixed(1)}, {tribe.location.lon.toFixed(1)}</p><p className="mt-1">Last verified {new Date(tribe.location.observed_at).toLocaleDateString("en-US", { timeZone: "America/New_York" })}. Tribes may move or have additional bases.</p></> : <p>Home map and coordinates haven&apos;t been verified.</p>}</div>
        {tribe.location?.mapImage && <details key={tribe.id} className="mt-4 border border-border bg-bg-primary/40 p-4">
          <summary className="cursor-pointer text-sm text-accent">Open {tribe.location.map} home map</summary>
          <figure className="mt-4 max-w-lg">
            <div className="relative overflow-hidden" style={{ aspectRatio: `${tribe.location.mapImage.w} / ${tribe.location.mapImage.h}` }}>
              <Image src={tribe.location.mapImage.src} width={tribe.location.mapImage.w} height={tribe.location.mapImage.h}
                sizes="(max-width: 640px) 100vw, 512px" alt={`${tribe.location.map} map with an approximate home region for ${fixText(tribe.name)}`} className="h-auto w-full" />
              <span aria-hidden className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg"
                style={{ left: `${tribe.location.mapImage.x}%`, top: `${tribe.location.mapImage.y}%`, background: tribeColor(tribe.id), opacity: .7 }} />
            </div>
            <figcaption className="mt-3 text-sm text-text-muted">Verified approximate home region. This is not a live player location.</figcaption>
          </figure>
        </details>}
        <h4 className="mt-5 font-display text-xl font-bold">Players</h4>
        {roster?.key !== key ? <p className="mt-2 text-sm text-text-muted">Loading players…</p> : roster.names === null ? <p className="mt-2 text-sm text-text-muted">Player list is unavailable. Try the tribe profile.</p> : !roster.names.length ? <p className="mt-2 text-sm text-text-muted">No public player names available.</p> : <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">{roster.names.map((name, index) => <li key={`${name}:${index}`}><Link href={playerHref(name)} className="text-accent hover:underline">{fixText(name)}</Link></li>)}</ul>}
      </> : <p className="text-text-muted">Click a bubble or tribe name to see their players, score and verified location.</p>}
    </section>
  </div>;
}
