import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { ContentSection, RuleItem } from "@/components/ContentSection";
import { IniSection } from "./IniSection";

export const metadata: Metadata = {
  title: "Helpful — MESA ARK",
  description: "Helpful guides, recommended INI settings, and tips for MESA ARK PvP servers.",
};

export default function HelpfulPage() {
  return (
    <>
      <PageHeader
        title="Helpful Guides"
        subtitle="Tips, settings, and guides to get the most out of MESA."
      />

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">

        {/* ── INI Setup ── */}
        <ContentSection title="PvP INI Settings (BaseDeviceProfiles)" defaultOpen={true}>
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
                <span>Open it with Notepad &rarr; <strong>delete everything</strong> inside &rarr; paste your chosen INI &rarr; save</span>
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
              <span>Open Steam &rarr; <strong>View</strong> &rarr; <strong>Servers</strong> &rarr; <strong>Favorites</strong> tab</span>
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
          <p className="mb-2">Admins need your CCC coordinates to teleport to your location in-game.</p>
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
          <p className="mb-2">Your SteamID64 is required when opening support tickets.</p>
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
              <span>Click <strong>Unsubscribe From All</strong> to remove old versions</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">3</span>
              <span>Click <strong>Subscribe to All</strong> to redownload the latest versions</span>
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
          <p className="font-semibold text-text-primary mb-2">Verify Game Files (fixes most issues):</p>
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
          <RuleItem text="If still crashing: Steam Library → ARK → DLC section → uncheck Crystal Isles → restart Steam → re-check Crystal Isles → try again." />

          <p className="font-semibold text-text-primary mt-3 mb-2">VPN issues:</p>
          <RuleItem text="Disable any VPN before connecting. VPNs can block game server ports or cause timeouts." />

          <p className="font-semibold text-text-primary mt-3 mb-2">Still not working:</p>
          <RuleItem text="Full reinstall: uninstall ARK, delete remaining files in Steam/steamapps/common/ARK/, reinstall, switch back to preaquatica branch." />
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
