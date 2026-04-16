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
    <div
      onClick={handleCopy}
      className="flex items-center justify-between px-3 py-2 rounded-lg border border-border/50 bg-bg-card/30 hover:border-accent/30 cursor-pointer transition group"
    >
      <span className="text-text-primary text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <code className="text-[10px] sm:text-xs text-text-muted font-mono">{ip}</code>
        <span className={`text-xs font-semibold transition ${copied ? "text-green-400" : "text-accent group-hover:text-accent/80"}`}>
          {copied ? "Copied!" : "Copy IP"}
        </span>
      </div>
    </div>
  );
}
