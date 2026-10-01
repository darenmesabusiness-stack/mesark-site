import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publishedMonths } from "@/lib/changelogStore";
import { caveMaps } from "@/data/caves";
import { ChangeLogBody } from "@/components/changelog/ChangeLogBody";
import { TAGS, TAG_ORDER, changeTotals } from "@/components/changelog/tags";
import { pageMeta } from "@/lib/seo";

// Months published later in the staff editor render on first visit, then stay cached.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await publishedMonths()).map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = (await publishedMonths()).find((x) => x.slug === slug);
  if (!m) return {};
  const { total } = changeTotals(m);
  const dotm = m.dotm ? `Dino of the Month: ${m.dotm.dino}${m.dotm.bonus ? ` (${m.dotm.bonus} tamed resistance)` : ""}. ` : "";
  return pageMeta({
    title: `${m.month} ${m.year} Change Log`,
    description: `${dotm}${total} changes to MESARK.`,
    image: { url: m.hero, width: 2400, height: 1350 },
  });
}

export default async function ChangeLogMonthPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const changelog = await publishedMonths();
  const i = changelog.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const m = changelog[i];
  const newer = changelog[i - 1];
  const older = changelog[i + 1];
  const { total, caves, tags } = changeTotals(m);
  const mapNames = Object.fromEntries(caveMaps.map((c) => [c.slug, c.name]));

  return (
    <>
      <section className="relative flex min-h-[78vh] items-end overflow-hidden pb-12 pt-32 sm:min-h-[86vh] sm:pb-16">
        <Image
          src={m.hero}
          alt={m.dotm ? `${m.dotm.dino}, MESA's Dino of the Month for ${m.month}, rendered from ARK's game files` : ""}
          fill
          preload
          sizes="100vw"
          quality={85}
          className="ken-burns object-cover object-[68%_50%] md:object-[60%_50%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/90 via-bg-primary/45 to-transparent" />
        <div className="absolute inset-x-0 -bottom-px h-2/3 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />
        <div className="hairline absolute inset-x-0 bottom-0" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4">
          <Link href="/changelog" className="hud-label mb-5 inline-flex items-center gap-3 transition hover:!text-accent">
            <span className="h-px w-8 bg-accent" />
            Change log · {m.year}
          </Link>
          <h1 className="font-display text-[clamp(4.5rem,15vw,11rem)] font-black">{m.month}</h1>
          <p className="mt-3 font-mono text-sm text-text-primary/75">
            {total} changes{caves ? ` · ${caves} to caves & MESA City` : ""}
          </p>

          {m.dotm && (
            <div className="clip-corner mt-8 inline-block border-l-2 border-accent bg-bg-primary/75 px-5 py-4 backdrop-blur">
              <p className="hud-label !text-accent">Dino of the Month</p>
              <p className="font-display mt-1 text-4xl font-black sm:text-5xl">{m.dotm.dino}</p>
              {m.dotm.bonus && (
                <p className="mt-1 text-sm text-text-primary/75">
                  Tamed resistance <span className="font-bold text-accent">{m.dotm.bonus}</span> all month
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-3 gap-px border border-border bg-border sm:grid-cols-6">
          {TAG_ORDER.map((t) => (
            <div key={t} className="bg-bg-secondary px-3 py-3">
              <p className={`font-mono text-[10px] uppercase tracking-wider ${TAGS[t].className.split(" ").filter((c) => c.startsWith("text-")).join(" ")}`}>
                {TAGS[t].label}
              </p>
              <p className="font-display mt-1 text-3xl font-black">{tags[t]}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 pb-16">
          <ChangeLogBody month={m} mapNames={mapNames} />
        </div>

        <nav className="grid gap-px border border-border bg-border pb-px sm:grid-cols-2" aria-label="Other months">
          {[older, newer].map((x, k) =>
            x ? (
              <Link
                key={x.slug}
                href={`/changelog/${x.slug}`}
                className={`group relative block overflow-hidden bg-bg-card p-6 ${k === 1 ? "sm:text-right" : ""}`}
              >
                <Image src={x.hero} alt="" fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover opacity-25 transition duration-500 group-hover:scale-105 group-hover:opacity-40" />
                <div className="relative">
                  <p className="hud-label">{k === 0 ? "← Older" : "Newer →"}</p>
                  <p className="font-display mt-1 text-4xl font-black transition group-hover:text-accent">
                    {x.month} {x.year}
                  </p>
                  {x.dotm && <p className="mt-1 text-sm text-text-muted">Dino of the Month: {x.dotm.dino}</p>}
                </div>
              </Link>
            ) : (
              <Link key={k} href="/changelog" className={`group block bg-bg-card p-6 ${k === 1 ? "sm:text-right" : ""}`}>
                <p className="hud-label">{k === 0 ? "Start of the log" : "Latest month"}</p>
                <p className="font-display mt-1 text-4xl font-black text-text-primary/60 transition group-hover:text-accent">All months</p>
              </Link>
            ),
          )}
        </nav>
        <div className="h-20" />
      </div>
    </>
  );
}
