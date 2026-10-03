import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { HofGallery } from "@/components/HofGallery";
import { hofSeed, publishedHof } from "@/lib/hofStore";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta({
  title: "Hall of Fame",
  description:
    "Meet the MESA Hall of Fame members and winning tribes. Season rosters, recognition and base tours.",
});
export const revalidate = 300;
export default async function HallOfFamePage() {
  const winners = await publishedHof();
  return (
    <>
      <PageHeader
        title="Hall of Fame"
        subtitle="The tribes who won. The players who made it happen."
        kicker="MESA legends"
        image="/art/ark/hall.jpg"
        focus="object-[30%_40%]"
      />
      <div className="mx-auto max-w-6xl px-4 pb-24">
        <p className="max-w-3xl text-text-muted">
          Honoring every current Hall of Fame member, alongside the winning
          rosters recorded in our official announcement archive. Member honors
          were checked on 3 October 2026; season records begin in May 2026.
          Recorded wins are separate from current tier status.
        </p>
        <div className="my-6 flex flex-wrap gap-5 text-sm">
          <Link href="/compete" className="text-accent underline">
            Qualification and rewards
          </Link>
          <Link href="/support?type=hof" className="text-accent underline">
            Submit a HOF application
          </Link>
        </div>
        <HofGallery winners={winners} honorees={hofSeed.honorees} />
      </div>
    </>
  );
}
