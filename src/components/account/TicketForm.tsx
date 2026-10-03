"use client";

import { useActionState, useState } from "react";
import {
  createTicket,
  replyTicket,
  type TicketState,
} from "@/app/support/actions";
import { TICKET_CLUSTERS, TICKET_TYPES } from "@/lib/playerSupport";
import { SUPPORT_TYPES } from "@/lib/supportTypes";

const field =
  "w-full border border-border bg-bg-card px-3 py-2.5 text-sm outline-none focus:border-accent";

export function TicketForm({
  requestId,
  channel,
  staff = false,
  initialType = "general",
  initialCluster = "Solo",
}: {
  requestId: string;
  channel?: string;
  staff?: boolean;
  initialType?: string;
  initialCluster?: string;
}) {
  const [initialId, setInitialId] = useState(requestId);
  const [type, setType] = useState(initialType);
  const native = !channel || channel.startsWith("w_");
  const [state, action, pending] = useActionState<TicketState, FormData>(
    async (prev, form) => {
      const result = await (channel ? replyTicket : createTicket)(prev, form);
      if (result.sent) setInitialId(crypto.randomUUID());
      return result;
    },
    { error: null },
  );
  return (
    <form
      action={action}
      onChange={() => setInitialId(crypto.randomUUID())}
      className="grid gap-4"
    >
      <input type="hidden" name="request_id" value={initialId} />
      {channel ? (
        <input type="hidden" name="channel" value={channel} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">
              What do you need help with?
              <select
                name="type"
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={field}
              >
                {(native ? SUPPORT_TYPES : TICKET_TYPES).map(([key, text]) => (
                  <option key={key} value={key}>
                    {text}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              Cluster
              <select
                name="cluster"
                required
                defaultValue={initialCluster}
                className={field}
              >
                {TICKET_CLUSTERS.map(([key, text]) => (
                  <option key={key} value={key}>
                    {text}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="grid gap-2 text-sm">
            Map <span className="text-text-muted">Optional</span>
            <input
              name="map"
              maxLength={60}
              defaultValue={state.fields?.map}
              className={field}
              placeholder="e.g. Ragnarok"
            />
          </label>
          {type === "hof" && (
            <>
              <p className="text-sm text-text-muted">
                Apply privately. Include accurate tribe members and evidence;
                staff review the application before any public recognition.
              </p>
              {[
                ["tribe", "Tribe name"],
                ["season", "Season"],
                ["location", "Base location (map and coordinates)"],
              ].map(([name, label]) => (
                <label key={name} className="grid gap-2 text-sm">
                  {label}
                  <input
                    name={name}
                    required
                    maxLength={500}
                    defaultValue={state.fields?.[name]}
                    className={field}
                  />
                </label>
              ))}
              <label className="grid gap-2 text-sm">
                Tribe members and their Steam IDs
                <textarea
                  name="members"
                  required
                  maxLength={3000}
                  rows={3}
                  defaultValue={state.fields?.members}
                  className={field}
                />
              </label>
              <label className="grid gap-2 text-sm">
                Base tour / HOF video link (or upload after opening)
                <input
                  type="url"
                  name="tour"
                  maxLength={500}
                  defaultValue={state.fields?.tour}
                  className={field}
                />
              </label>
              <label className="grid gap-2 text-sm">
                Raid list / achievements
                <textarea
                  name="raids"
                  maxLength={3000}
                  rows={3}
                  defaultValue={state.fields?.raids}
                  className={field}
                />
              </label>
            </>
          )}
          {type === "creator" && (
            <label className="grid gap-2 text-sm">
              Your channel URL
              <input
                type="url"
                name="channel_url"
                required
                maxLength={500}
                defaultValue={state.fields?.channel_url}
                className={field}
              />
            </label>
          )}
          {type.startsWith("bm_") && (
            <p className="text-sm text-text-muted">
              Describe your design or rank request. Staff will discuss an
              estimate privately; opening a ticket does not place a paid order.
            </p>
          )}
        </>
      )}
      <label className="grid gap-2 text-sm">
        {channel ? "Your reply" : "Describe the issue"}
        <textarea
          name="body"
          required
          maxLength={native ? 6000 : 1800}
          rows={5}
          defaultValue={state.body ?? ""}
          className={field}
          placeholder={
            channel
              ? "Write your reply…"
              : "What happened, and what do you need help with? Include evidence links if useful."
          }
        />
      </label>
      {native ? (
        <p className="text-xs text-text-muted">
          Private website ticket.{" "}
          {channel
            ? "Attach files below."
            : "Open the ticket, then attach screenshots, videos or documents."}
        </p>
      ) : (
        <p className="text-xs text-text-muted">
          This older ticket continues in Discord.
        </p>
      )}
      {staff && native && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="private" /> Internal staff note (hidden
          from the player)
        </label>
      )}
      {state.error && (
        <p
          role="alert"
          className="border-l-2 border-accent bg-bg-card px-4 py-3 text-sm"
        >
          {state.error}
        </p>
      )}
      {state.sent && !state.error && (
        <p role="status" className="text-sm text-teal">
          Reply sent.
        </p>
      )}
      <button
        disabled={pending}
        className="clip-corner-sm justify-self-start bg-accent px-5 py-2.5 font-display text-xl font-extrabold uppercase tracking-wide text-bg-primary disabled:opacity-60"
      >
        {pending ? "Sending…" : channel ? "Send reply" : "Open ticket"}
      </button>
    </form>
  );
}
