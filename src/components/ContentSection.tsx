"use client";

import { motion } from "framer-motion";
import { useId, useState } from "react";

/**
 * Collapsible section. Children are ALWAYS rendered into the HTML (collapsed with
 * CSS grid rows + `inert`), so search engines and the Discord bot's scraper see
 * every rule — previously closed sections were missing from the page source.
 */
export function ContentSection({ title, children, defaultOpen = false }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`clip-corner-sm border bg-bg-card/60 transition-colors ${open ? "border-accent/30" : "border-border hover:border-white/15"}`}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={id}
        className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
      >
        <h2 className="font-display text-2xl font-extrabold tracking-wide sm:text-3xl">{title}</h2>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center border transition ${
            open ? "rotate-45 border-accent bg-accent text-bg-primary" : "border-border text-text-muted group-hover:border-accent/50 group-hover:text-accent"
          }`}
          aria-hidden
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <div
        id={id}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className={`space-y-3 px-5 pb-6 text-sm leading-relaxed text-text-muted transition-opacity duration-300 sm:px-6 ${open ? "opacity-100" : "opacity-0"}`}>
            {children}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export function RuleItem({ text, warning = false }: { text: string; warning?: boolean }) {
  return (
    <div className={`flex items-start gap-3 py-1 ${warning ? "text-text-primary" : ""}`}>
      <span
        className={`mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 ${warning ? "bg-accent shadow-[0_0_8px_var(--accent)]" : "bg-text-muted/40"}`}
      />
      <span>{text}</span>
    </div>
  );
}

export function InfoCard({ title, value, accent = false }: { title: string; value: string; accent?: boolean }) {
  return (
    <div className="clip-corner-sm border border-border bg-bg-primary/50 p-4">
      <div className="hud-label !text-xs mb-1">{title}</div>
      <div className={`font-display text-2xl font-extrabold ${accent ? "text-accent" : "text-text-primary"}`}>{value}</div>
    </div>
  );
}
