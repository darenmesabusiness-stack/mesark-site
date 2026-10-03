/**
 * Postgres (Neon, connected through the Vercel integration, which sets DATABASE_URL).
 * Without it, sign-in and everything else that needs the database stays switched off.
 * The schema is created on first use, so a fresh database needs no manual setup.
 */
import { neon } from "@neondatabase/serverless";

export type Query = <T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
) => Promise<T[]>;
export type Statement = { text: string; params?: unknown[] };
export type Transaction = (
  statements: Statement[],
) => Promise<Record<string, unknown>[][]>;

let driver: Query | null = null;
let transactionDriver: Transaction | null = null;
let ready: Promise<void> | null = null;

export const dbConfigured = () =>
  Boolean(driver || process.env.DATABASE_URL || process.env.POSTGRES_URL);

/** Lets scripts run the same code against an in-memory Postgres (scripts/test-auth.mts). */
export function useDriver(q: Query, transaction?: Transaction) {
  driver = q;
  transactionDriver = transaction ?? null;
  ready = null;
}

function connect(): Query {
  if (driver) return driver;
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("Database not configured");
  const sql = neon(url);
  driver = (text, params = []) => sql.query(text, params) as never;
  transactionDriver = (statements) =>
    sql.transaction(
      statements.map(({ text, params = [] }) => sql.query(text, params)),
      { isolationLevel: "ReadCommitted" },
    );
  return driver;
}

const SCHEMA = [
  `create table if not exists rules_revisions (id uuid primary key, raw text not null, data jsonb not null,
    actor text not null, created_at timestamptz not null default now())`,
  `create table if not exists rules_live (id integer primary key check(id=1), revision uuid not null references rules_revisions(id))`,
  `create table if not exists rules_publish_audit (id bigserial primary key, actor text not null,
    revision uuid not null references rules_revisions(id), previous text not null, at timestamptz not null default now())`,
  `create table if not exists hof_entries (
    id text primary key, data jsonb not null, published boolean not null default false,
    updated_by text not null, updated_at timestamptz not null default now()
  )`,
  `create table if not exists hof_audit (
    id bigserial primary key, entry_id text not null, actor text not null,
    data jsonb not null, published boolean not null, created_at timestamptz not null default now()
  )`,
  `alter table hof_audit add column if not exists evidence text`,
  `create table if not exists support_tickets (
    id uuid primary key, number bigserial unique, opener text not null, opener_name text not null,
    discord_id text not null, type text not null, cluster text not null, subject text not null,
    details jsonb not null default '{}', fingerprint text not null,
    status text not null default 'open' check(status in ('open','closed')),
    assigned_to text, hold boolean not null default false, priority integer not null default 0,
    created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
    closed_at timestamptz
  )`,
  `create index if not exists support_tickets_opener on support_tickets(opener, created_at desc)`,
  `create table if not exists support_messages (
    id uuid primary key, ticket_id uuid not null references support_tickets(id), actor text not null,
    author text not null, body text not null, private boolean not null default false,
    fingerprint text not null, created_at timestamptz not null default now()
  )`,
  `create index if not exists support_messages_ticket on support_messages(ticket_id, created_at)`,
  `create table if not exists support_access (
    steam_id text not null, cluster text not null, type text not null,
    granted_by text not null, primary key(steam_id, cluster, type)
  )`,
  `create table if not exists support_access_audit (
    id bigserial primary key, actor text not null, target text not null, cluster text not null,
    type text not null, enabled boolean not null, created_at timestamptz not null default now()
  )`,
  `create table if not exists support_uploads (
    id uuid primary key, ticket_id uuid not null references support_tickets(id), actor text not null,
    name text not null, pathname text unique not null, mime text not null, bytes integer not null,
    ready boolean not null default false, created_at timestamptz not null default now()
  )`,
  `alter table support_messages add column if not exists kind text not null default 'reply'`,
  `create table if not exists moderator_credits (
    ticket_id uuid primary key references support_tickets(id), moderator text not null,
    credited_at timestamptz not null default now()
  )`,
  `create table if not exists moderator_deductions (
    id uuid primary key, moderator text not null, month text not null,
    points integer not null check(points >= 5 and points <= 10000), reason text not null,
    severity text not null check(severity in ('normal','major')), actor text not null,
    created_at timestamptz not null default now()
  )`,
  `create index if not exists moderator_credits_month on moderator_credits(moderator, credited_at)`,
  `create index if not exists moderator_deductions_month on moderator_deductions(month, moderator)`,
  `create table if not exists mesa_map_wipes (
     cluster text primary key, wiped_at timestamptz not null, expires_at timestamptz not null,
     updated_by text, updated_at timestamptz not null default now(),
     check (expires_at > wiped_at + interval '24 hours')
   )`,
  `create table if not exists mesa_map_locations (
     cluster text not null, wiped_at timestamptz not null, tribe_id bigint not null,
     map text not null, lat double precision not null check (lat between 0 and 100),
     lon double precision not null check (lon between 0 and 100), observed_at timestamptz not null,
     source text not null, updated_by text, primary key (cluster, wiped_at, tribe_id)
   )`,
  `create table if not exists mesa_map_audit (
     id bigint generated always as identity primary key, actor text not null, cluster text not null,
     action text not null, data jsonb not null, at timestamptz not null default now()
   )`,
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
  // Optional public customization. Deleting the account also removes its profile.
  `create table if not exists player_profiles (
     id uuid primary key, steam_id text unique not null references users(steam_id) on delete cascade,
     bio text not null default '' check(length(bio)<=280),
     accent text not null default 'ember' check(accent in ('ember','gold','teal','violet')),
     published boolean not null default false
   )`,
  // Roles v2: the first-week "admin" (full access) is now "owner"; nothing writes "admin" any more.
  `alter table player_profiles add column if not exists share_links boolean not null default false`,
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
  // Caves added or edited in the staff cave editor; they override the built-in caves (caves.ts).
  `alter table users add column if not exists discord_name text`,
  `create table if not exists cave_edits (
     map         text not null,
     cave_id     text not null,
     data        jsonb not null,
     hidden      boolean not null default false,
     updated_at  timestamptz not null default now(),
     updated_by  text,
     primary key (map, cave_id)
   )`,
  `create table if not exists mesa_map_wipes (
     cluster text primary key, wiped_at timestamptz not null, expires_at timestamptz not null,
     updated_by text, updated_at timestamptz not null default now(),
     check (expires_at > wiped_at + interval '24 hours')
   )`,
  `create table if not exists mesa_map_locations (
     cluster text not null, wiped_at timestamptz not null, tribe_id bigint not null,
     map text not null, lat double precision not null check (lat between 0 and 100),
     lon double precision not null check (lon between 0 and 100), observed_at timestamptz not null,
     source text not null, updated_by text, primary key (cluster, wiped_at, tribe_id)
   )`,
  `create table if not exists mesa_map_audit (
     id bigint generated always as identity primary key, actor text not null, cluster text not null,
     action text not null, data jsonb not null, at timestamptz not null default now()
   )`,
];

async function ensureReady() {
  const q = connect();
  if (!ready) {
    ready = (async () => {
      // Neon executes this batch in order in one HTTP round trip. Separate requests
      // made cold sign-in/staff navigation pay the network latency for every DDL.
      if (transactionDriver)
        await transactionDriver(SCHEMA.map((text) => ({ text })));
      else for (const stmt of SCHEMA) await q(stmt);
    })().catch((e) => {
      ready = null;
      throw e;
    });
  }
  await ready;
}

/** Run a query, creating the schema first if this instance hasn't yet. */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  await ensureReady();
  return connect()<T>(text, params);
}

/**
 * Serialize account deletion and role changes across all app instances. The mutation
 * is a separate statement after the lock, so READ COMMITTED sees the preceding
 * transaction's changes. Both statements must run in one database transaction.
 */
export async function ownershipQuery<T>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  await ensureReady();
  if (!transactionDriver)
    throw new Error("Ownership changes require a transaction driver");
  const results = await transactionDriver([
    { text: "select pg_advisory_xact_lock(1296388929, 1)" }, // MESA ownership lifecycle
    { text, params },
  ]);
  return results[1] as T[];
}
