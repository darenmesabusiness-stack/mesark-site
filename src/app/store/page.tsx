import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContentSection, InfoCard, RuleItem } from "@/components/ContentSection";

export const metadata: Metadata = {
  title: "Store — MESA ARK",
  description: "Purchase ranks, starter kits, and cosmetic items for MESA ARK PvP servers. All purchases support server maintenance.",
};

export default function StorePage() {
  return (
    <>
      <PageHeader
        title="Store"
        subtitle="Ranks, kits, and more to enhance your gameplay."
      />

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
        <ContentSection title="Visit Our Store" defaultOpen={true}>
          <div className="text-center py-6">
            <p className="text-text-muted mb-6">
              Purchase ranks, starter kits, and cosmetic items from our official store.
              All purchases directly support server maintenance and development.
            </p>
            <a
              href="https://store.mesark.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition"
            >
              Open Store
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </ContentSection>

        <ContentSection title="What's Available">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <InfoCard title="Ranks" value="VIP, VIP+, MVP" accent />
            <InfoCard title="Starter Kits" value="Per cluster" />
            <InfoCard title="Cosmetics" value="Skins & colors" />
          </div>
          <RuleItem text="Ranks provide perks like increased tribe limits, priority queue, and bonus kits." />
          <RuleItem text="Starter kits give you gear and dinos to jumpstart after a wipe." />
          <RuleItem text="All purchases are non-refundable. Read the terms before buying." warning />
          <RuleItem text="Store credit earned from Hall of Fame can be used on any item." />
        </ContentSection>
      </div>
    </>
  );
}
