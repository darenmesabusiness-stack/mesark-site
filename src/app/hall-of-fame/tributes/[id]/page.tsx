import Link from "next/link";
import {notFound} from "next/navigation";
import {PageHeader} from "@/components/PageHeader";
import {HofGallery} from "@/components/HofGallery";
import {publishedHof} from "@/lib/hofStore";
import {rosterHistory} from "@/lib/hofTribute";
import {pageMeta} from "@/lib/seo";
export const dynamic="force-dynamic";
export const metadata=pageMeta({title:"Hall of Fame tribute",description:"A winning MESA tribe, their roster and their wipe."});
export default async function Tribute({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  const winners=await publishedHof(), winner=winners.find(w=>w.id===id);
  if(!winner) notFound();
  const history=rosterHistory(winner,winners);
  return <><PageHeader title={winner.tribe} subtitle={`${winner.cluster} · Season ${winner.season}`} kicker="A place in MESA history" image={winner.art||"/art/ark/hall.jpg"} focus="object-[30%_40%]" />
    <div className="mx-auto max-w-6xl px-4 pb-24"><Link href="/hall-of-fame" className="mb-6 inline-block text-accent underline">All legends →</Link><HofGallery winners={[winner]} honorees={[]} />
      {history.length>0 && <section className="mt-12"><h2 className="mb-5 font-display text-4xl font-black">This roster’s other chapters</h2><HofGallery winners={history} honorees={[]} /></section>}
    </div></>;
}
