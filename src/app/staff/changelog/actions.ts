"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { CHANGELOG_TAG, discardMonth, saveMonth, setPublished } from "@/lib/changelogStore";
import { isLead } from "@/lib/staff";

async function lead() {
  const user = await currentUser();
  if (!isLead(user)) redirect("/staff");
  return user;
}

function refreshPublic(slug: string) {
  updateTag(CHANGELOG_TAG);
  revalidatePath("/changelog");
  revalidatePath(`/changelog/${slug}`);
  revalidatePath("/sitemap.xml");
}

/** Save (and optionally publish) the pasted posts for a month. Used with useActionState, so errors keep the text. */
export async function saveChangelog(_prev: { error: string | null }, form: FormData): Promise<{ error: string | null }> {
  const user = await lead();
  const publish = form.get("intent") === "publish";
  const { error, slug } = await saveMonth(user.steam_id, {
    year: Number(form.get("year")),
    month: Number(form.get("month")),
    raw: String(form.get("raw") ?? ""),
    hero: String(form.get("hero") ?? ""),
    publish,
  });
  if (error) return { error };
  refreshPublic(slug);
  redirect(`/staff/changelog/${slug}?saved=${publish ? "published" : "saved"}`);
}

export async function publishChangelog(form: FormData) {
  const user = await lead();
  const slug = String(form.get("slug"));
  await setPublished(slug, form.get("intent") !== "unpublish", user.steam_id);
  refreshPublic(slug);
  redirect(`/staff/changelog/${slug}?saved=${form.get("intent") === "unpublish" ? "unpublished" : "published"}`);
}

export async function discardChangelog(form: FormData) {
  await lead();
  const slug = String(form.get("slug"));
  await discardMonth(slug);
  refreshPublic(slug);
  redirect(`/staff/changelog?discarded=${slug}`);
}
