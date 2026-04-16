import { PageHeader } from "@/components/PageHeader";
import { ContentSection, InfoCard, RuleItem } from "@/components/ContentSection";

export default function CompetePage() {
  return (
    <>
      <PageHeader
        title="Compete"
        subtitle="Win wipes, climb the tiers, earn real rewards."
      />

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
        {/* Leaderboard Link Card */}
        <a
          href="https://leaderboards.mesark.net"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-all p-6 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text-primary group-hover:text-accent transition-colors">
                Live Leaderboards
              </h2>
              <p className="text-sm text-text-muted mt-1">
                View real-time tribe rankings, scores, and wipe stats on the leaderboard site.
              </p>
            </div>
            <svg className="w-6 h-6 text-accent shrink-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </a>

        {/* ── Hall of Fame ── */}
        <ContentSection title="Tier System" defaultOpen={true}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="py-2 pr-4">Tier</th>
                  <th className="py-2 pr-4">Wins Required</th>
                  <th className="py-2">Reward</th>
                </tr>
              </thead>
              <tbody className="text-text-primary">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-semibold">Silver</td>
                  <td className="py-2 pr-4">1 win</td>
                  <td className="py-2 text-accent">$25 store credit</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-semibold text-yellow-500">Gold</td>
                  <td className="py-2 pr-4">3 wins</td>
                  <td className="py-2 text-accent">$50 store credit</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-semibold text-cyan-400">Platinum</td>
                  <td className="py-2 pr-4">6 wins</td>
                  <td className="py-2 text-accent">$75 store credit</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-semibold text-emerald-400">Emerald</td>
                  <td className="py-2 pr-4">9 wins</td>
                  <td className="py-2 text-accent">$100 store credit</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-semibold text-blue-400">Diamond</td>
                  <td className="py-2 pr-4">12 wins</td>
                  <td className="py-2 text-accent">$50 PayPal + $150 store credit</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-semibold text-red-400">Champion</td>
                  <td className="py-2 pr-4">15 wins</td>
                  <td className="py-2 text-accent">$100 PayPal + $250 store credit</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold text-purple-400">Prestige</td>
                  <td className="py-2 pr-4">18 wins</td>
                  <td className="py-2 text-accent">$200 PayPal + $500 store credit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ContentSection>

        <ContentSection title="Reward Highlights">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <InfoCard title="Starting Reward" value="$25 credit" />
            <InfoCard title="Max PayPal" value="$200" accent />
            <InfoCard title="Max Store Credit" value="$500" accent />
            <InfoCard title="Total Tiers" value="7" />
          </div>
        </ContentSection>

        <ContentSection title="Submission Requirements">
          <RuleItem text="Submit your Hall of Fame claim within 48 hours of the wipe." warning />
          <RuleItem text="Your base must be located in a vanilla cave to qualify." warning />
          <RuleItem text="Maintain an active raid list throughout the wipe." />
          <RuleItem text="Submit a full Hall of Fame video showing your wipe performance." />
          <RuleItem text="All tribe members' Steam IDs must be accurate — lying results in a 60-day ban." warning />
        </ContentSection>
      </div>
    </>
  );
}
