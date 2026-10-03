import type { HofWinner } from "@/components/HofGallery";

export const HOF_COLORS = ["#e9bf57", "#50c9bd", "#b995ef", "#f5782b", "#7bbcf0", "#e99bba"];
/** Stable identity, independent of ranking/filter order. */
export function tributeColor(tribe: string) {
  let hash = 0;
  for (const char of tribe.toLowerCase()) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return HOF_COLORS[hash % HOF_COLORS.length];
}
export function rosterHistory(winner: HofWinner, winners: HofWinner[]) {
  const ids = new Set(winner.members.map(m => m.id));
  return winners.filter(w => w.id !== winner.id && w.members.some(m => ids.has(m.id)));
}
export function tributeText(w: HofWinner) {
  return w.achievement || `${w.tribe} earned ${w.cluster} Hall of Fame recognition in Season ${w.season}. ${w.members.length === 1 ? "One survivor is recorded on the winning roster." : `${w.members.length} survivors shared this win.`}`;
}
export function memberPath(id: string) { return `/hall-of-fame/members/${id}`; }
