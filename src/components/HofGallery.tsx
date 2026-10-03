"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { memberPath, tributeColor, tributeText, rosterHistory } from "@/lib/hofTribute";
export type HofMember = { id: string; name: string; honors: string[] };
export type HofWinner = {
  id: string;
  tribe: string;
  season: string;
  cluster: string;
  date: string;
  members: HofMember[];
  video: string | null;
  source: string;
  achievement?: string;
  art?: string;
  signature?: string;
  videoTitle?: string;
  wipeStats?: { score?: number; raids?: number; kills?: number; defenses?: number };
};
export function HofGallery({
  winners,
  honorees,
}: {
  winners: HofWinner[];
  honorees: HofMember[];
}) {
  const [search, setSearch] = useState(""),
    [cluster, setCluster] = useState("all"),
    [tab, setTab] = useState("winners");
  const [limit,setLimit]=useState(12);
  const needle = search.trim().toLowerCase();
  const matches = (value: string) =>
    !needle || value.toLowerCase().includes(needle);
  const normalized = (value: string) =>
    /100x/i.test(value)
      ? "100x"
      : /solo/i.test(value)
        ? "Solo"
        : /duo/i.test(value)
          ? "Duo"
          : /3\s*man/i.test(value)
            ? "3 Man"
            : /4\s*man/i.test(value)
              ? "4 Man"
              : /6\s*man/i.test(value)
                ? "6 Man"
                : value;
  const records = winners.filter(
    (w) =>
      (cluster === "all" || normalized(w.cluster) === cluster) &&
      matches(
        `${w.tribe} ${w.season} ${w.cluster} ${w.members.map((m) => m.name).join(" ")}`,
      ),
  );
  const members = honorees.filter(
    (m) =>
      (cluster === "all" ||
        m.honors.some((r) =>
          cluster === "3 Man" || cluster === "6 Man"
            ? r.startsWith("3/6")
            : normalized(r) === cluster,
        )) &&
      matches(`${m.name} ${m.honors.join(" ")}`),
  );
  const fields =
    "border border-border bg-bg-card px-3 py-2 text-sm focus:border-accent outline-none";
  return (
    <section>
      <nav
        aria-label="Hall of Fame views"
        className="mb-6 flex flex-wrap gap-4"
      >
        {[
          ["winners", "Season winners"],
          ["members", "Hall of Fame members"],
        ].map(([key, label]) => (
          <button
            key={key}
            aria-pressed={tab === key}
              onClick={() => {setTab(key);setLimit(key==='members'?24:12);}}
            className={`border px-4 py-2 font-display text-xl font-bold ${tab === key ? "border-accent text-accent" : "border-border text-text-muted"}`}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="mb-8 grid gap-3 sm:grid-cols-[1fr_12rem]">
        <label className="grid gap-2 text-sm text-text-muted">
          Find a tribe, member or season
          <input
            value={search}
            onChange={(e) => {setSearch(e.target.value);setLimit(tab==='members'?24:12);}}
            className={fields}
            type="search"
          />
        </label>
        <label className="grid gap-2 text-sm text-text-muted">
          Cluster
          <select
            value={cluster}
            onChange={(e) => {setCluster(e.target.value);setLimit(tab==='members'?24:12);}}
            className={fields}
          >
            {["all", "Solo", "Duo", "3 Man", "4 Man", "6 Man", "100x"].map(
              (c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All clusters" : c}
                </option>
              ),
            )}
          </select>
        </label>
      </div>
      <p role="status" className="mb-5 text-sm text-text-muted">
        {tab === "winners" ? records.length : members.length}{" "}
        {tab === "winners" ? "winner records" : "members"}
      </p>
      {tab === "winners" ? (
        <div className="grid gap-6 md:grid-cols-2">
          {records.slice(0,limit).map((w) => (
            <article
              key={w.id}
              id={w.id}
              className="clip-corner overflow-hidden border border-border bg-bg-card/60"
              style={{ borderTop: `3px solid ${tributeColor(w.tribe)}` }}
            >
              <div className="relative h-40">
                <Image
                  src={w.art || "/art/ark/hall.jpg"}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-[30%_50%] opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
                <span aria-hidden className="absolute right-5 top-5 flex h-16 w-16 items-center justify-center rounded-full border-2 bg-bg-card/80 font-display text-3xl font-black" style={{color:tributeColor(w.tribe),borderColor:tributeColor(w.tribe)}}>{w.tribe.split(/\s+/).slice(0,2).map(word=>word[0]).join("")}</span>
                <p className="absolute bottom-4 left-5 font-mono text-sm uppercase text-accent">
                  {w.cluster} · Season {w.season}
                </p>
              </div>
              <div className="p-5 pt-2">
                {w.signature && <p className="mb-2 text-sm font-medium" style={{color: tributeColor(w.tribe)}}>{w.signature}</p>}
                <h2 className="font-display text-3xl font-black break-words">
                  {w.tribe}
                </h2>
                <p className="mt-2 text-sm text-text-muted">
                  {tributeText(w)}
                </p>
                <p className="mt-3 text-sm text-text-muted">Recognized {new Date(w.date).toLocaleDateString("en-US", {timeZone:"UTC", month:"long", day:"numeric", year:"numeric"})}</p>
                {w.wipeStats && Object.keys(w.wipeStats).length > 0 && <dl className="mt-4 grid grid-cols-2 gap-3 border-y border-border py-4">
                  {Object.entries(w.wipeStats).map(([label,value]) => <div key={label}><dt className="text-sm capitalize text-text-muted">{label === "score" ? "Tribe score" : label}</dt><dd className="font-display text-3xl" style={{color:tributeColor(w.tribe)}}>{value.toLocaleString("en-US")}</dd></div>)}
                </dl>}
                <h3 className="mt-5 text-sm uppercase tracking-widest text-text-muted">
                  Winning roster
                </h3>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                  {w.members.map((m) => (
                    <li key={m.id} className="min-w-0 max-w-full break-words">
                      <Link
                        href={memberPath(m.id)}
                        className="text-sm hover:text-accent"
                      >
                        {m.name} →
                      </Link>
                    </li>
                  ))}
                </ul>
                {rosterHistory(w,winners).length > 0 && <details className="mt-4 text-sm"><summary className="cursor-pointer text-text-muted">More wins from this roster ({rosterHistory(w,winners).length})</summary><ul className="mt-2 grid gap-2">{rosterHistory(w,winners).map(record => <li key={record.id}><Link href={`/hall-of-fame#${record.id}`} className="hover:text-accent">{record.tribe} · {record.cluster} · Season {record.season}</Link></li>)}</ul></details>}
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                  <Link href={`/hall-of-fame/tributes/${w.id}`} className="text-accent underline">Explore their tribute →</Link>
                  {w.video && (
                    <a
                      href={w.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-words text-accent underline"
                    >
                      {w.videoTitle || "Watch this tribe’s wipe film"} ↗
                    </a>
                  )}
                  <a
                    href={w.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted underline"
                  >
                    Winner announcement ↗
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.slice(0,limit).map((m) => (
            <article
              key={m.id}
              className="border border-border bg-bg-card/60 p-4"
            >
              <h2 className="font-display text-2xl font-bold break-words">
                <Link
                  href={memberPath(m.id)}
                  className="hover:text-accent"
                >
                  {m.name} →
                </Link>
              </h2>
              <ul className="mt-2 grid gap-1 text-sm text-text-muted">
                {m.honors.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
      {(tab==='winners'?records.length:members.length)>limit&&<button className="mt-6 border border-accent px-5 py-2 text-sm text-accent" onClick={()=>setLimit(n=>n+(tab==='members'?24:12))}>Show more {tab==='winners'?'winners':'members'}</button>}
    </section>
  );
}
