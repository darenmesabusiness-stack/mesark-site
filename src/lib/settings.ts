import { getVercelOidcToken } from "@vercel/oidc";
import { unstable_cache } from "next/cache";

/**
 * Live cluster settings read from the game servers' configs by the bot
 * (mesark-bot src/public_settings.py → web bridge GET /v1/settings).
 * Cached for an hour; failures are not cached, and the page falls back to
 * its built-in numbers when the bot can't be reached (preview builds, outages).
 */
export type SettingRow = { label: string; value: string };
export type NamedValue = { name: string; value: string };
export type ClusterSettings = {
  id: string;
  name: string;
  maps: string[];
  next_wipe: number | null;
  wipe_cadence: string | null;
  rates: SettingRow[];
  limits: SettingRow[];
  harvest: NamedValue[];
  stacks: NamedValue[];
  disabled_tames: string[];
  disabled_engrams: string[];
};
export type LiveSettings = { updated: number; clusters: ClusterSettings[] };

const BOT_API = "https://bot.mesark.net";

async function fetchSettings(): Promise<LiveSettings> {
  const token = await getVercelOidcToken();
  const res = await fetch(`${BOT_API}/v1/settings`, {
    headers: { Authorization: `Bearer ${token}`, "X-Mesa-Role": "player", "X-Mesa-Actor": "settings-page" },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`bot bridge /v1/settings ${res.status}`);
  const data = (await res.json()) as LiveSettings;
  if (!Array.isArray(data?.clusters) || data.clusters.length === 0) throw new Error("no clusters");
  return data;
}

// A thrown error is not cached, so a failed call is retried on the next render.
const cachedSettings = unstable_cache(fetchSettings, ["live-cluster-settings-v1"], { revalidate: 3600 });

export async function getLiveSettings(): Promise<LiveSettings | null> {
  // Local dev only: render a saved /v1/settings response (no OIDC token outside Vercel).
  if (process.env.NODE_ENV === "development" && process.env.MESA_SETTINGS_FILE) {
    const { readFile } = await import("node:fs/promises");
    return JSON.parse(await readFile(process.env.MESA_SETTINGS_FILE, "utf-8")) as LiveSettings;
  }
  try {
    return await cachedSettings();
  } catch (e) {
    console.error("live settings unavailable, using built-in values", e);
    return null;
  }
}

const ET = "America/New_York";

/** "Fri Oct 9 · 1:00 PM ET" */
export function wipeLabel(ts: number): string {
  const d = new Date(ts * 1000);
  const day = new Intl.DateTimeFormat("en-US", { timeZone: ET, weekday: "short", month: "short", day: "numeric" }).format(d);
  const time = new Intl.DateTimeFormat("en-US", { timeZone: ET, hour: "numeric", minute: "2-digit" }).format(d);
  return `${day} · ${time} ET`;
}

/** "Oct 2, 7:46 AM ET" */
export function updatedLabel(ts: number): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: ET, month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  }).format(new Date(ts * 1000)) + " ET";
}
