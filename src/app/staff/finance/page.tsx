import { Suspense } from "react";
import { currentUser, type User } from "@/lib/auth";
import { LoadingData } from "@/components/staff/LoadingData";
import { botGet, periodFrom, type FinanceData } from "@/lib/bot";
import { isOwner } from "@/lib/staff";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";
import { BridgeError, PeriodPicker } from "@/components/staff/StatBits";
import { FinanceView } from "@/components/staff/FinanceView";

export const metadata = { title: "Finance" };

async function FinanceDataPanel({ user, days }: { user: User; days: number }) {
  const res = await botGet<FinanceData>(`/v1/finance?days=${days}`, user);
  return res.ok ? <FinanceView d={res.data} /> : <BridgeError error={res.error} />;
}

export default async function Finance({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const user = await currentUser();
  if (!isOwner(user)) return <StaffGate user={user} error={user ? "Finance is for the owner only." : undefined} />;
  const days = periodFrom((await searchParams).days);

  return (
    <StaffShell user={user} active="/staff/finance" title="Finance" kicker="Owner only">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-text-muted">Tip4Serv store payments the bot has synced. Processed payments only; refunds and chargebacks are left out.</p>
        <PeriodPicker path="/staff/finance" days={days} />
      </div>
      <div className="mt-6"><Suspense key={days} fallback={<LoadingData />}><FinanceDataPanel user={user} days={days} /></Suspense></div>
    </StaffShell>
  );
}
