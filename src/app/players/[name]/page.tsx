import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfileHero } from "@/components/profiles/ProfileHero";
import {
  CLUSTERS,
  clusterByKey,
  fixText,
  hours,
  isBlockedName,
  kd,
  num,
  playerFromParams,
  playerTotals,
  tribeHref,
  type PlayerCluster,
} from "@/lib/leaderboard";

// Rendered on first visit, then cached and refreshed every 5 min.
export const revalidate = 300;
export function generateStaticParams() {
  return [];
}

type Params = { params: Promise<{ name: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await playerFromParams(params);
  if (!p) return { title: "Player not found | MESA ARK", robots: { index: false } };
  const name = fixText(p.playerName);
  const t = playerTotals(p.clusters);
  const where = p.clusters.map((c) => clusterByKey(c.cluster)?.name ?? c.cluster).join(", ");
  const title = `${name} — MESA ARK player profile`;
  const description = `${num(t.kills)} kills, ${kd(t.kills, t.deaths)} K/D and ${hours(t.playTime)} hours on MESA ${where}. Best rank: #${t.best.killsRank} in kills on ${clusterByKey(t.best.cluster)?.name ?? t.best.cluster}.`;
  // Player-chosen names: shareable, but kept out of search indexes.
  return { title, description, robots: { index: false, follow: true }, openGraph: { title, description }, twitter: { card: "summary_large_image", title, description } };
}

export default async function PlayerPage({ params }: Params) {
  const p = await playerFromParams(params);
  if (!p) notFound();
  const name = fixText(p.playerName);
  const t = playerTotals(p.clusters);
  const art = clusterByKey(t.best.cluster) ?? CLUSTERS[0];
  const order = (k: string) => CLUSTERS.findIndex((c) => c.key === k);
  const clusters = [...p.clusters].sort((a, b) => order(a.cluster) - order(b.cluster));

  const totals = [
    { label: "Kills", value: num(t.kills) },
    { label: "Deaths", value: num(t.deaths) },
    { label: "K/D", value: kd(t.kills, t.deaths) },
    { label: "Tame kills", value: num(t.dinoKills) },
    { label: "Wild kills", value: num(t.wildDinoKills) },
    { label: "Hours", value: hours(t.playTime) },
  ];

  return (
    <>
      <ProfileHero
        kicker="Player profile"
        title={name}
        sub={`On ${clusters.map((c) => clusterByKey(c.cluster)?.name ?? c.cluster).join(" · ")} · best: #${num(t.best.killsRank)} in kills on ${art.name}`}
        art={art.art}
        focus={art.focus}
      />

      <div className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid grid-cols-3 gap-px border border-border bg-border sm:grid-cols-6">
          {totals.map((s) => (
            <div key={s.label} className="bg-bg-secondary px-3 py-3">
              <p className="hud-label !text-[10px]">{s.label}</p>
              <p className="font-display mt-1 text-3xl font-black">{s.value}</p>
            </div>
          ))}
        </div>
        <p className="hud-label mt-3 !text-[10px]">All clusters combined</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {clusters.map((c) => (
            <ClusterCard key={c.cluster} c={c} />
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Live leaderboard stats, refreshed every few minutes. Names are shown as typed in game.</p>
          <div className="flex gap-6">
            <Link href="/players" className="hud-label !text-text-primary/80 transition hover:!text-accent">
              Find another player →
            </Link>
            <a href="https://leaderboards.mesark.net" className="hud-label !text-text-primary/80 transition hover:!text-accent">
              Leaderboards →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function ClusterCard({ c }: { c: PlayerCluster }) {
  const cl = clusterByKey(c.cluster) ?? CLUSTERS[0];
  const tribe = fixText(c.tribeName);
  const tribeHidden = isBlockedName(c.tribeName);
  const stats = [
    ["Kills", num(c.kills)],
    ["Deaths", num(c.deaths)],
    ["K/D", kd(c.kills, c.deaths)],
    ["Tame kills", num(c.dinoKills)],
    ["Wild kills", num(c.wildDinoKills)],
    ["Tamed", num(c.dinosTamed)],
    ["Dino deaths", num(c.deathsByDino + c.deathsByWildDino)],
    ["Hours", hours(c.playTime)],
  ];

  return (
    <div className="clip-corner overflow-hidden border border-border bg-bg-card">
      <div className="flex items-center gap-4 border-b border-border p-4">
        <div className="clip-corner-sm relative h-20 w-16 shrink-0 overflow-hidden">
          <Image src={cl.art} alt="" fill sizes="64px" className={`object-cover ${cl.focus}`} />
        </div>
        <h2 className="font-display min-w-0 flex-1 text-4xl font-black sm:text-5xl">{cl.name}</h2>
        <p className="text-right">
          <span className="font-display block text-3xl font-black text-accent">#{num(c.killsRank)}</span>
          <span className="hud-label !text-[10px]">in kills of {num(c.totalPlayers)}</span>
        </p>
      </div>
      <div className="p-5 pt-4">
        <p className="text-sm text-text-muted">
          Tribe:{" "}
          {tribeHidden ? (
            <span className="text-text-primary/60">name hidden</span>
          ) : c.tribeId && tribe ? (
            <Link href={tribeHref(c.cluster, c.tribeId)} className="font-semibold text-text-primary transition hover:text-accent">
              {tribe} →
            </Link>
          ) : (
            <span className="text-text-primary/80">none</span>
          )}
        </p>
        <dl className="mt-4 grid grid-cols-4 gap-x-3 gap-y-4">
          {stats.map(([label, value]) => (
            <div key={label}>
              <dt className="hud-label !text-[9px]">{label}</dt>
              <dd className="font-display mt-0.5 text-2xl font-black">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
