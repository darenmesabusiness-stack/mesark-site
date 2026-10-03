import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { botGet } from "@/lib/bot";
import type { TicketConversation } from "@/lib/playerSupport";
import { TicketForm } from "@/components/account/TicketForm";
import { SupportGate } from "@/components/account/SupportGate";
import { AutoRefresh } from "@/components/staff/AutoRefresh";
import { nativeId, readSupport } from "@/lib/supportStore";
import { WebsiteTicket } from "@/components/account/WebsiteTicket";

export const metadata = { title: "Your ticket" };
const stamp = (at: number) =>
  new Date(at * 1000).toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }) + " ET";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^\d{1,20}$/.test(id) && !nativeId(id)) notFound();
  const user = await currentUser();
  if (!user?.discord_id) return <SupportGate user={user} />;
  if (nativeId(id)) {
    const d = await readSupport(user, id.slice(2));
    if (!d || d.ticket.opener !== user.steam_id) notFound();
    return <WebsiteTicket data={d} />;
  }
  const res = await botGet<TicketConversation>(`/v1/my-tickets/${id}`, user);
  if (!res.ok)
    return (
      <>
        <Link href="/support" className="text-accent">
          ← Your tickets
        </Link>
        <p role="alert" className="mt-6 border-l-2 border-accent p-4">
          {res.error}
        </p>
      </>
    );
  const d = res.data;
  return (
    <>
      <AutoRefresh seconds={30} />
      <Link href="/support" className="text-sm text-accent">
        ← Your tickets
      </Link>
      <p className="hud-label mt-6">
        {d.ticket.status} ·{" "}
        {d.ticket.cluster === "3/6 Man" ? "3 Man" : d.ticket.cluster}
      </p>
      <h1 className="font-display mt-2 text-5xl font-black">
        {d.ticket.type || "Support"}
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        {d.ticket.name} · replies refresh every 30 seconds
      </p>
      <a
        className="mt-4 inline-block text-sm text-accent underline"
        href={`https://discord.com/channels/1305671024833990706/${id}`}
        target="_blank"
        rel="noreferrer"
      >
        Open in Discord ↗
      </a>
      <div className="mt-8 grid gap-3">
        {d.messages.map((m) => (
          <article
            key={m.id}
            className="border border-border bg-bg-card/60 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{m.author}</p>
              <time
                className="text-xs text-text-muted"
                dateTime={new Date(m.at * 1000).toISOString()}
              >
                {stamp(m.at)}
              </time>
            </div>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm text-text-primary/85">
              {m.body}
            </p>
            {m.attachments.map((a) =>
              /^https:\/\/(cdn|media)\.discordapp\.(com|net)\//.test(a.url) ? (
                <a
                  key={a.url}
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block break-all text-sm text-accent underline"
                >
                  {a.name} ↗
                </a>
              ) : null,
            )}
          </article>
        ))}
      </div>
      {d.archived ? (
        <p className="mt-6 text-text-muted">
          This Discord channel has been archived. Check Discord for its closure
          transcript.
        </p>
      ) : d.ticket.status === "open" ? (
        <section className="mt-8 border-t border-border pt-6">
          <TicketForm requestId={crypto.randomUUID()} channel={id} />
        </section>
      ) : (
        <p className="mt-6 text-text-muted">
          This ticket is closed.{" "}
          <Link href="/support" className="text-accent">
            Open a new ticket
          </Link>{" "}
          if you need more help.
        </p>
      )}
    </>
  );
}
