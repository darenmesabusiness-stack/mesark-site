"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShieldCheckIcon,
  EyeIcon,
  TrophyIcon,
  ChartBarIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";
import { SectionHeading } from "@/components/home/SectionHeading";
import { LoopVideo } from "@/components/fx/LoopVideo";

const TILES: { title: string; desc: string; icon: ComponentType<SVGProps<SVGSVGElement>>; span: string }[] = [
  { title: "Anti-Cheat", desc: "Multi-layer detection: behavioral analysis, mesh protection, HWID tracking.", icon: EyeIcon, span: "lg:col-span-2" },
  { title: "Active Admins", desc: "24/7 support team monitoring servers and handling tickets.", icon: ShieldCheckIcon, span: "lg:col-span-2" },
  { title: "Competitive Seasons", desc: "Hall of Fame system with real cash prizes up to $500+ per season.", icon: TrophyIcon, span: "lg:col-span-2" },
  { title: "Custom Leaderboards", desc: "Live tribe scores, kill tracking, and seasonal rankings.", icon: ChartBarIcon, span: "lg:col-span-3" },
  { title: "Balanced PvP", desc: "Per-dino damage/resistance tuning, wipe delays, ORP systems.", icon: ScaleIcon, span: "lg:col-span-3" },
];

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export function WhyMesa() {
  return (
    <section className="relative border-y border-border bg-bg-secondary py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading kicker="Why MESA" lead="Built for" accent="PvP.">
          Not a vanilla box with a Discord bolted on. Custom mods, real enforcement, and a
          competitive ladder that pays.
        </SectionHeading>

        <div className="mt-14 grid gap-3 lg:grid-cols-6">
          {/* Feature tile with art */}
          <motion.div
            {...reveal}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="clip-corner group relative min-h-[340px] overflow-hidden bg-bg-card lg:col-span-6 lg:min-h-[420px]"
          >
            <Image
              src="/art/rex.jpg"
              alt="Armored tyrannosaurus overlooking a besieged fortress"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-[70%_40%] transition duration-1000 group-hover:scale-[1.04]"
            />
            <LoopVideo src="/video/rex-720.mp4" className="object-[70%_40%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card/70 to-transparent" />
            <div className="relative flex h-full max-w-lg flex-col justify-end p-6 sm:p-10">
              <p className="hud-label !text-accent">Custom mods</p>
              <h3 className="font-display mt-2 text-5xl font-black sm:text-6xl">Mesa City & more</h3>
              <p className="mt-3 text-text-primary/75">
                Mesa City, custom cloning, cryo breeders, tool gun, teleporters, and more.
              </p>
            </div>
          </motion.div>

          {TILES.map((t, i) => (
            <motion.div
              key={t.title}
              {...reveal}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 * i }}
              className={`clip-corner-sm group relative overflow-hidden border border-border bg-bg-card/60 p-6 transition hover:border-accent/40 ${t.span}`}
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/0 blur-2xl transition duration-500 group-hover:bg-accent/15" />
              <t.icon className="h-7 w-7 text-accent" />
              <h3 className="font-display mt-5 text-3xl font-extrabold">{t.title}</h3>
              <p className="mt-2 text-sm text-text-muted">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
