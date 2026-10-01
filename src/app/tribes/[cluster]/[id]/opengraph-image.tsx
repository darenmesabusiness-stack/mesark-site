import { shareCard, cardSize } from "@/lib/shareCard";
import { fixText, kd, num, tribeFromParams, tribeTotals } from "@/lib/leaderboard";

export const revalidate = 300;
export const size = cardSize;
export const contentType = "image/png";
export const alt = "MESA ARK tribe profile";

export default async function Image({ params }: { params: Promise<{ cluster: string; id: string }> }) {
  const r = await tribeFromParams(params);
  if (!r) {
    return shareCard({ kicker: "MESA ARK · Tribe profile", title: "Tribe profiles", art: "/art/ark/siege.jpg", stats: [] });
  }
  const { cluster, tribe } = r;
  const t = tribeTotals(tribe.members);
  return shareCard({
    kicker: `MESA ARK · ${cluster.name} tribe`,
    title: fixText(tribe.tribeName),
    art: cluster.art,
    stats: [
      { label: "Score rank", value: `#${num(tribe.scoreRank)}` },
      { label: "Kills", value: num(t.kills) },
      { label: "K/D", value: kd(t.kills, t.deaths) },
      { label: "Members", value: String(tribe.members.length) },
    ],
  });
}
