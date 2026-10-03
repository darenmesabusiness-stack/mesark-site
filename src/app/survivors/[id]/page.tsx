import { notFound } from "next/navigation";
import { ProfileHero } from "@/components/profiles/ProfileHero";
import { Suspense } from "react";
import { LinkedStats } from "@/components/profiles/LinkedStats";
import { publishedProfile } from "@/lib/account-profile";
import { PROFILE_ACCENTS } from "@/lib/account-profile-options";
import { isBlockedName, fixText } from "@/lib/leaderboard";
import { pageMeta } from "@/lib/seo";
import { hofSeed, publishedHof } from "@/lib/hofStore";
import { HofGallery } from "@/components/HofGallery";

export const dynamic = "force-dynamic";
export const metadata = pageMeta({title: "Survivor profile", description: "A MESA survivor's profile and game stats.", noindex: true});

export default async function SurvivorPage({ params }: { params: Promise<{id: string}> }) {
  const profile = await publishedProfile((await params).id);
  if (!profile || isBlockedName(profile.persona)) notFound();
  const wins=profile.share_links && profile.discord_id ? (await publishedHof()).filter(w=>w.members.some(m=>m.id===profile.discord_id)) : [];
  const honors=profile.share_links ? hofSeed.honorees.find(m=>m.id===profile.discord_id)?.honors ?? [] : [];
  return <>
    <ProfileHero kicker="Player profile" title={fixText(profile.persona) || "Survivor"} avatar={profile.avatar}
      sub="Steam-connected survivor" art="" focus="" accentColor={PROFILE_ACCENTS[profile.accent]} />
    <div className="mx-auto max-w-6xl px-4 pb-24">
      {profile.share_links && <div className="mb-8 flex flex-wrap gap-5 text-sm"><a href={`/survivors/${profile.id}/steam`} target="_blank" rel="noopener noreferrer" className="text-accent underline">Steam profile ↗</a>{profile.discord_id && <a href={`https://discord.com/users/${profile.discord_id}`} target="_blank" rel="noopener noreferrer" className="text-accent underline">Discord profile ↗</a>}</div>}
      {profile.bio && <p className="mb-8 whitespace-pre-wrap break-words border-l-2 bg-bg-card p-5 text-lg" style={{borderColor: PROFILE_ACCENTS[profile.accent]}}>{profile.bio}</p>}
      <Suspense fallback={<p role="status" className="text-text-muted">Loading game stats…</p>}><LinkedStats steamId={profile.steam_id} /></Suspense>
      {(wins.length>0 || honors.length>0) && <section className="mt-12"><h2 className="mb-5 font-display text-4xl font-black">Hall of Fame legacy</h2><ul className="mb-6 flex flex-wrap gap-3">{honors.map(h=><li key={h} className="border border-accent/40 px-3 py-2 text-sm text-accent">{h}</li>)}</ul><HofGallery winners={wins} honorees={[]} /></section>}
    </div>
  </>;
}
