import type { ChangeMonth, ChangeTag } from "@/data/changelog";

/** Direction-only labels: "Down" on a price or a timer can be good news, so no buff/nerf colours. */
export const TAGS: Record<ChangeTag, { label: string; className: string }> = {
  added: { label: "Added", className: "border-accent/50 bg-accent/10 text-accent" },
  removed: { label: "Removed", className: "border-white/15 bg-white/[0.03] text-text-muted" },
  up: { label: "▲ Up", className: "border-teal/45 bg-teal/10 text-teal" },
  down: { label: "▼ Down", className: "border-accent-secondary/45 bg-accent-secondary/10 text-[#e59a6a]" },
  fix: { label: "Fixed", className: "border-teal/30 text-teal/85" },
  changed: { label: "Changed", className: "border-border text-text-primary/65" },
};

export const TAG_ORDER: ChangeTag[] = ["added", "up", "down", "removed", "fix", "changed"];

export function changeTotals(m: ChangeMonth) {
  const tags = Object.fromEntries(TAG_ORDER.map((t) => [t, 0])) as Record<ChangeTag, number>;
  let total = 0;
  let caves = 0;
  for (const s of m.sections) {
    for (const it of s.items) {
      tags[it.tag] += 1;
      total += 1;
      if (s.kind === "caves" || s.kind === "city") caves += 1;
    }
  }
  return { total, caves, tags };
}

/** The first few "Added" lines across a month, for cards and meta descriptions. */
export function highlights(m: ChangeMonth, n = 3) {
  return m.sections
    .flatMap((s) => s.items)
    .filter((it) => it.tag === "added")
    .slice(0, n)
    .map((it) => it.text);
}
