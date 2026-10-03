"use client";

import { useActionState } from "react";
import { saveDelivery, saveTicketReview } from "@/app/staff/review-actions";

export function ReviewForm({ kind, id, state, note }: { kind: "delivery" | "ticket"; id: string; state: string; note: string }) {
  const [result, action, pending] = useActionState(kind === "delivery" ? saveDelivery : saveTicketReview, {});
  const states = kind === "delivery" ? ["unknown", "needs_check", "confirmed", "not_delivered"] : ["unreviewed", "active", "hold", "needs_records", "reviewed"];
  return <details className="mt-2 text-sm">
    <summary className="cursor-pointer underline">Review: {state.replaceAll("_", " ")}</summary>
    <form action={action} className="mt-2 grid gap-2">
      <input type="hidden" name="id" value={id} />
      <label>Review state<select name="state" defaultValue={state} className="ml-2 bg-bg-card border border-border p-1">{states.map(s => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}</select></label>
      <label className="grid gap-1">Private note or evidence reference<textarea name="note" defaultValue={note} required maxLength={1000} className="bg-bg-card border border-border p-2" /></label>
      <button disabled={pending} className="border border-border p-2 disabled:opacity-50">{pending ? "Saving…" : "Save review"}</button>
      {result.error && <p role="alert" className="text-accent">{result.error}</p>}
      {result.saved && <p role="status" className="text-teal">Review saved.</p>}
    </form>
  </details>;
}
