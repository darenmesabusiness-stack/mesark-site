import { shareCard, cardSize } from "@/lib/shareCard";
import { CLUSTERS, clusterByKey, fixText, hours, kd, num, playerFromParams, playerTotals } from "@/lib/leaderboard";

export const revalidate = 300;
export const size = cardSize;
export const contentType = "image/png";
export const alt = "MESA ARK player profile";

export default async function Image({ params }: { params: Promise<{ name: string }> }) {
  const p = await playerFromParams(params);
  if (!p) {
    return shareCard({ kicker: "MESA ARK · Player profile", title: "Player profiles", art: "/art/ark/siege.jpg", stats: [] });
  }
  const t = playerTotals(p.clusters);
  const best = clusterByKey(t.best.cluster) ?? CLUSTERS[0];
  return shareCard({
    kicker: `MESA ARK · ${p.clusters.map((c) => clusterByKey(c.cluster)?.name ?? c.cluster).join(" · ")}`,
    title: fixText(p.playerName),
    art: best.art,
    stats: [
      { label: "Kills", value: num(t.kills) },
      { label: "K/D", value: kd(t.kills, t.deaths) },
      { label: `Rank · ${best.name}`, value: `#${num(t.best.killsRank)}` },
      { label: "Hours", value: hours(t.playTime) },
    ],
  });
}
