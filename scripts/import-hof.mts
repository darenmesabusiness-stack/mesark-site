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
