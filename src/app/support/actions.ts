"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { botPost } from "@/lib/bot";
import { supportInput } from "@/lib/playerSupport";

export type TicketState = { error: string | null; sent?: boolean; requestId?: string; body?: string };

export async function createTicket(_prev: TicketState, form: FormData): Promise<TicketState> {
  const user = await currentUser();
  if (!user) return { error: "Sign in through Steam first." };
  const input = supportInput(form);
  if (!input) return { error: "Choose a type and cluster, then write up to 1,800 characters." };
  const res = await botPost<{ ticket_id: string }>("/v1/my-tickets", user, input);
  if (!res.ok) return { error: res.error, body: input.body };
  if (!/^\d{1,20}$/.test(res.data.ticket_id)) return { error: "Check your tickets before trying again." };
  revalidatePath("/support");
  redirect(`/support/${res.data.ticket_id}`);
}

export async function replyTicket(_prev: TicketState, form: FormData): Promise<TicketState> {
  const user = await currentUser();
  if (!user) return { error: "Sign in through Steam first." };
  const input = supportInput(form, true);
  if (!input || !("channel" in input)) return { error: "Write a message of 1–1,800 characters." };
  const res = await botPost(`/v1/my-tickets/${input.channel}`, user, input);
  if (!res.ok) return { error: res.error, body: input.body, requestId: _prev.requestId };
  revalidatePath(`/support/${input.channel}`);
  return { error: null, sent: true, requestId: crypto.randomUUID() };
}
