import { Suspense } from "react";
import { currentUser, type User } from "@/lib/auth";
import { LoadingData } from "@/components/staff/LoadingData";
import { botGet, type TicketQueueData } from "@/lib/bot";
import { isLead, isStaff } from "@/lib/staff";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";
import { BridgeError } from "@/components/staff/StatBits";
import { AutoRefresh } from "@/components/staff/AutoRefresh";
import { TicketQueueView } from "@/components/staff/TicketQueueView";

export const metadata = { title: "Ticket queue" };

async function QueueData({ user, legacy }: { user: User; legacy: string }) {
  const res = await botGet<TicketQueueData>(`/v1/tickets?legacy=${legacy}`, user);
  return res.ok ? <TicketQueueView d={res.data} /> : <BridgeError error={res.error} />;
}

export default async function TicketQueue({ searchParams }: { searchParams: Promise<{ legacy?: string }> }) {
  const user = await currentUser();
  if (!isStaff(user)) return <StaffGate user={user} />;
  const filter = (await searchParams).legacy;
  const legacy = filter === "legacy" || filter === "current" ? filter : "all";

  return (
    <StaffShell user={user} active="/staff/tickets" title="Tickets" kicker="Live ticket queue">
      <AutoRefresh seconds={30} />
      <p className="max-w-2xl text-text-muted">
        Every open Discord ticket in the order to answer them. Updates every 30 seconds; the same list is pinned in #ticket-queue.
        {isLead(user) ? " You also see staff-report and HOF tickets." : ""}
      </p>
      <nav aria-label="Ticket history filter" className="mt-4 flex gap-4">{["all", "current", "legacy"].map(f => <a key={f} href={`?legacy=${f}`} aria-current={f === legacy ? "page" : undefined} className="underline">{f === "all" ? "All tickets" : f === "current" ? "New tracking" : "Legacy records"}</a>)}</nav>
      <div className="mt-6"><Suspense key={legacy} fallback={<LoadingData />}><QueueData user={user} legacy={legacy} /></Suspense></div>
    </StaffShell>
  );
}
