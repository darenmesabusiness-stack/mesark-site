import { currentUser } from "@/lib/auth";
import { botGet, periodFrom, type SupportData } from "@/lib/bot";
import { isLead } from "@/lib/staff";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";
import { BridgeError, PeriodPicker } from "@/components/staff/StatBits";
import { SupportView } from "@/components/staff/SupportView";

export const metadata = { title: "Support stats" };

export default async function SupportStats({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const user = await currentUser();
  if (!isLead(user)) return <StaffGate user={user} error={user ? "Support stats are for lead admins and the owner." : undefined} />;
  const days = periodFrom((await searchParams).days);
  const res = await botGet<SupportData>(`/v1/support?days=${days}`, user);

  return (
    <StaffShell user={user} active="/staff/support" title="Support" kicker="Support stats">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-text-muted">Discord tickets, straight from the bot. Numbers refresh every minute.</p>
        <PeriodPicker path="/staff/support" days={days} />
      </div>
      <div className="mt-6">{res.ok ? <SupportView d={res.data} /> : <BridgeError error={res.error} />}</div>
    </StaffShell>
  );
}
