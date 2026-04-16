"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Morphing gradient blobs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.07] animate-blob-1"
        style={{ background: "radial-gradient(circle, #e87b35, transparent 70%)" }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.05] animate-blob-2"
        style={{ background: "radial-gradient(circle, #2d7aef, transparent 70%)" }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.04] animate-blob-3"
        style={{ background: "radial-gradient(circle, #e87b35, transparent 70%)" }}
      />
    </div>
  );
}

export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-[1] transition-transform duration-200 ease-out"
      style={{
        background: "radial-gradient(circle, rgba(45, 122, 239, 0.06) 0%, rgba(232, 123, 53, 0.03) 40%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
  );
}
