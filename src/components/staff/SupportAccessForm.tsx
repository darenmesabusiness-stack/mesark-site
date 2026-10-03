"use client";
import { useActionState } from "react";
import { grantAccess } from "@/app/staff/tickets/actions";
import { SUPPORT_TYPES } from "@/lib/supportTypes";

export function SupportAccessForm({
  team,
}: {
  team: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState<
    { error: string | null; saved?: boolean },
    FormData
  >(grantAccess, { error: null });
  return (
    <form action={action} className="mt-6 grid gap-4 border border-border p-4">
      <label className="grid gap-2 text-sm">
        Staff account
        <select
          required
          name="target"
          className="border border-border bg-bg-card p-2"
        >
          {team.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        Cluster
        <select name="cluster" className="border border-border bg-bg-card p-2">
          {["Solo", "Duo", "3/6 Man", "4 Man", "100x", "MESA", "*"].map((c) => (
            <option key={c} value={c}>
              {c === "*" ? "All clusters" : c === "3/6 Man" ? "3 Man" : c}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        Ticket type
        <select name="type" className="border border-border bg-bg-card p-2">
          {SUPPORT_TYPES.map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input name="enabled" type="checkbox" defaultChecked /> Grant access
        (uncheck to revoke)
      </label>
      <p className="text-sm text-text-muted">
        Assign the staff member’s actual responsibility. HOF is for senior/HOF
        staff; questions for moderators; black market for developers/team.
        Permanent rank orders are developer-only. Staff reports remain
        lead/owner-only.
      </p>
      {state.error && (
        <p role="alert" className="text-sm text-accent">
          {state.error}
        </p>
      )}
      {state.saved && (
        <p role="status" className="text-sm text-teal">
          Responsibility saved.
        </p>
      )}
      <button
        disabled={pending}
        className="justify-self-start border border-accent px-4 py-2 text-sm text-accent"
      >
        {pending ? "Saving…" : "Save responsibility"}
      </button>
    </form>
  );
}
