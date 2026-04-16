"use client";

import { motion } from "framer-motion";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="relative pt-28 pb-16 overflow-hidden noise">
      <div className="absolute inset-0 bg-gradient-to-b from-blue/5 to-transparent" />
      <div className="absolute top-0 left-1/3 w-[400px] h-[250px] bg-accent/6 rounded-full blur-[100px]" />
      <div className="absolute top-0 right-1/3 w-[300px] h-[200px] bg-blue/5 rounded-full blur-[100px]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-4xl mx-auto px-4 text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
          {title}
        </h1>
        {subtitle && <p className="text-text-muted max-w-xl mx-auto">{subtitle}</p>}
        <div className="mt-8 h-px animated-gradient" />
      </motion.div>
    </div>
  );
}
