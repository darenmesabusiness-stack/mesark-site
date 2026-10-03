import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { CommonIssues } from "@/components/CommonIssues";
import { PageHeader } from "@/components/PageHeader";
import { ContentSection, RuleItem } from "@/components/ContentSection";
import { IniSection } from "./IniSection";

export const metadata = pageMeta({
  title: "Common Issues",
  description: "Fix joining, mod mismatch, crashes and account issues on MESA. INI presets, keybinds and private support help.",
});

export default function HelpfulPage() {
  return (
    <>
      <PageHeader
        title="Common Issues"
        subtitle="Find your issue, try the first checks, and know what to send support."
        image="/art/ark/solo.jpg"
        focus="object-[50%_25%]"
        kicker="Guides"
      />

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
        <CommonIssues />
        <div className="flex flex-wrap gap-x-5 gap-y-2 border-y border-border py-4 text-sm">
          <Link href="/support" className="font-semibold text-accent hover:underline">Still stuck? Player Support →</Link>
          <a href="#detailed-guides" className="text-text-primary hover:text-accent">Detailed guides & INI presets ↓</a>
          <Link href="/settings" className="text-text-primary hover:text-accent">Settings & wipe times →</Link>
        </div>
        <h2 id="detailed-guides" className="scroll-mt-28 pt-6 font-display text-3xl font-extrabold">Detailed guides</h2>

        {/* ── INI Setup ── */}
        <ContentSection title="PvP INI Settings (BaseDeviceProfiles)">
          <p className="text-text-primary font-medium mb-3">
            INI files are <strong>allowed</strong> on MESA. These go in the <code className="bg-bg-card px-1.5 py-0.5 rounded text-text-primary text-xs">BaseDeviceProfiles.ini</code> file
            inside your ARK Engine config folder. Pick the preset that matches your playstyle.
          </p>

          <div className="p-4 rounded-lg border border-blue/20 bg-blue/5 mb-4">
            <p className="text-text-primary font-semibold mb-3">How to install:</p>
            <div className="space-y-2.5">
              <div className="flex gap-3 items-start">
                <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">1</span>
                <span>Open Steam &rarr; right-click <strong>ARK</strong> &rarr; <strong>Manage</strong> &rarr; <strong>Browse Local Files</strong></span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">2</span>
                <span>Navigate to <code className="bg-bg-card px-1.5 py-0.5 rounded text-text-primary text-xs">Engine &rarr; Config</code></span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">3</span>
                <span>Find <strong>BaseDeviceProfiles.ini</strong> (highlighted below)</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">4</span>
                <span>Close ARK and <strong>save a backup</strong> of the original file. Open it with Notepad, replace its contents with your chosen preset, and save. Restore the backup if the preset causes problems.</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-text-muted">
              The path depends on where Steam installed ARK. The folder structure is always <code className="bg-bg-card px-1 py-0.5 rounded text-text-primary">...\ARK\Engine\Config\</code>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-border mb-5">
            <Image
              src="/ini/basedeviceprofiles.png"
              alt="BaseDeviceProfiles.ini location in ARK Engine Config folder"
              width={1456}
              height={816}
              className="w-full h-auto"
            />
          </div>

          <IniSection />
        </ContentSection>

        {/* ── How to Join ── */}
        <ContentSection title="How to Join MESA Servers">
          <p className="text-text-primary font-medium mb-2">MESA runs on ARK: Survival Evolved (ASE), not ASA. You must be on the pre-Aquatica branch.</p>

          <p className="font-semibold text-text-primary mt-3 mb-2">Step 1 &mdash; Switch to pre-Aquatica branch:</p>
          <div className="space-y-2 mb-4">
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">1</span>
              <span>Open Steam Library &rarr; right-click <strong>ARK: Survival Evolved</strong> &rarr; <strong>Properties</strong></span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">2</span>
              <span>Click the <strong>Betas</strong> tab</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">3</span>
              <span>Select <strong>preaquatica - ASE: Pre-Aquatica</strong> from the dropdown</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">4</span>
              <span>Wait for the update to download</span>
            </div>
          </div>

          <p className="font-semibold text-text-primary mt-3 mb-2">Step 2 &mdash; Add servers to favorites:</p>
          <div className="space-y-2">
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">1</span>
              <span>Open Steam&apos;s server browser from <strong>View</strong> (Servers or Game Servers) &rarr; <strong>Favorites</strong> tab</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">2</span>
              <span>Click &quot;Add a Server&quot; and enter a server IP from <a href="/servers" className="text-blue hover:underline">mesark.net/servers</a></span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">3</span>
              <span>Launch ARK &rarr; Join ARK &rarr; change filter to &quot;Favorites&quot;</span>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-lg border border-border bg-bg-card/30 text-xs">
            <strong className="text-text-primary">Note:</strong> The server must be online for Steam to add it. If it doesn&apos;t appear, wait until after maintenance/wipe and try again.
          </div>
        </ContentSection>

        {/* ── CCC Coordinates ── */}
        <ContentSection title="How to Get CCC Coordinates">
          <p className="mb-2">If staff ask for your location, send CCC coordinates in your private ticket. Never publish live base or player coordinates in community posts.</p>
          <div className="space-y-2">
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">1</span>
              <span>Open Console (default key: <code className="bg-bg-card px-1.5 py-0.5 rounded text-text-primary text-xs">Tab</code>)</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">2</span>
              <span>Type <code className="bg-bg-card px-1.5 py-0.5 rounded text-text-primary text-xs">ccc</code> and hit Enter</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">3</span>
              <span>It copies automatically &mdash; just <strong>paste it</strong> in your ticket</span>
            </div>
          </div>
        </ContentSection>

        {/* ── SteamID64 ── */}
        <ContentSection title="How to Find Your SteamID64">
          <p className="mb-2">Website sign-in identifies your Steam account automatically. If staff ask for an ID, or an application asks for tribe members&apos; Steam IDs, use this guide and share them only in private support.</p>
          <div className="space-y-2">
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">1</span>
              <span>Open <strong>Steam</strong> &rarr; click your name in the top right</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">2</span>
              <span>Copy the URL from your browser (e.g. <code className="bg-bg-card px-1.5 py-0.5 rounded text-text-primary text-xs">steamcommunity.com/profiles/7656...</code>)</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">3</span>
              <span>If you have a custom URL, go to <a href="https://steamid.io" target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">steamid.io</a> and paste your profile link to get the 17-digit number</span>
            </div>
          </div>
        </ContentSection>

        {/* ── Mod Mismatch ── */}
        <ContentSection title="Mod Mismatch Fix">
          <p className="text-text-primary font-medium mb-2">
            Getting a &quot;Mod Mismatch&quot; or &quot;Mod Version Mismatch&quot; error? Your mods are out of date.
          </p>
          <div className="space-y-2.5 mb-3">
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">1</span>
              <span>Open the <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=3282623549" target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">MESA Mod Pack</a> on Steam Workshop</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">2</span>
              <span>First check Steam&apos;s Downloads page and let pending Workshop updates finish. Close ARK before changing subscriptions.</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">3</span>
              <span>If a specific mod still mismatches, unsubscribe and resubscribe to that mod, then wait for it to download. Use <strong>Subscribe to All</strong> on the collection if you are missing required mods.</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">4</span>
              <span>Wait for Steam to finish downloading all mods</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">5</span>
              <span>Restart ARK and try joining again</span>
            </div>
          </div>
          <div className="p-3 rounded-lg border border-border bg-bg-card/30 text-xs">
            <strong className="text-text-primary">Still not working?</strong> Close Steam completely, reopen it, and let the mods finish updating. Sometimes Steam doesn&apos;t download workshop updates until you restart it.
          </div>
        </ContentSection>

        {/* ── Troubleshooting ── */}
        <ContentSection title="Troubleshooting &mdash; Crashes & Performance">
          <p className="font-semibold text-text-primary mb-2">Verify Game Files (checks for missing or damaged files):</p>
          <div className="space-y-2 mb-4">
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">1</span>
              <span>Open Steam Library &rarr; right-click <strong>ARK</strong> &rarr; <strong>Properties</strong> &rarr; <strong>Installed Files</strong></span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">2</span>
              <span>Click <strong>Verify integrity of game files</strong></span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">3</span>
              <span>Wait for Steam to check and re-download any corrupted files, then restart ARK</span>
            </div>
          </div>

          <p className="font-semibold text-text-primary mb-2">Crystal Isles crashing:</p>
          <RuleItem text="Try verifying game files first (above)." />
          <RuleItem text="Check Steam Library → ARK → Properties → DLC and confirm Crystal Isles is installed. Capture the error if verification and the DLC check do not help." />

          <p className="font-semibold text-text-primary mt-3 mb-2">VPN issues:</p>
          <RuleItem text="If you use a VPN and get connection timeouts, compare with your normal connection if you can. Report whether only one connection fails." />

          <p className="font-semibold text-text-primary mt-3 mb-2">Still not working:</p>
          <RuleItem text="Open a support ticket with the error and checks you tried before a full reinstall. Keep backups of saves and configuration; do not delete the entire ARK folder as a first troubleshooting step." />
          <p className="text-xs">File verification steps: <a href="https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB" className="text-accent underline underline-offset-4">Steam Support</a>.</p>
        </ContentSection>

        {/* ── Custom Keybinds ── */}
        <ContentSection title="MESA Custom Keybinds">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex gap-3 items-center p-2 rounded bg-bg-card/30 border border-border">
              <code className="bg-blue/10 text-blue px-2 py-0.5 rounded text-xs font-bold shrink-0">P</code>
              <span className="text-sm">Find tribemates</span>
            </div>
            <div className="flex gap-3 items-center p-2 rounded bg-bg-card/30 border border-border">
              <code className="bg-blue/10 text-blue px-2 py-0.5 rounded text-xs font-bold shrink-0">F2</code>
              <span className="text-sm">In-game shop</span>
            </div>
            <div className="flex gap-3 items-center p-2 rounded bg-bg-card/30 border border-border">
              <code className="bg-blue/10 text-blue px-2 py-0.5 rounded text-xs font-bold shrink-0">F3</code>
              <span className="text-sm">Capture TP leaderboard</span>
            </div>
            <div className="flex gap-3 items-center p-2 rounded bg-bg-card/30 border border-border">
              <code className="bg-blue/10 text-blue px-2 py-0.5 rounded text-xs font-bold shrink-0">F4</code>
              <span className="text-sm">Armor durability info</span>
            </div>
            <div className="flex gap-3 items-center p-2 rounded bg-bg-card/30 border border-border">
              <code className="bg-blue/10 text-blue px-2 py-0.5 rounded text-xs font-bold shrink-0">Ctrl+U</code>
              <span className="text-sm">Reset skins</span>
            </div>
            <div className="flex gap-3 items-center p-2 rounded bg-bg-card/30 border border-border">
              <code className="bg-blue/10 text-blue px-2 py-0.5 rounded text-xs font-bold shrink-0">MMB</code>
              <span className="text-sm">Ping your tribe</span>
            </div>
            <div className="flex gap-3 items-center p-2 rounded bg-bg-card/30 border border-border">
              <code className="bg-blue/10 text-blue px-2 py-0.5 rounded text-xs font-bold shrink-0">L.Ctrl</code>
              <span className="text-sm">Cryopod menu</span>
            </div>
            <div className="flex gap-3 items-center p-2 rounded bg-bg-card/30 border border-border">
              <code className="bg-blue/10 text-blue px-2 py-0.5 rounded text-xs font-bold shrink-0">Tab</code>
              <span className="text-sm">Open console</span>
            </div>
          </div>
        </ContentSection>

        {/* ── Useful Commands ── */}
        <ContentSection title="Useful In-Game Commands">
          <div className="space-y-1.5 text-sm">
            <RuleItem text="/giveengrams — Unlock all available engrams" />
            <RuleItem text="/dmg 1 on — Turn on damage numbers" />
            <RuleItem text="/fill — Fill nearby turrets from your inventory" />
            <RuleItem text="/turrets on/off — Toggle turrets in range" />
            <RuleItem text="/pod — Cryopod nearby dinos" />
            <RuleItem text="/claim — Claim all unclaimed babies nearby" />
            <RuleItem text="/imprint — Imprint all babies that need cuddles" />
            <RuleItem text="/farm — Enable auto farming" />
            <RuleItem text="/auto — Enable Auto Yuty, Mammoth & Shadowmane" />
            <RuleItem text="/heal — Enable Daedon heal" />
            <RuleItem text="/mystats — Show your personal stats" />
            <RuleItem text="/leaderboard — Current tribe score leaderboard" />
            <RuleItem text="/dinolimit — Your tribe's dino limit" />
            <RuleItem text="/structurelimit — Your tribe's structure limit" />
            <RuleItem text="/dinostats — When facing a dino, shows stat points" />
            <RuleItem text="/forge — Turn on all nearby forges" />
            <RuleItem text="/suicide — Kill your player" />
            <RuleItem text="/bannedzones — Show restricted build areas" />
          </div>
        </ContentSection>

      </div>
    </>
  );
}
