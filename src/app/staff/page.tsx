import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { isOwner, isStaff } from "@/lib/staff";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";

type Status = "Live" | "Next" | "Planned";
// owner: true = owners only. Admins (staff) work tickets, so they get the ticket tools.
const MODULES: { title: string; text: string; status: Status; href?: string; owner?: boolean }[] = [
  { title: "Ticket queue", text: "Website and Discord tickets in one list, sorted by priority, with the player's details.", status: "Planned" },
  { title: "Player lookup", text: "Bans, purchases, servers and tribes for any player, next to their ticket.", status: "Planned" },
  { title: "Team", text: "Who has staff access. Make players admins (tickets) or owners.", status: "Live", href: "/staff/team", owner: true },
  { title: "Change log editor", text: "Write the monthly change log here; it publishes to /changelog and posts to Discord.", status: "Next", owner: true },
  { title: "Cave editor", text: "Drop a pin on the map, add notes and the walkthrough clip.", status: "Next", owner: true },
  { title: "Support stats", text: "Ticket volume, reply times and the AI helper's results. Replaces the old dashboard.", status: "Planned", owner: true },
  { title: "Finance", text: "Store revenue and payouts.", status: "Planned", owner: true },
];

const STATUS: Record<Status, string> = {
  Live: "border-teal text-teal",
  Next: "border-accent text-accent",
  Planned: "border-border text-text-muted",
};

export default async function StaffHome({ searchParams }: { searchParams: Promise<{ error?: string; claimed?: string }> }) {
  const user = await currentUser();
  const sp = await searchParams;
  if (!isStaff(user)) return <StaffGate user={user} error={sp.error === "claim" ? "Owner access can't be claimed any more. Ask the owner." : undefined} />;

  const modules = MODULES.filter((m) => !m.owner || isOwner(user));
  return (
    <StaffShell user={user} active="/staff" title="Staff section" kicker="Overview">
      {sp.claimed && (
        <p className="mb-8 border-l-2 border-teal bg-bg-card/80 px-4 py-3 text-sm">You&apos;re the owner now. Add your admins on the Team page.</p>
      )}
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => {
          const body = (
            <>
              <span className={`inline-block border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${STATUS[m.status]}`}>{m.status}</span>
              <h2 className="font-display mt-3 text-3xl font-black">{m.title}</h2>
              <p className="mt-2 text-sm text-text-muted">{m.text}</p>
            </>
          );
          return m.href ? (
            <Link key={m.title} href={m.href} className="group bg-bg-card p-5 transition hover:bg-accent/[0.06]">
              {body}
              <span className="font-display mt-4 inline-block text-lg font-extrabold tracking-wider text-accent transition-transform group-hover:translate-x-1">Open →</span>
            </Link>
          ) : (
            <div key={m.title} className="bg-bg-card p-5">
              {body}
            </div>
          );
        })}
      </div>
    </StaffShell>
  );
}
