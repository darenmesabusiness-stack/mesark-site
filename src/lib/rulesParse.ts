export type RuleSection = {title:string; rules:string[]};
export type RulesDocument = {sections:RuleSection[]};
/** Lossless cleanup of Discord formatting. Limits/exceptions remain in full rules. */
export function parseRules(raw:string):RulesDocument {
  if(!raw.trim() || raw.length>60000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(raw)) throw new Error("Use up to 60,000 characters of rule text.");
  if(/7656\d{13}/.test(raw)) throw new Error("Use public rule text without player Steam IDs.");
  const sections:RuleSection[]=[]; let section:RuleSection|undefined;
  for(const original of raw.split(/\r?\n/)) {
    const line=original.replace(/^(?:\s*>\s*)+/,"").replace(/\*\*/g,"").trim();
    if(!line) continue;
    const heading=line.match(/^#{1,3}\s+(.+)$/);
    if(heading) { section=sections.find(s=>s.title.toLowerCase()===heading[1].toLowerCase()); if(!section) { section={title:heading[1],rules:[]}; sections.push(section); } continue; }
    if(!section) {section={title:"General rules",rules:[]}; sections.push(section);}
    const bullet=line.match(/^[-•]\s+(.+)$/);
    if(bullet || !section.rules.length) section.rules.push(bullet?.[1] ?? line);
    else section.rules[section.rules.length-1]+="\n"+line;
  }
  const nonempty=sections.filter(s=>s.rules.length);
  if(!nonempty.length || nonempty.length>40 || nonempty.some(s=>s.title.length>100 || s.rules.length>150 || s.rules.some(r=>r.length>6000))) throw new Error("Use section headings and shorter individual rules.");
  return {sections:nonempty};
}
export function rulesRaw(data:RulesDocument) {return data.sections.map(s=>`# ${s.title}\n${s.rules.map(r=>`- ${r}`).join("\n\n")}`).join("\n\n");}
/** Extractive overview only; it never replaces or changes the full rule. */
export function rulesSummary(data:RulesDocument) {
  return data.sections.map(s=>({title:s.title, count:s.rules.length, highlights:s.rules.slice(0,3).map(r=>r.split("\n")[0].slice(0,180))}));
}
export function rulesDiff(previous:RulesDocument,next:RulesDocument) {
  const flatten=(d:RulesDocument)=>d.sections.flatMap(s=>s.rules.map(text=>({section:s.title,text})));
  const before=flatten(previous), after=flatten(next);
  const exists=(rows:ReturnType<typeof flatten>,rule:{section:string;text:string})=>rows.some(r=>r.section===rule.section && r.text===rule.text);
  return {added:after.filter(r=>!exists(before,r)),removed:before.filter(r=>!exists(after,r))};
}
