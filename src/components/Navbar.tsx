"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/servers", label: "Servers" },
  { href: "/maps", label: "Maps" },
  { href: "/changelog", label: "Changelog" },
  { href: "/rules", label: "Rules" },
  { href: "/settings", label: "Settings" },
  { href: "/helpful", label: "Helpful" },
  { href: "/compete", label: "Compete" },
  { href: "https://leaderboards.mesark.net", label: "Leaderboards", external: true },
];

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

export function Navbar() {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 24, () => false);
  // Menu state is keyed to the route it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (v: boolean) => setOpenOn(v ? pathname : null);

  const solid = scrolled || open;

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-border bg-bg-primary/85 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-3" aria-label="MESA home">
            <Image
              src="/favicon.png"
              alt=""
              width={34}
              height={34}
              className="transition-transform group-hover:scale-110 group-hover:-rotate-3"
            />
            <span className="font-display text-2xl font-black tracking-wide">MESA</span>
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = !link.external && (pathname === link.href || pathname.startsWith(`${link.href}/`));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  className={`relative px-3 py-2 font-display text-lg font-bold uppercase tracking-wider transition ${
                    isActive ? "text-text-primary" : "text-text-primary/60 hover:text-text-primary"
                  }`}
                >
                  {link.label}
                  {isActive && <motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-[1px] h-[2px] bg-accent" />}
                </Link>
              );
            })}
            <Link
              href="https://store.mesark.net/"
              target="_blank"
              className="clip-corner-sm ml-3 border border-blue/50 bg-blue/10 px-4 py-1.5 font-display text-lg font-extrabold uppercase tracking-wider text-text-primary transition hover:bg-blue/25"
            >
              Store
            </Link>
            <Link
              href="https://discord.gg/jkax9Nk46x"
              target="_blank"
              className="clip-corner-sm ml-2 bg-accent px-4 py-1.5 font-display text-lg font-extrabold uppercase tracking-wider text-bg-primary transition hover:bg-[#ff8c45]"
            >
              Support
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative h-10 w-10 lg:hidden"
          >
            <span className={`absolute left-2 right-2 top-[14px] h-[2px] bg-text-primary transition ${open ? "translate-y-[5px] rotate-45" : ""}`} />
            <span className={`absolute left-2 right-2 top-[24px] h-[2px] bg-text-primary transition ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-bg-primary/95 backdrop-blur-xl lg:hidden"
          >
            <div className="px-4 py-4">
              {NAV_LINKS.map((link, i) => {
                const isActive = !link.external && (pathname === link.href || pathname.startsWith(`${link.href}/`));
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i }}
                  >
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      className={`flex items-center justify-between border-b border-border/60 py-3 font-display text-3xl font-black uppercase ${
                        isActive ? "text-accent" : "text-text-primary"
                      }`}
                    >
                      {link.label}
                      <span className="text-base text-text-muted">{link.external ? "↗" : "→"}</span>
                    </Link>
                  </motion.div>
                );
              })}
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Link
                  href="https://store.mesark.net/"
                  target="_blank"
                  className="clip-corner-sm border border-blue/50 bg-blue/10 py-3 text-center font-display text-xl font-extrabold uppercase tracking-wider"
                >
                  Store
                </Link>
                <Link
                  href="https://discord.gg/jkax9Nk46x"
                  target="_blank"
                  className="clip-corner-sm bg-accent py-3 text-center font-display text-xl font-extrabold uppercase tracking-wider text-bg-primary"
                >
                  Support
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
