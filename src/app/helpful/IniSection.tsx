"use client";

import { useState, useEffect } from "react";

const PRESETS = [
  { key: "soft", label: "Soft", desc: "Balanced — good visuals with PvP tweaks", file: "/ini/soft.ini" },
  { key: "hard", label: "Hard", desc: "Competitive — stripped effects, max visibility", file: "/ini/hard.ini" },
  { key: "hardest", label: "Hardest", desc: "Maximum FPS — minimal rendering, bare-bones visuals", file: "/ini/hardest.ini" },
];

export function IniSection() {
  const [active, setActive] = useState("soft");
  const [contents, setContents] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    PRESETS.forEach(async (p) => {
      const res = await fetch(p.file);
      const text = await res.text();
      setContents((prev) => ({ ...prev, [p.key]: text }));
    });
  }, []);

  const current = PRESETS.find((p) => p.key === active)!;
  const text = contents[active] || "Loading...";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BaseDeviceProfiles_${active}.ini`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-3">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => { setActive(p.key); setCopied(false); }}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              active === p.key
                ? "bg-blue text-white"
                : "bg-bg-card border border-border text-text-muted hover:text-text-primary hover:bg-white/5"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <p className="text-xs text-text-muted mb-3">{current.desc}</p>

      {/* Actions */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={handleCopy}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            copied
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-blue/20 text-blue border border-blue/30 hover:bg-blue/30"
          }`}
        >
          {copied ? "Copied!" : "Copy to Clipboard"}
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-bg-card border border-border text-text-muted hover:text-text-primary hover:bg-white/5 transition-all"
        >
          Download .ini
        </button>
      </div>

      {/* Code block */}
      <pre className="bg-bg-card border border-border rounded-lg p-4 text-[11px] text-text-muted overflow-x-auto leading-relaxed whitespace-pre max-h-[400px] overflow-y-auto">
        {text}
      </pre>
    </div>
  );
}
