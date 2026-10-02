"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import { botPost } from "@/lib/bot";
import { query } from "@/lib/db";

export type LinkState = { error: string | null; linked?: string };

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
