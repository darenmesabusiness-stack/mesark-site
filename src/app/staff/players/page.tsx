import { currentUser } from "@/lib/auth";
import { botGet, type PlayerRecord } from "@/lib/bot";
import { isStaff } from "@/lib/staff";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";
import { BridgeError } from "@/components/staff/StatBits";
import { PlayerView } from "@/components/staff/PlayerView";

export const metadata = { title: "Player lookup" };

export default async function PlayerLookup({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const user = await currentUser();
  if (!isStaff(user)) return <StaffGate user={user} />;
  const q = ((await searchParams).q ?? "").trim().slice(0, 64);
  const res = q.length >= 2 ? await botGet<{ query: string; players: PlayerRecord[] }>(`/v1/player?q=${encodeURIComponent(q)}`, user) : null;

  return (
    <StaffShell user={user} active="/staff/players" title="Player lookup" kicker="Players">
      <p className="max-w-2xl text-text-muted">
        Search an exact in-game name, Steam name or SteamID. Shows bans on every cluster, the names and tribes they&apos;ve played as, and accounts on the same PC or
        connection. Staff only: don&apos;t share alts, evidence or who handled a ban with players.
      </p>
      <form action="/staff/players" className="mt-6 flex max-w-xl gap-2">
        <label htmlFor="q" className="sr-only">
          Player name or SteamID
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          required
          minLength={2}
          maxLength={64}
          placeholder="Name or 7656119…"
          className="min-w-0 flex-1 border border-border bg-bg-card px-4 py-2.5 font-mono text-sm outline-none focus:border-accent"
        />
        <button type="submit" className="clip-corner-sm bg-accent px-5 font-display text-xl font-extrabold uppercase tracking-wide text-bg-primary transition hover:bg-[#ff8c45]">
          Search
        </button>
      </form>

      <div className="mt-8">
        {res && !res.ok && <BridgeError error={res.error} />}
        {res?.ok && res.data.players.length === 0 && (
          <p className="text-text-muted">
            Nobody found for &ldquo;{q}&rdquo;. Names must match exactly (capitals don&apos;t matter). Try their Steam name or SteamID.
          </p>
        )}
        {res?.ok && res.data.players.length > 1 && <p className="mb-6 text-sm text-text-muted">{res.data.players.length} accounts match. Most-seen first.</p>}
        {res?.ok && res.data.players.map((p) => <PlayerView key={p.steam_id} p={p} />)}
      </div>
    </StaffShell>
  );
}
