import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { LivePopulation } from "@/components/LivePopulation";
import { EventFeed } from "@/components/live/EventFeed";
import { PopHistory } from "@/components/live/PopHistory";
import { getPopulation } from "@/lib/population";
import { getFeed } from "@/lib/feed";

export const metadata = pageMeta({
  title: "Live",
  description: "Players online right now across MESA, plus vault spawns, rare dinos and raids as they happen.",
});

// Refreshes every minute (the bot collects every 2 minutes).
export const revalidate = 60;

export default async function LivePage() {
  const [pop, feed] = await Promise.all([getPopulation().catch(() => null), getFeed().catch(() => null)]);
  const now = feed?.generated ?? pop?.updated ?? 0; // server time from the bot, so render stays pure
  return (
    <>
      <PageHeader
        title="Live"
        subtitle="Who's online and what's happening across every MESA cluster."
        image="/art/ark/rex.jpg"
        focus="object-[75%_40%]"
        kicker="Right now on MESA"
      />
      <div className="mx-auto max-w-4xl space-y-10 px-4 pb-20">
        {pop ? (
          <LivePopulation pop={pop} />
        ) : (
          <p className="border border-border bg-bg-card/60 px-5 py-4 text-sm text-text-muted">Live player counts are updating. Try again in a minute.</p>
        )}

        <section>
          <h2 className="font-display text-4xl font-black">Last 24 hours</h2>
          <div className="mt-4">{pop && <PopHistory pop={pop} />}</div>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="font-display text-4xl font-black">Happening now</h2>
            <p className="text-xs text-text-muted">Raids show an hour after they end.</p>
          </div>
          <div className="mt-4">
            <EventFeed items={feed?.items ?? []} now={now} />
          </div>
        </section>

        <p className="text-sm text-text-muted">
          Want to join?{" "}
          <Link href="/servers" className="text-accent underline underline-offset-4">
            Server list and IPs
          </Link>
          .
        </p>
      </div>
    </>
  );
}
