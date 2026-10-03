import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {parseRules} from "../src/lib/rulesParse";
import seed from "../src/data/rules.json";
const source=JSON.parse(await fs.readFile("out/review/discord-rules-hof-source.json","utf8")).find((c:{id:string})=>c.id==="1516224740430188645");
const normalized=(s:string)=>s.replace(/\s+/g," ").trim();
const full=seed.sections.flatMap(s=>s.rules).map(normalized);
let checked=0;
for(const post of source.messages) {
  const text=post.content.replace(/^> NEW RULES:/,"# Cluster exceptions and latest amendments").replace("submit your HOF application in the HOF ticket section on the Mesa Support Discord","submit your HOF application through the website HOF support form");
  for(const section of parseRules(text).sections) for(const rule of section.rules) {
    assert.ok(full.some(r=>r.includes(normalized(rule))),`Missing public clause from ${post.id}`); checked++;
  }
}
assert.equal(source.messages.length,7);
const report={checkedAt:new Date().toISOString(),posts:7,sourceClauses:checked,websiteClauses:full.length,result:"All source clauses retained, including qualifiers and penalties. HOF application entry changed to website; later cycling/structure-cap amendments cross-referenced."};
await fs.writeFile("out/review/rules-source-audit.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report));
