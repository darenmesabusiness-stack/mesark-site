import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContentSection } from "@/components/ContentSection";
import { CopyBlock } from "@/components/CopyBlock";

export const metadata: Metadata = {
  title: "Helpful — MESA ARK",
  description: "Helpful guides, recommended INI settings, and tips for MESA ARK PvP servers.",
};

const RECOMMENDED_INI = `[/Script/ShooterGame.ShooterGameUserSettings]
MasterAudioVolume=1.000000
MusicAudioVolume=0.000000
SFXAudioVolume=1.000000
CameraShakeScale=0.000000
bFirstPersonRiding=False
bThirdPersonPlayer=True
FOVMultiplier=1.200000
bShowStatusNotificationMessages=True
TrueSkyQuality=0.000000
bDisableBloom=True
bDisableLightShafts=True

[/Script/Engine.RendererSettings]
r.DepthOfField.MaxSize=0
r.BloomQuality=0
r.LightShaftQuality=0
r.LensFlareQuality=0
r.ShadowQuality=0
r.Shadow.CSM.MaxCascades=0
sg.GroundClutterQuality=0
r.MotionBlurQuality=0
r.AmbientOcclusionLevels=0
r.MaterialQualityLevel=0
r.MaxAnisotropy=0`;

export default function HelpfulPage() {
  return (
    <>
      <PageHeader
        title="Helpful Guides"
        subtitle="Tips, settings, and guides to get the most out of MESA."
      />

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
        {/* ── INI Settings ── */}
        <ContentSection title="Recommended INI Settings" defaultOpen={true}>
          <p className="text-text-primary font-medium mb-2">
            INI files are allowed on MESA. Use these recommended PvP settings for better performance and visibility.
          </p>

          <CopyBlock content={RECOMMENDED_INI} />

          <div className="mt-4 space-y-3">
            <p className="text-text-primary font-semibold">How to set up your INI:</p>
            <div className="space-y-2">
              <div className="flex gap-3 items-start">
                <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">1</span>
                <span>Open Steam &rarr; right-click <strong>ARK</strong> &rarr; <strong>Manage</strong> &rarr; <strong>Browse Local Files</strong></span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">2</span>
                <span>Navigate to <code className="bg-bg-card px-1.5 py-0.5 rounded text-text-primary text-xs">ShooterGame\Saved\Config\WindowsNoEditor\</code></span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">3</span>
                <span>Open <strong>GameUserSettings.ini</strong> with Notepad</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">4</span>
                <span>Paste the settings above (replace or add to existing sections)</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">5</span>
                <span>Save the file &rarr; right-click it &rarr; <strong>Properties</strong> &rarr; check <strong>Read-only</strong></span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="bg-blue/20 text-blue text-xs font-bold px-2 py-0.5 rounded shrink-0">6</span>
                <span>Launch ARK &mdash; your settings are applied</span>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-lg border border-border bg-bg-card/30 text-xs">
              <strong className="text-text-primary">Why read-only?</strong> ARK resets your INI every time you change settings in the menu. Setting read-only prevents this.
            </div>
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
              <span>If you have a custom URL, go to <a href="https://steamid.io" target="_blank" className="text-blue hover:underline">steamid.io</a> and paste your profile link to get the 17-digit number</span>
            </div>
          </div>
        </ContentSection>
      </div>
    </>
  );
}
