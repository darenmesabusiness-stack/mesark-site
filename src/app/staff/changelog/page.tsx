import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { slugFor, staffMonths, type MonthStatus } from "@/lib/changelogStore";
import { isLead } from "@/lib/staff";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";

const PILL: Record<MonthStatus, string> = {
  published: "border-teal text-teal",
  "built-in": "border-teal/60 text-teal/80",
  draft: "border-accent text-accent",
};
const LABEL: Record<MonthStatus, string> = { published: "Live", "built-in": "Live", draft: "Draft" };

export default async function ChangelogAdmin({ searchParams }: { searchParams: Promise<{ discarded?: string }> }) {
  const user = await currentUser();
  if (!isLead(user)) return <StaffGate user={user} error={user ? "The change log editor is for lead admins and the owner." : undefined} />;
  const sp = await searchParams;
  const months = await staffMonths();

  // Next month after the newest one (or this month if that's later).
  const now = new Date();
  const [y, m] = (months[0]?.slug ?? slugFor(now.getUTCFullYear(), now.getUTCMonth())).split("-").map(Number);
  const nextSlug = m === 12 ? slugFor(y + 1, 1) : slugFor(y, m + 1);

  return (
    <StaffShell user={user} active="/staff/changelog" title="Change log" kicker="Editor">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-text-muted">
          Paste the month&apos;s Discord post and publish. The site splits it into sections, tags every line and links cave changes to their
          pins on the map.
        </p>
        <Link
          href={`/staff/changelog/${nextSlug}`}
          className="clip-corner-sm bg-accent px-5 py-2.5 font-display text-xl font-extrabold uppercase tracking-wide text-bg-primary transition hover:bg-[#ff8c45]"
        >
          New month
        </Link>
      </div>
      {sp.discarded && <p className="mt-6 border-l-2 border-teal bg-bg-card/80 px-4 py-3 text-sm">Discarded the saved version of {sp.discarded}.</p>}

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-bg-secondary">
            <tr className="hud-label !text-sm">
              <th className="px-4 py-3 font-normal">Month</th>
              <th className="px-3 py-3 font-normal">Status</th>
              <th className="px-3 py-3 font-normal">Changes</th>
              <th className="px-3 py-3 font-normal">Last edit</th>
              <th className="px-4 py-3 font-normal" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {months.map((mo) => (
              <tr key={mo.slug} className="bg-bg-card/40">
                <td className="px-4 py-3 font-display text-xl font-black">{mo.label}</td>
                <td className="px-3 py-3">
                  <span className={`border px-2 py-0.5 font-mono text-sm uppercase tracking-wider ${PILL[mo.status]}`}>{LABEL[mo.status]}</span>
                </td>
                <td className="px-3 py-3 font-mono">{mo.changes}</td>
                <td className="px-3 py-3 text-sm text-text-muted">
                  {mo.updatedAt ? `${new Date(mo.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}${mo.editor ? ` · ${mo.editor}` : ""}` : "Original post"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/staff/changelog/${mo.slug}`} className="hud-label !text-text-primary/80 transition hover:!text-accent">
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StaffShell>
  );
}
