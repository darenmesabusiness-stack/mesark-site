"use client";
import { useActionState, useState } from "react";
import { saveWinner } from "@/app/staff/hof/actions";
import type { HofWinner } from "@/components/HofGallery";
export function HofEditor({
  entry,
  published = false,
  id,
}: {
  entry?: HofWinner;
  published?: boolean;
  id: string;
}) {
  const [state, action, pending] = useActionState<
    { error: string | null; saved?: boolean },
    FormData
  >(saveWinner, { error: null });
  const field = "border border-border bg-bg-card p-3 text-sm";
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [publish, setPublish] = useState(published),
    [verified, setVerified] = useState(false);
  return (
    <form
      action={action}
      onChange={(e) => {
        const target = e.target;
        if (
          (target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target instanceof HTMLSelectElement) &&
          target.type !== "checkbox"
        )
          setDraft((v) => ({ ...v, [target.name]: target.value }));
      }}
      className="grid gap-4"
    >
      <input name="id" type="hidden" value={id} />
      <p className="text-sm text-text-muted">
        Publish confirmed winners after reviewing their private HOF ticket. This
        form contains public information only. Publishing does not change
        Discord roles or issue rewards.
      </p>
      <label className="grid gap-2 text-sm">
        Tribe
        <input
          name="tribe"
          required
          maxLength={100}
          value={draft.tribe ?? entry?.tribe ?? ""}
          onChange={() => {}}
          className={field}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-2 text-sm">
          Season
          <input
            name="season"
            required
            pattern="[0-9]{1,4}"
            value={draft.season ?? entry?.season ?? ""}
            onChange={() => {}}
            className={field}
          />
        </label>
        <label className="grid gap-2 text-sm">
          Cluster
          <select
            name="cluster"
            value={
              draft.cluster ??
              (entry?.cluster
                ? /100x/i.test(entry.cluster)
                  ? "100x"
                  : /duo/i.test(entry.cluster)
                    ? "Duo"
                    : /solo/i.test(entry.cluster)
                      ? "Solo"
                      : entry.cluster.replace(/(\d)\s*man.*/i, "$1 Man")
                : "Solo")
            }
            onChange={() => {}}
            className={field}
          >
            {["Solo", "Duo", "3 Man", "4 Man", "6 Man", "100x"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          Recognition date
          <input
            name="date"
            type="date"
            required
            value={
              draft.date ??
              (entry?.date.slice(0, 10) ||
                new Date().toISOString().slice(0, 10))
            }
            onChange={() => {}}
            className={field}
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm">
        Winning roster — one name | Discord profile URL per line
        <textarea
          name="members"
          required
          rows={5}
          maxLength={4000}
          value={
            draft.members ??
            entry?.members
              .map((m) => `${m.name} | https://discord.com/users/${m.id}`)
              .join("\n") ??
            ""
          }
          onChange={() => {}}
          className={field}
        />
      </label>
      <label className="grid gap-2 text-sm">
        Public achievement description
        <textarea
          name="achievement"
          rows={3}
          maxLength={1000}
          value={draft.achievement ?? entry?.achievement ?? ""}
          onChange={() => {}}
          className={field}
        />
      </label>
      <label className="grid gap-2 text-sm">
        Public base tour / wipe video
        <input
          name="video"
          type="url"
          value={draft.video ?? entry?.video ?? ""}
          onChange={() => {}}
          className={field}
        />
      </label>
      <label className="grid gap-2 text-sm">
        Official winner announcement (optional for website announcements)
        <input
          name="source"
          type="url"
          value={
            draft.source ??
            (entry?.source.startsWith("https://discord.com/")
              ? entry.source
              : "")
          }
          onChange={() => {}}
          className={field}
        />
      </label>
      <label className="grid gap-2 text-sm">
        ARK artwork
        <select
          name="art"
          value={draft.art ?? (entry?.art || "/art/ark/hall.jpg")}
          onChange={() => {}}
          className={field}
        >
          {[
            ["/art/ark/hall.jpg", "Hall of Fame"],
            ["/art/ark/rex.jpg", "Rex"],
            ["/art/ark/siege.jpg", "Giganotosaurus"],
            ["/art/ark/hundredx-king.jpg", "King Titan"],
          ].map(([src, label]) => (
            <option key={src} value={src}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          name="verified"
          type="checkbox"
          required
          checked={verified}
          onChange={(e) => setVerified(e.target.checked)}
        />{" "}
        I verified this winner and the public roster.
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          name="published"
          type="checkbox"
          checked={publish}
          onChange={(e) => setPublish(e.target.checked)}
        />{" "}
        Show on the public Hall of Fame (uncheck to hide)
      </label>
      {state.error && (
        <p role="alert" className="text-accent text-sm">
          {state.error}
        </p>
      )}
      {state.saved && (
        <p role="status" className="text-teal text-sm">
          Hall of Fame record saved.
        </p>
      )}
      <button
        disabled={pending}
        className="justify-self-start border border-accent px-5 py-2 text-accent"
      >
        {pending ? "Saving…" : "Save winner"}
      </button>
    </form>
  );
}
