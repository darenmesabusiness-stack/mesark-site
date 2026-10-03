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
      if ([400, 403, 404, 409, 429].includes(res.status) && body?.error) return { ok: false, error: body.error };
      return { ok: false, error: res.status === 401 ? "The bot didn't accept this request." : "The bot couldn't answer. Try again in a minute." };
    }
    return { ok: true, data: body as T };
  } catch (e) {
    console.error("bot bridge unreachable", path, e);
    return { ok: false, error: "Can't reach the bot right now. Try again in a minute." };
  }
}

/** GET public data (no signed-in user), e.g. live population for the server list. */
export async function botGetPublic<T>(path: string): Promise<BotResult<T>> {
  let token: string;
  try {
    token = await getVercelOidcToken();
  } catch {
    return { ok: false, error: "no oidc" };
  }
  try {
    const res = await fetch(`${BOT_API}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return { ok: false, error: `bot ${res.status}` };
    return { ok: true, data: (await res.json()) as T };
  } catch (e) {
    console.error("bot bridge unreachable", path, e);
    return { ok: false, error: "unreachable" };
  }
}

export type PopulationData = {
  fresh: boolean;
  updated: number | null;
  online: number;
  peak_24h: number;
  clusters: Record<string, { players: number; servers: number }>;
  servers: { session: string; cluster: string; map: string; players: number }[];
  history: Record<string, { hour: number; avg: number }[]>;
};

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
      if ([400, 403, 404, 409, 429].includes(res.status) && data?.error) return { ok: false, error: data.error };
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

export type QueueTicket = {
  channel_id: string;
  guild_id: string;
  name: string;
  player: string;
  cluster: string;
  type: string;
  rank: string | null;
  opened: number;
  waiting_since: number | null;
  claimed_by: string | null;
  overdue: boolean;
  pinged: number;
  escalated: boolean;
  legacy: boolean;
  review?: { state: string; note: string; updated_at: number | null };
};

export type TicketQueueData = {
  ready: boolean;
  generated: number;
  sections: Partial<Record<"emergency" | "rank" | "staff" | "player" | "empty" | "hold", QueueTicket[]>>;
  tiers: Partial<Record<"emergency" | "rank" | "normal", { tickets: number; answered: number; p50_mins: number | null; p90_mins: number | null }>>;
  cohorts?: Record<string, { tickets: number; response_samples: number; response_p50: number | null; response_p90: number | null; resolution_samples: number; resolution_p50: number | null; resolution_p90: number | null; invalid_response_intervals: number }>;
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
  currency?: string;
  currencies?: { currency: string; revenue: number; payments: number }[];
  sync?: { last_attempt?: string; last_success?: string; recent_success?: string; history_completed?: string; last_error?: string; stale: boolean };
  status_changes?: { payment_id: string; previous: string; current: string; observed_at: number }[];
  delivery?: { payment_id: string; status: string; date: number; amount: number; currency: string; cart: string; delivery_state: string; note: string; updated_at: number | null; observed_at: number | null }[];
  delivery_count?: number;
  review_page?: number;
  review_ready?: boolean;
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

export type MembersDay = { day: string; joins: number; leaves: number; net: number; members: number | null };
export type MembersServer = {
  name: string;
  joins: number;
  leaves: number;
  net: number;
  members: number | null;
  retention_7d: number | null;
  new_account_pct: number | null;
  top_invites: { code: string; joins: number }[];
  daily: MembersDay[];
};
export type MembersData = { days: number; tracking_since: number | null; servers: Record<string, MembersServer> };
