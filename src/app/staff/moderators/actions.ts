"use server";
import { currentUser } from "@/lib/auth";
import { isLead } from "@/lib/staff";
import { deductModerator } from "@/lib/moderatorStore";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
export async function recordDeduction(form: FormData) {
  const actor = await currentUser();
  if (!isLead(actor)) redirect("/staff");
  const value = (key: string) => String(form.get(key) ?? "");
  const month = value("month");
  const saved = await deductModerator(actor.steam_id, { id:value("request_id"), moderator:value("moderator"), month, points:Number(value("points")), severity:value("severity"), reason:value("reason") });
  revalidatePath("/staff/moderators");
  redirect(`/staff/moderators?month=${encodeURIComponent(month)}&${saved ? "saved=1" : "error=1"}`);
}
