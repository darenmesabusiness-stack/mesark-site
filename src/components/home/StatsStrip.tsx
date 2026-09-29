"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { clusters, serverTotal } from "@/data/servers";

const STATS = [
  { to: serverTotal, suffix: "", label: "Servers" },
  { to: 4, suffix: "", label: "Clusters" },
  { to: 74, suffix: "K+", label: "Discord members" },
  { text: "24/7", label: "Admin support" },
] as const;

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(to);

  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {val}
      {suffix}
    </span>
  );
}

/** Unique base map names ("Fjordur 2" / "Fjordur #2" → "Fjordur") for the marquee. */
const MAPS = Array.from(
  new Set(
    clusters
      .flatMap((c) => c.servers.map((s) => s.map))
      .map((m) => m.replace(/\s*#?\d+$/, "").replace(/^Gen 2$/, "Genesis 2").replace(/^Gen 1$/, "Genesis"))
      .filter((m) => !/^(No Build|Trade|Trading|Boss|MESA Boss|Rare|MESA Arena)/i.test(m))
  )
);

export function StatsStrip() {
  return (
    <section className="relative border-b border-border bg-bg-primary">
      <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`px-4 py-10 sm:px-6 sm:py-14 ${i % 2 === 1 ? "border-l border-border" : ""} ${i >= 2 ? "border-t border-border lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
          >
            <div className="font-display text-6xl font-black text-text-primary sm:text-7xl lg:text-8xl">
              {"text" in s ? s.text : <CountUp to={s.to} suffix={s.suffix} />}
            </div>
            <div className="hud-label mt-3">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Map marquee */}
      <div className="relative overflow-hidden border-t border-border py-5" aria-hidden>
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
          {[...MAPS, ...MAPS].map((m, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-4xl font-black text-stroke opacity-40 sm:text-5xl">
              {m}
              <span className="text-accent opacity-100 [-webkit-text-stroke:0]">✦</span>
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg-primary to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg-primary to-transparent" />
      </div>
    </section>
  );
}
