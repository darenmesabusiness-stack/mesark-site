import { pageMeta } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { CaveMaps } from "@/components/maps/CaveMaps";
import { publishedCaveMaps } from "@/lib/caveStore";

export const metadata = pageMeta({
  title: "Cave Maps",
  description: "Every MESARK cave pinned at its in-game GPS, with a walkthrough clip.",
});

export default async function MapsPage() {
  const caveMaps = await publishedCaveMaps();
  const caveTotal = caveMaps.reduce((n, m) => n + m.caves.length, 0);
  return (
    <>
      <PageHeader
        title="Cave Maps"
        subtitle={`${caveTotal} caves across ${caveMaps.length} maps, pinned at their exact GPS. Tap a pin for the walkthrough, chokes and build rules.`}
        image="/art/ark/rex.jpg"
        focus="object-[75%_40%]"
        kicker="Find your base spot"
      />
      <div className="mx-auto max-w-7xl px-4 pb-20">
        <CaveMaps maps={caveMaps} />
      </div>
    </>
  );
}
