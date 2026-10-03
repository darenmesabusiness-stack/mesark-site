import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { isLead } from "@/lib/staff";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";
import { HofEditor } from "@/components/staff/HofEditor";
import { hofSeed, staffHof } from "@/lib/hofStore";
import type { HofWinner } from "@/components/HofGallery";
import recovery from "@/data/hofRecovery.json";
export const metadata = {
  title: "Hall of Fame editor",
  robots: { index: false, follow: false },
};
export default async function HofStaff({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const user = await currentUser();
  if (!isLead(user)) return <StaffGate user={user} />;
  const { id } = await searchParams,
    rows = await staffHof(user);
  const records = new Map<string, { data: HofWinner; published: boolean }>(
    hofSeed.winners.map((w) => [w.id, { data: w, published: true }]),
  );
  for (const row of rows) records.set(row.id, row);
  const entry = id ? records.get(id) : undefined;
  const candidate = id ? recovery.candidates.find(row=>row.announcement===id) : undefined;
  return (
    <StaffShell
      user={user}
      active="/staff/hof"
      title="Hall of Fame"
      kicker="Verified recognition"
    >
      <div className="mb-6 flex gap-5 text-sm">
        <Link href="/staff/hof" className="text-accent underline">
          New winner
        </Link>
        <Link href="/hall-of-fame" className="text-accent underline">
          View public showcase
        </Link>
        <Link href="/staff/tickets" className="text-accent underline">
          Review applications
        </Link>
      </div>
      {candidate && <aside className="mb-8 border border-accent/40 bg-bg-card p-5"><h2 className="font-display text-2xl">Archived snapshot to review</h2><p className="mt-3 text-sm text-text-muted">An exact tribe-name/cluster match was recovered from a preserved leaderboard table. This is an observation before the announcement, not a verified final result for this season. Confirm tribe identity and wipe boundaries before entering it below.</p><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><div><dt className="text-text-muted">Observed score</dt><dd className="font-display text-3xl">{candidate.observedScore.toLocaleString("en-US")}</dd></div><div><dt className="text-text-muted">Observed rank</dt><dd>#{candidate.observedRank}</dd></div><div><dt className="text-text-muted">Observed UTC</dt><dd>{new Date(candidate.observedAt).toLocaleString("en-US",{timeZone:"UTC"})}</dd></div></dl><p className="mt-4 text-sm text-text-muted">{candidate.matches} matching observations in the {recovery.windowDays}-day review window. Captured evidence must be referenced privately when results are saved.</p></aside>}
      <HofEditor
        key={id ?? "new"}
        id={entry?.data.id ?? crypto.randomUUID()}
        entry={entry?.data}
        published={entry?.published}
      />
      <details className="mt-10 border-t border-border pt-5">
        <summary className="cursor-pointer">Edit existing winners</summary>
        <ul className="mt-4 grid gap-2">
          {[...records.values()].map((r) => (
            <li key={r.data.id}>
              <Link
                href={`?id=${r.data.id}`}
                className="text-sm hover:text-accent"
              >
                {r.data.tribe} · {r.data.cluster} · Season {r.data.season}
                {!r.published ? " · Hidden" : ""}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </StaffShell>
  );
}
