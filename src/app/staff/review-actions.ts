"use server";

import { currentUser } from "@/lib/auth";
import { botPost } from "@/lib/bot";
import { isOwner, isStaff } from "@/lib/staff";
import { revalidatePath } from "next/cache";

export type ReviewResult = { error?: string; saved?: boolean };

async function save(kind: "delivery" | "ticket", form: FormData): Promise<ReviewResult> {
  const user = await currentUser();
  if (!(kind === "delivery" ? isOwner(user) : isStaff(user))) return { error: "You don't have access to this review." };
  const id = String(form.get("id") ?? "");
  const state = String(form.get("state") ?? "");
  const note = String(form.get("note") ?? "").trim();
  if (!/^\d{1,20}$/.test(id) || !note || note.length > 1000) return { error: "Add a note or evidence reference (1–1000 characters)." };
  const endpoint = kind === "delivery" ? `/v1/finance/${id}/delivery` : `/v1/tickets/${id}/review`;
  const result = await botPost(endpoint, user!, { state, note });
  if (!result.ok) return { error: result.error };
  revalidatePath(kind === "delivery" ? "/staff/finance" : "/staff/tickets");
  return { saved: true };
}

export async function saveDelivery(_previous: ReviewResult, form: FormData): Promise<ReviewResult> { return save("delivery", form); }
export async function saveTicketReview(_previous: ReviewResult, form: FormData): Promise<ReviewResult> { return save("ticket", form); }
