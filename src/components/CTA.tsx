"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { wipeSchedules, getNextWipe } from "@/data/wipes";
import { EmberField } from "@/components/fx/EmberField";
import { useNow } from "@/lib/useNow";

const pad = (n: number) => n.toString().padStart(2, "0");

function useSoonestWipe() {
  const now = useNow();
  if (!now) return null;
  const next = wipeSchedules
    .map((s) => ({ cluster: s.cluster, at: getNextWipe(s, now) }))
    .sort((a, b) => a.at.getTime() - b.at.getTime())[0];
  const sec = Math.max(0, Math.floor((next.at.getTime() - now.getTime()) / 1000));
  return {
    cluster: next.cluster,
    d: Math.floor(sec / 86400),
    h: Math.floor((sec % 86400) / 3600),
    m: Math.floor((sec % 3600) / 60),
    s: sec % 60,
  };
}

export function CTA() {
  const w = useSoonestWipe();

  return (
    <section className="relative overflow-hidden py-28 sm:py-40">
      <Image src="/art/ashfield.jpg" alt="" fill sizes="100vw" className="object-cover object-bottom" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary/40 to-bg-primary" />
      <EmberField density={40} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-5xl px-4 text-center"
      >
        <p className="hud-label flex items-center justify-center gap-2">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-accent" />
          {w ? `${w.cluster} wipes in` : "Next wipe in"}
        </p>
        <div className="font-display mt-4 text-[clamp(3.5rem,13vw,10rem)] font-black tabular-nums" suppressHydrationWarning>
          {w ? (
            <>
              {w.d > 0 && <span className="ember-text">{w.d}d </span>}
              {pad(w.h)}
              <span className="text-accent">:</span>
              {pad(w.m)}
              <span className="text-accent">:</span>
              {pad(w.s)}
            </>
          ) : (
            <span className="opacity-30">--:--:--</span>
          )}
        </div>
        <p className="mx-auto mt-6 max-w-xl text-lg text-text-primary/75">
          Fresh map, fresh tribes, same rules for everyone. Be online when it drops.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/servers"
            className="clip-corner inline-flex items-center justify-center gap-3 bg-accent px-10 py-4 font-display text-xl font-extrabold tracking-wider text-bg-primary transition hover:bg-[#ff8c45]"
          >
            Get server IPs →
          </Link>
          <Link
            href="https://store.mesark.net/"
            target="_blank"
            className="clip-corner inline-flex items-center justify-center gap-3 border border-white/20 bg-white/5 px-10 py-4 font-display text-xl font-extrabold tracking-wider transition hover:border-blue/60 hover:bg-blue/10"
          >
            Visit store
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
