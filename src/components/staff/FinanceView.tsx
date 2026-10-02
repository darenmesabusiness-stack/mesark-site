import { dateTime, usd, type FinanceData } from "@/lib/bot";
import { BarChart, Section, Table, Tile, Tiles } from "@/components/staff/StatBits";

/** Everything on /staff/finance below the period picker. */
export function FinanceView({ d }: { d: FinanceData }) {
  const ch = d.period.change_pct;
  return (
    <>
      <Tiles>
        <Tile
          label={`Last ${d.days} days`}
          value={usd(d.period.revenue)}
          note={
            ch == null ? (
              `${d.period.payments} payments`
            ) : (
              <>
                {d.period.payments} payments · <span className={ch >= 0 ? "text-teal" : "text-accent"}>{ch >= 0 ? "+" : ""}{ch}%</span> vs the {d.days} days before
              </>
            )
          }
        />
        <Tile label="Per day" value={usd(d.period.avg_daily)} note={`About ${usd(d.period.avg_daily * 30)} a month at this pace`} />
        <Tile label="This month" value={usd(d.month.revenue)} note={`${d.month.payments} payments`} />
        <Tile label="All time" value={usd(d.all_time.revenue)} note={`${d.all_time.payments.toLocaleString()} payments`} />
      </Tiles>
      <p className="mt-3 text-xs text-text-muted">Latest payment synced: {dateTime(d.last_payment)}</p>

      <Section title="Revenue per day" note="UTC dates">
        <BarChart label="Revenue per day" format={usd} data={d.daily.map((x) => ({ x: x.date.slice(5), y: x.revenue }))} />
      </Section>

      <Section title="Revenue per month" note="Last 24 months">
        <BarChart label="Revenue per month" format={usd} data={d.monthly.map((x) => ({ x: x.month, y: x.revenue }))} />
      </Section>

      <div className="grid gap-x-8 lg:grid-cols-2">
        <Section title="Top products">
          <Table head={["Product", "Sold", "Revenue"]} minWidth={360}>
            {d.products.map((p) => (
              <tr key={p.name} className="bg-bg-card/40">
                <td className="px-4 py-2.5 [overflow-wrap:anywhere]">{p.name}</td>
                <td className="px-3 py-2.5 tabular-nums">{p.count}</td>
                <td className="px-3 py-2.5 font-mono tabular-nums">{usd(p.revenue)}</td>
              </tr>
            ))}
          </Table>
        </Section>
        <Section title="Top spenders">
          <Table head={["Buyer", "Payments", "Spent"]} minWidth={360}>
            {d.spenders.map((p) => (
              <tr key={p.name} className="bg-bg-card/40">
                <td className="px-4 py-2.5 [overflow-wrap:anywhere]">{p.name}</td>
                <td className="px-3 py-2.5 tabular-nums">{p.count}</td>
                <td className="px-3 py-2.5 font-mono tabular-nums">{usd(p.revenue)}</td>
              </tr>
            ))}
          </Table>
        </Section>
      </div>

      <Section title="Admin pay" note="Months finalized with the bot's pay command">
        {d.payouts.length === 0 ? (
          <p className="text-sm text-text-muted">No months finalized yet. Admin effort for this month is on the Support page.</p>
        ) : (
          <Table head={["Month", "Admin", "Paid", "Effort", "Share"]} minWidth={480}>
            {d.payouts.map((p, i) => (
              <tr key={i} className="bg-bg-card/40">
                <td className="px-4 py-2.5 font-mono text-xs">{p.month}</td>
                <td className="px-3 py-2.5">{p.name}</td>
                <td className="px-3 py-2.5 font-mono tabular-nums">{usd(p.amount)}</td>
                <td className="px-3 py-2.5 tabular-nums">{p.effort ?? "–"}</td>
                <td className="px-3 py-2.5 tabular-nums">{p.share != null ? `${p.share.toFixed(1)}%` : "–"}</td>
              </tr>
            ))}
          </Table>
        )}
      </Section>
    </>
  );
}
