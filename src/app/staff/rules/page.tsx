import Link from "next/link";
import {currentUser} from "@/lib/auth";
import {isStaff,isLead} from "@/lib/staff";
import {StaffGate,StaffShell} from "@/components/staff/StaffShell";
import {RulesEditor} from "@/components/staff/RulesEditor";
import {liveRules,staffRules} from "@/lib/rulesStore";
import {rulesRaw,rulesSummary,rulesDiff} from "@/lib/rulesParse";
import {publishRulesAction} from "./actions";
export const metadata={title:"Rules editor",robots:{index:false,follow:false}};
export default async function RulesStaff({searchParams}:{searchParams:Promise<{id?:string;error?:string;published?:string}>}) {
  const actor=await currentUser(); if(!isStaff(actor)) return <StaffGate user={actor} />;
  const [live,rows,sp]=await Promise.all([liveRules(),staffRules(actor),searchParams]);
  const selected=rows.find(r=>r.id===sp.id), data=selected?.data ?? live.data;
  const changes=rulesDiff(live.data,data);
  const errors:Record<string,string>={review:"A lead must review the full draft before publishing.",conflict:"The live version or your access changed. Review the current rules and prepare a fresh draft.",save:"Publishing failed. The existing rules are unchanged."};
  return <StaffShell user={actor} active="/staff/rules" title="Rules editor" kicker="One source for every cluster">
    <div className="mb-6 flex flex-wrap gap-5 text-sm"><Link href="/rules" className="text-accent underline">Public rules →</Link><Link href="/staff/rules" className="underline">Start from current rules</Link></div>
    {sp.error && <p role="alert" className="mb-5 text-accent">{errors[sp.error]??"Check your draft."}</p>}{sp.published && <p role="status" className="mb-5 text-teal">Rules published. The previous versions remain in history.</p>}
    <RulesEditor key={selected?.id ?? live.id} raw={selected?.raw ?? rulesRaw(live.data)} />
    {selected && <section className="mt-8 border border-border p-5"><h2 className="font-display text-3xl">Changes to review</h2>{(["added","removed"] as const).map(kind=><div key={kind} className="mt-4"><h3 className="text-sm font-bold">{kind==="added" ? "Added or revised" : "Removed or replaced"}</h3><ul className="mt-3 grid gap-4 text-sm">{changes[kind].map((r,i)=><li key={i}><strong>{r.section}</strong><p className="mt-1 whitespace-pre-line break-words text-text-muted">{r.text}</p></li>)}</ul></div>)}</section>}
    {selected && <section className="mt-10"><h2 className="font-display text-3xl">Review draft</h2><p className="mt-3 text-sm text-text-muted">This extractive summary is an overview. Review the full rules below, especially exceptions and penalties.</p><p className="mt-4 text-sm">{changes.added.length} added or revised clauses · {changes.removed.length} removed or replaced clauses</p><ul className="my-5 grid gap-3">{rulesSummary(data).map((s,i)=><li key={i} className="border border-border p-4"><strong>{s.title} · {s.count} rules</strong><ul className="mt-2 grid gap-2 text-sm text-text-muted">{s.highlights.map((h,j)=><li key={j}>{h}{h.length===180?"…":""}</li>)}</ul></li>)}</ul>
      <details className="mb-5 border border-border p-4" open><summary className="cursor-pointer">Full draft to publish</summary>{data.sections.map((s,i)=><section key={i} className="mt-5"><h3 className="font-display text-2xl">{s.title}</h3><ul className="mt-2 grid gap-3 text-sm">{s.rules.map((r,j)=><li key={j} className="whitespace-pre-line break-words">{r}</li>)}</ul></section>)}</details>
      {isLead(actor) && <form action={publishRulesAction} className="grid gap-4"><input type="hidden" name="id" value={selected.id} /><input type="hidden" name="expected" value={live.id} /><label className="flex items-start gap-3 text-sm"><input type="checkbox" name="reviewed" required /><span>I reviewed the full draft, cluster exceptions and penalties.</span></label><button className="justify-self-start border border-accent px-5 py-3 text-accent">Publish this version</button></form>}
    </section>}
    <details className="mt-10 border-t border-border pt-5"><summary className="cursor-pointer">Drafts and version history</summary><p className="mt-3 text-sm text-text-muted">Open a previous version to review, edit or restore it. Only a lead can publish.</p><ul className="mt-4 grid gap-3">{rows.map(r=><li key={r.id}><Link href={`?id=${r.id}`} className="text-sm hover:text-accent">{new Date(r.created_at).toLocaleString("en-US",{timeZone:"UTC"})} UTC · {r.editor??"Staff"}{r.id===live.id?" · Live":""}</Link></li>)}</ul></details>
  </StaffShell>;
}
