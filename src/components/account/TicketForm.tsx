"use client";

import { useActionState, useState } from "react";
import { createTicket, replyTicket, type TicketState } from "@/app/support/actions";
import { TICKET_CLUSTERS, TICKET_TYPES } from "@/lib/playerSupport";

const field = "w-full border border-border bg-bg-card px-3 py-2.5 text-sm outline-none focus:border-accent";

export function TicketForm({ requestId, channel }: { requestId: string; channel?: string }) {
  const [initialId] = useState(requestId);
  const [state, action, pending] = useActionState<TicketState, FormData>(channel ? replyTicket : createTicket, { error: null });
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="request_id" value={state.requestId ?? initialId} />
      {channel ? <input type="hidden" name="channel" value={channel} /> : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">What do you need help with?
              <select name="type" required className={field}>{TICKET_TYPES.map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select>
            </label>
            <label className="grid gap-2 text-sm">Cluster
              <select name="cluster" required className={field}>{TICKET_CLUSTERS.map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select>
            </label>
          </div>
          <label className="grid gap-2 text-sm">Map <span className="text-text-muted">Optional</span>
            <input name="map" maxLength={60} className={field} placeholder="e.g. Ragnarok" />
          </label>
        </>
      )}
      <label className="grid gap-2 text-sm">{channel ? "Your reply" : "Describe the issue"}
        <textarea name="body" required maxLength={1800} rows={5} defaultValue={state.body ?? ""} className={field} placeholder={channel ? "Write your reply…" : "What happened, and what do you need help with? Include evidence links if useful."} />
      </label>
      <p className="text-xs text-text-muted">Your message goes to your private Discord ticket. Add files and screenshots in Discord.</p>
      {state.error && <p role="alert" className="border-l-2 border-accent bg-bg-card px-4 py-3 text-sm">{state.error}</p>}
      {state.sent && !state.error && <p role="status" className="text-sm text-teal">Reply sent.</p>}
      <button disabled={pending} className="clip-corner-sm justify-self-start bg-accent px-5 py-2.5 font-display text-xl font-extrabold uppercase tracking-wide text-bg-primary disabled:opacity-60">
        {pending ? "Sending…" : channel ? "Send reply" : "Open ticket"}
      </button>
    </form>
  );
}
