import Link from "next/link";
import Image from "next/image";

const COLUMNS = [
  {
    title: "Play",
    links: [
      { href: "/servers", label: "Server IPs" },
      { href: "/settings", label: "Settings & Wipe" },
      { href: "/helpful", label: "Helpful Guides" },
      { href: "https://store.mesark.net/", label: "Store" },
    ],
  },
  {
    title: "Rules",
    links: [{ href: "/rules", label: "Rules & Punishments" }],
  },
  {
    title: "Compete",
    links: [
      { href: "/compete", label: "Hall of Fame" },
      { href: "https://leaderboards.mesark.net", label: "Leaderboards" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "https://discord.gg/mesark", label: "Main Discord" },
      { href: "https://discord.gg/jkax9Nk46x", label: "Support Discord" },
      { href: "https://steamcommunity.com/sharedfiles/filedetails/?id=3282623549", label: "Steam Collection" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/favicon.png" alt="" width={40} height={40} />
              <span className="font-display text-3xl font-black">MESA</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-text-muted">
              Competitive ARK: Survival Evolved PvP. Fresh wipes every few days, custom mods, real rewards.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="hud-label mb-4 !text-text-primary">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        className="text-sm text-text-muted transition hover:text-accent"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div className="pointer-events-none mt-10 select-none overflow-hidden" aria-hidden>
        <div className="font-display text-stroke translate-y-[18%] text-center text-[27vw] font-black leading-none opacity-[0.07]">
          MESA ARK
        </div>
      </div>

      <div className="relative border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row sm:px-6">
          <span className="hud-label !text-[10px]">MESA ARK &copy; {new Date().getFullYear()}</span>
          <span className="hud-label !text-[10px]">Not affiliated with Studio Wildcard</span>
        </div>
      </div>
    </footer>
  );
}
