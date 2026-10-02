import Link from "next/link";
import type { User } from "@/lib/auth";
import { ROLE_LABEL, canClaimOwner, isLead, isOwner } from "@/lib/staff";

const NAV: { href: string; label: string; access: "staff" | "lead" | "owner" }[] = [
  { href: "/staff", label: "Overview", access: "staff" },
  { href: "/staff/tickets", label: "Tickets", access: "staff" },
  { href: "/staff/players", label: "Players", access: "staff" },
  { href: "/staff/support", label: "Support", access: "lead" },
  { href: "/staff/changelog", label: "Change log", access: "lead" },
  { href: "/staff/caves", label: "Caves", access: "lead" },
  { href: "/staff/team", label: "Team", access: "lead" },
  { href: "/staff/finance", label: "Finance", access: "owner" },
];

/** Frame for every /staff page: who's signed in, section nav, then the page. */
export function StaffShell({ user, active, title, kicker, children }: { user: User; active: string; title: string; kicker?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:pt-32">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <p className="hud-label flex items-center gap-3">
          <span className="h-px w-8 bg-accent" />
          MESA staff
        </p>
        <p className="font-mono text-xs text-text-muted">
          {user.persona ?? "Signed in"} · <span className="uppercase text-accent">{ROLE_LABEL[user.role]}</span>
        </p>
      </div>
      <nav className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]" aria-label="Staff sections">
        {NAV.filter((n) => n.access === "staff" || (n.access === "lead" ? isLead(user) : isOwner(user))).map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active === n.href ? "page" : undefined}
            className={`shrink-0 border px-3 py-1.5 font-display text-base font-extrabold uppercase tracking-wide transition ${
              active === n.href ? "border-accent bg-accent text-bg-primary" : "border-border bg-bg-card/60 text-text-primary/80 hover:border-accent/50"
            }`}
          >
            {n.label}
          </Link>
        ))}
      </nav>
      {kicker && <p className="hud-label mt-10 !text-accent">{kicker}</p>}
      <h1 className={`font-display text-[clamp(2.75rem,8vw,5rem)] font-black ${kicker ? "mt-1" : "mt-10"}`}>{title}</h1>
      <div className="mt-8">{children}</div>
    </div>
  );
}

/** What a non-staff visitor sees on /staff: sign in, claim owner access (first setup only), or no access. */
export async function StaffGate({ user, error }: { user: User | null; error?: string }) {
  const claim = user ? await canClaimOwner(user).catch(() => false) : false;
  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-32 sm:pt-40">
      <p className="hud-label mb-4 flex items-center gap-3">
        <span className="h-px w-8 bg-accent" />
        MESA staff
      </p>
      <h1 className="font-display text-[clamp(3rem,10vw,5.5rem)] font-black">Staff only</h1>
      {error && <p className="mt-6 border-l-2 border-accent bg-bg-card/80 px-4 py-3 text-sm">{error}</p>}
      {!user ? (
        <>
          <p className="mt-4 text-lg text-text-primary/75">Sign in with the Steam account that was given staff access.</p>
          <a
            href="/api/auth/steam"
            className="clip-corner-sm mt-8 inline-flex bg-accent px-6 py-3 font-display text-2xl font-extrabold uppercase tracking-wide text-bg-primary transition hover:bg-[#ff8c45]"
          >
            Sign in through Steam
          </a>
        </>
      ) : claim ? (
        <>
          <p className="mt-4 text-lg text-text-primary/75">
            Nobody runs the staff section yet, and yours is the first account on mesark.net. Claim owner access to run it.
          </p>
          <form action="/api/staff/claim" method="post" className="mt-8">
            <button type="submit" className="clip-corner-sm bg-accent px-6 py-3 font-display text-2xl font-extrabold uppercase tracking-wide text-bg-primary transition hover:bg-[#ff8c45]">
              Claim owner access
            </button>
          </form>
        </>
      ) : (
        <p className="mt-4 text-lg text-text-primary/75">
          You&apos;re signed in as {user.persona ?? "a player"}, which doesn&apos;t have staff access. Ask the owner or a lead admin to add you on the Team page.
        </p>
      )}
    </div>
  );
}
