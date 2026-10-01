import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[100svh] items-center overflow-hidden px-4">
      <Image src="/art/ark/ashfield.jpg" alt="" fill sizes="100vw" className="object-cover object-[70%_40%] opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/60 via-transparent to-bg-primary" />
      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <p className="hud-label mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-accent" />
          Error 404
        </p>
        <h1 className="font-display text-[clamp(4rem,14vw,10rem)] font-black">
          Wiped. <span className="ember-text">Nothing here.</span>
        </h1>
        <p className="mt-4 max-w-md text-lg text-text-primary/75">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="clip-corner inline-flex items-center justify-center bg-accent px-8 py-3.5 font-display text-lg font-extrabold tracking-wider text-bg-primary transition hover:bg-[#ff8c45]"
          >
            Home
          </Link>
          <Link
            href="/servers"
            className="clip-corner inline-flex items-center justify-center border border-white/20 bg-white/5 px-8 py-3.5 font-display text-lg font-extrabold tracking-wider transition hover:bg-white/10"
          >
            Servers
          </Link>
        </div>
      </div>
    </div>
  );
}
