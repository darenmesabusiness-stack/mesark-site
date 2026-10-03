import { getMesaMap } from "@/lib/mesaMapData";
import { publicName } from "@/lib/mesaMap";
import { getTribe, CLUSTERS } from "@/lib/leaderboard";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const cluster = params.get("cluster") ?? "", id = Number(params.get("tribe"));
  const respond = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
  if (!CLUSTERS.some(c => c.key === cluster) || !Number.isSafeInteger(id) || id <= 0) return respond({ error: "Invalid tribe" }, 400);
  const map = await getMesaMap(cluster);
  if (!map.open || !map.tribes.some(t => t.id === id)) return respond({ error: "Tribe unavailable on this map" }, 404);
  const tribe = await getTribe(cluster, id);
  if (!tribe || !publicName(tribe.tribeName)) return respond({ error: "Tribe unavailable" }, 404);
  // An explicit public DTO, never the upstream members or account identifiers.
  return respond({ members: tribe.members.filter(m => publicName(m.PlayerName)).slice(0, 100).map(m => m.PlayerName) });
}
