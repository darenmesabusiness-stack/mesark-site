import { dateTime, usd, type FinanceData } from "@/lib/bot";
import { BarChart, Section, Table, Tile, Tiles } from "@/components/staff/StatBits";
import { ReviewForm } from "@/components/staff/ReviewForm";

/** Everything on /staff/finance below the period picker. */
export function FinanceView({ d }: { d: FinanceData }) {
  const ch = d.period.change_pct;
  const currency = d.currency ?? "USD";
  const money = (n: number) => currency === "UNKNOWN" ? `${n.toFixed(2)} (currency unknown)` : new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
  return (
    <>
      <Tiles>
        <Tile
          label={`Last ${d.days} days`}
          value={money(d.period.revenue)}
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
        <Tile label="Per day" value={money(d.period.avg_daily)} note={`${currency} · last ${d.days} days`} />
        <Tile label="This month" value={money(d.month.revenue)} note={`${d.month.payments} payments`} />
        <Tile label="All time" value={money(d.all_time.revenue)} note={`${d.all_time.payments.toLocaleString()} payments`} />
      </Tiles>
      <p className="mt-3 text-xs text-text-muted">Latest payment date: {dateTime(d.last_payment)} · recent sync succeeded: {dateTime(Number(d.sync?.recent_success) || null)} · history scan completed: {dateTime(Number(d.sync?.history_completed) || null)}</p>
      {(d.sync?.stale || d.sync?.last_error) && <p role="status" className="mt-2 text-accent">{d.sync.last_error ? `Sync failed: ${d.sync.last_error}` : "Recent sync is missing or over two hours old."} Totals may be incomplete.</p>}
      <nav aria-label="Payment currency" className="mt-3 flex flex-wrap gap-4">{Array.from(new Set([currency, ...(d.currencies ?? []).map(c => c.currency)])).map(c => <a key={c} href={`?days=${d.days}&currency=${c}`} aria-current={c === currency ? "page" : undefined} className="underline">{c}</a>)}</nav>
      <p className="mt-2 text-xs text-text-muted">No currency conversion or combined money total is applied.</p>

      <Section title="Revenue per day" note="UTC dates">
        <BarChart label="Revenue per day" format={money} data={d.daily.map((x) => ({ x: x.date.slice(5), y: x.revenue }))} />
      </Section>

      <Section title="Revenue per month" note="Last 24 months">
        <BarChart label="Revenue per month" format={money} data={d.monthly.map((x) => ({ x: x.month, y: x.revenue }))} />
      </Section>

      <div className="grid gap-x-8 lg:grid-cols-2">
        <Section title="Top products">
          <Table head={["Product", "Sold", "Revenue"]} minWidth={360}>
            {d.products.map((p) => (
              <tr key={p.name} className="bg-bg-card/40">
                <td className="px-4 py-2.5 [overflow-wrap:anywhere]">{p.name}</td>
                <td className="px-3 py-2.5 tabular-nums">{p.count}</td>
                <td className="px-3 py-2.5 font-mono tabular-nums">{money(p.revenue)}</td>
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
                <td className="px-3 py-2.5 font-mono tabular-nums">{money(p.revenue)}</td>
              </tr>
            ))}
          </Table>
        </Section>
      </div>

      <Section title="Payment status changes" note="Observed changes from Tip4Serv, not automatic payouts or delivery actions">
        {(d.status_changes ?? []).length === 0 ? <p className="text-sm text-text-muted">No observed changes yet.</p> : <Table head={["Payment", "Previous", "Current", "Observed"]}>{d.status_changes!.map((c, i) => <tr key={i}><td className="p-3">{c.payment_id}</td><td className="p-3">{c.previous}</td><td className="p-3">{c.current}</td><td className="p-3">{dateTime(c.observed_at)}</td></tr>)}</Table>}
      </Section>
      <Section title="Delivery review" note={`Page ${d.review_page ?? 1} · ${d.delivery_count ?? 0} payments in this period · all currencies`}>
        <p className="mb-3 text-sm text-text-muted">Processed does not confirm delivery. Reviews record evidence only; saving never sends commands, rewards or refunds.</p>
        {d.review_ready === false && <p className="text-accent">Review storage is not ready.</p>}
        <Table head={["Payment", "Status", "Amount", "Product / private review"]}>{(d.delivery ?? []).map(p => <tr key={p.payment_id} className="bg-bg-card/40"><td className="p-3">{p.payment_id}<br /><span className="text-xs">{dateTime(p.date)}</span></td><td className="p-3">{p.status}<br /><span className="text-xs text-text-muted">Observed {dateTime(p.observed_at)}</span></td><td className="p-3">{p.amount.toFixed(2)} {p.currency}</td><td className="p-3">{p.cart}<ReviewForm kind="delivery" id={p.payment_id} state={p.delivery_state} note={p.note} /></td></tr>)}</Table>
        <nav aria-label="Delivery review pages" className="mt-3 flex gap-4">{(d.review_page ?? 1) > 1 && <a className="underline" href={`?days=${d.days}&currency=${currency}&review_page=${d.review_page! - 1}`}>Previous</a>}{(d.review_page ?? 1) * 100 < (d.delivery_count ?? 0) && <a className="underline" href={`?days=${d.days}&currency=${currency}&review_page=${(d.review_page ?? 1) + 1}`}>Next</a>}</nav>
      </Section>
      <Section title="Finalized admin allocations" note="USD amounts recorded by the bot's pay command; not settlement receipts">
        {d.payouts.length === 0 ? (
          <p className="text-sm text-text-muted">No months finalized yet. Admin effort for this month is on the Support page.</p>
        ) : (
          <Table head={["Month", "Admin", "Allocation", "Effort", "Share"]} minWidth={480}>
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
