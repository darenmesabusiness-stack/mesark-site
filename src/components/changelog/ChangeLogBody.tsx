"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { MapPinIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { ChangeItem, ChangeMonth, ChangeSection } from "@/data/changelog";
import { TAGS } from "@/components/changelog/tags";

const CLUSTERS = ["Solo", "Duo", "3/4 Man", "100x"];

/** A month's notes with a cluster filter and search. Cave lines link to their pin on /maps. */
export function ChangeLogBody({ month, mapNames }: { month: ChangeMonth; mapNames: Record<string, string> }) {
  const [cluster, setCluster] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return month.sections
      .filter((s) => !cluster || !s.clusters || s.clusters.includes(cluster))
      .map((s) => ({ ...s, items: q ? s.items.filter((it) => it.text.toLowerCase().includes(q)) : s.items }))
      .filter((s) => s.items.length > 0);
  }, [month, cluster, query]);

  const shown = sections.reduce((n, s) => n + s.items.length, 0);

  // Filtering shortens the page; keep the reader at the top of the list instead of the footer.
  const topRef = useRef<HTMLDivElement>(null);
  const keepInView = () => {
    const el = topRef.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 64;
    if (window.scrollY > y) window.scrollTo({ top: y });
  };

  return (
    <div ref={topRef}>
      <div className="sticky top-16 z-30 -mx-4 border-b border-border bg-bg-primary/90 px-4 py-3 backdrop-blur-md">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0">
            {[null, ...CLUSTERS].map((c) => (
              <button
                key={c ?? "all"}
                type="button"
                onClick={() => {
                  setCluster(c);
                  keepInView();
                }}
                aria-pressed={cluster === c}
                className={`shrink-0 border px-3 py-1.5 font-display text-base font-extrabold uppercase tracking-wide transition ${
                  cluster === c
                    ? "border-accent bg-accent text-bg-primary"
                    : "border-border bg-bg-card/60 text-text-primary/80 hover:border-accent/50 hover:text-text-primary"
                }`}
              >
                {c ?? "All clusters"}
              </button>
            ))}
          </div>
          <label className="relative md:ml-auto md:w-64">
            <span className="sr-only">Search this month&apos;s changes</span>
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                keepInView();
              }}
              placeholder="Search: rex, turret, cave…"
              className="w-full border border-border bg-bg-card/60 py-2 pl-9 pr-3 text-sm placeholder:text-text-muted/60 focus:border-accent/50 focus:outline-none"
            />
          </label>
        </div>
        <div className="mt-2 flex items-center gap-4">
          <p className="hud-label shrink-0 !text-[10px]">
            {cluster ? `Changes that hit ${cluster}` : "Every cluster"} · {shown} change{shown === 1 ? "" : "s"}
          </p>
          <div className="ml-auto hidden gap-4 overflow-x-auto md:flex [scrollbar-width:none]">
            {sections.map((s) => (
              <a key={sectionId(s)} href={`#${sectionId(s)}`} className="hud-label shrink-0 !text-[10px] transition hover:!text-accent">
                {sectionTitle(s)}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-10">
        {sections.map((s) => (
          <Section key={sectionId(s)} section={s} mapNames={mapNames} />
        ))}
        {sections.length === 0 && (
          <p className="border border-border bg-bg-card/60 p-6 text-sm text-text-muted">
            Nothing matches. Try another word or switch back to all clusters.
          </p>
        )}
      </div>
    </div>
  );
}

function sectionId(s: ChangeSection) {
  return s.kind + (s.clusters ? "-" + s.clusters.join("-").replace(/[^a-z0-9-]+/gi, "").toLowerCase() : "");
}

function sectionTitle(s: ChangeSection) {
  if (s.kind === "cluster" && s.clusters) return s.clusters.join(" + ");
  return s.title;
}

const KICKERS: Record<ChangeSection["kind"], string> = {
  general: "Every server",
  cluster: "Cluster only",
  caves: "Base spots",
  city: "MESA City",
  shop: "Points shop",
};

function Section({ section, mapNames }: { section: ChangeSection; mapNames: Record<string, string> }) {
  return (
    <section id={sectionId(section)} className="scroll-mt-44">
      <div className="mb-3 flex items-end justify-between gap-4 border-b border-border pb-3">
        <div>
          <p className="hud-label !text-accent">{KICKERS[section.kind]}</p>
          <h2 className="font-display mt-1 text-4xl font-black sm:text-5xl">{sectionTitle(section)}</h2>
        </div>
        <span className="font-mono text-xs text-text-muted">{section.items.length}</span>
      </div>
      {section.kind === "caves" ? <CaveGroups items={section.items} mapNames={mapNames} /> : <ItemList items={section.items} />}
    </section>
  );
}

/** Cave lines grouped by map, each map heading linking to that map on /maps. */
function CaveGroups({ items, mapNames }: { items: ChangeItem[]; mapNames: Record<string, string> }) {
  const groups = new Map<string, ChangeItem[]>();
  for (const it of items) {
    const key = it.map ?? "";
    groups.set(key, [...(groups.get(key) ?? []), it]);
  }
  return (
    <div className="space-y-6">
      {[...groups].map(([map, list]) => (
        <div key={map || "other"}>
          <div className="mb-1 flex items-center justify-between gap-3">
            <h3 className="font-display text-2xl font-extrabold text-text-primary/90">{map ? (mapNames[map] ?? map) : "Other maps"}</h3>
            {map && mapNames[map] && (
              <Link href={`/maps#${map}`} className="hud-label shrink-0 !text-text-primary/70 transition hover:!text-accent">
                Open map →
              </Link>
            )}
          </div>
          <ItemList items={list} />
        </div>
      ))}
    </div>
  );
}

function ItemList({ items }: { items: ChangeItem[] }) {
  return (
    <ul className="divide-y divide-border/70">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3 py-2.5">
          <span
            className={`mt-0.5 inline-flex w-[72px] shrink-0 justify-center border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${TAGS[it.tag].className}`}
          >
            {TAGS[it.tag].label}
          </span>
          <span className="min-w-0 flex-1 text-[15px] leading-snug text-text-primary/90">{it.text}</span>
          {it.link && (
            <Link
              href={it.link}
              className="mt-0.5 inline-flex shrink-0 items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-text-muted transition hover:text-accent"
              aria-label="Show this cave on the map"
            >
              <MapPinIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Pin</span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
