import { PageHeader } from "@/components/PageHeader";
import { ContentSection, InfoCard, RuleItem } from "@/components/ContentSection";

export default function WipePage() {
  return (
    <>
      <PageHeader
        title="Wipe Schedule"
        subtitle="All wipes happen at 1:00 PM EST."
      />

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
        <ContentSection title="Wipe Times" defaultOpen={true}>
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
