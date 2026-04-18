import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContentSection, InfoCard, RuleItem } from "@/components/ContentSection";

export const metadata: Metadata = {
  title: "Settings & Wipe Schedule — MESA ARK",
  description: "Server rates, commands, keybinds, mods, dino changes, and wipe schedule for every MESA ARK cluster.",
};

function CommandRow({ cmd, desc }: { cmd: string; desc: string }) {
  return (
    <div className="flex gap-4 py-2 border-b border-border/50 last:border-0">
      <code className="text-accent font-mono text-sm shrink-0 min-w-[180px]">{cmd}</code>
      <span className="text-text-muted text-sm">{desc}</span>
    </div>
  );
}

function KeybindRow({ keys, desc }: { keys: string; desc: string }) {
  return (
    <div className="flex gap-4 py-2 border-b border-border/50 last:border-0">
      <kbd className="bg-white/5 border border-border rounded px-2 py-0.5 text-sm font-mono text-accent shrink-0 min-w-[120px]">{keys}</kbd>
      <span className="text-text-muted text-sm">{desc}</span>
    </div>
  );
}

function ClusterCard({ name, wipe, rates }: {
  name: string;
  wipe: string;
  rates: { xp: string; harvest: string; tame: string; breed: string; stack: string; dinos: string; saddle: string; weapon: string };
}) {
  return (
    <div className="relative rounded-xl border border-accent/30 bg-gradient-to-br from-accent/[0.06] to-transparent p-5 hover:border-accent/50 transition group">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-text-primary">{name}</h3>
        <span className="text-xs font-semibold uppercase tracking-wider bg-accent/15 text-accent px-3 py-1 rounded-full">
          Wipe {wipe}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <StatBlock label="XP" value={rates.xp} />
        <StatBlock label="Harvest" value={rates.harvest} />
        <StatBlock label="Taming" value={rates.tame} />
        <StatBlock label="Breeding" value={rates.breed} />
        <StatBlock label="Stack" value={rates.stack} />
        <StatBlock label="Dinos" value={rates.dinos} />
        <StatBlock label="Saddle" value={rates.saddle} />
        <StatBlock label="Weapon" value={rates.weapon} />
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-text-muted/60 mb-0.5">{label}</div>
      <div className="text-sm font-bold text-accent">{value}</div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings & Wipe Schedule"
        subtitle="Rates, configuration, commands, keybinds, mods, and wipe times for each cluster."
      />

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
        {/* ── Cluster Settings ── */}
        <div className="mb-2">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent mb-4">Cluster Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ClusterCard name="3/6 Man" wipe="Saturday" rates={{ xp: "35x", harvest: "15x", tame: "Instant", breed: "50x", stack: "3,000", dinos: "200", saddle: "Default", weapon: "400%" }} />
            <ClusterCard name="100x" wipe="Wednesday" rates={{ xp: "100x", harvest: "100x", tame: "Instant", breed: "100x", stack: "25,000", dinos: "600", saddle: "125", weapon: "100x" }} />
            <ClusterCard name="Solo / Duo" wipe="Mon / Fri" rates={{ xp: "25x", harvest: "25x", tame: "Instant", breed: "50x", stack: "5,000", dinos: "600", saddle: "Default", weapon: "Default" }} />
            <ClusterCard name="4 Man" wipe="Saturday" rates={{ xp: "35x", harvest: "15x", tame: "Instant", breed: "50x", stack: "3,000", dinos: "200", saddle: "Default", weapon: "400%" }} />
          </div>
        </div>

        {/* ── Server Info ── */}
        <div className="pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted mb-4">Server Info & Guides</h2>
        </div>

        {/* ── Wipe Schedule ── */}
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

        <ContentSection title="General Changes & QOL">
          <h4 className="font-semibold text-text-primary mb-2">Environmental</h4>
          <div className="space-y-1">
            <RuleItem text="Global base temperature removed." />
            <RuleItem text="Player cold & heat disabled." />
            <RuleItem text="Element is transferable between servers." />
            <RuleItem text="Corrupted dinos do not deal damage to player structures." />
            <RuleItem text="Earthquake on Aberration disabled." />
            <RuleItem text="Meteor event on Extinction disabled." />
            <RuleItem text="Cryosickness lasts 60 seconds." />
            <RuleItem text="Cryopods take 3 seconds." />
            <RuleItem text="Level up animations removed on dinos." />
          </div>
          <h4 className="font-semibold text-text-primary mt-4 mb-2">Loot & Drops</h4>
          <div className="space-y-1">
            <RuleItem text="Cave crates have improved custom drop pool & give 2-3 items per crate." />
            <RuleItem text="Lava Golem drops 61 items including a chance of Extended Mag Blueprint." />
            <RuleItem text="Loot boxes give great blueprints, dino lines, and resources." />
            <RuleItem text="OSDs give 2x amount of loot." />
            <RuleItem text="Element Veins & OSDs cannot be damaged by ranged weapons or tamed dinos." />
            <RuleItem text="Disabled Blue & Yellow OSD spawns." />
            <RuleItem text="Disabled 10k & 25k Veins." />
          </div>
          <h4 className="font-semibold text-text-primary mt-4 mb-2">Crafting</h4>
          <div className="space-y-1">
            <RuleItem text="Kav Forges, Smithy, Fabricator, Pestle: all 2x crafting speed." />
            <RuleItem text="Heavy Turret has 12 slots instead of 58." />
            <RuleItem text="Replicator, Dedicated Storage & Tek grams automatically learned." />
            <RuleItem text="Replicator craftable in Kav Crafting Station." />
          </div>
          <h4 className="font-semibold text-text-primary mt-4 mb-2">Boss & Cave Timers</h4>
          <div className="space-y-1">
            <RuleItem text="Lava Golem cooldown lowered to 30 minutes." />
            <RuleItem text="Ice Queen cooldown lowered to 30 minutes." />
            <RuleItem text="Lava in Lava Golem does 50 damage/sec instead of instant kill." />
            <RuleItem text="Golem resets after 15 minutes." />
          </div>
          <h4 className="font-semibold text-text-primary mt-4 mb-2">Genesis Specific</h4>
          <div className="space-y-1">
            <RuleItem text="Insect Swarm disabled in Gen1." />
            <RuleItem text={'Disabled "Rhino 500" mission in Gen1 Lunar.'} />
            <RuleItem text="Drone & Seeker spawns disabled in Gen1." />
            <RuleItem text="Tek Suit enabled on Genesis 1." />
            <RuleItem text="Federation Suit is not transferable outside Genesis 2." />
          </div>
        </ContentSection>

        {/* ── PvP Combat Changes ── */}
        <ContentSection title="PvP Combat Changes">
          <div className="space-y-1">
            <RuleItem text="Blue Shield hitmarkers & Orange hitmarker for shooting player on dino." />
            <RuleItem text="Fabricated Sniper Rifle is automatically silenced." />
            <RuleItem text="Bola lasts 10 seconds." />
            <RuleItem text="You CAN net players wearing Tek armor. Nets only work on players with at least 1 piece of Tek equipped — no Tek, no net." />
            <RuleItem text="Net cooldown: 60 seconds." />
            <RuleItem text="Phase pistol stun disabled on players." />
            <RuleItem text="Shocking Tranquilizer dart does not shock players." />
            <RuleItem text="Whip stun has 20 second cooldown." />
            <RuleItem text="Flamethrower tick does 4% damage per second." />
          </div>
        </ContentSection>

        {/* ── Custom Keybinds ── */}
        <ContentSection title="Custom Keybinds">
          <KeybindRow keys="P" desc="Find tribemates" />
          <KeybindRow keys="F2" desc="Opens the in-game shop" />
          <KeybindRow keys="F3" desc="Opens Capture TP leaderboard" />
          <KeybindRow keys="F4" desc="Armor info toggle (durability shown on right side of screen)" />
          <KeybindRow keys="Ctrl + U" desc="Reset skins (remove all armor with skins first)" />
          <KeybindRow keys="Middle Mouse" desc="Ping your tribe" />
          <KeybindRow keys="Left Ctrl" desc="Open cryopod menu" />
          <KeybindRow keys="Esc" desc="Keybind reset can be found here" />
        </ContentSection>

        {/* ── Discord Tribe Logs ── */}
        <ContentSection title="Discord Tribe Logs (/tlr)">
          <p className="text-text-muted mb-3">Send your tribe log events to a Discord channel in real time.</p>
          <div className="space-y-1">
            <RuleItem text="Go to your Discord server settings." />
            <RuleItem text="Select Integrations → Webhooks → New Webhook." />
            <RuleItem text="Name your webhook and select the channel you want messages to go to." />
            <RuleItem text="Click Copy Webhook URL." />
            <RuleItem text="In-game, open chat and type: /tlr <webhook URL> (paste the URL directly)." warning />
          </div>
        </ContentSection>

        {/* ── In-Game Commands ── */}
        <ContentSection title="In-Game Commands">
          <h4 className="font-semibold text-text-primary mb-2">General</h4>
          <CommandRow cmd="/giveengrams" desc="Unlock all available engrams" />
          <CommandRow cmd="/dmg 1 on" desc="Turns on damage numbers" />
          <CommandRow cmd="/download" desc="Download uploaded items" />
          <CommandRow cmd="/upload" desc="Uploads your inventory" />
          <CommandRow cmd="/groups" desc="Displays your rank & duration left" />
          <CommandRow cmd="/loot" desc="Claim lootbox/kit items after emptying inventory" />
          <CommandRow cmd="/suicide" desc="Kills your player" />
          <CommandRow cmd="/bannedzones" desc="Shows visual range of no-build zones" />
          <CommandRow cmd="/eventlist" desc="Displays MESA Event Vaults on the map" />
          <CommandRow cmd="/mystats" desc="Shows your personal stats" />
          <CommandRow cmd="/stats <1-8>" desc="1=Playtime, 2=Player kills, 3=Tamed dino kills, 4=Wild dino kills, 5=Dinos tamed, 6=Deaths to players, 7=Deaths to tamed, 8=Deaths to wild" />
          <CommandRow cmd="/leaderboard" desc="Shows current Tribe Score leaderboard" />
          <CommandRow cmd="/dinolimit" desc="Displays your tribe's dino limit" />
          <CommandRow cmd="/structurelimit" desc="Displays your tribe's structure limit" />
          <CommandRow cmd="/countstructures" desc="Shows snapped structure count when looking at a structure" />
          <CommandRow cmd="/dinostats" desc="When facing a friendly dino, shows points into stats" />
          <CommandRow cmd="/claim" desc="Claims all unclaimed babies nearby" />
          <CommandRow cmd="/imprint" desc="Imprints all baby dinos nearby that need a cuddle" />
          <CommandRow cmd="/neuter" desc="Neuters the target dino" />
          <CommandRow cmd="/rarelist" desc="Displays current Rare Dinos on the map" />
          <CommandRow cmd="/saddle" desc="Saddles nearby dinos" />
          <CommandRow cmd="/heal" desc="Enables Daedon heal" />
          <CommandRow cmd="/auto" desc="Enables Auto Yuty, Mammoth & Shadowmane" />
          <CommandRow cmd="/farm" desc="Enables auto farming" />
          <CommandRow cmd="/pod" desc="Cryopods nearby dino" />
          <CommandRow cmd="/forge" desc="Turns on all forges in a nearby area" />

          <h4 className="font-semibold text-text-primary mt-6 mb-2">Rank Only</h4>
          <CommandRow cmd="/wake" desc="Wakes up cryo sicked dinos" />
          <CommandRow cmd="/cg" desc="Changes dino's gender" />
          <CommandRow cmd="/finishclone" desc="Finishes cloning a dino" />

          <h4 className="font-semibold text-text-primary mt-6 mb-2">Turret Commands</h4>
          <CommandRow cmd="/fill" desc="Fills turrets in range using ammo from your inventory" />
          <CommandRow cmd="/fill <name>" desc="Fills only turrets with that name (e.g. /fill wall)" />
          <CommandRow cmd="/turrets on/off" desc="Turns turrets in range on or off" />
          <CommandRow cmd="/turrets low/medium/high" desc="Sets turret range" />
          <CommandRow cmd="/turrets all" desc="Target all players" />
          <CommandRow cmd="/turrets playertamed" desc="Target players & tamed dinos" />
          <CommandRow cmd="/turrets player" desc="Target players only" />
          <CommandRow cmd="/turrets wild" desc="Target wild dinos only" />
          <CommandRow cmd="/turrets tamed" desc="Target tamed dinos only" />
          <CommandRow cmd="/turrets playermounted" desc="Target player mounted only" />

          <h4 className="font-semibold text-text-primary mt-6 mb-2">Dino Paint Commands</h4>
          <CommandRow cmd="/dinopaint" desc="Displays dino paints remaining" />
          <CommandRow cmd="/sdcrandom" desc="Randomizes the target dino's color" />
          <CommandRow cmd="/sdc <region> <color>" desc="Paints the target dino's region to that color" />
          <CommandRow cmd="/savedc <name>" desc="Saves targeting dino's color scheme (species specific)" />
          <CommandRow cmd="/loaddc <name>" desc="Loads a saved color scheme for that species" />
          <CommandRow cmd="/listdc" desc="Lists all saved color schemes for that species" />
        </ContentSection>

        {/* ── Custom Mods ── */}
        <ContentSection title="Custom Mods & Features">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoCard title="Kav Structures" value="Custom building pieces" />
            <InfoCard title="Custom Cloning Chambers" value="Enhanced cloning" />
            <InfoCard title="Cryo Breeders" value="Custom Propagator" />
            <InfoCard title="Mesa City" value="Element veins, OSD, Golem events" accent />
            <InfoCard title="Custom Tool Gun" value="Building & management" />
            <InfoCard title="Small Teleporter" value="Portable teleportation" />
            <InfoCard title="Custom Tribe Finder" value="Find tribe members" />
            <InfoCard title="Custom OSD & Vein HUD" value="Enhanced event display" />
          </div>
          <div className="mt-4 space-y-1">
            <RuleItem text="Points can be used to buy Dinos, Resources, Gear, Tek grams via the in-game shop (F2)." />
            <RuleItem text="Use /giveengrams to unlock all available engrams including Tek." />
          </div>
        </ContentSection>

        {/* ── Dino Changes ── */}
        <ContentSection title="Dino Changes">
          <h4 className="font-semibold text-text-primary mb-2">Wild Spawn Changes</h4>
          <div className="space-y-1">
            <RuleItem text="Wild Wyvern spawns set to 150-190 only on Scorched Earth." />
            <RuleItem text="Wild Giga spawns set to 130-150 only on The Center." />
            <RuleItem text="Wild Carcha spawns set to 130-150 only on The Center." />
            <RuleItem text="Wild Deinonychus spawns set to 140+ on Valguero." />
            <RuleItem text="Wild dino levels improved to make 130+ more common." />
          </div>
          <h4 className="font-semibold text-text-primary mt-4 mb-2">Custom Spawns</h4>
          <div className="space-y-1">
            <RuleItem text="Maewing: Ragnarok Redwoods, Lost Island Redwoods, Center Redwoods, Ragnarok Desert, Crystal Isles Redwoods." />
            <RuleItem text="Velo: Ragnarok Desert." />
          </div>
          <h4 className="font-semibold text-text-primary mt-4 mb-2">Disabled Dinos</h4>
          <p className="text-text-muted text-sm">
            Nameless, Seeker, Pegomastax, Troodon, Ichtyornis, Electrophorus, Cnidaria, Iguanodon, Rhyniogantha, Fjordhawk, Microraptor, Diplodocus, Purlovia, Raptor, Megalania, Titanosaur (Solo & Duo only).
          </p>
        </ContentSection>

        {/* ── Dino Delays ── */}
        <ContentSection title="Dino Riding Delays">
          <p className="text-text-muted text-sm mb-3">
            MESA uses <strong className="text-text-primary">riding delays</strong>, not tame delays. You can tame immediately but cannot ride until the timer expires.
            <strong className="text-accent"> 100x has NO delays.</strong>
          </p>
          <h4 className="font-semibold text-text-primary mb-2">24-Hour Riding Delays (all clusters except 100x)</h4>
          <div className="space-y-1">
            <RuleItem text="Stegosaurus" />
            <RuleItem text="Andrewsarchus" />
            <RuleItem text="Managarmr" />
            <RuleItem text="Desmodus" />
            <RuleItem text="Carcharodontosaurus" />
          </div>
          <h4 className="font-semibold text-text-primary mt-4 mb-2">Longer Delays</h4>
          <div className="space-y-1">
            <RuleItem text="Titans — 3-day delay (cannot tame)" warning />
            <RuleItem text="Noglins — delayed (cannot tame immediately)" warning />
            <RuleItem text="Stryders — delayed (cannot tame immediately)" warning />
          </div>
        </ContentSection>

        {/* ── Disabled Engrams ── */}
        <ContentSection title="Disabled Engrams">
          <p className="text-text-muted text-sm">
            The following engrams are disabled on MESA servers: Climbing Pick, Pliers, Portable Rope Ladder, Wood Elevator Track, Zipline Ammo, Cluster Grenade, Vessel, Campfire, Bog, Elevator Track, Hide Sleeping Bag, Silencer, Standing Torch, Stone Fence Foundation, Toilet, Torch, Wood Fence Foundation, Tek ATV, Tek Shield, Adobe Fence Support, Adobe Fence Foundation, Raft, Trophy Base, Camera, Zipline Motor, Stone Fence Support, Wood Fence Support, Canoe, Shoulder Cannon, Tek Exo Suit, Tek Security Console, Ammo Box, Tek Hoversail, Fishing Net, Wyvern Bone Costume, Rope Ladder, Wood Chair.
          </p>
          <div className="mt-2">
            <RuleItem text="Use /giveengrams to unlock all available engrams." warning />
          </div>
        </ContentSection>

        {/* ── Banned Locations ── */}
        <ContentSection title="Banned Build Locations">
          <div className="space-y-1">
            <RuleItem text='Use the /bannedzones command in-game to visualize restricted building areas.' warning />
            <RuleItem text="Most banned base locations are blocked by Admin-placed ocean or cliff platforms." />
            <RuleItem text="Building in restricted areas will result in structure removal and may result in a temporary ban." />
            <RuleItem text="See the server rules page for the full list of restricted locations." />
          </div>
        </ContentSection>
      </div>
    </>
  );
}
