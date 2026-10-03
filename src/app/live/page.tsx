import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { LivePopulation } from "@/components/LivePopulation";
import { PopHistory } from "@/components/live/PopHistory";
import { MesaMap } from "@/components/live/MesaMap";
import { getPopulation } from "@/lib/population";
import { getMesaMap } from "@/lib/mesaMapData";
import { mapCluster } from "@/lib/mesaMap";
import { CLUSTERS } from "@/lib/leaderboard";
import { mapPreview } from "@/lib/mesaMapStore";

export const metadata = pageMeta({ title: "Mesa Map", description: "Explore MESA's top ten tribes by cluster. Tribe score bubbles, player rosters and verified home locations, opening 24 hours after each wipe." });
// Wipe gates and locations must be checked on every request.
export const dynamic = "force-dynamic";

export default async function LivePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams, cluster = mapCluster(params.cluster);
  const [pop, map] = await Promise.all([getPopulation().catch(() => null), getMesaMap(cluster.key)]);
  return <>
    <PageHeader title="Mesa Map" subtitle="The biggest tribes in each cluster. Open a bubble to explore who's behind the score."
      image="/art/ark/rex.jpg" focus="object-[75%_40%]" kicker="MESA community" />
    <div className="mx-auto max-w-5xl space-y-8 px-4 pb-20">
      {mapPreview() && <p className="border border-accent/50 px-4 py-3 text-sm text-accent">Local review: real public tribe scores with a test wipe window. No base locations are published.</p>}
      <nav className="flex flex-wrap gap-2" aria-label="Choose Mesa Map cluster">{CLUSTERS.map(c => <Link key={c.key} href={`/live?cluster=${c.key}`} aria-current={c.key === cluster.key ? "page" : undefined}
        className={`min-h-11 border px-5 py-2 font-display text-xl font-bold ${c.key === cluster.key ? "border-accent bg-accent text-bg-primary" : "border-border bg-bg-card/60 hover:border-accent/50"}`}>{c.name}</Link>)}</nav>
      <section aria-labelledby="mesa-map-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2"><h2 id="mesa-map-title" className="font-display text-4xl font-black">{cluster.name} tribes</h2><p className="text-sm text-text-muted">Opens 24 hours after each wipe</p></div>
        {!map.open ? <div className="border border-border bg-bg-card/60 p-6"><h3 className="font-display text-2xl font-bold">{map.unlock ? "Fresh wipe. Let the tribes settle in." : "Waiting for this wipe's map"}</h3>
          <p className="mt-2 text-text-muted">{map.unlock ? <>The map opens <time dateTime={map.unlock}>{new Date(map.unlock).toLocaleString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })} ET</time>.</> : "The map opens 24 hours after staff confirm the completed wipe. It closes again for the next wipe."}</p></div> : map.unavailable ? <p className="border border-border p-6 text-text-muted">Tribe scores are temporarily unavailable. Please try again shortly.</p> : <MesaMap key={cluster.key} cluster={cluster.key} tribes={map.tribes} expiresAt={map.expires} />}
      </section>
      <details className="border border-border bg-bg-card/40 p-5"><summary className="cursor-pointer font-display text-2xl font-bold">Players online &amp; last 24 hours</summary><div className="mt-5 space-y-6">{pop ? <><LivePopulation pop={pop} /><PopHistory pop={pop} /></> : <p className="text-text-muted">Live player counts are updating.</p>}</div></details>
      <details className="border border-border bg-bg-card/40 p-5"><summary className="cursor-pointer font-display text-2xl font-bold">Vault &amp; Rare Dino notifications</summary><p className="mt-3 text-text-muted">Follow your cluster&apos;s server notifier in Discord for the ongoing event log.</p><a href="https://discord.gg/mesark" className="mt-3 inline-block text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer">Open MESA Discord ↗</a></details>
      <p className="text-sm text-text-muted">Looking for cave layouts? <Link href="/maps" className="text-accent underline underline-offset-4">Cave Maps</Link> · <Link href="/leaderboards?view=tribes" className="text-accent underline underline-offset-4">All tribe rankings</Link></p>
    </div>
  </>;
}
