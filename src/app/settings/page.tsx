import { PageHeader } from "@/components/PageHeader";
import { ContentSection, InfoCard } from "@/components/ContentSection";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Server Settings"
        subtitle="Rates and configuration for each cluster."
      />

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
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
      </div>
    </>
  );
}
