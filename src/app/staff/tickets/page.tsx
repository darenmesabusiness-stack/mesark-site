import { Suspense } from "react";
import { currentUser, type User } from "@/lib/auth";
import { LoadingData } from "@/components/staff/LoadingData";
import { botGet, type TicketQueueData } from "@/lib/bot";
import { isLead, canSupport, isOwner } from "@/lib/staff";
import Link from "next/link";
import { listSupport, supportLabel } from "@/lib/supportStore";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";
import { BridgeError } from "@/components/staff/StatBits";
import { AutoRefresh } from "@/components/staff/AutoRefresh";
import { TicketQueueView } from "@/components/staff/TicketQueueView";

export const metadata = { title: "Ticket queue" };

async function QueueData({ user, legacy }: { user: User; legacy: string }) {
  const res = await botGet<TicketQueueData>(
    `/v1/tickets?legacy=${legacy}`,
    user,
  );
  return res.ok ? (
    <TicketQueueView d={res.data} />
  ) : (
    <BridgeError error={res.error} />
  );
}

async function WebsiteQueue({ user, status }: { user: User; status: string }) {
  const tickets = await listSupport(user, true, status);
  return tickets.length ? (
    <ul className="mt-4 grid gap-2">
      {tickets.map((t) => (
        <li key={t.id}>
          <Link
            href={`/staff/tickets/w_${t.id}`}
            className="flex flex-wrap justify-between gap-3 border border-border bg-bg-card/60 p-4 hover:border-accent"
          >
            <span>
              {supportLabel(t.type)} · #{t.number}
              <span className="mt-1 block text-sm text-text-muted">
                {t.subject} · {t.opener_name} ·{" "}
                {t.cluster === "3/6 Man" ? "3 Man" : t.cluster}
              </span>
            </span>
            <span className="text-sm text-accent">
              {t.priority === 2
                ? "Emergency · "
                : t.priority === 1
                  ? "Purchased rank · "
                  : ""}
              {t.hold ? "On hold · " : ""}
              {t.assigned_name ?? "Unclaimed"} →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <p className="mt-4 text-sm text-text-muted">
      No {status} website tickets in your assigned responsibilities.
    </p>
  );
}

export default async function TicketQueue({
  searchParams,
}: {
  searchParams: Promise<{ legacy?: string; status?: string }>;
}) {
  const user = await currentUser();
  if (!canSupport(user)) return <StaffGate user={user} />;
  const filters = await searchParams;
  const filter = filters.legacy;
  const status = filters.status === "closed" ? "closed" : "open";
  const legacy = filter === "legacy" || filter === "current" ? filter : "all";

  return (
    <StaffShell
      user={user}
      active="/staff/tickets"
      title="Tickets"
      kicker="Live ticket queue"
    >
      <AutoRefresh seconds={30} />
      <p className="max-w-2xl text-text-muted">
        Website requests, ordered by emergency, verified purchased rank and
        oldest first. Updates every 30 seconds.
        {isLead(user) ? " You also see staff-report and HOF tickets." : ""}
      </p>
      <nav
        className="mt-4 flex flex-wrap gap-4 text-sm"
        aria-label="Website ticket status"
      >
        <Link href="?status=open" className="text-accent underline">
          Open tickets
        </Link>
        <Link href="?status=closed" className="text-accent underline">
          Closed tickets
        </Link>
        {isOwner(user) && (
          <Link href="/staff/tickets/access" className="text-accent underline">
            Staff responsibilities
          </Link>
        )}
      </nav>
      <Suspense key={status} fallback={<LoadingData />}>
        <WebsiteQueue user={user} status={status} />
      </Suspense>
      {user.role !== "moderator" && <section className="mt-10 border-t border-border pt-6">
        <Link href="?legacy=all" className="text-sm text-text-muted underline">
          Earlier Discord tickets
        </Link>
        {filter && (
          <>
            <nav aria-label="Ticket history filter" className="mt-4 flex gap-4">
              {["all", "current", "legacy"].map((f) => (
                <a
                  key={f}
                  href={`?legacy=${f}`}
                  aria-current={f === legacy ? "page" : undefined}
                  className="underline"
                >
                  {f === "all"
                    ? "All tickets"
                    : f === "current"
                      ? "New tracking"
                      : "Legacy records"}
                </a>
              ))}
            </nav>
            <div className="mt-6">
              <Suspense key={legacy} fallback={<LoadingData />}>
                <QueueData user={user} legacy={legacy} />
              </Suspense>
            </div>
          </>
        )}
      </section>}
    </StaffShell>
  );
}
