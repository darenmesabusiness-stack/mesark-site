import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { publishedMonths } from "@/lib/changelogStore";
import { pageMeta } from "@/lib/seo";
import { changeTotals, highlights } from "@/components/changelog/tags";

export async function generateMetadata(): Promise<Metadata> {
  const [latest] = await publishedMonths();
  return pageMeta({
    title: "Change Log",
    description: "Every MESARK update, month by month.",
    image: { url: latest.hero, width: 2400, height: 1350 },
  });
}

export default async function ChangeLogIndex() {
  const [latest, ...older] = await publishedMonths();
  const lt = changeTotals(latest);

  return (
    <>
      <PageHeader
        title="Change Log"
        subtitle="Every change we ship, month by month. Dino of the Month, cave reworks, cluster balance and F2 Shop."
        image="/art/ark/siege.jpg"
        focus="object-[70%_50%]"
        kicker="Patch notes"
      />

      <div className="mx-auto max-w-7xl px-4 pb-24">
        <Link
          href={`/changelog/${latest.slug}`}
          className="clip-corner group relative block aspect-[4/5] overflow-hidden bg-bg-card sm:aspect-[16/9] lg:aspect-[21/9]"
        >
          <Image
            src={latest.hero}
            alt=""
            fill
            preload
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-[66%_50%] transition duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/90 via-bg-primary/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <span className="hud-label inline-flex items-center gap-2 bg-accent px-2 py-1 !text-bg-primary">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-bg-primary" /> Latest
            </span>
            <h2 className="font-display mt-4 text-[clamp(3.5rem,10vw,8rem)] font-black">
              {latest.month} <span className="text-stroke">{latest.year}</span>
            </h2>
            {latest.dotm && (
              <p className="mt-2 text-lg text-text-primary/85">
                Dino of the Month: <span className="font-bold text-accent">{latest.dotm.dino}</span>
                {latest.dotm.bonus && (
                  <span className="block text-text-muted sm:inline">
                    <span className="hidden sm:inline"> · </span>
                    {latest.dotm.bonus} tamed resistance
                  </span>
                )}
              </p>
            )}
            <ul className="mt-4 hidden max-w-xl space-y-1 text-sm text-text-primary/70 sm:block">
              {highlights(latest).map((h) => (
                <li key={h}>+ {h}</li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-5">
              <span className="font-mono text-xs text-text-muted">{lt.total} changes</span>
              <span className="font-display text-xl font-extrabold tracking-wider text-accent transition-transform group-hover:translate-x-1">
                Read the notes →
              </span>
            </div>
          </div>
        </Link>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {older.map((m) => {
            const t = changeTotals(m);
            return (
              <Link key={m.slug} href={`/changelog/${m.slug}`} className="clip-corner group block overflow-hidden border border-border bg-bg-card transition hover:border-accent/50">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={m.hero}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-[66%_50%] transition duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
                </div>
                <div className="p-5 pt-1">
                  <p className="hud-label">{m.year}</p>
                  <h3 className="font-display mt-1 text-5xl font-black transition group-hover:text-accent">{m.month}</h3>
                  {m.dotm && (
                    <p className="mt-2 text-sm text-text-primary/80">
                      Dino of the Month: <span className="font-semibold text-accent">{m.dotm.dino}</span>
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="font-mono text-[11px] text-text-muted">
                      {t.total} changes{t.caves ? ` · ${t.caves} cave${t.caves === 1 ? "" : "s"}` : ""}
                    </span>
                    <span className="font-display text-lg font-extrabold tracking-wider text-accent transition-transform group-hover:translate-x-1">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
