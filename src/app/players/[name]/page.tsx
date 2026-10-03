import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlayerStats } from "@/components/profiles/PlayerStats";
import { ProfileHero } from "@/components/profiles/ProfileHero";
import { pageMeta } from "@/lib/seo";
import {
  CLUSTERS,
  clusterByKey,
  fixText,
  hours,
  kd,
  num,
  playerFromParams,
  playerTotals,
} from "@/lib/leaderboard";

// Rendered on first visit, then cached and refreshed every 5 min.
export const revalidate = 300;
export function generateStaticParams() {
  return [];
}

type Params = { params: Promise<{ name: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await playerFromParams(params);
  if (!p) return { title: "Player not found", robots: { index: false } };
  const name = fixText(p.playerName);
  const t = playerTotals(p.clusters);
  const where = p.clusters.map((c) => clusterByKey(c.cluster)?.name ?? c.cluster).join(", ");
  const description = `${num(t.kills)} kills, ${kd(t.kills, t.deaths)} K/D and ${hours(t.playTime)} hours on MESARK ${where}.`;
  // Player-chosen names: shareable, but kept out of search indexes. The preview image comes from opengraph-image.tsx.
  return pageMeta({ title: name, description, image: null, noindex: true });
}

export default async function PlayerPage({ params }: Params) {
  const p = await playerFromParams(params);
  if (!p) notFound();
  const name = fixText(p.playerName);
  const t = playerTotals(p.clusters);
  const art = clusterByKey(t.best.cluster) ?? CLUSTERS[0];
  const order = (k: string) => CLUSTERS.findIndex((c) => c.key === k);
  const clusters = [...p.clusters].sort((a, b) => order(a.cluster) - order(b.cluster));



  return (
    <>
      <ProfileHero
        kicker="Player profile"
        title={name}
        avatar={p.avatar}
        sub={`On ${clusters.map((c) => clusterByKey(c.cluster)?.name ?? c.cluster).join(" · ")} · best: #${num(t.best.killsRank)} in kills on ${art.name}`}
        art={art.art}
        focus={art.focus}
      />

      <div className="mx-auto max-w-6xl px-4 pb-24"><PlayerStats clusters={clusters} /></div>
    </>
  );
}
