import { currentUser } from "@/lib/auth";
import { isOwner, listAccounts } from "@/lib/staff";
import { query } from "@/lib/db";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";
import { SupportAccessForm } from "@/components/staff/SupportAccessForm";

export const metadata = {
  title: "Support responsibilities",
  robots: { index: false, follow: false },
};
export default async function AccessPage() {
  const user = await currentUser();
  if (!isOwner(user)) return <StaffGate user={user} />;
  const [team, grants] = await Promise.all([
    listAccounts(),
    query<{ persona: string; cluster: string; type: string }>(
      `select u.persona,g.cluster,g.type from support_access g join users u on u.steam_id=g.steam_id order by u.persona,g.cluster,g.type`,
    ),
  ]);
  return (
    <StaffShell
      user={user}
      active="/staff/tickets"
      title="Support responsibilities"
      kicker="Owner controls"
    >
      <p className="text-text-muted">
        Owners see every website ticket. Leads see standard support, HOF and
        staff reports. Other staff need an assigned cluster and ticket type;
        black market access is always explicit.
      </p>
      <SupportAccessForm
        team={team
          .filter((u) => u.role !== "player")
          .map((u) => ({ id: u.steam_id, name: u.persona ?? "Staff account" }))}
      />
      <ul className="mt-6 grid gap-2 text-sm">
        {grants.map((g, i) => (
          <li key={i}>
            {g.persona} · {g.cluster} · {g.type}
          </li>
        ))}
      </ul>
    </StaffShell>
  );
}
