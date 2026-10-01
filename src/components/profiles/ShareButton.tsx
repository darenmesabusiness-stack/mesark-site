"use client";

import { useState } from "react";
import { LinkIcon, CheckIcon } from "@heroicons/react/24/outline";

/** Copies the current page URL; pasted in Discord it unfurls into the profile's stat card. */
export function ShareButton({ label = "Copy profile link" }: { label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href.split("#")[0]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or permissions): leave the button as is.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`clip-corner-sm inline-flex items-center gap-2 border px-4 py-2.5 font-display text-lg font-extrabold uppercase tracking-wide transition ${
        copied ? "border-teal bg-teal/15 text-teal" : "border-accent bg-accent text-bg-primary hover:bg-accent/90"
      }`}
    >
      {copied ? <CheckIcon className="h-5 w-5" /> : <LinkIcon className="h-5 w-5" />}
      {copied ? "Link copied" : label}
    </button>
  );
}
