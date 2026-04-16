import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContentSection, InfoCard, RuleItem } from "@/components/ContentSection";

export const metadata: Metadata = {
  title: "Settings & Wipe Schedule — MESA ARK",
  description: "Server rates, configuration, and wipe schedule for every MESA ARK cluster. XP, harvesting, taming, breeding, and more.",
};

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings & Wipe Schedule"
        subtitle="Rates, configuration, and wipe times for each cluster."
      />

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
        {/* ── Server Settings ── */}
        <ContentSection title="3 Man / 6 Man Cluster" defaultOpen={true}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <InfoCard title="XP Multiplier" value="35x" accent />
            <InfoCard title="Harvesting" value="15x" accent />
            <InfoCard title="Taming" value="Instant" accent />
            <InfoCard title="Breeding" value="50x" />
            <InfoCard title="Stack Size" value="3,000" />
            <InfoCard title="Tame Limit" value="200 dinos" />
            <InfoCard title="Saddle Armor" value="Default cap" />
            <InfoCard title="Weapon Damage" value="400% cap" accent />
          </div>
        </ContentSection>

        <ContentSection title="100x Cluster">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <InfoCard title="XP Multiplier" value="100x" accent />
            <InfoCard title="Harvesting" value="100x" accent />
            <InfoCard title="Taming" value="100x (Instant)" accent />
            <InfoCard title="Breeding" value="100x" />
            <InfoCard title="Stack Size" value="25,000" />
            <InfoCard title="Tame Limit" value="600 dinos" />
            <InfoCard title="Saddle Armor" value="125 cap" />
            <InfoCard title="Weapon Damage" value="100x rates" accent />
          </div>
        </ContentSection>

        <ContentSection title="Solo / Duo Cluster">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <InfoCard title="XP Multiplier" value="25x" accent />
            <InfoCard title="Harvesting" value="25x" accent />
            <InfoCard title="Taming" value="Instant" accent />
            <InfoCard title="Breeding" value="50x" />
            <InfoCard title="Stack Size" value="5,000" />
            <InfoCard title="Tame Limit" value="600 dinos" />
            <InfoCard title="Saddle Armor" value="Default cap" />
            <InfoCard title="Weapon Damage" value="Default cap" />
          </div>
        </ContentSection>

        <ContentSection title="4 Man Cluster">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <InfoCard title="XP Multiplier" value="35x" accent />
            <InfoCard title="Harvesting" value="15x" accent />
            <InfoCard title="Taming" value="Instant" accent />
            <InfoCard title="Breeding" value="50x" />
            <InfoCard title="Stack Size" value="3,000" />
            <InfoCard title="Tame Limit" value="200 dinos" />
            <InfoCard title="Saddle Armor" value="Default cap" />
            <InfoCard title="Weapon Damage" value="400% cap" accent />
          </div>
        </ContentSection>

        {/* ── Wipe Schedule ── */}
        <ContentSection title="Wipe Times">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <InfoCard title="Solo" value="Monday" accent />
            <InfoCard title="Duo" value="Friday" accent />
            <InfoCard title="3/6 Man" value="Saturday" accent />
            <InfoCard title="100x 2/6 Man" value="Wednesday" accent />
            <InfoCard title="All Clusters" value="1:00 PM EST" />
          </div>
          <div className="mt-4 space-y-1">
            <RuleItem text="3/6 Man rotates between 3 Man and 6 Man every Saturday." />
            <RuleItem text="100x rotates between 2 Man and 6 Man every Wednesday." />
            <RuleItem text="Hall of Fame submissions must be completed within 48 hours of wipe." />
          </div>
        </ContentSection>
      </div>
    </>
  );
}
