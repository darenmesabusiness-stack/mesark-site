import { notFound } from "next/navigation";
import { ProfileHero } from "@/components/profiles/ProfileHero";
import { Suspense } from "react";
import { LinkedStats } from "@/components/profiles/LinkedStats";
import { publishedProfile } from "@/lib/account-profile";
import { PROFILE_ACCENTS } from "@/lib/account-profile-options";
import { isBlockedName, fixText } from "@/lib/leaderboard";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = pageMeta({title: "Survivor profile", description: "A MESA survivor's profile and game stats.", noindex: true});

export default async function SurvivorPage({ params }: { params: Promise<{id: string}> }) {
  const profile = await publishedProfile((await params).id);
  if (!profile || isBlockedName(profile.persona)) notFound();
  return <>
    <ProfileHero kicker="Player profile" title={fixText(profile.persona) || "Survivor"} avatar={profile.avatar}
      sub="Steam-connected survivor" art="" focus="" accentColor={PROFILE_ACCENTS[profile.accent]} />
    <div className="mx-auto max-w-6xl px-4 pb-24">
      {profile.bio && <p className="mb-8 whitespace-pre-wrap break-words border-l-2 bg-bg-card p-5 text-lg" style={{borderColor: PROFILE_ACCENTS[profile.accent]}}>{profile.bio}</p>}
      <Suspense fallback={<p role="status" className="text-text-muted">Loading game stats…</p>}><LinkedStats steamId={profile.steam_id} /></Suspense>
    </div>
  </>;
}
