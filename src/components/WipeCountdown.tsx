"use client";

import { wipeSchedules, getNextWipe, shortCadence } from "@/data/wipes";
import { useNow } from "@/lib/useNow";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date, now: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function WipeCountdown({ compact = false }: { compact?: boolean }) {
  const now = useNow();

  if (!now) return null;

  const rows = wipeSchedules.map((s) => ({ s, next: getNextWipe(s, now) }));
  const soonest = Math.min(...rows.map((r) => r.next.getTime()));

  if (compact) {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        {rows.map(({ s, next }) => {
          const tl = getTimeLeft(next, now);
          return (
            <div key={s.cluster} className="flex items-center gap-2 border border-border bg-bg-card/40 px-3 py-1.5 text-xs">
              <span className="font-semibold text-text-primary">{s.cluster}</span>
              <span className="font-mono text-accent">
                {tl.days > 0 ? `${tl.days}d ` : ""}{pad(tl.hours)}:{pad(tl.minutes)}:{pad(tl.seconds)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {rows.map(({ s, next }) => {
        const tl = getTimeLeft(next, now);
        const isNext = next.getTime() === soonest;
        return (
          <div
            key={s.cluster}
            className={`clip-corner-sm relative border p-4 ${isNext ? "border-accent/50 bg-accent/[0.07]" : "border-border bg-bg-card/60"}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl font-extrabold">{s.cluster}</span>
              {isNext && <span className="live-dot h-1.5 w-1.5 rounded-full bg-accent" />}
            </div>
            <div className={`mt-1 font-mono text-lg font-semibold tabular-nums sm:text-xl ${isNext ? "text-accent" : "text-text-primary/85"}`}>
              {tl.days > 0 ? `${tl.days}d ` : ""}{pad(tl.hours)}:{pad(tl.minutes)}:{pad(tl.seconds)}
            </div>
            <div className="hud-label !text-xs mt-1">{shortCadence(s)} @ 1:00 PM EST</div>
          </div>
        );
      })}
    </div>
  );
}
