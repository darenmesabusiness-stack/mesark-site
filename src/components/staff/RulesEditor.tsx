"use client";
import {useActionState} from "react";
import {parseRules} from "@/lib/rulesParse";
import {prepareRules} from "@/app/staff/rules/actions";
export function RulesEditor({raw}:{raw:string}) {
  const [state,action,pending]=useActionState(prepareRules,{error:null});
  return <form action={action} className="grid gap-4"><fieldset className="grid gap-4 border border-border p-5"><legend className="px-2 text-sm">Add a new rule</legend><label className="grid gap-2 text-sm">Section<select name="section" className="w-full min-w-0 border border-border bg-bg-card p-3">{parseRules(raw).sections.map((s,i)=><option key={i}>{s.title}</option>)}</select></label><label className="grid gap-2 text-sm">New rule<textarea name="addition" maxLength={6000} rows={4} className="w-full border border-border bg-bg-card p-3" placeholder="Describe the rule, clusters, limits and exceptions." /></label></fieldset><details><summary className="cursor-pointer text-sm">Edit the complete draft</summary><label className="grid gap-2 text-sm">Full rules draft<textarea name="raw" required maxLength={60000} rows={18} defaultValue={raw} className="w-full border border-border bg-bg-card p-4 text-sm leading-relaxed" /></label></details>
    <p className="text-sm text-text-muted">Add a section with # Section name and a rule with - Rule text. Keep limits, exceptions and penalties in full. Preparing makes a summary and preview; a lead admin publishes after review.</p>
    {state.error && <p role="alert" className="text-sm text-accent">{state.error}</p>}<button disabled={pending} className="justify-self-start border border-accent px-5 py-3 text-accent">{pending?"Preparing…":"Prepare summary and preview"}</button></form>;
}
