import { PageHeader } from "@/components/PageHeader";
import { ContentSection, RuleItem } from "@/components/ContentSection";

export default function RulesPage() {
  return (
    <>
      <PageHeader
        title="Server Rules"
        subtitle="Breaking rules results in bans. Ignorance is not an excuse. Read them."
      />

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
        <ContentSection title="General Rules" defaultOpen={true}>
          <RuleItem text="English is the recommended language in global chat." />
          <RuleItem text="No cheating, hacking, duping, or meshing — permanent ban, no exceptions." warning />
          <RuleItem text="No account sharing. You are responsible for your account at all times." />
          <RuleItem text="Macros of any kind are forbidden." warning />
          <RuleItem text="Autoclickers are only allowed in PvE activities (crafting, farming)." />
          <RuleItem text="Do not impersonate staff or claim to be an admin." />
          <RuleItem text="No real-money trading (RMT). Selling or buying in-game items for real currency is banned." warning />
          <RuleItem text="No insiding — betraying your tribe by stealing, destroying, or sabotaging from within." warning />
          <RuleItem text="No teaming with other tribes. One tribe per fight, no exceptions." />
        </ContentSection>

        <ContentSection title="PVP Rules">
          <RuleItem text="No dinos inside Lava Golem arena except Velonasaurs." />
          <RuleItem text="Do not block the Lava Golem for more than 10 minutes." />
          <RuleItem text="No teaming — alliances, truces, or coordinated attacks with other tribes are forbidden." warning />
          <RuleItem text="Do not place structures on other players (caging mid-fight, foundation wiping, etc.)." />
          <RuleItem text="Max DPS dinos at OSD/Vein events is limited to your tribe member count." />
        </ContentSection>

        <ContentSection title="Raiding Rules">
          <RuleItem text="Do not use /farm during active PvP or raiding." warning />
          <RuleItem text="No mesh biting or mesh picking through walls/terrain." warning />
          <RuleItem text="No tunneling into bases — exception: motorboat tunneling is allowed." />
          <RuleItem text="No forcefield abuse to gain unfair advantages during raids." />
          <RuleItem text="Maximum 5 dinos blocking an entrance during a raid." />
          <RuleItem text="No popcorning — intentionally dropping loot to deny raiders." warning />
          <RuleItem text="Do not deny tribe score through intentional actions (dying on purpose, etc.)." />
          <RuleItem text="Cycling (log rotating to refresh cooldowns) is only allowed during PvE." />
        </ContentSection>

        <ContentSection title="Counter Raiding Rules">
          <RuleItem text="You must establish a FOB with a minimum of 20 turrets before counter raiding." warning />
          <RuleItem text="You must destroy the attacker's FOB first before engaging the defenders." />
          <RuleItem text="If your counter raid fails, there is a 1-hour cooldown before you can attempt again." />
          <RuleItem text="Only one tribe may counter raid at a time — no stacking counters." />
        </ContentSection>

        <ContentSection title="Caging Rules">
          <RuleItem text="No open-world caging. You may only cage players during an active raid." />
          <RuleItem text="Caged players must be freed after the raid is over." />
          <RuleItem text="No cross-map caging (dragging caged players to other maps)." />
          <RuleItem text="If you cage a player, you must raid their main base within 30 minutes." warning />
        </ContentSection>

        <ContentSection title="Building Rules">
          <RuleItem text="Do not build on spawn points, city terminals, or obelisks." warning />
          <RuleItem text="No rathole building — hiding loot or structures in unraidable mesh spots." warning />
          <RuleItem text="No Behemoth Gates inside caves." />
          <RuleItem text="Maximum 5 vaults blocking a cave entrance." />
          <RuleItem text="No meshed structures — anything clipped into terrain or mesh will be deleted." warning />
        </ContentSection>
      </div>
    </>
  );
}
