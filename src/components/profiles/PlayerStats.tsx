import Image from "next/image";
import Link from "next/link";
import { CLUSTERS, clusterByKey, fixText, hours, isBlockedName, kd, num, playerTotals, tribeHref, type PlayerCluster } from "@/lib/leaderboard";

export function PlayerStats({ clusters }: { clusters: (PlayerCluster & { playerName?: string })[] }) {
  const t = playerTotals(clusters);
  const totals = [
    ["Kills", num(t.kills)], ["Deaths", num(t.deaths)], ["K/D", kd(t.kills, t.deaths)],
    ["Tame kills", num(t.dinoKills)], ["Wild kills", num(t.wildDinoKills)], ["Hours", hours(t.playTime)],
  ];
  return <>
    <dl className="grid grid-cols-3 gap-px border border-border bg-border sm:grid-cols-6">
      {totals.map(([label, value]) => <div key={label} className="bg-bg-secondary px-3 py-3">
        <dt className="hud-label !text-sm">{label}</dt><dd className="font-display mt-1 text-3xl font-black">{value}</dd>
      </div>)}
    </dl>
    <p className="mt-3 text-sm text-text-muted">All clusters combined · stats refresh every few minutes.</p>
    <div className="mt-8 grid gap-6 md:grid-cols-2">{clusters.map(c => <ClusterCard key={c.cluster} c={c} />)}</div>
  </>;
}
function ClusterCard({ c }: { c: PlayerCluster & { playerName?: string } }) {
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
          <span className="hud-label !text-sm">in kills of {num(c.totalPlayers)}</span>
        </p>
      </div>
      <div className="p-5 pt-4">
        {c.playerName && <p className="mb-2 text-sm text-text-muted">Survivor: {isBlockedName(c.playerName) ? "name hidden" : fixText(c.playerName)}</p>}
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
              <dt className="hud-label !text-sm">{label}</dt>
              <dd className="font-display mt-0.5 text-2xl font-black">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
