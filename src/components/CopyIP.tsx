"use client";

import { useState } from "react";

export function CopyIP({ ip, label }: { ip: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label} IP ${ip}`}
      className={`group flex w-full items-center justify-between gap-3 border px-3 py-2.5 text-left transition ${
        copied ? "border-emerald-500/50 bg-emerald-500/10" : "border-border/70 bg-bg-primary/40 hover:border-accent/50 hover:bg-accent/[0.05]"
      }`}
    >
      <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-text-primary">
        <span className="truncate">{label}</span>
      </span>
      <span className="flex items-center gap-3">
        <code className="font-mono text-[11px] text-text-muted sm:text-xs">{ip}</code>
        <span
          className={`w-14 text-right font-mono text-[10px] font-semibold uppercase tracking-widest transition ${
            copied ? "text-emerald-400" : "text-accent"
          }`}
        >
          {copied ? "Copied" : "Copy"}
        </span>
      </span>
    </button>
  );
}
