import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Play</h4>
            <div className="space-y-2">
              <Link href="/servers" className="block text-sm text-text-muted hover:text-accent transition">Server IPs</Link>
              <Link href="/settings" className="block text-sm text-text-muted hover:text-accent transition">Settings</Link>
              <Link href="/wipe" className="block text-sm text-text-muted hover:text-accent transition">Wipe Schedule</Link>
              <Link href="https://store.mesark.net" className="block text-sm text-text-muted hover:text-accent transition">Store</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Rules</h4>
            <div className="space-y-2">
              <Link href="/rules" className="block text-sm text-text-muted hover:text-accent transition">Server Rules</Link>
              <Link href="/punishments" className="block text-sm text-text-muted hover:text-accent transition">Punishments</Link>
              <Link href="/unban" className="block text-sm text-text-muted hover:text-accent transition">Unban Policy</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Compete</h4>
            <div className="space-y-2">
              <Link href="/hof" className="block text-sm text-text-muted hover:text-accent transition">Hall of Fame</Link>
              <Link href="https://leaderboards.mesark.fun" className="block text-sm text-text-muted hover:text-accent transition">Leaderboards</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Community</h4>
            <div className="space-y-2">
              <Link href="https://discord.gg/ZXmpp6fzDe" className="block text-sm text-text-muted hover:text-accent transition">Support Discord</Link>
              <Link href="https://steamcommunity.com/sharedfiles/filedetails/?id=3282623549" className="block text-sm text-text-muted hover:text-accent transition">Steam Collection</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="https://cdn.discordapp.com/icons/1072737953895415858/44f5c6b6775e45774484da23a2b918c6.png?size=64"
              alt="MESA"
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-text-muted">MESA ARK &copy; {new Date().getFullYear()}</span>
          </div>
          <span className="text-xs text-text-muted/50">Not affiliated with Studio Wildcard</span>
        </div>
      </div>
    </footer>
  );
}
