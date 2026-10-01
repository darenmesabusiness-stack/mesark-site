"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Cave, CaveMap } from "@/data/caves";

const MAX_ZOOM = 6;

/** Interactive cave maps: pick a map, pins at each cave's GPS, click a pin for its video and notes. */
export function CaveMaps({ maps }: { maps: CaveMap[] }) {
  const [slug, setSlug] = useState(maps[0].slug);
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const map = maps.find((m) => m.slug === slug) ?? maps[0];
  const cave = map.caves.find((c) => c.id === selected) ?? null;

  // Shareable links: /maps#the-island/aztec-cave (also follows in-page hash changes)
  useEffect(() => {
    const read = () => {
      const [m, c] = decodeURIComponent(window.location.hash.slice(1)).split("/");
      if (m && maps.some((x) => x.slug === m)) {
        setSlug(m);
        setSelected(c || null);
      }
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [maps]);
  useEffect(() => {
    const h = `#${slug}${selected ? `/${selected}` : ""}`;
    if (window.location.hash !== h) window.history.replaceState(null, "", h);
  }, [slug, selected]);

  const pickMap = (s: string) => {
    setSlug(s);
    setSelected(null);
    setQuery("");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return map.caves
      .map((c, i) => ({ c, n: i + 1 }))
      .filter(({ c }) => !q || c.name.toLowerCase().includes(q) || c.notes.some((n) => n.toLowerCase().includes(q)));
  }, [map, query]);

  return (
    <div className="space-y-5">
      {/* Map picker */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {maps.map((m) => (
          <button
            key={m.slug}
            type="button"
            onClick={() => pickMap(m.slug)}
            className={`shrink-0 border px-3.5 py-2 font-display text-lg font-extrabold uppercase tracking-wide transition ${
              m.slug === slug
                ? "border-accent bg-accent text-bg-primary"
                : "border-border bg-bg-card/60 text-text-primary/80 hover:border-accent/50 hover:text-text-primary"
            }`}
          >
            {m.name}
            <span className={`ml-2 font-mono text-[10px] ${m.slug === slug ? "text-bg-primary/70" : "text-text-muted"}`}>
              {m.caves.length}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        {map.image ? (
          <MapView key={map.slug} map={map} selected={selected} onSelect={setSelected} />
        ) : (
          <CardGrid map={map} selected={selected} onSelect={setSelected} />
        )}

        <aside className="clip-corner-sm flex min-h-[320px] flex-col border border-border bg-bg-card/60 lg:max-h-[min(80vh,860px)]">
          {cave ? (
            <CaveDetail
              key={cave.id}
              cave={cave}
              n={map.caves.indexOf(cave) + 1}
              mapName={map.name}
              onBack={() => setSelected(null)}
            />
          ) : (
            <>
              <div className="border-b border-border p-4">
                <p className="hud-label !text-accent">{map.name}</p>
                <h2 className="font-display text-3xl font-extrabold">{map.caves.length} caves</h2>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search caves or features (flyers, water, choke)..."
                  className="mt-3 w-full border border-border bg-bg-primary/60 px-3 py-2 text-sm placeholder:text-text-muted/60 focus:border-accent/50 focus:outline-none"
                />
              </div>
              <ul className="flex-1 overflow-y-auto p-2">
                {filtered.map(({ c, n }) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(c.id)}
                      className="group flex w-full items-center gap-3 px-2 py-2 text-left transition hover:bg-accent/[0.06]"
                    >
                      <PinBadge n={n} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{c.name}</span>
                        <span className="font-mono text-[11px] text-text-muted">
                          {c.lat}, {c.lon}
                        </span>
                      </span>
                      <span className="text-accent opacity-0 transition group-hover:opacity-100">→</span>
                    </button>
                  </li>
                ))}
                {filtered.length === 0 && <li className="p-4 text-sm text-text-muted">No caves match.</li>}
              </ul>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function PinBadge({ n, active = false }: { n: number; active?: boolean }) {
  return (
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 font-mono text-[10px] font-bold sm:h-7 sm:w-7 sm:text-[11px] ${
        active ? "border-white bg-accent text-bg-primary" : "border-accent/80 bg-bg-primary text-accent"
      }`}
    >
      {n}
    </span>
  );
}

/** Zoomable, draggable map image with cave pins. Pins keep their screen size at any zoom.
 *  The pan offset is stored as a fraction of the map's size, so resizing keeps the view. */
function MapView({ map, selected, onSelect }: { map: CaveMap; selected: string | null; onSelect: (id: string) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ z: 1, x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean } | null>(null);
  const pinch = useRef<{ d: number; z: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());

  const clamp = useCallback((z: number, x: number, y: number) => {
    const lim = (z - 1) / 2;
    return { z, x: Math.max(-lim, Math.min(lim, x)), y: Math.max(-lim, Math.min(lim, y)) };
  }, []);
  const size = () => box.current?.clientWidth || 1;

  // Zoom keeping the point under (cx, cy) (fraction of the box, from its centre) fixed.
  const zoomAt = useCallback(
    (factor: number, cx = 0, cy = 0) =>
      setView((v) => {
        const z = Math.max(1, Math.min(MAX_ZOOM, v.z * factor));
        const k = z / v.z;
        return clamp(z, cx - (cx - v.x) * k, cy - (cy - v.y) * k);
      }),
    [clamp],
  );

  // Wheel zoom (non-passive so the page doesn't scroll while zooming the map).
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.25 : 0.8, (e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  // Centre the selected cave when it's picked from the list.
  useEffect(() => {
    const c = map.caves.find((x) => x.id === selected);
    if (!c || c.x == null || c.y == null) return;
    setView((v) => {
      const z = Math.max(v.z, 2.2);
      return clamp(z, -(c.x! / 100 - 0.5) * z, -(c.y! / 100 - 0.5) * z);
    });
  }, [selected, map, clamp]);

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), z: view.z };
      drag.current = null;
    } else {
      drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false };
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const z = Math.max(1, Math.min(MAX_ZOOM, (pinch.current.z * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.current.d));
      setView((v) => clamp(z, v.x * (z / v.z), v.y * (z / v.z)));
    } else if (drag.current) {
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) {
        drag.current.moved = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }
      setView((v) => clamp(v.z, drag.current!.vx + dx / size(), drag.current!.vy + dy / size()));
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) setTimeout(() => (drag.current = null), 0);
  };

  return (
    <div className="clip-corner-sm relative border border-border bg-bg-secondary">
      <div
        ref={box}
        className="relative aspect-square w-full touch-none select-none overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ cursor: view.z > 1 ? "grab" : "default" }}
      >
        <div
          className="absolute inset-0 transition-transform duration-150 ease-out will-change-transform"
          style={{ transform: `translate(${view.x * 100}%, ${view.y * 100}%) scale(${view.z})` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- needs exact pixel mapping, not an optimized crop */}
          <img src={map.image!.src} alt={`${map.name} map`} draggable={false} className="absolute inset-0 h-full w-full" />
          {map.caves.map((c, i) =>
            c.x == null || c.y == null ? null : (
              <button
                key={c.id}
                type="button"
                onClick={() => !drag.current?.moved && onSelect(c.id)}
                aria-label={`${c.name}, GPS ${c.lat}, ${c.lon}`}
                className="group absolute"
                style={{ left: `${c.x}%`, top: `${c.y}%`, transform: `translate(-50%, -50%) scale(${1 / view.z})` }}
              >
                <span className={`block transition ${c.id === selected ? "scale-125" : "group-hover:scale-110"}`}>
                  <PinBadge n={i + 1} active={c.id === selected} />
                </span>
                {c.id === selected && <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-accent/50" />}
                <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap bg-bg-primary/95 px-2 py-1 text-xs font-semibold text-text-primary shadow-lg group-hover:block">
                  {c.name}
                </span>
              </button>
            ),
          )}
        </div>
      </div>

      <div className="absolute right-3 top-3 flex flex-col gap-1.5">
        {[
          { label: "+", aria: "Zoom in", on: () => zoomAt(1.5) },
          { label: "−", aria: "Zoom out", on: () => zoomAt(1 / 1.5) },
          { label: "⟲", aria: "Reset view", on: () => setView({ z: 1, x: 0, y: 0 }) },
        ].map((b) => (
          <button
            key={b.aria}
            type="button"
            onClick={b.on}
            aria-label={b.aria}
            className="flex h-9 w-9 items-center justify-center border border-border bg-bg-primary/85 text-lg font-bold text-text-primary backdrop-blur transition hover:border-accent hover:text-accent"
          >
            {b.label}
          </button>
        ))}
      </div>
      <p className="pointer-events-none absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-widest text-text-primary/60">
        Scroll or pinch to zoom · drag to move
      </p>
    </div>
  );
}

/** Maps without in-game map art (MESA City): the spots as cards. */
function CardGrid({ map, selected, onSelect }: { map: CaveMap; selected: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="grid content-start gap-3 sm:grid-cols-2">
      {map.caves.map((c, i) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c.id)}
          className={`clip-corner-sm group relative aspect-video overflow-hidden border text-left transition ${
            c.id === selected ? "border-accent" : "border-border hover:border-accent/50"
          }`}
        >
          {c.poster || (c.video && isGif(c.video)) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.poster ?? c.video} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="absolute inset-0 bg-bg-card" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3">
            <PinBadge n={i + 1} active={c.id === selected} />
            <span className="font-display text-xl font-extrabold leading-tight">{c.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

const isGif = (url: string) => /\.gif($|\?)/i.test(url);

function CaveDetail({ cave, n, mapName, onBack }: { cave: Cave; n: number; mapName: string; onBack: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string, what: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(what);
    setTimeout(() => setCopied(null), 1600);
  };
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      {cave.video && isGif(cave.video) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={cave.video} src={cave.video} alt="" className="aspect-video w-full shrink-0 bg-bg-primary object-cover" />
      ) : cave.video ? (
        <video
          key={cave.video}
          src={cave.video}
          poster={cave.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="aspect-video w-full shrink-0 bg-bg-primary object-cover"
        />
      ) : (
        <div className="flex aspect-video w-full shrink-0 items-center justify-center bg-bg-primary text-sm text-text-muted">
          No preview yet
        </div>
      )}
      <div className="space-y-4 p-4">
        <button type="button" onClick={onBack} className="hud-label !text-text-muted transition hover:!text-accent">
          ← All {mapName} caves
        </button>
        <div className="flex items-start gap-3">
          <PinBadge n={n} active />
          <h2 className="font-display text-3xl font-extrabold leading-none">{cave.name}</h2>
        </div>
        <button
          type="button"
          onClick={() => copy(`${cave.lat}, ${cave.lon}`, "gps")}
          className="flex w-full items-center justify-between border border-border bg-bg-primary/60 px-3 py-2.5 transition hover:border-accent/50"
        >
          <span className="hud-label">GPS</span>
          <span className="font-mono text-lg text-text-primary">
            {cave.lat}, {cave.lon}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{copied === "gps" ? "Copied" : "Copy"}</span>
        </button>
        {cave.notes.length > 0 && (
          <ul className="space-y-1.5 text-sm text-text-primary/85">
            {cave.notes.map((note) => (
              <li key={note} className="flex gap-2.5">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
                {note}
              </li>
            ))}
          </ul>
        )}
        {cave.spi && (
          <button
            type="button"
            onClick={() => copy(cave.spi!, "spi")}
            className="w-full border border-dashed border-border px-3 py-2 text-left transition hover:border-accent/50"
          >
            <span className="hud-label block !text-[10px]">Admin teleport {copied === "spi" ? "· copied" : "· click to copy"}</span>
            <code className="mt-1 block break-all font-mono text-[11px] text-text-muted">{cave.spi}</code>
          </button>
        )}
      </div>
    </div>
  );
}
