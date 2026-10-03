import Link from "next/link";
import { SteamAvatar } from "@/components/profiles/SteamAvatar";
import { fixText, hours, num, playerHref, tribeHref } from "@/lib/leaderboard";
import type { RankingQuery, RankingRow } from "@/lib/rankings";

const medals = [
  {
    name: "Gold",
    text: "text-[#ffd477]",
    frame:
      "border-[#e4b64b]/60 bg-gradient-to-br from-[#e4b64b]/15 to-bg-card/70",
    glow: "shadow-[0_0_30px_#e4b64b14]",
  },
  {
    name: "Silver",
    text: "text-[#d6e1ec]",
    frame:
      "border-[#b3c4d4]/50 bg-gradient-to-br from-[#b3c4d4]/10 to-bg-card/70",
    glow: "",
  },
  {
    name: "Bronze",
    text: "text-[#e8aa7d]",
    frame:
      "border-[#bd8051]/50 bg-gradient-to-br from-[#bd8051]/15 to-bg-card/70",
    glow: "",
  },
] as const;
export function RankingMedal({
  rank,
  large = false,
}: {
  rank: number;
  large?: boolean;
}) {
  const medal = medals[rank - 1];
  if (!medal)
    return <span className="font-mono text-text-muted">#{num(rank)}</span>;
  return (
    <span
      aria-label={`${medal.name} medal, rank ${rank}`}
      className={`inline-flex shrink-0 items-center justify-center ${medal.text}`}
    >
      <svg
        viewBox="0 0 48 60"
        role="img"
        aria-hidden="true"
        className={large ? "h-16 w-14" : "h-11 w-9"}
      >
        <path
          d="M9 1h12l6 20-11 9zM27 1h12l-7 29-11-9z"
          fill="currentColor"
          opacity=".45"
        />
        <circle cx="24" cy="35" r="20" fill="currentColor" opacity=".18" />
        <circle
          cx="24"
          cy="35"
          r="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="m24 21 4 8 9 1-6 6 1 9-8-4-8 4 1-9-6-6 9-1z"
          fill="currentColor"
          opacity=".2"
        />
        <text
          x="24"
          y="41"
          textAnchor="middle"
          fill="currentColor"
          fontSize="18"
          fontWeight="800"
        >
          {rank}
        </text>
      </svg>
    </span>
  );
}
export function RankingPodium({
  rows,
  query,
}: {
  rows: RankingRow[];
  query: RankingQuery;
}) {
  const winners = rows.filter((row) => row.rank >= 1 && row.rank <= 3);
  if (!winners.length) return null;
  const value = (row: RankingRow) =>
    query.sort === "Tribe Score"
      ? num(row.score)
      : query.sort === "Time Played"
        ? hours(row.playTime)
        : query.sort === "Deaths"
          ? num(row.deaths)
          : query.sort === "Tamed Dino Kills"
            ? num(row.dinoKills)
            : num(row.kills);
  return (
    <section aria-label="Top three" className="mt-6 grid gap-4 sm:grid-cols-3">
      {winners.map((row) => {
        const medal = medals[row.rank - 1];
        const name = fixText(row.name);
        const content = (
          <>
            <div className="flex items-center justify-between gap-3">
              <RankingMedal rank={row.rank} large />
              <span
                className={`font-mono text-sm font-semibold uppercase tracking-wider ${medal.text}`}
              >
                {medal.name} · #{row.rank}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              {query.mode === "players" && (
                <SteamAvatar
                  avatar={row.avatar}
                  name={name}
                  className="h-16 w-16"
                />
              )}
              <h3 className="min-w-0 break-words font-display text-3xl font-black group-hover:text-accent">
                {name}
              </h3>
            </div>
            <p
              className={`mt-5 font-display text-4xl font-black ${medal.text}`}
            >
              {value(row)}{" "}
              <span className="font-mono text-sm font-medium">
                {query.sort === "Time Played"
                  ? "hours"
                  : query.sort.toLocaleLowerCase()}
              </span>
            </p>
          </>
        );
        const style = `clip-corner group block border p-5 ${medal.frame} ${medal.glow}`;
        return query.mode === "tribes" && row.tribeId === null ? (
          <div key={row.rank} className={style}>
            {content}
          </div>
        ) : (
          <Link
            key={row.rank}
            href={
              query.mode === "players"
                ? playerHref(row.name)
                : tribeHref(query.cluster, row.tribeId!)
            }
            className={style}
          >
            {content}
          </Link>
        );
      })}
    </section>
  );
}
