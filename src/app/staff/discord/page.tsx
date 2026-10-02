import { currentUser } from "@/lib/auth";
import { botGet, periodFrom, type MembersData } from "@/lib/bot";
import { isLead } from "@/lib/staff";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";
import { BridgeError, PeriodPicker } from "@/components/staff/StatBits";
import { DiscordView } from "@/components/staff/DiscordView";

export const metadata = { title: "Discord growth" };

export default async function DiscordStats({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const user = await currentUser();
  if (!isLead(user)) return <StaffGate user={user} error={user ? "Discord stats are for lead admins and the owner." : undefined} />;
  const days = periodFrom((await searchParams).days);
  const res = await botGet<MembersData>(`/v1/members?days=${days}`, user);

  return (
    <StaffShell user={user} active="/staff/discord" title="Discord" kicker="Members joining and leaving">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-text-muted">Who joins and leaves the MESA Discords, recorded by the bot (it replaced Invite Tracker). Counts only.</p>
        <PeriodPicker path="/staff/discord" days={days} />
      </div>
      <div className="mt-6">{res.ok ? <DiscordView d={res.data} /> : <BridgeError error={res.error} />}</div>
    </StaffShell>
  );
}
