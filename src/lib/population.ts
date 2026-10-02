import { unstable_cache } from "next/cache";
import { botGetPublic, type PopulationData } from "@/lib/bot";

/**
 * Live players per server for /live (from the bot: game machines' perf sampler, counts only, every 2 min).
 * Cached for a minute so the public pages never wait on the bot; null when it's unavailable,
 * and pages then render without counts.
 */
export const getPopulation = unstable_cache(
  async (): Promise<PopulationData | null> => {
    const res = await botGetPublic<PopulationData>("/v1/population?hours=24");
    return res.ok && res.data.fresh ? res.data : null;
  },
  ["population-v1"],
  { revalidate: 60 },
);
