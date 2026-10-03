"use client";
import Image from "next/image";
import { useState } from "react";
import { steamAvatar } from "@/lib/steamAvatar";

export function SteamAvatar({
  avatar,
  name,
  className = "h-11 w-11",
}: {
  avatar?: string | null;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  const source = steamAvatar(avatar);
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-bg-card font-display text-xl font-black text-text-primary/80 ${className}`}
    >
      {source && failed !== source ? (
        <Image
          src={source}
          alt=""
          fill
          unoptimized
          className="object-cover"
          onError={() => setFailed(source)}
        />
      ) : (
        name.trim().slice(0, 1).toLocaleUpperCase() || "?"
      )}
    </span>
  );
}
