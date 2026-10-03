"use client";
import { useActionState } from "react";
import Link from "next/link";
import { saveProfileAction, type ProfileState } from "@/app/account/actions";
import { PROFILE_ACCENTS, type AccountProfile } from "@/lib/account-profile-options";

export function ProfileEditor({ profile }: { profile: AccountProfile | null }) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(saveProfileAction, { error: null });
  return <section className="mt-8 border border-border bg-bg-card/60 p-5 sm:p-6">
    <h2 className="font-display text-3xl font-black">Customize your profile</h2>
    <p className="mt-2 text-sm text-text-muted">Your picture and name come from Steam. Add a bio, choose a color and decide whether to share your profile.</p>
    <form action={action} className="mt-5 grid gap-5">
      <label className="grid gap-2 text-sm">Bio <textarea name="bio" maxLength={280} rows={3} defaultValue={profile?.bio ?? ""} placeholder="Tell other survivors a little about yourself." className="w-full border border-border bg-bg-secondary px-3 py-2 outline-none focus:border-accent" /><span className="text-text-muted">Up to 280 characters. Don’t include private information.</span></label>
      <fieldset><legend className="mb-2 text-sm">Profile color</legend><div className="flex flex-wrap gap-4">
        {Object.entries(PROFILE_ACCENTS).map(([key,color]) => <label key={key} className="flex items-center gap-2 text-sm capitalize"><input type="radio" name="accent" value={key} defaultChecked={(profile?.accent ?? "ember")===key} required /><span className="h-4 w-4 rounded-full" style={{backgroundColor:color}} />{key}</label>)}
      </div></fieldset>
      <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="published" value="yes" defaultChecked={profile?.published ?? false} className="mt-1" /><span>Make my profile shareable.<span className="mt-1 block text-text-muted">Shows your Steam name, picture, bio and game stats. Linked accounts stay private unless you choose to share them below. Turn this off to hide the shared profile.</span></span></label>
      <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="share_links" value="yes" defaultChecked={profile?.share_links ?? false} className="mt-1" /><span>Show my Hall of Fame honors and links to my Steam and Discord profiles.<span className="mt-1 block text-text-muted">Visitors can open those accounts from your public MESA profile. Steam shows your account identity on its own site.</span></span></label>
      <button disabled={pending} className="clip-corner-sm justify-self-start bg-accent px-5 py-2 font-display text-xl font-bold text-bg-primary disabled:opacity-60">{pending ? "Saving…" : "Save profile"}</button>
      {state.error && <p role="alert" className="text-sm text-accent">{state.error}</p>}
      {state.saved && <p role="status" className="text-sm text-teal">Profile saved.</p>}
    </form>
    {profile?.published && <Link href={`/survivors/${profile.id}`} className="mt-5 inline-block text-accent underline underline-offset-4">View your public profile →</Link>}
  </section>;
}
