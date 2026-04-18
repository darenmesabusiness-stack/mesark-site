import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { ContentSection } from "@/components/ContentSection";
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
            inside your ARK Engine config folder. Pick the preset that matches your preference.
          </p>

          {/* Steps */}
          <div className="p-4 rounded-lg border border-blue/20 bg-blue/5 mb-4">
            <p className="text-text-primary font-semibold mb-3">How to install:</p>
            <div className="space-y-2.5">
              <div className="flex gap-3 items-start">
                <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">1</span>
                <span>
                  Open Steam &rarr; right-click <strong>ARK</strong> &rarr; <strong>Manage</strong> &rarr; <strong>Browse Local Files</strong>
                </span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">2</span>
                <span>
                  Navigate to <code className="bg-bg-card px-1.5 py-0.5 rounded text-text-primary text-xs">Engine &rarr; Config</code>
                </span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">3</span>
                <span>
                  Find <strong>BaseDeviceProfiles.ini</strong> (see image below)
                </span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">4</span>
                <span>
                  Open it with Notepad &rarr; <strong>delete everything</strong> inside &rarr; paste your chosen INI &rarr; save
                </span>
              </div>
            </div>

            <div className="mt-3 text-xs text-text-muted">
              The path is relative to wherever Steam installed ARK. If you use a different drive, adjust accordingly &mdash;
              the folder structure is always <code className="bg-bg-card px-1 py-0.5 rounded text-text-primary">...\ARK\Engine\Config\</code>
            </div>
          </div>

          {/* Screenshot */}
          <div className="rounded-lg overflow-hidden border border-border mb-5">
            <Image
              src="/ini/basedeviceprofiles.png"
              alt="BaseDeviceProfiles.ini location in ARK Engine Config folder"
              width={1456}
              height={816}
              className="w-full h-auto"
            />
          </div>

          {/* INI Presets */}
          <IniSection />
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
      </div>
    </>
  );
}
