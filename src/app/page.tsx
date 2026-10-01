import { Hero } from "@/components/Hero";
import { StatsStrip } from "@/components/home/StatsStrip";
import { ClusterCards } from "@/components/home/ClusterCards";
import { WhyMesa } from "@/components/home/WhyMesa";
import { HallOfFame } from "@/components/home/HallOfFame";
import { CTA } from "@/components/CTA";
import { SITE } from "@/lib/seo";

// Tells Google the site's name ("MESARK") for search results.
const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  alternateName: ["MESA ARK", "MESA"],
  url: `${SITE.url}/`,
  description: SITE.description,
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD) }} />
      <Hero />
      <StatsStrip />
      <ClusterCards />
      <WhyMesa />
      <HallOfFame />
      <CTA />
    </>
  );
}
