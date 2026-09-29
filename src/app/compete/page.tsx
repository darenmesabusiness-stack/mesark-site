import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContentSection, InfoCard, RuleItem } from "@/components/ContentSection";
import { hofTiers } from "@/data/hof";

export const metadata: Metadata = {
  title: "Compete — MESA ARK",
  description: "Hall of Fame tier system, cash prizes up to $700, and competitive season rewards on MESA ARK PvP servers.",
};

export default function CompetePage() {
  return (
    <>
      <PageHeader
        title="Compete"
        subtitle="Win wipes, climb the tiers, earn real rewards."
        image="/art/hall.jpg"
        focus="object-[30%_40%]"
        kicker="Hall of Fame"
      />

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
        {/* Leaderboard Link Card */}
        <a
          href="https://leaderboards.mesark.net"
          target="_blank"
          rel="noopener noreferrer"
          className="clip-corner block border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-all p-6 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-3xl font-black text-text-primary group-hover:text-accent transition-colors">
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
                {hofTiers.map((t, i) => (
                  <tr key={t.name} className={i < hofTiers.length - 1 ? "border-b border-border/50" : ""}>
                    <td className={`py-2.5 pr-4 font-display text-xl font-extrabold ${t.color}`}>{t.name}</td>
                    <td className="py-2.5 pr-4 font-mono text-xs">{t.wins} win{t.wins > 1 ? "s" : ""}</td>
                    <td className="py-2.5 text-accent">{t.reward}</td>
                  </tr>
                ))}
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
