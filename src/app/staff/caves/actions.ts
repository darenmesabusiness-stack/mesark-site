"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { CAVES_TAG, hideCave, restoreCave, saveCave, unhideCave } from "@/lib/caveStore";
import { isLead } from "@/lib/staff";

async function lead() {
  const user = await currentUser();
  if (!isLead(user)) redirect("/staff");
  return user;
}

function refreshMaps() {
  updateTag(CAVES_TAG);
  revalidatePath("/maps");
}

/** Save a cave (used with useActionState so errors keep what was typed). Live straight away. */
export async function saveCaveAction(_prev: { error: string | null }, form: FormData): Promise<{ error: string | null }> {
  const user = await lead();
  const map = String(form.get("map") ?? "");
  const result = await saveCave(user.steam_id, {
    map,
    id: String(form.get("id") ?? "") || null,
    name: String(form.get("name") ?? ""),
    lat: Number(form.get("lat")),
    lon: Number(form.get("lon")),
    notes: String(form.get("notes") ?? "").split("\n"),
    spi: String(form.get("spi") ?? "") || null,
    video: String(form.get("video") ?? "") || null,
  });
  if ("error" in result) return { error: result.error };
  refreshMaps();
  redirect(`/staff/caves?map=${map}&saved=${encodeURIComponent(result.id)}`);
}

export async function hideCaveAction(form: FormData) {
  const user = await lead();
  const map = String(form.get("map"));
  await hideCave(user.steam_id, map, String(form.get("id")));
  refreshMaps();
  redirect(`/staff/caves?map=${map}`);
}

export async function unhideCaveAction(form: FormData) {
  const user = await lead();
  const map = String(form.get("map"));
  await unhideCave(user.steam_id, map, String(form.get("id")));
  refreshMaps();
  redirect(`/staff/caves?map=${map}`);
}

export async function restoreCaveAction(form: FormData) {
  await lead();
  const map = String(form.get("map"));
  await restoreCave(map, String(form.get("id")));
  refreshMaps();
  redirect(`/staff/caves?map=${map}`);
}
