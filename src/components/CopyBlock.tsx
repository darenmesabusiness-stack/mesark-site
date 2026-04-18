"use client";

import { useState } from "react";

export function CopyBlock({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-bg-card border border-border rounded-lg p-4 text-xs text-text-muted overflow-x-auto leading-relaxed whitespace-pre">
        {content}
      </pre>
      <button
        onClick={handleCopy}
        className={`absolute top-3 right-3 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
          copied
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-blue/20 text-blue border border-blue/30 hover:bg-blue/30"
        }`}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
