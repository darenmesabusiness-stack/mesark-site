import { PageHeader } from "@/components/PageHeader";
import { ContentSection, RuleItem } from "@/components/ContentSection";

export default function PunishmentsPage() {
  return (
    <>
      <PageHeader
        title="Punishments"
        subtitle="All bans are enforced across the cluster. Repeat offenses escalate."
      />

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
        <ContentSection title="12-Hour Bans" defaultOpen={true}>
          <RuleItem text="Blocking drops or loot crates" />
          <RuleItem text="Impersonating staff" />
          <RuleItem text="Blocking Lava Golem for more than 10 minutes" />
          <RuleItem text="Placing structures on players" />
          <RuleItem text="Mass soaking (excessive soaking with no intent to raid)" />
          <RuleItem text="Open-world caging or placing turrets in the open" />
          <RuleItem text="Having meshed structures (unintentional)" />
          <RuleItem text="Countering a raid that is already being countered" />
        </ContentSection>

        <ContentSection title="24-Hour Bans">
          <RuleItem text="Using macros or autoclickers in PvP" warning />
          <RuleItem text="IRL threats against other players" warning />
          <RuleItem text="Mesh biting or mesh picking" warning />
          <RuleItem text="Illegal builds (ratholes, blocked spawns, banned locations)" />
          <RuleItem text="Griefing an enemy FOB outside of active raiding" />
          <RuleItem text="Escaping cages via exploits or glitches" />
        </ContentSection>

        <ContentSection title="30-Day Bans">
          <RuleItem text="Real-money trading (RMT)" warning />
          <RuleItem text="Insiding — betraying your tribe from within" warning />
          <RuleItem text="Popcorning — intentionally dropping loot to deny raiders" warning />
          <RuleItem text="Teaming with other tribes" warning />
          <RuleItem text="Cycling (log rotating) during PvP" />
          <RuleItem text="Merging tribes during PvP" />
        </ContentSection>

        <ContentSection title="60-Day Bans">
          <RuleItem text="Account sharing" warning />
          <RuleItem text="Tunneling into bases (non-motorboat)" warning />
          <RuleItem text="Tribe score abuse or manipulation" />
          <RuleItem text="Lying about Steam IDs for Hall of Fame submissions" warning />
        </ContentSection>

        <ContentSection title="Permanent Bans">
          <RuleItem text="Cheating of any kind — results in all-cluster ban" warning />
          <RuleItem text="Duping items or dinos — results in dev wipe + permanent ban" warning />
          <RuleItem text="HWID spoofing to evade bans" warning />
          <RuleItem text="Meshing or living inside the mesh" warning />
          <RuleItem text="Building in banned/restricted locations" warning />
        </ContentSection>
      </div>
    </>
  );
}
