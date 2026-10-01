/**
 * Change log months: the six built-in months (src/data/changelog.ts) plus anything staff
 * write in the editor. A published database row for a month replaces the built-in one.
 */
import { unstable_cache } from "next/cache";
import { changelog as builtIn, type ChangeMonth } from "@/data/changelog";
import { changelogRaw } from "@/data/changelog-raw";
import { dbConfigured, query } from "@/lib/db";
import { MONTHS, parseChangelog } from "@/lib/changelogParse";

export const CHANGELOG_TAG = "changelog";

/** Hero art for a month: Blender renders of real ARK assets. */
export const HERO_OPTIONS = [
  ...builtIn.map((m) => ({ src: m.hero, label: `${m.dotm?.dino ?? "Hero"} (${m.month})` })),
  { src: "/art/ark/rex.jpg", label: "Rex" },
  { src: "/art/ark/siege.jpg", label: "Giganotosaurus" },
  { src: "/art/ark/hall.jpg", label: "Dragon" },
  { src: "/art/ark/ashfield.jpg", label: "Sauropod" },
  { src: "/art/ark/hundredx-king.jpg", label: "King Titan" },
];

/** Picks hero art for a dino: an earlier month's render of it, else the Rex. */
export function heroFor(dino: string | null | undefined) {
  const d = (dino ?? "").toLowerCase();
  return (d && HERO_OPTIONS.find((h) => h.label.toLowerCase().startsWith(d))?.src) || "/art/ark/rex.jpg";
}

interface Row {
  slug: string;
  raw: string;
  data: ChangeMonth;
  published: boolean;
  published_at: string | null;
  updated_at: string;
  updated_by: string | null;
  editor: string | null;
}

/** Published months, newest first (uncached; use `publishedMonths` in pages). */
export async function loadPublishedMonths(): Promise<ChangeMonth[]> {
  const bySlug = new Map(builtIn.map((m) => [m.slug, m]));
  if (dbConfigured()) {
    try {
      for (const r of await query<{ data: ChangeMonth }>(`select data from changelog_months where published`)) bySlug.set(r.data.slug, r.data);
    } catch (e) {
      console.error("changelog: reading published months failed", e);
    }
  }
  return [...bySlug.values()].sort((a, b) => b.slug.localeCompare(a.slug));
}

/** Cached for pages; publishing in the editor refreshes it straight away. */
export const publishedMonths = unstable_cache(loadPublishedMonths, ["changelog-published"], { tags: [CHANGELOG_TAG], revalidate: 3600 });

export type MonthStatus = "built-in" | "published" | "draft";
export interface StaffMonth {
  slug: string;
  label: string;
  status: MonthStatus;
  changes: number;
  updatedAt: string | null;
  editor: string | null;
}

async function rows(): Promise<Row[]> {
  return query<Row>(
    `select c.slug, c.raw, c.data, c.published, c.published_at, c.updated_at, c.updated_by, u.persona as editor
       from changelog_months c left join users u on u.steam_id = c.updated_by`,
  );
}

const count = (m: ChangeMonth) => m.sections.reduce((n, s) => n + s.items.length, 0);

export async function staffMonths(): Promise<StaffMonth[]> {
  const out = new Map<string, StaffMonth>(
    builtIn.map((m) => [m.slug, { slug: m.slug, label: `${m.month} ${m.year}`, status: "built-in", changes: count(m), updatedAt: null, editor: null }]),
  );
  for (const r of await rows()) {
    out.set(r.slug, {
      slug: r.slug,
      label: `${r.data.month} ${r.data.year}`,
      status: r.published ? "published" : "draft",
      changes: count(r.data),
      updatedAt: r.updated_at,
      editor: r.editor,
    });
  }
  return [...out.values()].sort((a, b) => b.slug.localeCompare(a.slug));
}

export interface Editable {
  slug: string;
  year: number;
  month: number; // 1-12
  raw: string;
  hero: string;
  status: MonthStatus | "new";
  data: ChangeMonth | null;
}

export const slugFor = (year: number, month: number) => `${year}-${String(month).padStart(2, "0")}`;

/** What the editor opens: the saved draft/published row, else the built-in month, else blank. */
export async function editableMonth(slug: string): Promise<Editable | null> {
  const m = /^(\d{4})-(\d{2})$/.exec(slug);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (month < 1 || month > 12) return null;
  const [row] = await query<Row>(`select slug, raw, data, published, published_at, updated_at, updated_by, null as editor from changelog_months where slug = $1`, [slug]);
  if (row) return { slug, year, month, raw: row.raw, hero: row.data.hero, status: row.published ? "published" : "draft", data: row.data };
  const b = builtIn.find((x) => x.slug === slug);
  if (b) return { slug, year, month, raw: changelogRaw[slug] ?? "", hero: b.hero, status: "built-in", data: b };
  return { slug, year, month, raw: "", hero: "", status: "new", data: null };
}

/** Parses the pasted posts and saves them as a draft, or publishes. Returns an error message or null. */
export async function saveMonth(
  editor: string,
  input: { year: number; month: number; raw: string; hero: string; publish: boolean },
): Promise<{ error: string | null; slug: string }> {
  const slug = slugFor(input.year, input.month);
  if (input.year < 2024 || input.year > 2100 || input.month < 1 || input.month > 12) return { error: "Pick a month and year.", slug };
  const parsed = parseChangelog(input.raw);
  if (!parsed.sections.length && !parsed.dotm) {
    return { error: "No changes found. Paste the post exactly as it goes in Discord, starting with the “# … CHANGE LOG” line.", slug };
  }
  const name = MONTHS[input.month - 1];
  const [existing] = await query<{ published_at: string | null }>(`select published_at from changelog_months where slug = $1`, [slug]);
  const posted = existing?.published_at ?? builtIn.find((b) => b.slug === slug)?.posted ?? new Date().toISOString();
  const data: ChangeMonth = {
    slug,
    month: name[0].toUpperCase() + name.slice(1),
    year: input.year,
    posted,
    hero: HERO_OPTIONS.some((h) => h.src === input.hero) ? input.hero : heroFor(parsed.dotm?.dino),
    dotm: parsed.dotm,
    sections: parsed.sections,
  };
  await query(
    `insert into changelog_months (slug, raw, data, published, published_at, updated_at, updated_by)
     values ($1, $2, $3::jsonb, $4, case when $4 then now() end, now(), $5)
     on conflict (slug) do update set
       raw = excluded.raw, data = excluded.data, updated_at = now(), updated_by = excluded.updated_by,
       published = changelog_months.published or excluded.published,
       published_at = coalesce(changelog_months.published_at, excluded.published_at)`,
    [slug, input.raw, JSON.stringify(data), input.publish, editor],
  );
  return { error: null, slug };
}

export async function setPublished(slug: string, published: boolean, editor: string) {
  await query(
    `update changelog_months set published = $2, published_at = case when $2 then coalesce(published_at, now()) else published_at end,
            updated_at = now(), updated_by = $3 where slug = $1`,
    [slug, published, editor],
  );
}

/** Drops the saved version; a built-in month goes back to its original text. */
export async function discardMonth(slug: string) {
  await query(`delete from changelog_months where slug = $1`, [slug]);
}
