"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue/5 via-bg-primary to-bg-primary" />
      <div className="absolute top-[-200px] left-1/3 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[150px]" />
      <div className="absolute top-[-100px] right-1/3 w-[500px] h-[500px] bg-blue/6 rounded-full blur-[150px]" />

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none mb-6 mesa-glow">
            <span className="text-blue">MESA</span>
            <span className="text-accent">RK</span>
          </h1>

          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-4">
            The #1 competitive ARK: Survival Evolved PvP server network.
          </p>
          <p className="text-sm text-text-muted/60 max-w-xl mx-auto mb-10">
            Solo &bull; Duo &bull; 3/6 Man &bull; 100x — Custom mods, active admins, competitive seasons.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/servers"
            className="px-8 py-3.5 bg-accent hover:bg-accent-secondary text-white font-bold rounded-lg transition-all glow-red text-sm tracking-wide"
          >
            PLAY NOW
          </Link>
          <Link
            href="https://discord.gg/ZXmpp6fzDe"
            target="_blank"
            className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-border text-text-primary font-semibold rounded-lg transition-all text-sm tracking-wide"
          >
            JOIN DISCORD
          </Link>
          <Link
            href="https://store.mesark.net"
            target="_blank"
            className="px-8 py-3.5 bg-blue/10 hover:bg-blue/20 border border-blue/30 text-text-primary font-bold rounded-lg transition-all glow-blue text-sm tracking-wide"
          >
            STORE
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: "106+", label: "Servers" },
            { value: "4", label: "Clusters" },
            { value: "74K+", label: "Discord Members" },
            { value: "24/7", label: "Admin Support" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-text-primary">{stat.value}</div>
              <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
    </section>
  );
}
