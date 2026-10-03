import Link from "next/link";
import {pageMeta} from "@/lib/seo";
import {PageHeader} from "@/components/PageHeader";
import {ContentSection,RuleItem} from "@/components/ContentSection";
import {liveRules} from "@/lib/rulesStore";
export const dynamic="force-dynamic";
export const metadata=pageMeta({title:"Rules",description:"MESA server rules, cluster exceptions and Hall of Fame requirements."});
export default async function RulesPage() {
  const {data}=await liveRules();
  return <><PageHeader title="Rules" subtitle="Know the rules for your cluster before you play." image="/art/ark/ashfield.jpg" focus="object-[70%_40%]" kicker="MESA info" />
    <div className="mx-auto max-w-4xl space-y-4 px-4 pb-20">
      <p className="mb-5 text-base text-text-muted">Cluster exceptions are listed first. HOF applications and private player details belong in your website ticket.</p>
      <nav aria-label="Rules sections" className="mb-6 flex flex-wrap gap-3">{data.sections.map((s,i)=><a key={i} href={`#rules-${i}`} className="border border-border px-3 py-2 text-sm hover:border-accent">{s.title}</a>)}</nav>
      {data.sections.map((s,i)=><div key={i} id={`rules-${i}`} className="scroll-mt-24"><ContentSection title={s.title} defaultOpen={i===0}>{s.rules.map((r,j)=><div key={j} className="whitespace-pre-line break-words"><RuleItem text={r} /></div>)}</ContentSection></div>)}
      <ContentSection title="Questions and ban appeals"><p>Open a website ticket with your in-game name, cluster and the issue or ban reason. Staff review the evidence and applicable rules.</p><Link href="/support?type=ban" className="inline-block mt-3 text-accent underline">Submit a ban appeal →</Link><Link href="/support?type=question" className="ml-5 inline-block mt-3 text-accent underline">Ask about a rule →</Link></ContentSection>
    </div></>;
}
