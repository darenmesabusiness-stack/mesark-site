"use server";

import { currentUser } from "@/lib/auth";
import { botPost } from "@/lib/bot";
import { revalidatePath } from "next/cache";
import { submitPrivateReview, type ReviewResult } from "@/lib/privateReview";

export type { ReviewResult } from "@/lib/privateReview";

async function save(kind: "delivery" | "ticket", form: FormData): Promise<ReviewResult> {
  const result = await submitPrivateReview(kind, form, { user: currentUser, post: botPost });
  if (result.saved) revalidatePath(kind === "delivery" ? "/staff/finance" : "/staff/tickets");
  return result;
}

export async function saveDelivery(_previous: ReviewResult, form: FormData): Promise<ReviewResult> { return save("delivery", form); }
export async function saveTicketReview(_previous: ReviewResult, form: FormData): Promise<ReviewResult> { return save("ticket", form); }
