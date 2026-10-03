"use client";

import { wipeSchedules, getNextWipe, shortCadence } from "@/data/wipes";
import { useNow } from "@/lib/useNow";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

/** Four-cell live countdown bar. The soonest wipe is flagged "Next up". */
export function WipeTicker() {
  const now = useNow();

  const rows = wipeSchedules.map((s) => {
    const next = now ? getNextWipe(s, now) : null;
    return { s, ms: next && now ? next.getTime() - now.getTime() : Infinity };
  });
  const soonest = Math.min(...rows.map((r) => r.ms));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-white/10 bg-bg-primary/60 backdrop-blur-md">
      {rows.map(({ s, ms }, i) => {
        const t = parts(ms === Infinity ? 0 : ms);
        const isNext = ms === soonest && ms !== Infinity;
        return (
          <div
            key={s.cluster}
            className={`relative px-4 sm:px-6 py-3 sm:py-4 ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""} border-white/10`}
          >
            {isNext && <div className="absolute inset-x-0 top-0 h-[2px] bg-accent" />}
            <div className="flex items-center justify-between gap-2">
              <span className="font-display whitespace-nowrap text-xl font-extrabold tracking-wide sm:text-2xl">{s.cluster}</span>
              {isNext ? (
                <span className="flex items-center gap-1.5 hud-label !text-accent !tracking-[0.18em] !text-xs">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-accent" />
                  Next up
                </span>
              ) : (
                <span className="hud-label hidden !text-xs sm:inline">{shortCadence(s)} 1PM EST</span>
              )}
            </div>
            <div
              className={`mt-1 font-mono text-sm sm:text-lg tabular-nums ${isNext ? "text-accent" : "text-text-primary/80"}`}
              suppressHydrationWarning
            >
              {now ? (
                <>
                  {t.d > 0 && <span>{t.d}d </span>}
                  {pad(t.h)}:{pad(t.m)}:{pad(t.s)}
                </>
              ) : (
                <span className="opacity-40">--:--:--</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
