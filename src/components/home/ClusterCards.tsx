"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { clusterProfiles, serverCount, wipeDay } from "@/data/clusters";
import { SectionHeading } from "@/components/home/SectionHeading";

export function ClusterCards() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading kicker="Four clusters" lead="Pick your" accent="war.">
            Every cluster wipes weekly at 1:00 PM EST. Same mods, same rules, different pressure.
          </SectionHeading>
          <Link href="/settings" className="hud-label !text-text-primary hover:!text-accent transition shrink-0">
            Compare rates →
          </Link>
        </div>
      </div>

      {/* Mobile: swipeable rail. Desktop: 4-up grid. */}
      <div className="mt-12 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:scroll-px-6 sm:px-6 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-4 lg:overflow-visible lg:pb-0 [scrollbar-width:none]">
        {clusterProfiles.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-auto"
          >
            <Link
              href="/servers"
              className="clip-corner group relative block aspect-[4/5] overflow-hidden bg-bg-card"
            >
              <Image
                src={c.art}
                alt={`${c.name} cluster key art`}
                fill
                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 25vw"
                className={`object-cover ${c.focus} transition duration-700 ease-out group-hover:scale-[1.06]`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/30 to-transparent" />
              <div className="absolute inset-0 bg-accent/0 mix-blend-overlay transition duration-500 group-hover:bg-accent/15" />

              <div className="absolute left-4 top-4 flex items-center gap-2">
                <span className="hud-label !text-[10px] bg-bg-primary/70 px-2 py-1 backdrop-blur">
                  {serverCount(c.key)} servers
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="hud-label !text-accent !text-[10px]">{wipeDay(c.key)}</div>
                <h3 className="font-display mt-1 text-6xl font-black">{c.name}</h3>
                <p className="mt-2 text-sm text-text-primary/70">{c.tagline}</p>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="hud-label !text-[10px]">{c.tribe}</span>
                  <span className="font-display text-lg font-extrabold tracking-wider text-accent transition-transform group-hover:translate-x-1">
                    Get IPs →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
