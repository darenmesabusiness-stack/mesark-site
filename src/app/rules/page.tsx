import { PageHeader } from "@/components/PageHeader";
import { ContentSection, RuleItem, InfoCard } from "@/components/ContentSection";

export default function RulesPage() {
  return (
    <>
      <PageHeader
        title="Rules & Punishments"
        subtitle="Breaking rules results in bans. Ignorance is not an excuse. Read them."
      />

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
        {/* ── Server Rules ── */}
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

        {/* ── Punishments ── */}
        <ContentSection title="12-Hour Bans">
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

        {/* ── Unban Policy ── */}
        <ContentSection title="Fee Structure">
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
