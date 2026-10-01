"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { hofTiers } from "@/data/hof";
import { SectionHeading } from "@/components/home/SectionHeading";

const MAX_WINS = hofTiers[hofTiers.length - 1].wins;

export function HallOfFame() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0">
        <Image
          src="/art/ark/hall.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[30%_50%] opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-bg-primary via-bg-primary/85 to-bg-primary/20" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg-primary to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg-primary to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div className="hidden lg:block" />
        <div>
          <SectionHeading kicker="Hall of Fame" lead="Win wipes." accent="Get paid.">
            Seven tiers from your first win to Prestige. Real PayPal and store credit,
            not a Discord role.
          </SectionHeading>

          <ol className="mt-10 space-y-2">
            {hofTiers.map((t, i) => (
              <motion.li
                key={t.name}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
                className="clip-corner-sm relative grid grid-cols-[4.5rem_1fr] items-center gap-4 overflow-hidden border border-white/5 bg-bg-primary/70 px-4 py-3 backdrop-blur-sm sm:grid-cols-[5rem_8rem_1fr]"
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: t.wins / MAX_WINS }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.06 }}
                  className="absolute inset-y-0 left-0 w-full origin-left opacity-[0.08]"
                  style={{ background: t.hex }}
                />
                <div className="relative font-mono text-xs text-text-muted">
                  <span className="font-display text-3xl font-black text-text-primary">{t.wins}</span> win{t.wins > 1 ? "s" : ""}
                </div>
                <div className={`relative font-display text-2xl font-black ${t.color}`}>{t.name}</div>
                <div className="relative col-span-2 text-sm text-text-primary/80 sm:col-span-1 sm:text-right">{t.reward}</div>
              </motion.li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/compete"
              className="clip-corner inline-flex items-center justify-center gap-3 bg-accent px-7 py-3.5 font-display text-lg font-extrabold tracking-wider text-bg-primary transition hover:bg-[#ff8c45]"
            >
              How to qualify →
            </Link>
            <Link
              href="https://leaderboards.mesark.net"
              target="_blank"
              className="clip-corner inline-flex items-center justify-center gap-3 border border-white/20 bg-white/5 px-7 py-3.5 font-display text-lg font-extrabold tracking-wider transition hover:border-blue/60 hover:bg-blue/10"
            >
              Live leaderboards
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
