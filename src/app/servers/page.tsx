import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ServerList } from "@/components/ServerList";
import { WipeCountdown } from "@/components/WipeCountdown";
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
        <div className="rounded-xl border border-border bg-bg-card/50 overflow-hidden">
          <div className="px-6 py-4">
            <h3 className="font-bold text-lg mb-1">How to Connect</h3>
            <p className="text-sm text-text-muted">Copy a server IP below, then follow this quick guide to join.</p>
          </div>
          <div className="aspect-video w-full">
            <iframe
              src="https://www.youtube.com/embed/ZPXEAtJMTrc"
              title="How to Connect to MESA Servers"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="w-full h-full border-0"
            />
          </div>
        </div>

        {/* Wipe countdown */}
        <WipeCountdown />

        <ServerList clusters={clusters} />
      </div>
    </>
  );
}
