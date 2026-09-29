import { Hero } from "@/components/Hero";
import { StatsStrip } from "@/components/home/StatsStrip";
import { ClusterCards } from "@/components/home/ClusterCards";
import { WhyMesa } from "@/components/home/WhyMesa";
import { HallOfFame } from "@/components/home/HallOfFame";
import { CTA } from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <ClusterCards />
      <WhyMesa />
      <HallOfFame />
      <CTA />
    </>
  );
}
