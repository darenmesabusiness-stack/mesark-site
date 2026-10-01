/**
 * The website's change-log parser must read the Discord posts exactly like the original
 * Python build script did. Run: npx tsx scripts/test-changelog-parse.mts
 */
import assert from "node:assert/strict";
import { changelog } from "../src/data/changelog";
import { changelogRaw } from "../src/data/changelog-raw";
import { parseChangelog, tagFor } from "../src/lib/changelogParse";

let checked = 0;
for (const month of changelog) {
  const raw = changelogRaw[month.slug];
  assert.ok(raw, `raw posts for ${month.slug}`);
  const parsed = parseChangelog(raw);
  assert.equal(parsed.month, month.month, `${month.slug} month name`);
  assert.deepEqual(parsed.dotm, month.dotm, `${month.slug} dino of the month`);
  assert.equal(parsed.sections.length, month.sections.length, `${month.slug} section count`);
  parsed.sections.forEach((s, i) => {
    const want = month.sections[i];
    assert.equal(s.kind, want.kind, `${month.slug} section ${i} kind`);
    assert.equal(s.title, want.title, `${month.slug} section ${i} title`);
    assert.deepEqual(s.clusters, want.clusters, `${month.slug} section ${i} clusters`);
    assert.equal(s.map, want.map, `${month.slug} section ${i} map`);
    assert.deepEqual(s.items, want.items, `${month.slug} section ${i} items`);
    checked += s.items.length;
  });
}

// A fresh post written the Discord way, with two parts.
const fresh = parseChangelog(`# <:mesark:1> NOVEMBER CHANGE LOG (PART 1)

# 🦖 Dino Of The Month
\`\`\`
Rex is the chosen Dino Of The Month for November, Tamed Resistance upgraded to 3x
\`\`\`
# ⚠️ Change-Logs
\`\`\`
- Increased Hide Stack size to 1000
- Disabled Ovis spawns
@everyone
\`\`\`
# 🌍 The Island Cave Changes
\`\`\`
- Fixed a mesh hole in Swamp Cave
\`\`\`

# <:mesark:1> NOVEMBER CHANGE LOG (PART 2)
# ⚠️ Solos & Duos Specific Change-Log
\`\`\`
- Reduced Bola timer to 7 seconds
\`\`\``);
assert.equal(fresh.month, "November");
assert.equal(fresh.parts, 2);
assert.deepEqual(fresh.dotm, { dino: "Rex", bonus: "3x", text: "Rex is the chosen Dino Of The Month for November, Tamed Resistance upgraded to 3x" });
assert.deepEqual(fresh.sections.map((s) => [s.kind, s.title, s.items.length]), [
  ["general", "All clusters", 2],
  ["cluster", "Solos & Duos Specific Change-Log", 1],
  ["caves", "Cave changes", 1],
]);
assert.deepEqual(fresh.sections[1].clusters, ["Duo", "Solo"]);
assert.equal(fresh.sections[2].items[0].link, "/maps#the-island/swamp-cave");
assert.equal(tagFor("Increased Hide Stack size to 1000"), "up");
assert.equal(tagFor("Fixed a mesh hole"), "fix");
assert.equal(parseChangelog("just some text").sections.length, 0);

console.log(`changelog parser matches the live data (${changelog.length} months, ${checked} changes)`);
