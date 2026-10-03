"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import { botPost } from "@/lib/bot";
import { query } from "@/lib/db";
import { profileInput, saveAccountProfile } from "@/lib/account-profile";

export type LinkState = { error: string | null; linked?: string };
export type ProfileState = { error: string | null; saved?: boolean };

export async function saveProfileAction(_prev: ProfileState, form: FormData): Promise<ProfileState> {
  const user = await currentUser();
  if (!user) return { error: "Sign in through Steam first." };
  let input;
  try { input = profileInput(form.get("bio"), form.get("accent"), form.get("published") === "yes"); }
  catch (e) { return { error: e instanceof Error ? e.message : "Check your profile details." }; }
  try {
    const profile = await saveAccountProfile(user.steam_id, input);
    revalidatePath("/account");
    revalidatePath(`/survivors/${profile.id}`);
    return { error: null, saved: true };
  } catch { return { error: "Couldn't save your profile. Try again in a minute." }; }
}

/** Redeems a /link code from Discord for the signed-in Steam account. */
export async function linkDiscordAction(_prev: LinkState, form: FormData): Promise<LinkState> {
  const user = await currentUser();
  if (!user) return { error: "Sign in through Steam first." };
  const code = String(form.get("code") ?? "").trim();
  if (!code) return { error: "Type the code the bot gave you." };

  const res = await botPost<{ discord_id: string; discord_name: string }>("/v1/link/redeem", user, { code });
  if (!res.ok) return { error: res.error };
  const { discord_id, discord_name } = res.data;
  // One Discord per account: if another account had this Discord, it moves here.
  await query(`update users set discord_id = null, discord_name = null where discord_id = $1 and steam_id <> $2`, [discord_id, user.steam_id]);
  await query(`update users set discord_id = $1, discord_name = $2 where steam_id = $3`, [discord_id, discord_name, user.steam_id]);
  revalidatePath("/account");
  return { error: null, linked: discord_name };
}

export async function unlinkDiscordAction() {
  const user = await currentUser();
  if (!user) return;
  const res = await botPost("/v1/link/remove", user);
  if (!res.ok) console.error("discord unlink at bot failed", res.error);
  await query(`update users set discord_id = null, discord_name = null where steam_id = $1`, [user.steam_id]);
  revalidatePath("/account");
}
