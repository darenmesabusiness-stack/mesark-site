import { PageHeader } from "@/components/PageHeader";
import { ContentSection, RuleItem, InfoCard } from "@/components/ContentSection";

export default function UnbanPage() {
  return (
    <>
      <PageHeader
        title="Unban Policy"
        subtitle="Banned players may request an unban through our support process."
      />

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
        <ContentSection title="Fee Structure" defaultOpen={true}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <InfoCard title="Rate" value="$2 USD / ban day" accent />
            <InfoCard title="Minimum Fee" value="$10 USD" />
            <InfoCard title="Cheats / Exploits" value="$150 minimum" accent />
          </div>
          <RuleItem text="Each day of your ban costs $2 USD. A 30-day ban = $60." />
          <RuleItem text="The minimum unban fee is $10 regardless of ban length." />
          <RuleItem text="Cheating or exploit-related bans have a minimum fee of $150." warning />
          <RuleItem text="Ban evading increases the unban price by $50 each time you evade." warning />
          <RuleItem text="Maximum unban fee is capped at $500." />
          <RuleItem text="Repeat offenses double the unban price from your last fee." warning />
        </ContentSection>

        <ContentSection title="Non-Appealable Offenses">
          <p className="text-text-muted mb-2">The following offenses cannot be unbanned under any circumstances:</p>
          <RuleItem text="Selling or buying accounts" warning />
          <RuleItem text="Real-life threats or harassment" warning />
          <RuleItem text="Doxxing — sharing personal information of other players" warning />
        </ContentSection>

        <ContentSection title="Unban Process">
          <div className="space-y-2">
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center">1</span>
              <span>Join the support Discord server</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center">2</span>
              <span>Create a support ticket in the unban channel</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center">3</span>
              <span>Submit your ban reason and in-game name (IGN)</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center">4</span>
              <span>Wait for admin review (usually within 24 hours)</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center">5</span>
              <span>Complete payment once approved</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center">6</span>
              <span>You will be unbanned after payment confirmation</span>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Example Unban Fees">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="py-2 pr-4">Offense</th>
                  <th className="py-2 pr-4">Ban Length</th>
                  <th className="py-2">Unban Fee</th>
                </tr>
              </thead>
              <tbody className="text-text-primary">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4">Insiding</td>
                  <td className="py-2 pr-4">30 days</td>
                  <td className="py-2 text-accent font-semibold">$60</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4">Cycling in PvP</td>
                  <td className="py-2 pr-4">30 days</td>
                  <td className="py-2 text-accent font-semibold">$60</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Aimbot / Cheating</td>
                  <td className="py-2 pr-4">Permanent</td>
                  <td className="py-2 text-accent font-semibold">$150 minimum</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ContentSection>
      </div>
    </>
  );
}
