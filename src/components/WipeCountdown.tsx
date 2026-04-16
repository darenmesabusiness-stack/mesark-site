"use client";

import { useState, useEffect } from "react";
import { wipeSchedules, getNextWipe } from "@/data/wipes";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
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
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        {wipeSchedules.map((schedule) => {
          const next = getNextWipe(schedule, now);
          const tl = getTimeLeft(next);
          return (
            <div
              key={schedule.cluster}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-bg-card/30 text-xs"
            >
              <span className="font-semibold text-text-primary">{schedule.cluster}</span>
              <span className="text-accent font-mono">
                {tl.days > 0 ? `${tl.days}d ` : ""}{pad(tl.hours)}:{pad(tl.minutes)}:{pad(tl.seconds)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {wipeSchedules.map((schedule) => {
        const next = getNextWipe(schedule, now);
        const tl = getTimeLeft(next);
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return (
          <div
            key={schedule.cluster}
            className="p-4 rounded-xl border border-border bg-bg-card/50 text-center"
          >
            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">
              {schedule.cluster}
            </div>
            <div className="text-lg sm:text-xl font-mono font-bold text-accent">
              {tl.days > 0 ? `${tl.days}d ` : ""}{pad(tl.hours)}:{pad(tl.minutes)}:{pad(tl.seconds)}
            </div>
            <div className="text-[10px] text-text-muted mt-1">
              {dayNames[schedule.dayOfWeek]} @ 1:00 PM EST
            </div>
          </div>
        );
      })}
    </div>
  );
}
