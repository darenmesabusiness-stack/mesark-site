import { Suspense } from "react";
import Link from "next/link";
import { currentUser, type User } from "@/lib/auth";
import { botGet } from "@/lib/bot";
import { type PlayerTicket } from "@/lib/playerSupport";
import { TicketForm } from "@/components/account/TicketForm";
import { SupportGate } from "@/components/account/SupportGate";

async function MyTickets({ user }: { user: User }) {
  const res = await botGet<{ tickets: PlayerTicket[] }>("/v1/my-tickets", user);
  if (!res.ok) return <p role="alert" className="border-l-2 border-accent p-4 text-sm">{res.error}</p>;
  if (!res.data.tickets.length) return <p className="text-text-muted">No tickets yet.</p>;
  return <ul className="grid gap-2">{res.data.tickets.map(t => (
    <li key={t.id}><Link href={`/support/${t.id}`} className="flex items-center justify-between gap-4 border border-border bg-bg-card/60 p-4 hover:border-accent">
      <span><span className="font-display text-xl font-bold">{t.type || "Support"}</span><span className="mt-1 block text-xs text-text-muted">{t.name} · {t.cluster === "3/6 Man" ? "3 Man" : t.cluster}</span></span>
      <span className={`font-mono text-xs uppercase ${t.status === "open" ? "text-accent" : "text-text-muted"}`}>{t.status} →</span>
    </Link></li>
  ))}</ul>;
}

export default async function SupportPage() {
  const user = await currentUser();
  if (!user?.discord_id) return <SupportGate user={user} />;
  return <>
    <p className="hud-label">MESA support</p>
    <h1 className="font-display mt-3 text-5xl font-black">Your tickets</h1>
    <p className="mt-4 text-text-muted">One conversation with staff, here or in Discord.</p>
    <div className="mt-6"><Suspense fallback={<p role="status">Loading your tickets…</p>}><MyTickets user={user} /></Suspense></div>
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="font-display mb-6 text-3xl font-black">Open a ticket</h2>
      <TicketForm requestId={crypto.randomUUID()} />
    </section>
    <p className="mt-8 text-sm text-text-muted">Hall of Fame and creator applications: <a className="text-accent underline" href="https://discord.gg/jkax9Nk46x">continue in Discord</a>.</p>
  </>;
}
