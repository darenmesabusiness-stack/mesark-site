"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { botPost } from "@/lib/bot";
import { supportInput } from "@/lib/playerSupport";
import {
  createSupport,
  parseSupport,
  replySupport,
  nativeId,
} from "@/lib/supportStore";

export type TicketState = {
  error: string | null;
  sent?: boolean;
  requestId?: string;
  body?: string;
  fields?: Record<string, string>;
};

export async function createTicket(
  _prev: TicketState,
  form: FormData,
): Promise<TicketState> {
  const user = await currentUser();
  if (!user) return { error: "Sign in through Steam first." };
  const input = parseSupport(form);
  const fields = Object.fromEntries(
    [...form.entries()].filter(([, v]) => typeof v === "string"),
  ) as Record<string, string>;
  if (!input)
    return {
      error:
        "Check the required fields and links. Messages can contain up to 6,000 characters.",
      fields,
      body: fields.body,
    };
  let id: string | null;
  try {
    id = await createSupport(user, input);
  } catch {
    return {
      error:
        "Could not save your ticket. Your text is kept; retry with the same submission.",
      body: input.body,
      fields,
    };
  }
  if (!id)
    return {
      error:
        "Link Discord first, or resolve an open ticket. Limits: 3 open tickets and 5 new tickets per day.",
      body: input.body,
      fields,
    };
  revalidatePath("/support");
  revalidatePath("/staff/tickets");
  redirect(`/support/w_${id}`);
}

export async function replyTicket(
  _prev: TicketState,
  form: FormData,
): Promise<TicketState> {
  const user = await currentUser();
  if (!user) return { error: "Sign in through Steam first." };
  const channel = String(form.get("channel") ?? "");
  if (nativeId(channel)) {
    const body = String(form.get("body") ?? "").trim(),
      request = String(form.get("request_id") ?? "");
    let sent = false;
    try {
      sent = await replySupport(
        user,
        channel.slice(2),
        request,
        body,
        form.get("private") === "on",
      );
    } catch {
      /* safe retry with stable request id */
    }
    if (!sent)
      return {
        error:
          "Reply not saved. Check ticket access/status or retry with this same submission.",
        body,
        requestId: request,
      };
    revalidatePath(`/support/${channel}`);
    revalidatePath(`/staff/tickets/${channel}`);
    return { error: null, sent: true, requestId: crypto.randomUUID() };
  }
  const input = supportInput(form, true);
  if (!input || !("channel" in input))
    return { error: "Write a message of 1–1,800 characters." };
  const res = await botPost(`/v1/my-tickets/${input.channel}`, user, input);
  if (!res.ok)
    return { error: res.error, body: input.body, requestId: _prev.requestId };
  revalidatePath(`/support/${input.channel}`);
  return { error: null, sent: true, requestId: crypto.randomUUID() };
}
