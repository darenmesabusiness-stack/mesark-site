"use client";

import { useSyncExternalStore } from "react";

/*
 * One shared 1-second clock for every countdown on the page. Server render and
 * hydration see `null` (so markup matches), then the client ticks.
 */
let now: number | null = null;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
      now = null;
    }
  };
}

export function useNow(): Date | null {
  const t = useSyncExternalStore(subscribe, () => now, () => null);
  return t === null ? null : new Date(t);
}

const noop = () => () => {};

/** True only after hydration on the client. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}
