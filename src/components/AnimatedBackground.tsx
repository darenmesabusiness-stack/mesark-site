"use client";

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
