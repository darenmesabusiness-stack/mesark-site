"use client";

import { useActionState, useDeferredValue, useMemo, useState } from "react";
import { ChangeLogBody } from "@/components/changelog/ChangeLogBody";
import { TAGS, TAG_ORDER } from "@/components/changelog/tags";
import type { ChangeMonth } from "@/data/changelog";
import { MONTHS, parseChangelog } from "@/lib/changelogParse";

type Save = (prev: { error: string | null }, form: FormData) => Promise<{ error: string | null }>;

/**
 * Paste the Discord change-log post(s) for a month; the preview updates as you type, exactly as
 * the public page will show it. Save keeps it private (unless the month is already live); Publish
 * puts it on /changelog.
 */
export function ChangelogEditor({
  action,
  initial,
  heroes,
  mapNames,
}: {
  action: Save;
  initial: { year: number; month: number; raw: string; hero: string; live: boolean; isNew: boolean };
  heroes: { src: string; label: string }[];
  mapNames: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });
  const [raw, setRaw] = useState(initial.raw);
  const [year, setYear] = useState(initial.year);
  const [month, setMonth] = useState(initial.month);
  const [hero, setHero] = useState(initial.hero);
  const [showFull, setShowFull] = useState(false);
  const deferred = useDeferredValue(raw);
  const parsed = useMemo(() => parseChangelog(deferred), [deferred]);

  const counts = Object.fromEntries(TAG_ORDER.map((t) => [t, 0])) as Record<string, number>;
  let total = 0;
  let unlinked = 0;
  for (const s of parsed.sections)
    for (const it of s.items) {
      counts[it.tag] += 1;
      total += 1;
      if ((s.kind === "caves" || s.kind === "city") && !it.link) unlinked += 1;
    }
  const nameMismatch = parsed.month && parsed.month.toLowerCase() !== MONTHS[month - 1];
  const preview: ChangeMonth = {
    slug: `${year}-${String(month).padStart(2, "0")}`,
    month: MONTHS[month - 1],
    year,
    posted: new Date().toISOString(),
    hero,
    dotm: parsed.dotm,
    sections: parsed.sections,
  };

  return (
    <form action={formAction} className="grid gap-8">
      {state.error && <p className="border-l-2 border-accent bg-bg-card/80 px-4 py-3 text-sm">{state.error}</p>}

      <div className="flex flex-wrap gap-4">
        <label className="grid gap-1 text-sm">
          <span className="hud-label !text-[10px]">Month</span>
          <select
            name="month"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            disabled={!initial.isNew}
            className="border border-border bg-bg-primary px-3 py-2 capitalize focus:border-accent/50 focus:outline-none disabled:opacity-70"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="hud-label !text-[10px]">Year</span>
          <input
            name="year"
            type="number"
            min={2024}
            max={2100}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            disabled={!initial.isNew}
            className="w-28 border border-border bg-bg-primary px-3 py-2 focus:border-accent/50 focus:outline-none disabled:opacity-70"
          />
        </label>
        {!initial.isNew && (
          <>
            <input type="hidden" name="month" value={month} />
            <input type="hidden" name="year" value={year} />
          </>
        )}
      </div>

      <label className="grid gap-2">
        <span className="hud-label !text-[10px]">The Discord post (paste every part of the month, one after the other)</span>
        <textarea
          name="raw"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={18}
          spellCheck={false}
          placeholder={"# <:mesark:...> NOVEMBER CHANGE LOG\n\n# 🦖 Dino Of The Month\n```\nRex is the chosen Dino Of The Month for November, Tamed Resistance upgraded to 3x\n```\n# ⚠️ Change-Logs\n```\n- Increased ...\n```"}
          className="w-full border border-border bg-bg-primary px-4 py-3 font-mono text-[13px] leading-relaxed placeholder:text-text-muted/50 focus:border-accent/50 focus:outline-none"
        />
      </label>

      <section className="grid gap-3 border border-border bg-bg-card/60 p-5">
        <p className="hud-label !text-accent">What the site reads from it</p>
        <p className="text-sm">
          {parsed.parts} post{parsed.parts === 1 ? "" : "s"} · {total} change{total === 1 ? "" : "s"} in {parsed.sections.length} section
          {parsed.sections.length === 1 ? "" : "s"}
          {parsed.dotm ? (
            <>
              {" "}
              · Dino of the Month <span className="font-semibold text-accent">{parsed.dotm.dino}</span>
              {parsed.dotm.bonus && ` (${parsed.dotm.bonus})`}
            </>
          ) : (
            " · no Dino of the Month"
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          {TAG_ORDER.map((t) => (
            <span key={t} className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${TAGS[t].className}`}>
              {TAGS[t].label} {counts[t]}
            </span>
          ))}
        </div>
        {nameMismatch && (
          <p className="text-sm text-accent">
            The post says {parsed.month}, but you&apos;re editing <span className="capitalize">{MONTHS[month - 1]}</span>.
          </p>
        )}
        {unlinked > 0 && (
          <p className="text-sm text-text-muted">
            {unlinked} cave line{unlinked === 1 ? "" : "s"} didn&apos;t match a cave on the map, so they won&apos;t get a pin link. That&apos;s fine
            for caves that aren&apos;t on the map yet.
          </p>
        )}
        {parsed.sections.length > 0 && (
          <button type="button" onClick={() => setShowFull((v) => !v)} className="hud-label justify-self-start !text-text-primary/80 hover:!text-accent">
            {showFull ? "Hide full preview" : "Show full preview"} →
          </button>
        )}
      </section>

      {showFull && parsed.sections.length > 0 && (
        <div className="border border-border p-4">
          <ChangeLogBody month={preview} mapNames={mapNames} />
        </div>
      )}

      <fieldset className="grid gap-3">
        <legend className="hud-label mb-3 !text-[10px]">Header art (Blender renders from ARK&apos;s game files)</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {heroes.map((h) => (
            <label
              key={h.src}
              className={`cursor-pointer overflow-hidden border transition ${hero === h.src ? "border-accent ring-1 ring-accent" : "border-border hover:border-accent/50"}`}
            >
              <input type="radio" name="hero" value={h.src} checked={hero === h.src} onChange={() => setHero(h.src)} className="sr-only" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={h.src} alt="" className="aspect-video w-full object-cover" loading="lazy" />
              <span className="block px-2 py-1.5 text-xs">{h.label}</span>
            </label>
          ))}
        </div>
        {!hero && <p className="text-sm text-text-muted">No art picked: the site uses an earlier render of the Dino of the Month, or the Rex.</p>}
      </fieldset>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        {initial.live ? (
          <button
            type="submit"
            name="intent"
            value="save"
            disabled={pending}
            className="clip-corner-sm bg-accent px-6 py-3 font-display text-xl font-extrabold uppercase tracking-wide text-bg-primary transition hover:bg-[#ff8c45] disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save changes (live)"}
          </button>
        ) : (
          <>
            <button
              type="submit"
              name="intent"
              value="publish"
              disabled={pending}
              className="clip-corner-sm bg-accent px-6 py-3 font-display text-xl font-extrabold uppercase tracking-wide text-bg-primary transition hover:bg-[#ff8c45] disabled:opacity-60"
            >
              {pending ? "Saving…" : "Publish"}
            </button>
            <button
              type="submit"
              name="intent"
              value="save"
              disabled={pending}
              className="border border-border px-5 py-3 font-display text-xl font-extrabold uppercase tracking-wide transition hover:border-accent hover:text-accent disabled:opacity-60"
            >
              Save draft
            </button>
          </>
        )}
        <span className="text-sm text-text-muted">
          {initial.live ? "This month is on the site; saving updates it right away." : "Drafts are only visible here until you publish."}
        </span>
        {state.error && <p className="w-full text-sm text-accent">{state.error}</p>}
      </div>
    </form>
  );
}
