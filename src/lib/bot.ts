import { getVercelOidcToken } from "@vercel/oidc";
import type { User } from "@/lib/auth";

/**
 * Server-side client for the bot's web bridge (mesark-bot web_bridge.py at bot.mesark.net).
 * Each call carries this deployment's Vercel OIDC token; the bridge only accepts tokens from
 * the production deployment of this project, so preview builds and local dev can't read
 * anything. The staff member's role and SteamID go along so the bridge can re-check access
 * and log who asked.
 */
const BOT_API = "https://bot.mesark.net";

export type BotResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function botGet<T>(path: string, user: User): Promise<BotResult<T>> {
  let token: string;
  try {
    token = await getVercelOidcToken();
  } catch {
    return { ok: false, error: "This copy of the site can't talk to the bot. Only mesark.net can." };
  }
  try {
    const res = await fetch(`${BOT_API}${path}`, {
      headers: { Authorization: `Bearer ${token}`, "X-Mesa-Role": user.role, "X-Mesa-Actor": user.steam_id },
      cache: "no-store",
      signal: AbortSignal.timeout(25_000),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      console.error("bot bridge", path, res.status, body);
      if (res.status === 400 && body?.error) return { ok: false, error: body.error };
      return { ok: false, error: res.status === 401 ? "The bot didn't accept this request." : "The bot couldn't answer. Try again in a minute." };
    }
    return { ok: true, data: body as T };
  } catch (e) {
    console.error("bot bridge unreachable", path, e);
    return { ok: false, error: "Can't reach the bot right now. Try again in a minute." };
  }
}

/** POST to the bridge as the signed-in user (Discord linking). */
export async function botPost<T>(path: string, user: User, body: unknown = {}): Promise<BotResult<T>> {
  let token: string;
  try {
    token = await getVercelOidcToken();
  } catch {
    return { ok: false, error: "This copy of the site can't talk to the bot. Only mesark.net can." };
  }
  try {
    const res = await fetch(`${BOT_API}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Mesa-Role": user.role,
        "X-Mesa-Actor": user.steam_id,
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      if ((res.status === 400 || res.status === 429) && data?.error) return { ok: false, error: data.error };
      console.error("bot bridge", path, res.status, data);
      return { ok: false, error: "The bot couldn't answer. Try again in a minute." };
    }
    return { ok: true, data: data as T };
  } catch (e) {
    console.error("bot bridge unreachable", path, e);
    return { ok: false, error: "Can't reach the bot right now. Try again in a minute." };
  }
}

export type SupportData = {
  days: number;
  totals: {
    tickets: number;
    closed: number;
    claimed: number;
    questions: number;
    bot_replies: number;
    staff_replies: number;
    needs_human: number;
    emergencies: number;
    escalated: number;
    players: number;
    bot_rate: number;
  };
  first_reply: { p50: number | null; p90: number | null; answered: number; unanswered: number };
  daily: { date: string; created: number; questions: number; bot: number; staff: number; needs_human: number }[];
  heatmap: number[][]; // [weekday Mon=0][hour], UTC
  open: { channel: string; player: string; escalated: boolean; opened: number; staff: string | null; wait_mins: number; idle_mins: number }[];
  open_empty_hidden: number; // tickets with no messages 12 h after opening (abandoned or deleted by hand)
  effort: {
    month: string;
    staff: { name: string; listed: boolean; resolved: number; claimed_open: number; escalated: number; replies: number; rating: number | null; ratings: number; effort: number }[];
  } | null;
  generated: number;
};

export type PlayerRecord = {
  steam_id: string;
  names: { name: string; steam_name: string | null; tribe: string | null; cluster: string | null; server: string | null; last_seen: number }[];
  bans: { cluster: string; banned: boolean | null; since: number | null; duration: number | null; remaining: number | null; expired: boolean }[];
  ban_count: number;
  reason_type: string | null;
  evasions: number;
  unban_price: string | null;
  proofs: { channel: string; time: number; reason: string; type: string; links: string[] }[];
  same_hwid: string[];
  same_ip: string[];
  violations_30d: { type: string; count: number }[];
  admin_actions: { admin: string; action: string; detail: string; cluster: string; time: number }[];
};

export type FinanceData = {
  days: number;
  period: { revenue: number; payments: number; prev_revenue: number; change_pct: number | null; avg_daily: number };
  month: { revenue: number; payments: number };
  all_time: { revenue: number; payments: number };
  daily: { date: string; revenue: number }[];
  monthly: { month: string; revenue: number }[];
  products: { name: string; count: number; revenue: number }[];
  spenders: { name: string; count: number; revenue: number }[];
  payouts: { month: string; name: string; amount: number; effort: number | null; share: number | null }[];
  last_payment: number | null;
  generated: number;
};

/** "2.7 min", "2 h 37 min", "3 d 4 h". */
export function minutes(m: number | null | undefined): string {
  if (m == null) return "–";
  if (m < 60) return `${m < 10 ? m.toFixed(1).replace(/\.0$/, "") : Math.round(m)} min`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h} h ${Math.round(m % 60)} min`;
  return `${Math.floor(h / 24)} d ${h % 24} h`;
}

export function seconds(s: number | null | undefined): string {
  return s == null ? "–" : minutes(s / 60);
}

export const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n >= 1000 ? 0 : 2 });

export function day(ts: number | null | undefined): string {
  if (!ts) return "–";
  return new Date(ts * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" });
}

export function dateTime(ts: number | null | undefined): string {
  if (!ts) return "–";
  return new Date(ts * 1000).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }) + " ET";
}

/** Period picker values shared by the stats pages. */
export const PERIODS = [7, 30, 90] as const;
export function periodFrom(v: string | undefined): number {
  const n = Number(v);
  return (PERIODS as readonly number[]).includes(n) ? n : 30;
}
