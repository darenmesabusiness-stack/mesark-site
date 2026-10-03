export default function StaffLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:pt-32" role="status" aria-live="polite">
      <p className="hud-label flex items-center gap-3"><span className="h-px w-8 bg-accent" />MESA staff</p>
      <h1 className="font-display mt-10 text-[clamp(2.75rem,8vw,5rem)] font-black">Loading staff section</h1>
      <p className="mt-4 text-text-muted">Opening your page…</p>
      <div className="mt-8 h-1 max-w-xs overflow-hidden bg-border" aria-hidden="true">
        <div className="h-full w-1/3 animate-pulse bg-accent" />
      </div>
    </div>
  );
}
