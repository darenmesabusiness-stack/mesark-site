import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CaveMaps } from "@/components/maps/CaveMaps";
import { caveMaps, caveTotal } from "@/data/caves";

export const metadata: Metadata = {
  title: "ARK Cave Maps — Every Cave With GPS & Video | MESA ARK",
  description: `Interactive ARK: Survival Evolved cave maps for ${caveMaps.length} maps: ${caveTotal} caves pinned at their exact GPS, each with a video walkthrough, chokes, flyer rules and structure damage notes.`,
};

export default function MapsPage() {
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
