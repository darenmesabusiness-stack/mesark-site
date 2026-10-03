import Link from "next/link";
import type { User } from "@/lib/auth";

export function SupportGate({ user }: { user: User | null }) {
  return (
    <div>
      <p className="hud-label">MESA support</p>
      <h1 className="font-display mt-3 text-5xl font-black">Get help</h1>
      <p className="mt-4 text-text-muted">{user ? "Link your Discord to see your tickets and talk to staff here." : "Sign in with Steam and link your Discord to open tickets, see replies and continue the same conversation in either place."}</p>
      <Link href="/account" className="clip-corner-sm mt-6 inline-flex bg-accent px-5 py-2.5 font-display text-xl font-extrabold uppercase text-bg-primary">{user ? "Link Discord" : "Sign in with Steam"}</Link>
      <p className="mt-6 text-sm text-text-muted">Need help signing in? <a href="https://discord.gg/jkax9Nk46x" className="text-accent underline">Open MESA Support Discord</a>.</p>
    </div>
  );
}
