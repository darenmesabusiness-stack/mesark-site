import { accountStats } from "@/lib/account-profile";
import { PlayerStats } from "@/components/profiles/PlayerStats";

/** Stream identity-matched stats without holding up account controls. */
export async function LinkedStats({ steamId }: { steamId: string }) {
  const stats = await accountStats(steamId);
  return <>
    {stats === null ? <p className="border border-border bg-bg-card p-5 text-text-muted">Game stats are temporarily unavailable. Your Steam account is connected; try again shortly.</p>
      : stats.clusters.length ? <PlayerStats clusters={stats.clusters} />
      : <p className="border border-border bg-bg-card p-5 text-text-muted">{stats.unavailable.length ? "No stats found on the clusters currently available. Some clusters couldn’t be checked; try again shortly." : "No current-wipe stats found for this Steam account yet. Play on a MESA cluster and your recorded stats will appear here automatically."}</p>}
    {stats?.unavailable.length ? <p className="mt-3 text-sm text-text-muted">Some clusters couldn’t be reached. Their stats will appear when they are available again.</p> : null}
  </>;
}
