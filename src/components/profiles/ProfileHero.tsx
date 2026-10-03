import Image from "next/image";
import Link from "next/link";
import { ShareButton } from "@/components/profiles/ShareButton";
import { SteamAvatar } from "@/components/profiles/SteamAvatar";

/**
 * Profile header: name and share button on the left, the cluster's portrait render
 * (survivors per tribe size, King Titan for 100x) framed on the right. On phones the
 * portrait sits behind the text instead.
 */
export function ProfileHero({
  kicker,
  title,
  sub,
  art,
  focus,
  shareLabel,
  avatar,
}: {
  kicker: string;
  title: string;
  sub: string;
  art: string;
  focus: string;
  shareLabel?: string;
  avatar?: string | null;
}) {
  return (
    <section className="relative overflow-hidden pb-12 pt-28 sm:pt-36">
      <div className="absolute inset-0 md:hidden">
        <Image src={art} alt="" fill preload sizes="100vw" quality={80} className={`object-cover ${focus}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-bg-primary/40" />
      </div>
      <div className="absolute left-1/4 top-0 hidden h-[300px] w-[500px] rounded-full bg-accent/10 blur-[120px] md:block" />

      <div className="relative mx-auto grid max-w-6xl items-end gap-10 px-4 pt-40 md:grid-cols-[minmax(0,1fr)_300px] md:pt-0 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <Link href="/players" className="hud-label mb-5 inline-flex items-center gap-3 transition hover:!text-accent">
            <span className="h-px w-8 bg-accent" />
            {kicker}
          </Link>
          <div className="flex items-center gap-4">{kicker === "Player profile" && <SteamAvatar avatar={avatar} name={title} className="h-20 w-20 sm:h-24 sm:w-24" />}<h1 className="min-w-0 font-display break-words text-[clamp(3rem,9vw,7.5rem)] font-black">{title}</h1></div>
          <p className="mt-3 font-mono text-sm text-text-primary/75">{sub}</p>
          <div className="mt-7">
            <ShareButton label={shareLabel} />
          </div>
        </div>
        <div className="clip-corner relative hidden aspect-[4/5] overflow-hidden border border-border md:block">
          <Image src={art} alt="" fill preload sizes="360px" quality={85} className={`ken-burns object-cover ${focus}`} />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg-primary/80 to-transparent" />
        </div>
      </div>
      <div className="hairline absolute inset-x-0 bottom-0" />
    </section>
  );
}
