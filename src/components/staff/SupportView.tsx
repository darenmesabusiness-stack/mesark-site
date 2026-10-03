import { dateTime, minutes, type SupportData } from "@/lib/bot";
import { BarChart, Heatmap, Section, Table, Tile, Tiles } from "@/components/staff/StatBits";

/** Everything on /staff/support below the period picker. */
export function SupportView({ d }: { d: SupportData }) {
  const t = d.totals;
  const fr = d.first_reply;
  const opened = fr.answered + fr.unanswered;
  return (
    <>
      <Tiles>
        <Tile label="Tickets" value={t.tickets.toLocaleString()} note={`${t.players.toLocaleString()} players · ${t.closed.toLocaleString()} closed`} />
        <Tile label="First staff reply" value={minutes(fr.p50)} note={`Typical (median). 1 in 10 waits over ${minutes(fr.p90)}.`} />
        <Tile
          label="No staff reply"
          value={fr.unanswered.toLocaleString()}
          note={`${Math.round((fr.unanswered / Math.max(opened, 1)) * 100)}% of tickets. Some were solved by the AI.`}
        />
        <Tile label="AI answered" value={`${t.bot_rate}%`} note={`${t.bot_replies.toLocaleString()} answers · ${t.needs_human.toLocaleString()} handed to staff`} />
        <Tile label="Claimed" value={t.claimed.toLocaleString()} note="Tickets an admin claimed" />
        <Tile label="Escalated" value={t.escalated.toLocaleString()} note="Sent up to a lead or the owner" />
        <Tile label="Staff replies" value={t.staff_replies.toLocaleString()} />
        <Tile label="Open now" value={d.open.length} note="Opened in the last 3 days" />
      </Tiles>

      <Section title="Tickets per day" note={`Last ${d.days} days, UTC dates`}>
        <BarChart label="New tickets per day" data={d.daily.map((x) => ({ x: x.date.slice(5), y: x.created }))} />
      </Section>

      <Section title="Busiest hours">
        <Heatmap grid={d.heatmap} />
      </Section>

      <Section
        title="Open tickets"
        note={`Not closed yet, opened in the last 3 days. Unanswered first.${d.open_empty_hidden ? ` ${d.open_empty_hidden} empty tickets (nobody wrote anything in 12 h) are left out.` : ""}`}
      >
        {d.open.length === 0 ? (
          <p className="text-sm text-text-muted">Nothing open.</p>
        ) : (
          <Table head={["Ticket", "Player", "Opened", "Waiting", "Last message", "First admin"]}>
            {d.open.map((o) => (
              <tr key={o.channel} className={o.staff ? "bg-bg-card/40" : "bg-accent/[0.06]"}>
                <td className="px-4 py-2.5 font-mono text-sm">
                  {o.channel}
                  {o.escalated && <span className="ml-2 border border-accent px-1.5 py-px text-sm uppercase text-accent">Escalated</span>}
                </td>
                <td className="px-3 py-2.5">{o.player || "–"}</td>
                <td className="px-3 py-2.5 text-sm text-text-muted">{dateTime(o.opened)}</td>
                <td className="px-3 py-2.5 font-mono text-sm">{minutes(o.wait_mins)}</td>
                <td className="px-3 py-2.5 font-mono text-sm text-text-muted">{minutes(o.idle_mins)} ago</td>
                <td className="px-3 py-2.5 text-sm">{o.staff ?? <span className="text-accent">No reply yet</span>}</td>
              </tr>
            ))}
          </Table>
        )}
      </Section>

      <Section title="Admin effort" note={d.effort ? `${d.effort.month}, same scoring as /points. Admins with no effort yet are left out.` : undefined}>
        {!d.effort ? (
          <p className="text-sm text-text-muted">The effort table couldn&apos;t be loaded this time.</p>
        ) : (
          <Table head={["Admin", "Closed", "Claimed, still open", "Escalated", "Replies", "Rating", "Effort"]}>
            {d.effort.staff.map((s) => (
              <tr key={s.name} className="bg-bg-card/40">
                <td className="px-4 py-2.5 font-semibold">
                  {s.name}
                </td>
                <td className="px-3 py-2.5 tabular-nums">{s.resolved}</td>
                <td className="px-3 py-2.5 tabular-nums">{s.claimed_open}</td>
                <td className="px-3 py-2.5 tabular-nums">{s.escalated}</td>
                <td className="px-3 py-2.5 tabular-nums">{s.replies}</td>
                <td className="px-3 py-2.5 tabular-nums text-sm">{s.rating ? `${s.rating.toFixed(1)} ★ (${s.ratings})` : "–"}</td>
                <td className="px-3 py-2.5 font-mono font-semibold tabular-nums text-accent">{s.effort.toFixed(1)}</td>
              </tr>
            ))}
          </Table>
        )}
      </Section>
    </>
  );
}
