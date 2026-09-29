"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { EmberField } from "@/components/fx/EmberField";
import { useHydrated } from "@/lib/useNow";
import { WipeTicker } from "@/components/home/WipeTicker";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const [playing, setPlaying] = useState(false);
  // Client-only so iOS gets a real `muted` attribute; reduced-motion keeps the poster.
  const showVideo = hydrated && !reduce;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [showVideo]);

  return (
    <section ref={ref} className="relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden">
      {/* Media */}
      <motion.div style={reduce ? undefined : { scale: mediaScale }} className="absolute inset-0 origin-center">
        <Image
          src="/art/siege.jpg"
          alt=""
          fill
          preload
          sizes="100vw"
          quality={85}
          className="object-cover object-[62%_50%]"
        />
        {showVideo && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
            onPlaying={() => setPlaying(true)}
            className={`absolute inset-0 h-full w-full object-cover object-[62%_50%] transition-opacity duration-1000 ${playing ? "opacity-100" : "opacity-0"}`}
          >
            <source src="/video/siege-720.mp4" type="video/mp4" media="(max-width: 767px)" />
            <source src="/video/siege-1080.mp4" type="video/mp4" />
          </video>
        )}
      </motion.div>

      {/* Legibility overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/75 via-bg-primary/25 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg-primary/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent" />
      <EmberField density={60} />

      {/* Copy */}
      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-10 sm:px-6 sm:pb-14"
      >
        <motion.p
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="hud-label mb-5 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-accent" />
          <span className="sm:hidden">Competitive ARK PvP</span>
          <span className="hidden sm:inline">ARK: Survival Evolved — Competitive PvP Network</span>
        </motion.p>

        <h1 className="font-display font-black text-[clamp(4.25rem,14vw,11.5rem)]">
          <span className="block overflow-hidden pb-[0.04em]">
            <motion.span
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
              className="block"
            >
              Every wipe
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.28 }}
              className="block"
            >
              is a <span className="ember-text">war.</span>
            </motion.span>
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
          className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <p className="max-w-xl text-base text-text-primary/75 sm:text-lg">
            106+ servers across Solo, Duo, 3/6 Man and 100x. Weekly wipes, custom mods,
            and real cash prizes for the tribes that finish on top.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/servers"
              className="clip-corner group inline-flex items-center justify-center gap-3 bg-accent px-8 py-4 font-display text-xl font-extrabold tracking-wider text-bg-primary transition hover:bg-[#ff8c45]"
            >
              Play now
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="https://discord.gg/mesark"
              target="_blank"
              className="clip-corner inline-flex items-center justify-center gap-3 border border-white/20 bg-white/5 px-8 py-4 font-display text-xl font-extrabold tracking-wider backdrop-blur-sm transition hover:border-blue/60 hover:bg-blue/10"
            >
              Join Discord
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative z-10"
      >
        <WipeTicker />
      </motion.div>
    </section>
  );
}
