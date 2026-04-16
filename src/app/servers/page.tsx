import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContentSection } from "@/components/ContentSection";
import { CopyIP } from "@/components/CopyIP";

export const metadata: Metadata = {
  title: "Server List — MESA ARK",
  description: "Browse 106+ ARK: Survival Evolved PvP servers across Solo, Duo, 3/6 Man, 4 Man, and 100x clusters. Copy any server IP to join.",
};

const clusters = [
  {
    name: "4 Man",
    servers: [
      { map: "Aberration", ip: "141.98.157.224:7777" },
      { map: "Crystal Isles", ip: "141.98.157.224:7779" },
      { map: "Extinction", ip: "141.98.157.224:7781" },
      { map: "Fjordur", ip: "141.98.157.224:7783" },
      { map: "Fjordur 2", ip: "141.98.157.224:7785" },
      { map: "Ragnarok", ip: "141.98.157.230:7777" },
      { map: "The Center", ip: "141.98.157.230:7779" },
      { map: "The Center 2", ip: "141.98.157.230:7781" },
      { map: "The Center 3", ip: "141.98.157.230:7783" },
      { map: "Genesis 1", ip: "141.98.157.230:7785" },
      { map: "Genesis 2", ip: "141.98.157.67:7777" },
      { map: "Lost Island", ip: "141.98.157.67:7779" },
      { map: "Scorched Earth", ip: "141.98.157.67:7781" },
      { map: "The Island", ip: "141.98.157.67:7783" },
      { map: "The Island 2", ip: "141.98.157.67:7785" },
      { map: "Valguero", ip: "141.98.157.67:7787" },
      { map: "Trading Outpost", ip: "141.98.157.67:7789" },
      { map: "MESA City", ip: "141.98.157.67:7791" },
      { map: "No Build Aberration", ip: "141.98.157.67:7793" },
      { map: "No Build Scorched Earth", ip: "141.98.157.67:7795" },
    ],
  },
  {
    name: "3 Man",
    servers: [
      { map: "Aberration", ip: "141.98.157.231:7777" },
      { map: "Crystal Isles", ip: "141.98.157.231:7779" },
      { map: "Crystal Isles 2", ip: "141.98.157.231:7781" },
      { map: "Extinction", ip: "141.98.157.231:7783" },
      { map: "Fjordur", ip: "141.98.157.231:7785" },
      { map: "Fjordur 2", ip: "141.98.157.233:7777" },
      { map: "Fjordur 3", ip: "141.98.157.233:7779" },
      { map: "Genesis 1", ip: "141.98.157.233:7781" },
      { map: "Genesis 2", ip: "141.98.157.233:7783" },
      { map: "Genesis 2 (2)", ip: "141.98.157.233:7785" },
      { map: "Lost Island", ip: "141.98.157.27:7777" },
      { map: "Ragnarok", ip: "141.98.157.27:7779" },
      { map: "Ragnarok 2", ip: "141.98.157.27:7781" },
      { map: "Ragnarok 3", ip: "141.98.157.27:7783" },
      { map: "Scorched Earth", ip: "141.98.157.27:7785" },
      { map: "The Center", ip: "141.98.157.188:7777" },
      { map: "The Center 2", ip: "141.98.157.188:7779" },
      { map: "The Island", ip: "141.98.157.188:7781" },
      { map: "Valguero", ip: "141.98.157.188:7783" },
      { map: "Valguero 2", ip: "141.98.157.188:7785" },
      { map: "MESA City", ip: "141.98.157.188:7787" },
      { map: "MESA City 2", ip: "141.98.157.188:7789" },
      { map: "Trading Outpost", ip: "141.98.157.188:7791" },
      { map: "No Build Aberration", ip: "141.98.157.188:7793" },
      { map: "No Build Scorched Earth", ip: "141.98.157.188:7795" },
      { map: "Rare Dinos & Event Map", ip: "141.98.157.188:7797" },
    ],
  },
  {
    name: "100x",
    servers: [
      { map: "Aberration", ip: "185.172.175.148:7777" },
      { map: "Crystal Isles", ip: "185.172.175.148:7779" },
      { map: "Extinction", ip: "185.172.175.148:7781" },
      { map: "Fjordur", ip: "185.172.175.148:7783" },
      { map: "Genesis 1", ip: "185.172.175.148:7785" },
      { map: "Genesis 2", ip: "185.172.175.148:7787" },
      { map: "Lost Island", ip: "185.172.175.253:7777" },
      { map: "Ragnarok", ip: "185.172.175.253:7779" },
      { map: "Scorched Earth", ip: "185.172.175.253:7781" },
      { map: "The Center", ip: "185.172.175.253:7783" },
      { map: "The Island", ip: "185.172.175.253:7785" },
      { map: "Valguero", ip: "185.172.175.253:7787" },
      { map: "MESA City", ip: "185.172.175.253:7789" },
      { map: "Trading Outpost", ip: "185.172.175.253:7791" },
    ],
  },
  {
    name: "Duo",
    servers: [
      { map: "Aberration", ip: "185.172.175.43:7777" },
      { map: "Crystal Isles", ip: "185.172.175.43:7779" },
      { map: "Crystal Isles 2", ip: "185.172.175.43:7781" },
      { map: "Extinction", ip: "185.172.175.43:7783" },
      { map: "Fjordur", ip: "185.172.175.43:7785" },
      { map: "Fjordur 2", ip: "185.172.175.11:7777" },
      { map: "Genesis 1", ip: "185.172.175.11:7779" },
      { map: "Genesis 2", ip: "185.172.175.11:7781" },
      { map: "Genesis 2 (2)", ip: "185.172.175.11:7783" },
      { map: "Lost Island", ip: "185.172.175.11:7785" },
      { map: "Ragnarok", ip: "185.172.175.101:7777" },
      { map: "Ragnarok 2", ip: "185.172.175.101:7779" },
      { map: "Scorched Earth", ip: "185.172.175.101:7781" },
      { map: "The Center", ip: "185.172.175.101:7783" },
      { map: "The Center 2", ip: "185.172.175.101:7785" },
      { map: "The Island", ip: "185.172.175.101:7787" },
      { map: "Valguero", ip: "185.172.175.101:7789" },
      { map: "No Build Ab", ip: "185.172.175.101:7791" },
      { map: "No Build Scorched", ip: "185.172.175.101:7793" },
      { map: "Rare Dinos Map", ip: "185.172.175.101:7795" },
      { map: "Trade Map", ip: "185.172.175.101:7797" },
      { map: "MESA City", ip: "185.172.175.101:7799" },
    ],
  },
  {
    name: "Solo",
    servers: [
      { map: "Aberration", ip: "141.98.157.49:7777" },
      { map: "Crystal Isles", ip: "141.98.157.49:7779" },
      { map: "Crystal Isles 2", ip: "141.98.157.49:7781" },
      { map: "Extinction", ip: "141.98.157.49:7783" },
      { map: "Fjordur", ip: "141.98.157.49:7785" },
      { map: "Fjordur 2", ip: "141.98.157.72:7777" },
      { map: "Genesis 1", ip: "141.98.157.72:7779" },
      { map: "Genesis 2", ip: "141.98.157.72:7781" },
      { map: "Genesis 2 (2)", ip: "141.98.157.72:7783" },
      { map: "Lost Island", ip: "141.98.157.72:7785" },
      { map: "Ragnarok", ip: "141.98.157.253:7777" },
      { map: "Ragnarok 2", ip: "141.98.157.253:7779" },
      { map: "Scorched Earth", ip: "141.98.157.253:7781" },
      { map: "The Center", ip: "141.98.157.253:7783" },
      { map: "The Center 2", ip: "141.98.157.253:7785" },
      { map: "The Island", ip: "141.98.157.253:7787" },
      { map: "Valguero", ip: "141.98.157.253:7789" },
      { map: "No Build Ab", ip: "141.98.157.253:7791" },
      { map: "No Build Scorched", ip: "141.98.157.253:7793" },
      { map: "Rare Dinos Map", ip: "141.98.157.253:7795" },
      { map: "Trade Map", ip: "141.98.157.253:7797" },
      { map: "MESA City", ip: "141.98.157.253:7799" },
    ],
  },
];

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
              className="w-full h-full border-0"
            />
          </div>
        </div>

        {clusters.map((cluster, i) => (
          <ContentSection key={cluster.name} title={cluster.name} defaultOpen={i === 0}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cluster.servers.map((server) => (
                <CopyIP key={server.ip} ip={server.ip} label={server.map} />
              ))}
            </div>
          </ContentSection>
        ))}
      </div>
    </>
  );
}
