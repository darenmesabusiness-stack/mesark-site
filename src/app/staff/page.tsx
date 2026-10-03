import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { isLead, isOwner, isStaff } from "@/lib/staff";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";

type Status = "Live" | "Next" | "Planned";
// Who sees what: admins work tickets; lead admins also run content and the team; owners see everything.
type Access = "staff" | "lead" | "owner";
const MODULES: {
  title: string;
  text: string;
  status: Status;
  href?: string;
  access: Access;
}[] = [
  {
    title: "Ticket queue",
    text: "Website tickets and earlier Discord history. Reply, review evidence, claim and close requests in your responsibilities.",
    status: "Live",
    href: "/staff/tickets",
    access: "staff",
  },
  {
    title: "Hall of Fame",
    text: "Review applications, honor confirmed winning tribes and publish their public rosters and base tours.",
    status: "Live",
    href: "/staff/hof",
    access: "lead",
  },
  {
    title: "Player lookup",
    text: "Bans on every cluster, names, tribes and possible alts for any player.",
    status: "Live",
    href: "/staff/players",
    access: "staff",
  },
  {
    title: "Team",
    text: "Who has staff access. Add or remove admins; the owner also picks lead admins.",
    status: "Live",
    href: "/staff/team",
    access: "lead",
  },
  {
    title: "Change log editor",
    text: "Paste the month's Discord post and publish it to /changelog.",
    status: "Live",
    href: "/staff/changelog",
    access: "lead",
  },
  {
    title: "Cave editor",
    text: "Drop a pin on the map, add notes and the walkthrough clip.",
    status: "Live",
    href: "/staff/caves",
    access: "lead",
  },
  {
    title: "Support stats",
    text: "Ticket volume, reply times, busiest hours, open tickets and admin effort.",
    status: "Live",
    href: "/staff/support",
    access: "lead",
  },
  {
    title: "Discord growth",
    text: "Members joining and leaving each Discord, invites used and who stays.",
    status: "Live",
    href: "/staff/discord",
    access: "lead",
  },
  {
    title: "Finance",
    text: "Store revenue, top products and spenders, admin pay.",
    status: "Live",
    href: "/staff/finance",
    access: "owner",
  },
];

const STATUS: Record<Status, string> = {
  Live: "border-teal text-teal",
  Next: "border-accent text-accent",
  Planned: "border-border text-text-muted",
};

export default async function StaffHome() {
  const user = await currentUser();
  if (user?.role === "moderator") redirect("/staff/moderators");
  if (!isStaff(user)) return <StaffGate user={user} />;

  const can = { staff: true, lead: isLead(user), owner: isOwner(user) };
  const modules = MODULES.filter((m) => can[m.access]);
  return (
    <StaffShell
      user={user}
      active="/staff"
      title="Staff section"
      kicker="Overview"
    >
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => {
          const body = (
            <>
              <span
                className={`inline-block border px-2 py-0.5 font-mono text-sm uppercase tracking-wider ${STATUS[m.status]}`}
              >
                {m.status}
              </span>
              <h2 className="font-display mt-3 text-3xl font-black">
                {m.title}
              </h2>
              <p className="mt-2 text-sm text-text-muted">{m.text}</p>
            </>
          );
          return m.href ? (
            <Link
              key={m.title}
              href={m.href}
              className="group bg-bg-card p-5 transition hover:bg-accent/[0.06]"
            >
              {body}
              <span className="font-display mt-4 inline-block text-lg font-extrabold tracking-wider text-accent transition-transform group-hover:translate-x-1">
                Open →
              </span>
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
