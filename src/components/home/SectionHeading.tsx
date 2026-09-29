"use client";

import { motion } from "framer-motion";

/** Big two-tone display heading with a HUD kicker, used by every home section. */
export function SectionHeading({
  kicker,
  lead,
  accent,
  children,
  align = "left",
}: {
  kicker: string;
  lead: string;
  accent: string;
  children?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}
    >
      <p className={`hud-label mb-4 flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
        <span className="h-px w-8 bg-accent" />
        {kicker}
      </p>
      <h2 className="font-display text-[clamp(3rem,8vw,6.5rem)] font-black">
        {lead} <span className="ember-text">{accent}</span>
      </h2>
      {children && <div className="mt-5 text-base text-text-muted sm:text-lg">{children}</div>}
    </motion.div>
  );
}
