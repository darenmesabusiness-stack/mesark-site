import Link from "next/link";
import { TicketForm } from "@/components/account/TicketForm";
import { TicketAttachments } from "@/components/account/TicketAttachments";
import { AutoRefresh } from "@/components/staff/AutoRefresh";
import { TicketControls } from "@/components/staff/TicketControls";
import { supportLabel, type readSupport } from "@/lib/supportStore";

export function WebsiteTicket({
  data,
  staff = false,
  assignees = [],
}: {
  data: NonNullable<Awaited<ReturnType<typeof readSupport>>>;
  staff?: boolean;
  assignees?: { id: string; name: string }[];
}) {
  const { ticket: t, messages, uploads } = data;
  const href = `w_${t.id}`;
  return (
    <>
      <AutoRefresh seconds={30} />
      <Link
        href={staff ? "/staff/tickets" : "/support"}
        className="text-sm text-accent"
      >
        ← {staff ? "Ticket queue" : "Your tickets"}
      </Link>
      <p className="hud-label mt-6">
        {t.status} · {t.cluster === "3/6 Man" ? "3 Man" : t.cluster} · #
        {t.number}
      </p>
      <h1 className="font-display mt-2 text-4xl font-black">
        {supportLabel(t.type)}
      </h1>
      <p className="mt-3 break-words text-text-muted">
        {t.subject} · {t.opener_name}
        {t.assigned_name
          ? ` · Assigned to ${t.assigned_name}`
          : " · Awaiting staff"}
        {t.hold ? " · On hold" : ""}
      </p>
      <a
        href={`/api/support/transcript/${t.id}`}
        className="mt-4 inline-block text-sm text-accent underline"
      >
        Download transcript
      </a>
      {Object.keys(t.details).length > 0 && (
        <dl className="mt-6 grid gap-3 border border-border bg-bg-card/60 p-4">
          {Object.entries(t.details).map(([key, value]) => (
            <div key={key}>
              <dt className="text-sm uppercase text-text-muted">
                {key.replaceAll("_", " ")}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap break-words text-sm">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {staff && (
        <TicketControls key={t.status} ticket={t} assignees={assignees} />
      )}
      <div className="mt-8 grid gap-3">
        {messages.filter((m) => staff || !m.private).map((m) => (
          <article
            key={m.id}
            className={`border bg-bg-card/60 p-4 ${m.private ? "border-accent/40" : "border-border"}`}
          >
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-semibold">
                {m.author}
                {m.private ? " · Internal note" : ""}
              </p>
              <time
                className="text-sm text-text-muted"
                dateTime={new Date(m.created_at).toISOString()}
              >
                {new Date(m.created_at).toLocaleString("en-US", {
                  timeZone: "America/New_York",
                })}{" "}
                ET
              </time>
            </div>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm">
              {m.body}
            </p>
          </article>
        ))}
      </div>
      {uploads.length > 0 && (
        <section className="mt-6">
          <h2 className="font-display text-2xl font-bold">Attachments</h2>
          <ul className="mt-3 grid gap-2">
            {uploads.map((f) => (
              <li key={f.id} className="min-w-0">
                <a
                  className="break-words text-sm text-accent underline"
                  href={`/api/support/files/${f.id}`}
                >
                  {f.name} · {(f.bytes / 1048576).toFixed(1)} MB
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      {t.status === "open" ? (
        <section className="mt-8 border-t border-border pt-6">
          <TicketForm
            requestId={crypto.randomUUID()}
            channel={href}
            staff={staff}
          />
          <TicketAttachments ticket={t.id} />
        </section>
      ) : (
        <p className="mt-6 text-text-muted">
          This ticket is closed. Its conversation, files and transcript remain
          available.
        </p>
      )}
    </>
  );
}
