"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/servers", label: "Servers" },
];

type NavLink = { href: string; label: string; external?: boolean };
const NAV_GROUPS: { label: string; links: NavLink[] }[] = [
  { label: "Info", links: [
    { href: "/rules", label: "Rules" },
    { href: "/helpful", label: "Common Issues" },
    { href: "/settings", label: "Settings" },
    { href: "/maps", label: "Cave maps" },
    { href: "/changelog", label: "Changelog" },
  ] },
  { label: "Community", links: [
    { href: "/live", label: "Mesa Map" },
    { href: "/hall-of-fame", label: "Hall of Fame" },
    { href: "/leaderboards", label: "Leaderboards" },
    { href: "https://discord.gg/mesark", label: "Join Discord", external: true },
  ] },
];

function NavGroup({
  group,
  pathname,
}: {
  group: (typeof NAV_GROUPS)[number];
  pathname: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !ref.current?.contains(event.target) &&
        ref.current
      )
        ref.current.open = false;
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);
  const active = group.links.some(
    (link) =>
      !link.external &&
      (pathname === link.href || pathname.startsWith(`${link.href}/`)),
  );
  return (
    <details
      ref={ref}
      name="desktop-navigation"
      className="group relative"
      onKeyDown={(event) => {
        if (event.key === "Escape" && ref.current) {
          ref.current.open = false;
          ref.current.querySelector("summary")?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          event.currentTarget.open = false;
      }}
    >
      <summary
        className={`cursor-pointer list-none px-3 py-2 font-display text-lg font-bold uppercase tracking-wider transition hover:text-text-primary [&::-webkit-details-marker]:hidden ${active ? "text-text-primary" : "text-text-primary/60"}`}
      >
        {group.label}{" "}
        <span aria-hidden className="ml-1 text-xs text-accent">
          ⌄
        </span>
      </summary>
      <div className="absolute left-0 top-full mt-2 w-56 border border-border bg-bg-primary p-2 shadow-xl">
        {group.links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            onClick={() => {
              if (ref.current) ref.current.open = false;
            }}
            aria-current={pathname === link.href ? "page" : undefined}
            className="block px-3 py-3 text-sm text-text-primary/80 transition hover:bg-accent/10 hover:text-accent"
          >
            {link.label}
            {link.external && (
              <span aria-hidden className="float-right">
                ↗
              </span>
            )}
          </Link>
        ))}
      </div>
    </details>
  );
}

type Me = {
  enabled: boolean;
  user: { persona: string | null; avatar: string | null } | null;
};

/** Sign-in state for the nav, fetched after load so every page can stay static. */
function useMe() {
  const [me, setMe] = useState<Me | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/api/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => live && setMe(d))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return me;
}

function AccountButton({ me }: { me: Me }) {
  const label = me.user
    ? `Your account (${me.user.persona ?? "signed in"})`
    : "Sign in through Steam";
  return (
    <Link
      href="/account"
      aria-label={label}
      title={label}
      className="ml-3 flex h-9 w-9 items-center justify-center text-text-primary/70 transition hover:text-accent"
    >
      {me.user?.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={me.user.avatar}
          alt=""
          width={30}
          height={30}
          className="h-[30px] w-[30px] border border-border"
        />
      ) : (
        <UserCircleIcon className="h-7 w-7" />
      )}
    </Link>
  );
}

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

export function Navbar() {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 24,
    () => false,
  );
  // Menu state is keyed to the route it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (v: boolean) => setOpenOn(v ? pathname : null);

  const solid = scrolled || open;
  const me = useMe();

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-border bg-bg-primary/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="MESA home"
          >
            <Image
              src="/favicon.png"
              alt=""
              width={34}
              height={34}
              className="transition-transform group-hover:scale-110 group-hover:-rotate-3"
            />
            <span className="font-display text-2xl font-black tracking-wide">
              MESA
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link: NavLink) => {
              const isActive =
                !link.external &&
                (pathname === link.href ||
                  pathname.startsWith(`${link.href}/`));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative px-3 py-2 font-display text-lg font-bold uppercase tracking-wider transition ${
                    isActive
                      ? "text-text-primary"
                      : "text-text-primary/60 hover:text-text-primary"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-[1px] h-[2px] bg-accent"
                    />
                  )}
                </Link>
              );
            })}
            {NAV_GROUPS.map((group) => (
              <NavGroup
                key={`${pathname}:${group.label}`}
                group={group}
                pathname={pathname}
              />
            ))}
            {me?.enabled && <AccountButton me={me} />}
            <Link
              href="https://store.mesark.net/"
              target="_blank"
              className="clip-corner-sm ml-2 border border-blue/50 bg-blue/10 px-4 py-1.5 font-display text-lg font-extrabold uppercase tracking-wider text-text-primary transition hover:bg-blue/25"
            >
              Store
            </Link>
            <Link
              href="/support"
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
            aria-controls="mobile-navigation"
            className="relative h-10 w-10 lg:hidden"
          >
            <span
              className={`absolute left-2 right-2 top-[14px] h-[2px] bg-text-primary transition ${open ? "translate-y-[5px] rotate-45" : ""}`}
            />
            <span
              className={`absolute left-2 right-2 top-[24px] h-[2px] bg-text-primary transition ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-bg-primary/95 backdrop-blur-xl lg:hidden"
          >
            <div className="px-4 py-4">
              {NAV_LINKS.map((link: NavLink, i) => {
                const isActive =
                  !link.external &&
                  (pathname === link.href ||
                    pathname.startsWith(`${link.href}/`));
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
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center justify-between border-b border-border/60 py-3 font-display text-3xl font-black uppercase ${
                        isActive ? "text-accent" : "text-text-primary"
                      }`}
                    >
                      {link.label}
                      <span className="text-base text-text-muted">
                        {link.external ? "↗" : "→"}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
              <div className="grid grid-cols-2 gap-4 border-b border-border/60 py-4">
                {NAV_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="hud-label mb-2 text-accent">{group.label}</p>
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        onClick={() => setOpen(false)}
                        aria-current={
                          pathname === link.href ? "page" : undefined
                        }
                        className={`block py-2 text-sm hover:text-accent ${pathname === link.href ? "text-accent" : "text-text-primary/80"}`}
                      >
                        {link.label}
                        {link.external && <span aria-hidden> ↗</span>}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
              {me?.enabled && (
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-border/60 py-3 font-display text-3xl font-black uppercase text-text-primary"
                >
                  {me.user ? "Your account" : "Sign in"}
                  <span className="text-base text-text-muted">→</span>
                </Link>
              )}
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Link
                  href="https://store.mesark.net/"
                  target="_blank"
                  className="clip-corner-sm border border-blue/50 bg-blue/10 py-3 text-center font-display text-xl font-extrabold uppercase tracking-wider"
                >
                  Store
                </Link>
                <Link
                  href="/support"
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
