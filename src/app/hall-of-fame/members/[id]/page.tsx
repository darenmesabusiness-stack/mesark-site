import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { HofGallery } from "@/components/HofGallery";
import { hofSeed, publishedHof } from "@/lib/hofStore";
import { publicProfileForDiscord } from "@/lib/account-profile";
import { dbConfigured } from "@/lib/db";
import { pageMeta } from "@/lib/seo";
export const dynamic = "force-dynamic";
export const metadata = pageMeta({title:"Hall of Fame member", description:"A MESA Hall of Fame survivor and their recorded wins.", noindex:true});
export default async function MemberPage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  if (!/^\d{17,20}$/.test(id)) notFound();
  const winners=await publishedHof();
  const records=winners.filter(w=>w.members.some(m=>m.id===id));
  const member=hofSeed.honorees.find(m=>m.id===id) ?? records.flatMap(w=>w.members).find(m=>m.id===id);
  if (!member) notFound();
  // Never infer an account from a display name, or expose unpublished accounts.
  let profile=null;
  if(dbConfigured()) { try {profile=await publicProfileForDiscord(id);} catch { /* Archive remains available during account DB outage. */ } }
  if(profile) redirect(`/survivors/${profile.id}`);
  return <><PageHeader title={member.name} subtitle="The wins and honors behind this MESA survivor." kicker="Hall of Fame member" image="/art/ark/hall.jpg" focus="object-[30%_40%]" />
    <div className="mx-auto max-w-6xl px-4 pb-24">
      <ul className="mb-5 flex flex-wrap gap-3">{member.honors.map(h=><li key={h} className="border border-accent/40 px-3 py-2 text-sm text-accent">{h}</li>)}</ul>
      <p className="mb-5 text-text-muted">{records.length} recorded {records.length===1 ? "win" : "wins"}. This member has not shared a linked player profile yet.</p>
      <div className="mb-8 flex flex-wrap gap-5 text-sm"><a href={`https://discord.com/users/${id}`} target="_blank" rel="noopener noreferrer" className="text-accent underline">Discord profile ↗</a><Link href="/account" className="text-accent underline">Your honors? Link Discord and share your MESA profile →</Link><Link href="/hall-of-fame" className="underline">All legends →</Link></div>
      <HofGallery winners={records} honorees={[]} />
    </div></>;
}
