/**
 * Turns a MESA Discord change-log post (one or more "PART n" posts pasted together) into the
 * structured month shown on /changelog. Port of Mesa Images/_Tools/changelog/build_changelog.py,
 * so posts written the usual Discord way keep working:
 *   # <:mesark:...> OCTOBER CHANGE LOG (PART 2)
 *   # 🦖 Dino Of The Month
 *   ```Paraceratherium is the chosen Dino Of The Month for October, Tamed Resistance upgraded to 4x```
 *   # ⚠️ Duos Specific Change-Log
 *   ```- Increased ...```
 */
import { caveMaps } from "@/data/caves";
import type { ChangeItem, ChangeMonth, ChangeSection, ChangeTag, SectionKind } from "@/data/changelog";

export const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

// Cluster names as on mesark.net. "3-6 Man" was the old name of 3/4 Man.
const CLUSTERS: [RegExp, string][] = [
  [/3\s*[-/]\s*[46] man/, "3/4 Man"],
  [/\bduos?\b/, "Duo"],
  [/\bsolos?\b/, "Solo"],
  [/\b100x\b/, "100x"],
];
const SECTION_ORDER: SectionKind[] = ["general", "cluster", "caves", "city", "shop"];
const SECTION_TITLES: Partial<Record<SectionKind, string>> = { general: "All clusters", caves: "Cave changes", city: "MESA City", shop: "F2 Shop" };

// Leading verb -> neutral tag (direction only; "Down" on a price is good news).
const TAGS: [RegExp, ChangeTag][] = [
  [/^(fixed\b|.* is now fixed)/, "fix"],
  [/^(added|add)\b|^new\b|^enabled\b|can now\b|will now automatically/, "added"],
  [/^(removed|disabled|blocked|prevent)/, "removed"],
  [/^(buff|increased|extended|made .*(larger|higher|wider))/, "up"],
  [/^(nerf|reduced|decreased)/, "down"],
];

const HEADER = /^\s*#\s*(?:<a?:\w+:\d+>\s*)?([A-Za-z]+)\s+CHANGE\s*LOG[^\n]*/i;
const SECTION = /^#\s+(.+?)\s*$\s*```([\s\S]*?)(?:```|(?=^#\s)|$(?![\s\S]))/gm;

export const tagFor = (text: string): ChangeTag => TAGS.find(([re]) => re.test(text.toLowerCase()))?.[1] ?? "changed";

const cleanTitle = (t: string) =>
  t
    .replace(/<a?:\w+:\d+>/g, "")
    .replace(/[^\p{L}\p{N}_\s/&'().,-]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Cave names per map (with and without "(Loot & PVP Spot)" style suffixes), and map names.
const CAVE_INDEX = new Map<string, [string, string][]>();
const MAP_NAMES = new Map<string, string>();
for (const m of caveMaps) {
  MAP_NAMES.set(m.name.toLowerCase(), m.slug);
  const list: [string, string][] = [];
  for (const c of m.caves) for (const n of new Set([c.name, c.name.replace(/\s*\(.*?\)/g, "")])) list.push([n.toLowerCase(), c.id]);
  CAVE_INDEX.set(m.slug, list);
}
const MAPS_BY_LENGTH = [...MAP_NAMES].sort((a, b) => b[0].length - a[0].length);

/** The map a cave line is about and a /maps deep link when the cave is pinned. */
function findCave(text: string, mapSlug: string | null): { map: string | null; link: string | null } {
  const low = text.toLowerCase().replace(/levelling/g, "leveling");
  let map = mapSlug;
  if (!map) map = MAPS_BY_LENGTH.find(([name]) => new RegExp(`\\b${escapeRe(name)}\\b`).test(low))?.[1] ?? null;
  let best: [string, string, string] | null = null;
  for (const ms of map ? [map] : [...CAVE_INDEX.keys()]) {
    for (const [name, id] of CAVE_INDEX.get(ms) ?? []) {
      if (low.includes(name) && (!best || name.length > best[0].length)) best = [name, ms, id];
    }
  }
  return best ? { map: best[1], link: `/maps#${best[1]}/${best[2]}` } : { map, link: null };
}

export interface ParsedMonth {
  month: string | null; // e.g. "October", from the post header
  dotm: ChangeMonth["dotm"];
  sections: ChangeSection[];
  parts: number;
}

type RawSection = { kind: SectionKind; title: string; clusters: string[] | null; map: string | null; items: ChangeItem[] };

/** Parse one month's posts (pasted together). Text outside a "# ... CHANGE LOG" post is ignored. */
export function parseChangelog(raw: string): ParsedMonth {
  const text = raw.replace(/\r\n/g, "\n");
  const starts = [...text.matchAll(/^\s*#\s*(?:<a?:\w+:\d+>\s*)?[A-Za-z]+\s+CHANGE\s*LOG/gim)].map((m) => m.index ?? 0);
  const posts = starts.map((s, i) => text.slice(s, starts[i + 1] ?? text.length));

  let month: string | null = null;
  let dotm: ChangeMonth["dotm"] = null;
  const sections: RawSection[] = [];

  for (const post of posts) {
    const head = HEADER.exec(post.trimStart());
    if (!head || !MONTHS.includes(head[1].toLowerCase())) continue;
    month ??= head[1][0].toUpperCase() + head[1].slice(1).toLowerCase();
    const body = post.trimStart().slice(head[0].length);

    for (const sec of body.matchAll(SECTION)) {
      const title = cleanTitle(sec[1]);
      const low = title.toLowerCase();
      const lines = sec[2].trim().split("\n").map((l) => l.trim()).filter(Boolean);

      if (low.includes("dino of the month")) {
        const t = lines.join(" ");
        const d = /^(.+?) is the chosen Dino Of The Month.*?(?:upgraded to ([\d.]+x))?\s*$/i.exec(t);
        dotm = { dino: d ? d[1].trim() : t, bonus: d?.[2] ?? null, text: t };
        continue;
      }

      let kind: SectionKind = "general";
      let clusters: string[] | null = null;
      let map: string | null = null;
      if (low.includes("cave")) {
        kind = "caves";
        const mm = /(.+?)\s+cave changes/.exec(low);
        if (mm && MAP_NAMES.has(mm[1])) map = MAP_NAMES.get(mm[1])!;
      } else if (low.includes("mesa city")) {
        kind = "city";
        map = "mesa-city";
      } else if (low.includes("f2 shop")) {
        kind = "shop";
      } else if (low.includes("specific")) {
        kind = "cluster";
        const found = CLUSTERS.filter(([re]) => re.test(low)).map(([, name]) => name);
        clusters = found.length ? found : [title];
      }

      const items: ChangeItem[] = [];
      for (const ln of lines) {
        const t = (ln.startsWith("-") ? ln.slice(1) : ln).replace(/\s+/g, " ").trim().replace(/`+$/, "").trim();
        if (!t || t === "@everyone") continue;
        const item: ChangeItem = { text: t, tag: tagFor(t) };
        if (kind === "caves" || kind === "city") {
          const c = findCave(t, map);
          if (c.map) item.map = c.map;
          if (c.link) item.link = c.link;
        }
        items.push(item);
      }
      if (items.length) sections.push({ kind, title, clusters, map, items });
    }
  }

  // One section per kind (and per cluster set) across parts, in a fixed order.
  const merged = new Map<string, ChangeSection>();
  for (const s of sections) {
    const key = `${s.kind}|${(s.clusters ?? []).join("+")}`;
    const prev = merged.get(key);
    if (prev) prev.items.push(...s.items);
    else merged.set(key, { ...s, title: SECTION_TITLES[s.kind] ?? s.title, map: s.kind === "city" ? s.map : null, items: [...s.items] });
  }
  const ordered = [...merged.values()].sort((a, b) => SECTION_ORDER.indexOf(a.kind) - SECTION_ORDER.indexOf(b.kind));
  return { month, dotm, sections: ordered, parts: posts.length };
}
