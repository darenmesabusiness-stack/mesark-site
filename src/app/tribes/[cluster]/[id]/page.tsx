import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfileHero } from "@/components/profiles/ProfileHero";
import { pageMeta } from "@/lib/seo";
import { fixText, hours, isBlockedName, kd, num, playerHref, tribeFromParams, tribeTotals } from "@/lib/leaderboard";

// Rendered on first visit, then cached and refreshed every 5 min.
export const revalidate = 300;
export function generateStaticParams() {
  return [];
}

type Params = { params: Promise<{ cluster: string; id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const r = await tribeFromParams(params);
  if (!r) return { title: "Tribe not found", robots: { index: false } };
  const { cluster, tribe } = r;
  const t = tribeTotals(tribe.members);
  const name = fixText(tribe.tribeName);
  const description = `#${tribe.scoreRank} of ${num(tribe.totalTribes)} tribes on MESARK ${cluster.name}. ${tribe.members.length} members, ${num(t.kills)} kills, ${kd(t.kills, t.deaths)} K/D.`;
  return pageMeta({ title: `${name} (${cluster.name} tribe)`, description, image: null, noindex: true });
}

export default async function TribePage({ params }: Params) {
  const r = await tribeFromParams(params);
  if (!r) notFound();
  const { cluster, tribe } = r;
  const t = tribeTotals(tribe.members);

  const totals = [
    { label: "Tribe score", value: num(tribe.damageScore) },
    { label: "Kills", value: num(t.kills) },
    { label: "Deaths", value: num(t.deaths) },
    { label: "K/D", value: kd(t.kills, t.deaths) },
    { label: "Tame kills", value: num(t.dinoKills) },
    { label: "Hours", value: hours(t.playTime) },
  ];

  return (
    <>
      <ProfileHero
        kicker={`Tribe profile · ${cluster.name}`}
        title={fixText(tribe.tribeName)}
        sub={`#${num(tribe.scoreRank)} of ${num(tribe.totalTribes)} tribes by tribe score · ${tribe.members.length} member${tribe.members.length === 1 ? "" : "s"}`}
        art={cluster.art}
        focus={cluster.focus}
        shareLabel="Copy tribe link"
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

        <h2 className="font-display mt-12 text-5xl font-black">Members</h2>
        <div className="mt-4 overflow-x-auto border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-bg-secondary">
              <tr className="hud-label !text-[10px]">
                <th className="px-4 py-3 font-normal">Survivor</th>
                <th className="px-3 py-3 text-right font-normal">Kills</th>
                <th className="px-3 py-3 text-right font-normal">Deaths</th>
                <th className="px-3 py-3 text-right font-normal">K/D</th>
                <th className="px-3 py-3 text-right font-normal">Tame kills</th>
                <th className="px-3 py-3 text-right font-normal">Wild kills</th>
                <th className="px-4 py-3 text-right font-normal">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {tribe.members.map((m, i) => {
                const hidden = isBlockedName(m.PlayerName);
                return (
                  <tr key={`${m.PlayerName}-${i}`} className="bg-bg-card/40 transition hover:bg-accent/[0.05]">
                    <td className="px-4 py-3">
                      {hidden ? (
                        <span className="text-text-muted">Name hidden</span>
                      ) : (
                        <Link href={playerHref(m.PlayerName)} className="font-semibold transition hover:text-accent">
                          {fixText(m.PlayerName)}
                        </Link>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right font-mono">{num(m.PlayerKills)}</td>
                    <td className="px-3 py-3 text-right font-mono">{num(m.DeathByPlayer)}</td>
                    <td className="px-3 py-3 text-right font-mono">{kd(m.PlayerKills, m.DeathByPlayer)}</td>
                    <td className="px-3 py-3 text-right font-mono">{num(m.DinoKills)}</td>
                    <td className="px-3 py-3 text-right font-mono">{num(m.WildDinoKills)}</td>
                    <td className="px-4 py-3 text-right font-mono">{hours(m.PlayTime)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Live leaderboard stats. Tribe IDs reset when the cluster wipes, so this link lasts for the current wipe.</p>
          <div className="flex gap-6">
            <Link href="/players" className="hud-label !text-text-primary/80 transition hover:!text-accent">
              Find a tribe →
            </Link>
            <Link href="/leaderboards" className="hud-label !text-text-primary/80 transition hover:!text-accent">
              Leaderboards →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
