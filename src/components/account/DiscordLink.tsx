"use client";

import { useActionState } from "react";
import { linkDiscordAction, unlinkDiscordAction, type LinkState } from "@/app/account/actions";

/** Account page: link Discord with a /link code, or show the linked account with an unlink button. */
export function DiscordLink({ linkedName }: { linkedName: string | null }) {
  const [state, action, pending] = useActionState<LinkState, FormData>(linkDiscordAction, { error: null });

  if (linkedName) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-lg">
            Linked to <span className="font-semibold text-accent">@{linkedName}</span>
          </p>
          {state.linked && <p className="mt-1 text-sm text-teal">Done. The bot knows this Discord is you.</p>}
          <p className="mt-1 text-sm text-text-muted">Run /link again from another Discord account to move it.</p>
        </div>
        <form action={unlinkDiscordAction}>
          <button type="submit" className="text-sm text-text-muted underline underline-offset-4 transition hover:text-accent">
            Unlink Discord
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <ol className="grid gap-1 text-sm text-text-primary/80">
        <li>
          1. In the MESA Discord, type <code className="border border-border bg-bg-secondary px-1.5 py-0.5 font-mono text-accent">/link</code>. Only you see the reply.
        </li>
        <li>2. Type the code it gives you here. Codes last 10 minutes.</li>
      </ol>
      <form action={action} className="mt-4 flex max-w-md gap-2">
        <label htmlFor="link-code" className="sr-only">
          Code from /link
        </label>
        <input
          id="link-code"
          name="code"
          required
          autoComplete="one-time-code"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={12}
          placeholder="ABCD-2345"
          className="min-w-0 flex-1 border border-border bg-bg-card px-4 py-2.5 font-mono text-lg uppercase tracking-widest outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={pending}
          className="clip-corner-sm bg-accent px-5 font-display text-xl font-extrabold uppercase tracking-wide text-bg-primary transition hover:bg-[#ff8c45] disabled:opacity-60"
        >
          {pending ? "Linking…" : "Link"}
        </button>
      </form>
      {state.error && (
        <p role="alert" className="mt-3 border-l-2 border-accent bg-bg-card/80 px-4 py-2 text-sm">
          {state.error}
        </p>
      )}
    </div>
  );
}
