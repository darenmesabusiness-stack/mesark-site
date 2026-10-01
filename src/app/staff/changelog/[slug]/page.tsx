import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { HERO_OPTIONS, editableMonth } from "@/lib/changelogStore";
import { MONTHS } from "@/lib/changelogParse";
import { caveMaps } from "@/data/caves";
import { changelog as builtIn } from "@/data/changelog";
import { isLead } from "@/lib/staff";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";
import { ChangelogEditor } from "@/components/staff/ChangelogEditor";
import { discardChangelog, publishChangelog, saveChangelog } from "../actions";

const SAVED: Record<string, string> = {
  saved: "Saved.",
  published: "Published. It's on /changelog now.",
  unpublished: "Taken off the site. It's a draft again.",
};

export default async function EditMonth({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ saved?: string }> }) {
  const user = await currentUser();
  if (!isLead(user)) return <StaffGate user={user} error={user ? "The change log editor is for lead admins and the owner." : undefined} />;
  const { slug } = await params;
  const sp = await searchParams;
  const m = await editableMonth(slug);
  if (!m) notFound();

  const name = MONTHS[m.month - 1];
  const title = `${name[0].toUpperCase()}${name.slice(1)} ${m.year}`;
  const saved = m.status === "draft" || m.status === "published";
  const statusText = {
    new: "New month, not saved yet.",
    "built-in": "This month is live from the original Discord post. Publishing an edited version replaces it.",
    draft: "Draft: only staff can see it.",
    published: "Live on the site.",
  }[m.status];

  return (
    <StaffShell user={user} active="/staff/changelog" title={title} kicker="Change log editor">
      <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link href="/staff/changelog" className="hud-label !text-text-primary/80 hover:!text-accent">
          ← All months
        </Link>
        <p className="text-sm text-text-muted">{statusText}</p>
        {(m.status === "published" || m.status === "built-in") && (
          <a href={`/changelog/${m.slug}`} target="_blank" rel="noopener" className="hud-label !text-text-primary/80 hover:!text-accent">
            View on site ↗
          </a>
        )}
      </div>
      {sp.saved && SAVED[sp.saved] && <p className="mb-8 border-l-2 border-teal bg-bg-card/80 px-4 py-3 text-sm">{SAVED[sp.saved]}</p>}

      <ChangelogEditor
        action={saveChangelog}
        initial={{ year: m.year, month: m.month, raw: m.raw, hero: m.hero, live: m.status === "published", isNew: m.status === "new" }}
        heroes={HERO_OPTIONS}
        mapNames={Object.fromEntries(caveMaps.map((c) => [c.slug, c.name]))}
      />

      {saved && (
        <div className="mt-10 flex flex-wrap gap-4 border-t border-border pt-6">
          <form action={publishChangelog}>
            <input type="hidden" name="slug" value={m.slug} />
            <input type="hidden" name="intent" value={m.status === "published" ? "unpublish" : "publish"} />
            <button type="submit" className="border border-border px-4 py-2 font-display text-lg font-extrabold uppercase tracking-wide transition hover:border-accent hover:text-accent">
              {m.status === "published" ? "Take off the site" : "Publish saved draft"}
            </button>
          </form>
          <form action={discardChangelog} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="slug" value={m.slug} />
            <label className="flex items-center gap-2 text-sm text-text-muted">
              <input type="checkbox" required className="accent-[var(--accent)]" />
              {m.status === "draft"
                ? "Delete this draft"
                : builtIn.some((b) => b.slug === m.slug)
                  ? "Go back to the original Discord post"
                  : "Delete this month from the site"}
            </label>
            <button type="submit" className="px-2 py-2 text-sm text-text-muted underline underline-offset-4 transition hover:text-accent">
              Confirm
            </button>
          </form>
        </div>
      )}
    </StaffShell>
  );
}
