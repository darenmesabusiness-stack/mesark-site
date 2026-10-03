import fs from "node:fs/promises";
import seed from "../src/data/hofMembers.json";
const raw=JSON.parse(await fs.readFile("out/review/hof-recovered-candidates.json","utf8")) as {announcement:string;matching_observations:number;latest:null|{observed_at:string;score:number;rank:number}}[];
const known=new Set(seed.winners.map(w=>w.id));
const candidates=raw.filter(row=>known.has(row.announcement) && row.latest).map(row=>({announcement:row.announcement,matches:row.matching_observations,observedAt:row.latest!.observed_at,observedScore:row.latest!.score,observedRank:row.latest!.rank}));
if(candidates.some(row=>!Number.isSafeInteger(row.observedScore)||row.observedScore<0||!Number.isInteger(row.observedRank)||row.observedRank<1||row.observedRank>10||!Number.isFinite(Date.parse(row.observedAt)))) throw new Error("Invalid archived score observation");
await fs.writeFile("src/data/hofRecovery.json",JSON.stringify({checkedAt:new Date().toISOString().slice(0,10),windowDays:45,candidates},null,2)+"\n");
console.log(`Prepared ${candidates.length} staff-only review candidates. No raw text, names, account or event IDs; no final results published.`);
