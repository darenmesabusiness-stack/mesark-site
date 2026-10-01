/**
 * Change log editor storage against an in-memory Postgres. Run: npx tsx scripts/test-changelog-store.mts
 */
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { useDriver } from "../src/lib/db";
import { upsertUser } from "../src/lib/auth";
import { discardMonth, editableMonth, heroFor, loadPublishedMonths, saveMonth, setPublished, staffMonths } from "../src/lib/changelogStore";
import { changelog as builtIn } from "../src/data/changelog";

const pg = new PGlite();
useDriver(async (text, params = []) => (await pg.query(text, params as unknown[])).rows as never);
process.env.DATABASE_URL = "pglite"; // dbConfigured() checks for it; the driver above handles queries
await upsertUser("76561198000000013", "Lead", null);
const lead = "76561198000000013";

const post = `# <:mesark:1> NOVEMBER CHANGE LOG
# 🦖 Dino Of The Month
\`\`\`
Rex is the chosen Dino Of The Month for November, Tamed Resistance upgraded to 3x
\`\`\`
# ⚠️ Change-Logs
\`\`\`
- Increased Hide Stack size to 1000
\`\`\``;

// Nothing saved: the six built-in months are live.
assert.equal((await loadPublishedMonths()).length, builtIn.length);
assert.equal((await editableMonth("2026-11"))?.status, "new");
assert.equal(await editableMonth("2026-13"), null);
assert.equal((await editableMonth("2026-10"))?.status, "built-in");
assert.ok((await editableMonth("2026-10"))!.raw.includes("OCTOBER CHANGE LOG"), "built-in month opens with its Discord text");

// Bad paste is refused and nothing is saved.
assert.match(String((await saveMonth(lead, { year: 2026, month: 11, raw: "hello", hero: "", publish: false })).error), /No changes found/);
assert.equal((await staffMonths()).find((m) => m.slug === "2026-11"), undefined);

// Draft: visible to staff only.
assert.equal((await saveMonth(lead, { year: 2026, month: 11, raw: post, hero: "", publish: false })).error, null);
assert.equal((await staffMonths()).find((m) => m.slug === "2026-11")?.status, "draft");
assert.equal((await staffMonths()).find((m) => m.slug === "2026-11")?.editor, "Lead");
assert.equal((await loadPublishedMonths()).some((m) => m.slug === "2026-11"), false, "drafts stay off the site");

// Publish: newest month on the site, hero from an earlier Rex render.
await setPublished("2026-11", true, lead);
const live = await loadPublishedMonths();
assert.equal(live[0].slug, "2026-11");
assert.equal(live[0].month, "November");
assert.equal(live[0].dotm?.dino, "Rex");
assert.equal(live[0].hero, heroFor("Rex"));
assert.equal(live[0].sections[0].items[0].tag, "up");

// Editing a live month keeps it live.
await saveMonth(lead, { year: 2026, month: 11, raw: post.replace("1000", "2000"), hero: "/art/ark/siege.jpg", publish: false });
const edited = (await loadPublishedMonths())[0];
assert.ok(edited.sections[0].items[0].text.includes("2000"));
assert.equal(edited.hero, "/art/ark/siege.jpg");

// Overriding a built-in month only shows once published; discarding goes back to the original.
const oct = builtIn.find((m) => m.slug === "2026-10")!;
await saveMonth(lead, { year: 2026, month: 10, raw: (await editableMonth("2026-10"))!.raw + "\n\n# <:mesark:1> OCTOBER CHANGE LOG (PART 2)\n# ⚠️ Change-Logs\n```\n- Added New Test Item\n```", hero: oct.hero, publish: false });
const octCount = (m: { sections: { items: unknown[] }[] }) => m.sections.reduce((n, s) => n + s.items.length, 0);
assert.equal(octCount((await loadPublishedMonths()).find((m) => m.slug === "2026-10")!), octCount(oct), "draft doesn't change the live month");
await setPublished("2026-10", true, lead);
const octLive = (await loadPublishedMonths()).find((m) => m.slug === "2026-10")!;
assert.equal(octCount(octLive), octCount(oct) + 1);
assert.equal(octLive.posted, oct.posted, "keeps the original posting date");
await discardMonth("2026-10");
assert.equal(octCount((await loadPublishedMonths()).find((m) => m.slug === "2026-10")!), octCount(oct));

// Unpublish takes it off the site.
await setPublished("2026-11", false, lead);
assert.equal((await loadPublishedMonths()).some((m) => m.slug === "2026-11"), false);

console.log("changelog store tests passed");
