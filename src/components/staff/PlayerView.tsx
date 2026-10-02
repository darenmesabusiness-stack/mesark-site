import Link from "next/link";
import { dateTime, day, seconds, type PlayerRecord } from "@/lib/bot";
import { Section, Table } from "@/components/staff/StatBits";

function look(id: string) {
  return `/staff/players?q=${id}`;
}

function BanState({ b }: { b: PlayerRecord["bans"][number] }) {
  if (b.banned === true) {
    const left = b.duration === 0 ? "permanent" : b.remaining == null ? "length unknown" : `${seconds(b.remaining)} left`;
    return <span className="text-accent">Banned · {left}</span>;
  }
  if (b.banned === null) return <span className="text-text-muted">Ban on record, no length logged</span>;
  return <span className="text-teal">Not banned{b.expired ? " (expired)" : " (lifted)"}</span>;
}

/** One player's full record on /staff/players. */
export function PlayerView({ p }: { p: PlayerRecord }) {
  const latest = p.names.find((n) => n.name)?.name ?? p.names.find((n) => n.steam_name)?.steam_name;
  const activeBan = p.bans.some((b) => b.banned);
  return (
    <article className="mb-14 border-t border-border pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="hud-label !text-[10px]">Player</p>
          <h2 className="font-display mt-1 text-4xl font-black sm:text-5xl">{latest ?? p.steam_id}</h2>
          <p className="mt-1 font-mono text-xs text-text-muted">
            {p.steam_id} ·{" "}
            <a href={`https://steamcommunity.com/profiles/${p.steam_id}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-accent">
              Steam profile ↗
            </a>
          </p>
        </div>
        <div className="text-right text-sm">
          <p className={activeBan ? "font-semibold text-accent" : "text-teal"}>{activeBan ? "Banned somewhere right now" : "No active ban"}</p>
          <p className="text-xs text-text-muted">
            {p.ban_count} ban{p.ban_count === 1 ? "" : "s"} on record{p.reason_type ? ` · last reason: ${p.reason_type}` : ""}
            {p.evasions ? ` · ${p.evasions} evasion${p.evasions === 1 ? "" : "s"}` : ""}
          </p>
          {p.unban_price && <p className="mt-1 text-xs text-text-muted">Unban: {p.unban_price}</p>}
        </div>
      </div>

      {p.bans.length > 0 && (
        <Section title="Bans by cluster">
          <Table head={["Cluster", "Status", "Since"]} minWidth={480}>
            {p.bans.map((b) => (
              <tr key={b.cluster} className="bg-bg-card/40">
                <td className="px-4 py-2.5 font-semibold">{b.cluster}</td>
                <td className="px-3 py-2.5 text-sm">
                  <BanState b={b} />
                </td>
                <td className="px-3 py-2.5 text-xs text-text-muted">{day(b.since)}</td>
              </tr>
            ))}
          </Table>
        </Section>
      )}

      <Section title="Seen as" note="Latest first, from the server logs">
        {p.names.length === 0 ? (
          <p className="text-sm text-text-muted">No sightings in the server logs.</p>
        ) : (
          <Table head={["In-game name", "Steam name", "Tribe", "Cluster · map", "Last seen"]}>
            {p.names.map((n, i) => (
              <tr key={i} className="bg-bg-card/40">
                <td className="px-4 py-2.5 font-semibold">{n.name || "–"}</td>
                <td className="px-3 py-2.5 text-text-muted">{n.steam_name || "–"}</td>
                <td className="px-3 py-2.5">{n.tribe || "–"}</td>
                <td className="px-3 py-2.5 text-xs">
                  {n.cluster || "?"}
                  {n.server ? ` · ${n.server}` : ""}
                </td>
                <td className="px-3 py-2.5 text-xs text-text-muted">{dateTime(n.last_seen)}</td>
              </tr>
            ))}
          </Table>
        )}
      </Section>

      {(p.same_hwid.length > 0 || p.same_ip.length > 0) && (
        <Section title="Possible alts" note="Other SteamIDs seen on the same PC (HWID) or the same connection (IP). Same IP can just mean a shared house.">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Same PC", p.same_hwid],
              ["Same IP", p.same_ip],
            ].map(([label, ids]) => (
              <div key={label as string} className="border border-border bg-bg-card/60 p-4">
                <p className="hud-label !text-[10px]">{label as string}</p>
                {(ids as string[]).length === 0 ? (
                  <p className="mt-2 text-sm text-text-muted">None</p>
                ) : (
                  <ul className="mt-2 space-y-1 font-mono text-xs">
                    {(ids as string[]).map((id) => (
                      <li key={id}>
                        <Link href={look(id)} className="underline underline-offset-4 hover:text-accent">
                          {id}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {p.proofs.length > 0 && (
        <Section title="Ban proof posts">
          <Table head={["Date", "Channel", "Reason", "Clips"]}>
            {p.proofs.map((b, i) => (
              <tr key={i} className="bg-bg-card/40">
                <td className="px-4 py-2.5 text-xs text-text-muted">{day(b.time)}</td>
                <td className="px-3 py-2.5 text-xs">#{b.channel}</td>
                <td className="px-3 py-2.5">
                  {b.reason || "(no text)"}
                  {b.type && b.type !== "Other" && <span className="ml-2 text-[10px] uppercase text-text-muted">{b.type}</span>}
                </td>
                <td className="px-3 py-2.5 text-xs">
                  {b.links.length === 0
                    ? "–"
                    : b.links.map((l, j) => (
                        <a key={j} href={l} target="_blank" rel="noopener noreferrer" className="mr-2 underline underline-offset-4 hover:text-accent">
                          clip {j + 1} ↗
                        </a>
                      ))}
                </td>
              </tr>
            ))}
          </Table>
        </Section>
      )}

      {p.violations_30d.length > 0 && (
        <Section title="Anti-cheat flags" note="Last 30 days">
          <ul className="flex flex-wrap gap-2">
            {p.violations_30d.map((v) => (
              <li key={v.type} className="border border-border bg-bg-card/60 px-3 py-1.5 text-sm">
                {v.type} <span className="font-mono text-accent">×{v.count}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {p.admin_actions.length > 0 && (
        <Section title="Admin actions mentioning them">
          <Table head={["When", "Admin", "Action", "Cluster", "Detail"]} minWidth={720}>
            {p.admin_actions.map((a, i) => (
              <tr key={i} className="bg-bg-card/40">
                <td className="px-4 py-2.5 text-xs text-text-muted">{dateTime(a.time)}</td>
                <td className="px-3 py-2.5">{a.admin}</td>
                <td className="px-3 py-2.5 text-xs">{a.action}</td>
                <td className="px-3 py-2.5 text-xs">{a.cluster}</td>
                <td className="max-w-md px-3 py-2.5 text-xs text-text-muted [overflow-wrap:anywhere]">{a.detail}</td>
              </tr>
            ))}
          </Table>
        </Section>
      )}
    </article>
  );
}
