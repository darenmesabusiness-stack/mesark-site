"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/servers", label: "Servers" },
  { href: "/rules", label: "Rules" },
  { href: "/settings", label: "Settings" },
  { href: "/compete", label: "Compete" },
  { href: "https://leaderboards.mesark.net", label: "Leaderboards", external: true },
  { href: "https://store.mesark.net", label: "Store", external: true },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="https://cdn.discordapp.com/icons/1072737953895415858/44f5c6b6775e45774484da23a2b918c6.png?size=128"
              alt="MESA"
              className="w-9 h-9 rounded-lg group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                className={
                  link.label === "Store"
                    ? "px-4 py-2 text-sm font-semibold bg-blue/80 hover:bg-blue text-white rounded-lg transition-all glow-blue"
                    : "px-3 py-2 text-sm text-text-muted hover:text-text-primary hover:bg-white/5 rounded-lg transition-all"
                }
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://discord.gg/ZXmpp6fzDe"
              target="_blank"
              className="ml-2 px-4 py-2 text-sm font-semibold bg-accent hover:bg-accent-secondary text-white rounded-lg transition-all glow-red"
            >
              Support
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-text-muted hover:text-text-primary"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
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
            className="lg:hidden border-t border-border bg-bg-secondary/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-sm text-text-muted hover:text-text-primary hover:bg-white/5 rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="https://discord.gg/ZXmpp6fzDe"
                target="_blank"
                className="block px-3 py-2 text-sm font-semibold text-accent"
              >
                Support Discord
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
