import type { User } from "@/lib/auth";
import type { BotResult } from "@/lib/bot";
import { isOwner, isStaff } from "@/lib/staff";

export type ReviewResult = { error?: string; saved?: boolean };
export type ReviewKind = "delivery" | "ticket";
type Dependencies = {
  user: () => Promise<User | null>;
  post: (path: string, user: User, body: { state: string; note: string }) => Promise<BotResult<unknown>>;
};

/** Shared submission policy, with dependencies supplied only by server code. */
export async function submitPrivateReview(kind: ReviewKind, form: FormData, deps: Dependencies): Promise<ReviewResult> {
  const user = await deps.user();
  if (!(kind === "delivery" ? isOwner(user) : isStaff(user))) return { error: "You don't have access to this review." };
  const id = String(form.get("id") ?? "");
  const state = String(form.get("state") ?? "");
  const note = String(form.get("note") ?? "").trim();
  const states = kind === "delivery" ? ["unknown", "needs_check", "confirmed", "not_delivered"] : ["unreviewed", "active", "hold", "needs_records", "reviewed"];
  if (!/^[1-9]\d{0,19}$/.test(id) || !states.includes(state) || !note || note.length > 1000) return { error: "Choose a valid state and add a note or evidence reference (1–1000 characters)." };
  const endpoint = kind === "delivery" ? `/v1/finance/${id}/delivery` : `/v1/tickets/${id}/review`;
  const result = await deps.post(endpoint, user!, { state, note });
  return result.ok ? { saved: true } : { error: result.error };
}
