"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-blue/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[300px] bg-accent/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[300px] bg-blue/6 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto px-4 text-center"
      >
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6">
          READY TO <span className="text-accent glow-text">DOMINATE</span>?
        </h2>
        <p className="text-text-muted mb-10 max-w-lg mx-auto">
          Join thousands of players competing on MESA. Find your server, build your base, raid your enemies.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/servers"
            className="px-10 py-4 bg-accent hover:bg-accent-secondary text-white font-bold rounded-lg transition-all glow-red text-sm tracking-widest"
          >
            VIEW SERVERS
          </Link>
          <Link
            href="https://mesark.tip4serv.com/"
            target="_blank"
            className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-border text-text-primary font-semibold rounded-lg transition-all text-sm tracking-wide"
          >
            VISIT STORE
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
