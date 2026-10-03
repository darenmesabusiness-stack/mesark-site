"use server";
import { currentUser } from "@/lib/auth";
import {
  actSupport,
  nativeId,
  setSupportAccess,
  type SupportAction,
} from "@/lib/supportStore";
import { revalidatePath } from "next/cache";

export async function ticketControl(
  _prev: { error: string | null; requestId?: string },
  form: FormData,
) {
  const user = await currentUser(),
    id = String(form.get("ticket") ?? "");
  if (!user || !nativeId(id)) return { error: "Ticket unavailable." };
  let saved = false;
  try {
    saved = await actSupport(
      user,
      id.slice(2),
      String(form.get("action") ?? "") as SupportAction,
      String(form.get("value") ?? ""),
      String(form.get("request_id") ?? ""),
    );
  } catch {
    /* keep same request id for safe retry */
  }
  if (!saved)
    return {
      error:
        "Action not saved. Check current access, assignment and status before retrying.",
    };
  revalidatePath("/staff/tickets");
  revalidatePath(`/staff/tickets/${id}`);
  revalidatePath(`/support/${id}`);
  return { error: null, requestId: crypto.randomUUID(), saved: true };
}

export async function grantAccess(
  _prev: { error: string | null; saved?: boolean },
  form: FormData,
) {
  const user = await currentUser();
  if (!user) return { error: "Sign in first." };
  let saved = false;
  try {
    saved = await setSupportAccess(
      user,
      String(form.get("target") ?? ""),
      String(form.get("cluster") ?? ""),
      String(form.get("type") ?? ""),
      form.get("enabled") === "on",
    );
  } catch {
    /* generic error protects database details */
  }
  revalidatePath("/staff/tickets/access");
  return {
    saved,
    error: saved
      ? null
      : "Only the owner can assign access to an existing staff account.",
  };
}
