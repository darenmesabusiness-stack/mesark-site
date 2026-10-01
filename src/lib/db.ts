/**
 * Postgres (Neon, connected through the Vercel integration, which sets DATABASE_URL).
 * Without it, sign-in and everything else that needs the database stays switched off.
 * The schema is created on first use, so a fresh database needs no manual setup.
 */
import { neon } from "@neondatabase/serverless";

export type Query = <T = Record<string, unknown>>(text: string, params?: unknown[]) => Promise<T[]>;

let driver: Query | null = null;
let ready: Promise<void> | null = null;

export const dbConfigured = () => Boolean(driver || process.env.DATABASE_URL || process.env.POSTGRES_URL);

/** Lets scripts run the same code against an in-memory Postgres (scripts/test-auth.mts). */
export function useDriver(q: Query) {
  driver = q;
  ready = null;
}

function connect(): Query {
  if (driver) return driver;
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("Database not configured");
  const sql = neon(url);
  driver = (text, params = []) => sql.query(text, params) as never;
  return driver;
}

const SCHEMA = [
  `create table if not exists users (
     steam_id    text primary key,
     persona     text,
     avatar      text,
     discord_id  text unique,
     role        text not null default 'player',
     created_at  timestamptz not null default now(),
     last_login  timestamptz not null default now()
   )`,
  `create table if not exists sessions (
     id_hash     text primary key,
     steam_id    text not null references users(steam_id) on delete cascade,
     created_at  timestamptz not null default now(),
     expires_at  timestamptz not null
   )`,
  `create index if not exists sessions_steam_id on sessions (steam_id)`,
  // Roles v2: the first-week "admin" (full access) is now "owner"; nothing writes "admin" any more.
  `update users set role = 'owner' where role = 'admin'`,
  // Change log months written in the staff editor; published rows override the built-in months.
  `create table if not exists changelog_months (
     slug          text primary key,
     raw           text not null default '',
     data          jsonb not null,
     published     boolean not null default false,
     published_at  timestamptz,
     updated_at    timestamptz not null default now(),
     updated_by    text
   )`,
];

/** Run a query, creating the schema first if this instance hasn't yet. */
export async function query<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  const q = connect();
  if (!ready) {
    ready = (async () => {
      for (const stmt of SCHEMA) await q(stmt);
    })().catch((e) => {
      ready = null;
      throw e;
    });
  }
  await ready;
  return q<T>(text, params);
}
