import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { RuleItem } from "@/components/ContentSection";

export const metadata: Metadata = {
  title: "Store — MESA ARK",
  description: "Purchase ranks, starter kits, and cosmetic items for MESA ARK PvP servers. All purchases support server maintenance.",
};

const CATEGORIES = [
  {
    title: "Ranks",
    items: ["VIP", "VIP+", "MVP"],
    desc: "Increased tribe limits, priority queue, bonus kits, and exclusive perks.",
  },
  {
    title: "Starter Kits",
    items: ["Solo Kit", "Duo Kit", "Tribe Kit"],
    desc: "Gear and dinos to jumpstart after a wipe. Available per cluster.",
  },
  {
    title: "Cosmetics",
    items: ["Skins", "Colors", "Emotes"],
    desc: "Stand out with custom skins, dino colors, and player emotes.",
  },
];

export default function StorePage() {
  return (
    <>
      <PageHeader
        title="Store"
        subtitle="Ranks, kits, and more to enhance your gameplay."
      />

      <div className="max-w-4xl mx-auto px-4 pb-20">
        {/* CTA */}
        <div className="text-center mb-10">
          <p className="text-text-muted mb-6 max-w-lg mx-auto">
            All purchases directly support server maintenance and development.
          </p>
          <a
            href="https://mesark.tip4serv.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-secondary text-white font-bold rounded-lg transition-all glow-red text-sm tracking-wide"
          >
            OPEN STORE
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Categories */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {CATEGORIES.map((cat) => (
            <div key={cat.title} className="p-6 rounded-xl border border-border bg-bg-card/50">
              <h3 className="font-bold text-lg mb-1 text-accent">{cat.title}</h3>
              <p className="text-sm text-text-muted mb-3">{cat.desc}</p>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span key={item} className="px-2 py-1 text-xs rounded-md bg-white/5 border border-border text-text-muted">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="rounded-xl border border-border bg-bg-card/50 p-6 space-y-2">
          <h3 className="font-bold text-sm mb-3 uppercase tracking-wider text-text-muted">Good to know</h3>
          <RuleItem text="Store credit earned from Hall of Fame can be used on any item." />
          <RuleItem text="All purchases are non-refundable. Read the terms before buying." warning />
        </div>
      </div>
    </>
  );
}
