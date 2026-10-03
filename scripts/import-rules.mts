import fs from "node:fs/promises";
import {parseRules} from "../src/lib/rulesParse";
const sources=JSON.parse(await fs.readFile("out/review/discord-rules-hof-source.json","utf8"));
const channel=sources.find((c:{id:string})=>c.id==="1516224740430188645");
const sections=new Map<string,string[]>();
const starts:Record<string,string>={"1516242864772743168":"Raiding Rules","1516242906921570415":"Counter Raiding Rules","1516242933974564956":"Open World Turret Rules"};
for(const post of channel.messages.toReversed()) {
  let text:string=post.content;
  if(starts[post.id]) text=`# ${starts[post.id]}\n${text}`;
  text=text.replace(/^> NEW RULES:/,"# Cluster exceptions and latest amendments");
  text=text.replace("submit your HOF application in the HOF ticket section on the Mesa Support Discord","submit your HOF application through the website HOF support form");
  for(const s of parseRules(text).sections) sections.set(s.title,[...sections.get(s.title) ?? [],...s.rules]);
}
const data={sections:[...sections].map(([title,rules])=>({title,rules:[...new Set(rules)]})),sources:channel.messages.map((p:{id:string;edited:string|null;date:string})=>({url:`https://discord.com/channels/1072737953895415858/${channel.id}/${p.id}`,updated:p.edited??p.date})),checked:"2026-10-03"};
const amendments=data.sections.find(s=>s.title==="Cluster exceptions and latest amendments")!;
data.sections=data.sections.filter(s=>s!==amendments);
data.sections.unshift(amendments);
for(const section of data.sections) for(let i=0;i<section.rules.length;i++) {
  let rule=section.rules[i];
  if(rule.startsWith("Cycling is allowed when in a PVE")) rule += "\nException: cycling mid-raid is also allowed after Day 5 on 3/6 Man, subject to the declaration requirements in Cluster exceptions and latest amendments.";
  if(rule.startsWith("Structure capping or C4 capping")) rule += "\nException: structure capping is also allowed after Day 5 on 3/6 Man. This exception does not permit C4 capping.";
  if(rule.startsWith("Whistling Neutral/Aggressive")) rule += "\nThe later amendment sets the maximum at four tames on aggressive or neutral at one time.";
  section.rules[i]=rule;
}
await fs.writeFile("src/data/rules.json",JSON.stringify(data,null,2)+"\n");
console.log(`Imported ${data.sections.reduce((n,s)=>n+s.rules.length,0)} full rules across ${data.sections.length} sections from ${data.sources.length} public posts.`);
