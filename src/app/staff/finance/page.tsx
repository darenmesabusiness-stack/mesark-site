import { Suspense } from "react";
import { currentUser, type User } from "@/lib/auth";
import { LoadingData } from "@/components/staff/LoadingData";
import { botGet, periodFrom, type FinanceData } from "@/lib/bot";
import { isOwner } from "@/lib/staff";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";
import { BridgeError, PeriodPicker } from "@/components/staff/StatBits";
import { FinanceView } from "@/components/staff/FinanceView";

export const metadata = { title: "Finance" };

async function FinanceDataPanel({ user, days, currency, reviewPage }: { user: User; days: number; currency: string; reviewPage: number }) {
  const res = await botGet<FinanceData>(`/v1/finance?days=${days}&currency=${currency}&review_page=${reviewPage}`, user);
  return res.ok ? <FinanceView d={res.data} /> : <BridgeError error={res.error} />;
}

export default async function Finance({ searchParams }: { searchParams: Promise<{ days?: string; currency?: string; review_page?: string }> }) {
  const user = await currentUser();
  if (!isOwner(user)) return <StaffGate user={user} error={user ? "Finance is for the owner only." : undefined} />;
  const params = await searchParams;
  const days = periodFrom(params.days);
  const currency = /^(?:[A-Z]{3}|UNKNOWN)$/.test(params.currency ?? "") ? params.currency! : "USD";
  const reviewPage = Math.max(1, Math.min(500, Number(params.review_page) || 1));

  return (
    <StaffShell user={user} active="/staff/finance" title="Finance" kicker="Owner only">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-text-muted">Synced Tip4Serv payments, separated by original currency. Processed totals are gross payments, not profit or proof of delivery.</p>
        <PeriodPicker path="/staff/finance" days={days} extra={{ currency }} />
      </div>
      <div className="mt-6"><Suspense key={`${days}-${currency}-${reviewPage}`} fallback={<LoadingData />}><FinanceDataPanel user={user} days={days} currency={currency} reviewPage={reviewPage} /></Suspense></div>
    </StaffShell>
  );
}
