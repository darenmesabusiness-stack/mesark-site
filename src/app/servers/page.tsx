import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ServerList } from "@/components/ServerList";
import { WipeCountdown } from "@/components/WipeCountdown";
import { ContentSection } from "@/components/ContentSection";
import { clusters } from "@/data/servers";

export const metadata: Metadata = {
  title: "Server List — MESA ARK",
  description: "Browse 106+ ARK: Survival Evolved PvP servers across Solo, Duo, 3/6 Man, 4 Man, and 100x clusters. Copy any server IP to join.",
};

export default function ServersPage() {
  return (
    <>
      <PageHeader
        title="Server List"
        subtitle="Click any server to copy its IP."
      />

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
        {/* How to connect */}
        <ContentSection title="How to Connect">
          <p>Copy a server IP below, then follow this quick guide to join.</p>
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/ZPXEAtJMTrc"
              title="How to Connect to MESA Servers"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="w-full h-full border-0"
            />
          </div>
        </ContentSection>

        {/* Mod Pack */}
        <div className="rounded-xl border border-border bg-bg-card/50 px-6 py-5 space-y-3">
          <h3 className="font-bold text-lg">MESA Mod Pack</h3>
          <p className="text-sm text-text-muted">
            Subscribe to the MESA mod collection on Steam. Required to join any MESA server.
          </p>
          <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=3282623549" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue/80 hover:bg-blue text-white rounded-lg transition-all">
            Subscribe on Steam Workshop
          </a>
        </div>

        {/* Wipe countdown */}
        <WipeCountdown />

        <ServerList clusters={clusters} />

        {/* Pre-Aquatica guide */}
        <ContentSection title="Can't Find MESA Servers?">
          <p>You need to switch to the pre-Aquatica branch in Steam. Watch this guide:</p>
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/yBGv_G-gG4Y"
              title="How to Switch to Pre-Aquatica Branch"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="w-full h-full border-0"
            />
          </div>
        </ContentSection>
      </div>
    </>
  );
}
