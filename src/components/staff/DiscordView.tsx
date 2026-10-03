import { type MembersData, type MembersServer } from "@/lib/bot";
import { BarChart, Section, Table, Tile, Tiles } from "@/components/staff/StatBits";

const signed = (n: number) => (n > 0 ? `+${n.toLocaleString()}` : n.toLocaleString());
const pct = (n: number | null) => (n == null ? "–" : `${n}%`);

function Server({ s, days }: { s: MembersServer; days: number }) {
  const withCount = s.daily.filter((d) => d.members != null);
  return (
    <div className="mt-10 first:mt-0">
      <h2 className="font-display text-3xl font-black">{s.name}</h2>
      <div className="mt-4">
        <Tiles>
          <Tile label="Members" value={s.members == null ? "–" : s.members.toLocaleString()} note="Latest daily count" />
          <Tile label="Joined" value={s.joins.toLocaleString()} note={`Last ${days} days`} />
          <Tile label="Left" value={s.leaves.toLocaleString()} />
          <Tile label="Net" value={signed(s.net)} note="Joined minus left" />
          <Tile label="Stayed a week" value={pct(s.retention_7d)} note="Of people who joined 7+ days ago, still here after 7 days" />
          <Tile label="Brand-new accounts" value={pct(s.new_account_pct)} note="Joiners whose Discord account was under 30 days old" />
        </Tiles>
      </div>
      <Section title="Joined per day" note="UTC dates">
        <BarChart label={`${s.name}: joins per day`} data={s.daily.map((d) => ({ x: d.day.slice(5), y: d.joins }))} />
      </Section>
      <Section title="Left per day">
        <BarChart label={`${s.name}: leaves per day`} data={s.daily.map((d) => ({ x: d.day.slice(5), y: d.leaves }))} />
      </Section>
      {withCount.length > 1 && (
        <Section title="Member count">
          <BarChart label={`${s.name}: members`} data={withCount.map((d) => ({ x: d.day.slice(5), y: d.members ?? 0 }))} format={(n) => n.toLocaleString()} />
        </Section>
      )}
      <Section title="Top invites" note="Which invite link people joined with. Unknown = vanity link or an invite that expired on use.">
        {s.top_invites.length === 0 ? (
          <p className="text-sm text-text-muted">No joins recorded yet.</p>
        ) : (
          <Table head={["Invite", "Joins"]} minWidth={320}>
            {s.top_invites.map((i) => (
              <tr key={i.code}>
                <td className="px-4 py-2.5 font-mono text-xs">{i.code}</td>
                <td className="px-3 py-2.5 font-mono text-xs">{i.joins.toLocaleString()}</td>
              </tr>
            ))}
          </Table>
        )}
      </Section>
    </div>
  );
}

/** Everything on /staff/discord below the period picker. */
export function DiscordView({ d }: { d: MembersData }) {
  const servers = Object.values(d.servers);
  return (
    <>
      {d.tracking_since && (
        <p className="mb-6 text-sm text-text-muted">
          Tracking since {new Date(d.tracking_since * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}. Earlier days show zero.
        </p>
      )}
      {servers.map((s) => (
        <Server key={s.name} s={s} days={d.days} />
      ))}
    </>
  );
}
