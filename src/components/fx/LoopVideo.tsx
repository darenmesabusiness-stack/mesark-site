"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Muted background loop that only downloads once it scrolls near the viewport,
 * pauses off-screen, and never plays for reduced-motion users. Sits on top of
 * a next/image poster supplied by the parent, fading in once frames arrive.
 */
export function LoopVideo({ src, className = "" }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          v.muted = true;
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      src={load ? src : undefined}
      onPlaying={() => setPlaying(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );
}
