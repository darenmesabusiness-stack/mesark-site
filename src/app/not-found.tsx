import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-text-muted/30 mb-4">
          404
        </h1>
        <p className="text-xl font-bold text-text-primary mb-2">Page not found</p>
        <p className="text-sm text-text-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-accent hover:bg-accent-secondary text-white font-bold rounded-lg transition-all text-sm"
          >
            HOME
          </Link>
          <Link
            href="/servers"
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-border text-text-primary font-semibold rounded-lg transition-all text-sm"
          >
            SERVERS
          </Link>
        </div>
      </div>
    </div>
  );
}
