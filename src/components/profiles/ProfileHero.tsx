import Image from "next/image";
import Link from "next/link";
import { SteamAvatar } from "@/components/profiles/SteamAvatar";

/** Player profiles lead with Steam identity; tribe profiles retain cluster art. */
export function ProfileHero({
  kicker,
  title,
  sub,
  art,
  focus,
  avatar,
  player = kicker === "Player profile",
  accentColor,
}: {
  kicker: string;
  title: string;
  sub: string;
  art: string;
  focus: string;
  avatar?: string | null;
  player?: boolean;
  accentColor?: string;
}) {
  return (
    <section className="relative overflow-hidden pb-12 pt-28 sm:pt-36">
      {!player && <div className="absolute inset-0 md:hidden">
        <Image src={art} alt="" fill preload sizes="100vw" quality={80} className={`object-cover ${focus}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-bg-primary/40" />
      </div>}
      <div className="absolute left-1/4 top-0 hidden h-[300px] w-[500px] rounded-full bg-accent/10 blur-[120px] md:block" />

      <div className={`relative mx-auto max-w-6xl gap-10 px-4 ${player ? "pt-4" : "grid items-end pt-40 md:grid-cols-[minmax(0,1fr)_300px] md:pt-0 lg:grid-cols-[minmax(0,1fr)_360px]"}`}>
        <div className="min-w-0">
          <Link href="/players" className="hud-label mb-5 inline-flex items-center gap-3 transition hover:!text-accent">
            <span className="h-px w-8 bg-accent" />
            {kicker}
          </Link>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">{player && <SteamAvatar avatar={avatar} name={title} borderColor={accentColor} className="h-36 w-36 !rounded-xl !border-2 !text-6xl sm:h-48 sm:w-48" />}<h1 className="min-w-0 font-display break-words text-[clamp(3rem,9vw,7.5rem)] font-black">{title}</h1></div>
          <p className="mt-3 font-mono text-sm text-text-primary/75">{sub}</p>
        </div>
        {!player && <div className="clip-corner relative hidden aspect-[4/5] overflow-hidden border border-border md:block">
          <Image src={art} alt="" fill preload sizes="360px" quality={85} className={`ken-burns object-cover ${focus}`} />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg-primary/80 to-transparent" />
        </div>}
      </div>
      <div className="hairline absolute inset-x-0 bottom-0" />
    </section>
  );
}
