import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { canClaimOwner, isStaff } from "@/lib/staff";

export const metadata = pageMeta({
  title: "Your Account",
  description: "Sign in to MESARK with Steam.",
  noindex: true,
});

const ERRORS: Record<string, string> = {
  off: "Sign-in isn't switched on yet. Check back soon.",
  expired: "That sign-in took too long or was opened in another tab. Try again.",
  steam: "Steam didn't confirm the sign-in. Try again.",
  server: "Something went wrong on our side while signing you in. Try again in a minute.",
  confirm: "Tick the box to confirm before deleting your account.",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; welcome?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
  const enabled = dbConfigured();
  const user = enabled ? await currentUser() : null;
  const claim = user && !isStaff(user) ? await canClaimOwner(user).catch(() => false) : false;
  const notice = sp.error ? ERRORS[sp.error] : sp.deleted ? "Your account and sign-ins are deleted." : null;

  return (
    <div className="relative mx-auto max-w-3xl px-4 pb-24 pt-32 sm:pt-40">
      <div className="absolute left-1/4 top-0 -z-10 h-[300px] w-[500px] rounded-full bg-accent/10 blur-[120px]" />
      <p className="hud-label mb-4 flex items-center gap-3">
        <span className="h-px w-8 bg-accent" />
        Your account
      </p>

      {notice && <p className="mb-6 border-l-2 border-accent bg-bg-card/80 px-4 py-3 text-sm">{notice}</p>}

      {!user ? (
        <>
          <h1 className="font-display text-[clamp(3rem,10vw,6rem)] font-black">Sign in</h1>
          <p className="mt-4 max-w-xl text-lg text-text-primary/75">
            Sign in with your Steam account to claim your player profile and, soon, open support tickets from here.
          </p>
          {enabled ? (
            <a
              href="/api/auth/steam"
              className="clip-corner-sm mt-8 inline-flex items-center gap-3 bg-accent px-6 py-3 font-display text-2xl font-extrabold uppercase tracking-wide text-bg-primary transition hover:bg-[#ff8c45]"
            >
              Sign in through Steam
            </a>
          ) : (
            <p className="mt-8 inline-block border border-border bg-bg-card/60 px-5 py-3 text-sm text-text-muted">Sign-in opens soon.</p>
          )}
          <ul className="mt-10 grid gap-3 border-t border-border pt-6 text-sm text-text-muted">
            <li>You log in on Steam&apos;s own site. MESA never sees your password.</li>
            <li>We receive your Steam ID, public Steam name and avatar, and nothing else.</li>
            <li>
              Your Steam ID is never shown publicly. See the{" "}
              <Link href="/privacy" className="text-text-primary underline decoration-accent/50 underline-offset-4 hover:text-accent">
                privacy policy
              </Link>
              .
            </li>
          </ul>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-5">
            {user.avatar && (
              <Image src={user.avatar} alt="" width={88} height={88} className="clip-corner-sm h-[88px] w-[88px] border border-border" unoptimized />
            )}
            <div className="min-w-0">
              <h1 className="font-display break-words text-[clamp(2.75rem,9vw,5rem)] font-black">{user.persona ?? "Survivor"}</h1>
              <p className="mt-1 font-mono text-xs text-text-muted">
                Steam ID {user.steam_id} · only you can see this
              </p>
            </div>
          </div>
          {sp.welcome && <p className="mt-6 text-text-primary/80">You&apos;re signed in. Welcome to MESA.</p>}
          {claim && (
            <Link
              href="/staff"
              className="clip-corner-sm mt-6 inline-flex bg-accent px-5 py-2.5 font-display text-xl font-extrabold uppercase tracking-wide text-bg-primary transition hover:bg-[#ff8c45]"
            >
              Set up staff access →
            </Link>
          )}
          {isStaff(user) && (
            <Link
              href="/staff"
              className="clip-corner-sm mt-6 inline-flex bg-accent px-5 py-2.5 font-display text-xl font-extrabold uppercase tracking-wide text-bg-primary transition hover:bg-[#ff8c45]"
            >
              Staff section →
            </Link>
          )}

          <section className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-3">
            {[
              ["Claim your profile", "Link your in-game stats to this account."],
              ["Link Discord", "Send the bot a one-time code so ticket replies reach you."],
              ["Tickets", "Open and follow support tickets here."],
            ].map(([title, text]) => (
              <div key={title} className="bg-bg-card p-5">
                <p className="hud-label !text-[10px]">Coming next</p>
                <h2 className="font-display mt-1 text-2xl font-black">{title}</h2>
                <p className="mt-2 text-sm text-text-muted">{text}</p>
              </div>
            ))}
          </section>

          <div className="mt-10 flex flex-wrap items-start gap-6 border-t border-border pt-6">
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="border border-border px-4 py-2 font-display text-lg font-extrabold uppercase tracking-wide transition hover:border-accent hover:text-accent">
                Sign out
              </button>
            </form>
            <form action="/api/auth/delete" method="post" className="grid gap-2">
              <label className="flex items-center gap-2 text-sm text-text-muted">
                <input type="checkbox" name="confirm" value="yes" className="accent-[var(--accent)]" />
                Delete my MESA account and sign-ins
              </label>
              <button type="submit" className="justify-self-start text-sm text-text-muted underline underline-offset-4 transition hover:text-accent">
                Delete account
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
