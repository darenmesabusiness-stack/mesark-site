"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CLUSTERS = [
  {
    name: "Solo",
    desc: "1-man tribes. Pure skill, no teammates to rely on.",
    wipe: "Every Monday",
    color: "from-[#e87b35]/20 to-transparent",
  },
  {
    name: "Duo",
    desc: "2-man tribes. Tight coordination, high stakes.",
    wipe: "Every Friday",
    color: "from-[#2d7aef]/20 to-transparent",
  },
  {
    name: "3/6 Man",
    desc: "Rotating tribe size. Competitive seasons with HOF rewards.",
    wipe: "Every Saturday",
    color: "from-[#e87b35]/20 to-transparent",
  },
  {
    name: "100x 2/6 Man",
    desc: "Fast-paced chaos. Instant taming, 100x rates.",
    wipe: "Every Wednesday",
    color: "from-[#2d7aef]/20 to-transparent",
  },
];

const FEATURES = [
  { title: "Custom Mods", desc: "Mesa City, custom cloning, cryo breeders, tool gun, teleporters, and more." },
  { title: "Active Admins", desc: "24/7 support team monitoring servers and handling tickets." },
  { title: "Anti-Cheat", desc: "Multi-layer detection: behavioral analysis, mesh protection, HWID tracking." },
  { title: "Competitive Seasons", desc: "Hall of Fame system with real cash prizes up to $500+ per season." },
  { title: "Custom Leaderboards", desc: "Live tribe scores, kill tracking, and seasonal rankings." },
  { title: "Balanced PvP", desc: "Per-dino damage/resistance tuning, wipe delays, ORP systems." },
];

export function Features() {
  return (
    <section className="relative py-24 bg-bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Clusters */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-3">
            CHOOSE YOUR <span className="text-accent">CLUSTER</span>
          </h2>
          <p className="text-text-muted text-center mb-12 text-sm">All clusters wipe at 1:00 PM EST</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CLUSTERS.map((cluster, i) => (
              <motion.div
                key={cluster.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href="/servers" className="block group">
                  <div className={`relative p-6 rounded-xl border border-border bg-gradient-to-b ${cluster.color} hover:border-accent/50 transition-all`}>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition">{cluster.name}</h3>
                    <p className="text-sm text-text-muted mb-4">{cluster.desc}</p>
                    <div className="text-xs text-accent font-semibold uppercase tracking-wider">{cluster.wipe}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-12">
            WHY <span className="text-accent">MESA</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl border border-border bg-bg-card/50 hover:border-accent/30 transition-all"
              >
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-text-muted">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
