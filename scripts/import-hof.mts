import fs from "node:fs/promises";
import { isBlockedName } from "../src/lib/leaderboard";
const raw = JSON.parse(
  await fs.readFile("out/website-support/hof-source.json", "utf8"),
);
const safe = (name: string, fallback: string) =>
  isBlockedName(name) || /jew\W*hunt|7656\d{13}/i.test(name)
    ? fallback
    : name.slice(0, 100);
const member = (m: { id: string; name: string; honors: string[] }) => ({
  ...m,
  name: safe(m.name, "Hall of Fame member"),
});
raw.winners = raw.winners.map(
  (w: { tribe: string; members: Parameters<typeof member>[0][] }) => ({
    ...w,
    tribe: safe(w.tribe, "Hall of Fame tribe"),
    members: w.members.map(member),
  }),
);
try {
  const channels = JSON.parse(await fs.readFile("out/review/discord-rules-hof-source.json", "utf8"));
  const posts = new Map<string, {embeds:{title?:string}[]}>(channels.find((c:{id:string})=>c.id==="1500222043453391010").messages.map((p:{id:string})=>[p.id,p]));
  for (const winner of raw.winners) {
    const title=posts.get(winner.id)?.embeds.find(e=>e.title)?.title ?? "";
    if(title && !isBlockedName(title) && !/jew\W*hunt|7656\d{13}/i.test(title)) winner.videoTitle=title.slice(0,160);
  }
} catch { console.log("No additional public wipe-film source available."); }
raw.honorees = raw.honorees
  .map(member)
  .sort((a: { name: string }, b: { name: string }) =>
    a.name.localeCompare(b.name),
  );
await fs.writeFile(
  "src/data/hofMembers.json",
  JSON.stringify(raw, null, 2) + "\n",
);
console.log(
  `Imported ${raw.winners.length} official winner records and ${raw.honorees.length} current members; public fields only.`,
);
