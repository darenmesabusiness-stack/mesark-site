"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function ContentSection({ title, children, defaultOpen = false }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border border-border rounded-xl bg-bg-card/50 overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition"
      >
        <h3 className="font-bold text-lg">{title}</h3>
        <svg
          className={`w-5 h-5 text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-sm text-text-muted leading-relaxed space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function RuleItem({ text, warning = false }: { text: string; warning?: boolean }) {
  return (
    <div className={`flex gap-3 items-start py-1 ${warning ? "text-accent" : ""}`}>
      <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${warning ? "bg-accent" : "bg-text-muted/40"}`} />
      <span>{text}</span>
    </div>
  );
}

export function InfoCard({ title, value, accent = false }: { title: string; value: string; accent?: boolean }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-bg-card/30">
      <div className="text-xs text-text-muted uppercase tracking-wider mb-1">{title}</div>
      <div className={`font-bold ${accent ? "text-accent" : "text-text-primary"}`}>{value}</div>
    </div>
  );
}
