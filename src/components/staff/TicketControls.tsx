"use client";
import { useActionState, useState } from "react";
import { ticketControl } from "@/app/staff/tickets/actions";
import type { SupportTicket } from "@/lib/supportStore";

export function TicketControls({
  ticket,
  assignees = [],
}: {
  ticket: SupportTicket;
  assignees?: { id: string; name: string }[];
}) {
  const [selected, setSelected] = useState(
    ticket.status === "closed" ? "reopen" : "claim",
  );
  const [request, setRequest] = useState(() => crypto.randomUUID());
  const [closingMessage, setClosingMessage] = useState("");
  const [state, action, pending] = useActionState<
    { error: string | null; requestId?: string; saved?: boolean },
    FormData
  >(
    async (prev, form) => {
      const result = await ticketControl(prev, form);
      if (!result.error) {
        setRequest(crypto.randomUUID());
        setClosingMessage("");
      }
      return result;
    },
    { error: null },
  );
  return (
    <form
      action={action}
      onChange={() => setRequest(crypto.randomUUID())}
      className="mt-6 grid gap-3 border border-border p-4"
    >
      <h2 className="font-display text-2xl font-bold">Staff controls</h2>
      <input type="hidden" name="ticket" value={`w_${ticket.id}`} />
      <input type="hidden" name="request_id" value={request} />
      <label className="grid gap-2 text-sm">
        Action
        <select
          name="action"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          disabled={pending}
          className="border border-border bg-bg-card p-2"
        >
          {(ticket.status === "closed"
            ? ["reopen"]
            : [
                "claim",
                "unclaim",
                "transfer",
                "close",
                "hold",
                "unhold",
                "emergency",
                "rank",
                "normal",
              ]
          ).map((a) => (
            <option key={a} value={a}>
              {(
                {
                  rank: "Verified purchased rank priority",
                  normal: "Normal priority",
                  transfer: "Transfer to staff account",
                  close: "Close with a message to the player",
                } as Record<string, string>
              )[a] ?? a}
            </option>
          ))}
        </select>
      </label>
      {selected === "transfer" ? (
        <label className="grid gap-2 text-sm">
          Assign to
          <select
            name="value"
            disabled={pending}
            required
            className="border border-border bg-bg-card p-2"
          >
            {assignees.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
      ) : selected === "close" ? (
        <label className="grid gap-2 text-sm">
          Message to the player
          <textarea
            name="value"
            value={closingMessage}
            onChange={(e) => setClosingMessage(e.target.value)}
            maxLength={1000}
            disabled={pending}
            required
            rows={2}
            className="border border-border bg-bg-card p-2"
          />
        </label>
      ) : (
        <input type="hidden" name="value" value="" />
      )}
      <p className="text-xs text-text-muted">
        Transfer and priority changes require lead/owner access. Mark
        purchased-rank priority only after checking the purchase. HOF/staff
        reports retain their restricted access.
      </p>
      {state.error && (
        <p role="alert" className="text-sm text-accent">
          {state.error}
        </p>
      )}
      {state.saved && (
        <p role="status" className="text-sm text-teal">
          Action saved.
        </p>
      )}
      <button
        disabled={pending}
        className="justify-self-start border border-accent px-4 py-2 text-sm text-accent"
      >
        {pending ? "Saving…" : "Apply action"}
      </button>
    </form>
  );
}
