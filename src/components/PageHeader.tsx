"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Inner-page banner: full-bleed Higgsfield artwork behind a big display title.
 * `image` is optional so any page without art still gets the ember treatment.
 */
export function PageHeader({
  title,
  subtitle,
  image,
  focus = "object-center",
  kicker = "MESA ARK",
}: {
  title: string;
  subtitle?: string;
  image?: string;
  focus?: string;
  kicker?: string;
}) {
  return (
    // <section>, not <header>: the Discord bot scraper strips <header> tags and the
    // page title/subtitle are useful retrieval context.
    <section className="relative mb-10 overflow-hidden pt-32 pb-14 sm:pt-44 sm:pb-20">
      {image ? (
        <>
          <Image src={image} alt="" fill preload sizes="100vw" quality={85} className={`ken-burns object-cover ${focus}`} />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/90 via-bg-primary/55 to-bg-primary/10" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg-primary to-transparent" />
        </>
      ) : (
        <div className="absolute left-1/4 top-0 h-[300px] w-[500px] rounded-full bg-accent/10 blur-[120px]" />
      )}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-4xl px-4"
      >
        <p className="hud-label mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-accent" />
          {kicker}
        </p>
        <h1 className="font-display text-[clamp(3.5rem,11vw,8rem)] font-black">{title}</h1>
        {subtitle && <p className="mt-4 max-w-xl text-lg text-text-primary/75">{subtitle}</p>}
      </motion.div>
      <div className="hairline absolute inset-x-0 bottom-0" />
    </section>
  );
}
