import { minutes, type QueueTicket, type TicketQueueData } from "@/lib/bot";
import { Section, Table, Tile, Tiles } from "@/components/staff/StatBits";
import { ReviewForm } from "@/components/staff/ReviewForm";

const SECTIONS: { key: keyof TicketQueueData["sections"]; title: string; note: string }[] = [
  { key: "emergency", title: "🚨 Emergency", note: "Flagged urgent by the bot. Answer first." },
  { key: "rank", title: "👑 Rank holders", note: "GOD → Viking → The One Above All → Vanish → Mastercraft." },
  { key: "staff", title: "Waiting for an admin", note: "Oldest first." },
  { key: "player", title: "Waiting on the player", note: "An admin replied last, or the player hasn't written yet." },
  { key: "empty", title: "Empty", note: "Nothing written for 30+ min. New ones are warned at 12 h and closed 12 h later." },
  { key: "hold", title: "On hold (dnt)", note: "Marked do-not-touch by staff." },
];

const TIER_LABEL = { emergency: "Emergency", rank: "Rank holders", normal: "Everyone else" } as const;
const TIER_TARGET = { emergency: 5, rank: 10, normal: 20 } as const;

function waited(t: QueueTicket, now: number) {
  const since = t.waiting_since ?? t.opened;
  return minutes((now - since) / 60);
}

/** Everything on /staff/tickets. Discord links open the ticket in the app or browser. */
export function TicketQueueView({ d }: { d: TicketQueueData }) {
  const now = d.generated;
  const count = (k: keyof TicketQueueData["sections"]) => d.sections[k]?.length ?? 0;
  if (!d.ready) return <p className="text-sm text-text-muted">The bot hasn&apos;t started tracking tickets yet.</p>;
  return (
    <>
      <Tiles>
        <Tile label="Emergency" value={count("emergency")} note="Open now" />
        <Tile label="Rank holders" value={count("rank")} note="Open, waiting for an admin" />
        <Tile label="Waiting for an admin" value={count("staff")} note={`${(d.sections.staff ?? []).filter((t) => t.overdue).length} past target`} />
        <Tile label="Waiting on player" value={count("player")} note={`${count("empty")} empty · ${count("hold")} on hold`} />
      </Tiles>

      {SECTIONS.map(({ key, title, note }) => {
        const rows = d.sections[key] ?? [];
        if (!rows.length) return null;
        return (
          <Section key={key} title={`${title} (${rows.length})`} note={note}>
            <Table head={["Ticket", "Player", "Cluster", key === "player" || key === "empty" ? "Opened" : "Waiting", "Claimed by", ""]}>
              {rows.map((t) => (
                <tr key={t.channel_id} className={t.overdue ? "bg-accent/[0.07]" : "bg-bg-card/40"}>
                  <td className="px-4 py-2.5 font-mono text-sm">
                    <a href={`https://discord.com/channels/${t.guild_id}/${t.channel_id}`} target="_blank" rel="noopener noreferrer" className="underline decoration-accent/40 underline-offset-4 hover:text-accent">
                      {t.name}
                    </a>
                    {t.legacy && <p className="mt-1 text-text-muted">Legacy record · historical timestamps may be incomplete</p>}
                    <ReviewForm kind="ticket" id={t.channel_id} state={t.review?.state ?? "unreviewed"} note={t.review?.note ?? ""} />
                  </td>
                  <td className="px-3 py-2.5">
                    {t.player || "–"}
                    {t.rank && <span className="ml-2 text-sm font-semibold uppercase text-accent">👑 {t.rank}</span>}
                  </td>
                  <td className="px-3 py-2.5 text-sm">{t.cluster || "–"}</td>
                  <td className="px-3 py-2.5 font-mono text-sm">{waited(t, now)}</td>
                  <td className="px-3 py-2.5 text-sm">{t.claimed_by ?? <span className="text-text-muted">nobody</span>}</td>
                  <td className="px-3 py-2.5 text-right text-sm uppercase tracking-wider">
                    {t.overdue && <span className="text-accent">⏰ past target</span>}
                    {t.pinged > 0 && <span className="ml-2 text-text-muted">pinged {t.pinged}/3</span>}
                    {t.escalated && <span className="ml-2 text-text-muted">escalated</span>}
                  </td>
                </tr>
              ))}
            </Table>
          </Section>
        );
      })}
      <Section title="Human response and ticket closure" note="Tickets opened in the last 30 days, separated by collection history. Bot replies are excluded.">
        <p className="mb-3 text-sm text-text-muted">Closure time runs from opening to recorded close for tickets with player activity. It does not establish that the issue was resolved. Review labels do not change queue state, priority, claims or hold rules.</p>
        <Table head={["Cohort", "Tickets", "Human reply median / p90", "Closure median / p90", "Coverage"]}>{Object.entries(d.cohorts ?? {}).map(([name, c]) => <tr key={name}><td className="p-3">{name}</td><td className="p-3">{c.tickets}</td><td className="p-3">{minutes(c.response_p50)} / {minutes(c.response_p90)}</td><td className="p-3">{minutes(c.resolution_p50)} / {minutes(c.resolution_p90)}</td><td className="p-3">{c.response_samples} reply samples · {c.resolution_samples} closure samples · {c.invalid_response_intervals} invalid reply intervals excluded</td></tr>)}</Table>
      </Section>

      {Object.keys(d.tiers).length > 0 && (
        <Section title="First reply by priority" note="Last 30 days, from when the player first wrote. Tracked since the queue went live.">
          <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
            {(Object.keys(TIER_LABEL) as (keyof typeof TIER_LABEL)[]).map((k) => {
              const t = d.tiers[k];
              return (
                <div key={k} className="bg-bg-card p-4">
                  <p className="hud-label !text-sm">
                    {TIER_LABEL[k]} · target {TIER_TARGET[k]} min
                  </p>
                  <p className="font-display mt-2 text-3xl font-black tabular-nums">{t ? minutes(t.p50_mins) : "–"}</p>
                  <p className="mt-1 text-sm text-text-muted">{t ? `typical · 1 in 10 over ${minutes(t.p90_mins)} · ${t.tickets} tickets` : "No tickets yet"}</p>
                </div>
              );
            })}
          </div>
        </Section>
      )}
    </>
  );
}
