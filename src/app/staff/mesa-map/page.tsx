import { currentUser } from "@/lib/auth";
import { isLead } from "@/lib/staff";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";
import { CLUSTERS } from "@/lib/leaderboard";
import { mapCluster } from "@/lib/mesaMap";
import { currentMapState, mapWindow } from "@/lib/mesaMapStore";
import { query } from "@/lib/db";
import { caveMaps } from "@/data/caves";
import { editMesaMap } from "./actions";
import Link from "next/link";

export default async function MesaMapEditor({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const user = await currentUser();
  if (!isLead(user)) return <StaffGate user={user} />;
  const sp = await searchParams, cluster = mapCluster(sp.cluster), window = await mapWindow(cluster.key);
  const state = currentMapState(window);
  const locations = window ? await query<{ tribe_id: number; map: string; lat: number; lon: number }>("select tribe_id, map, lat, lon from mesa_map_locations where cluster = $1 and wiped_at = $2::timestamptz and exists(select 1 from users where steam_id=$3 and role in ('owner','lead')) order by tribe_id", [cluster.key, window.wiped_at, user.steam_id]) : [];
  const input = "mt-1 w-full border border-border bg-bg-primary px-3 py-2 text-text-primary";
  return <StaffShell user={user} active="/staff/mesa-map" title="Mesa Map" kicker="Wipes & verified tribe homes">
    <nav className="flex flex-wrap gap-2">{CLUSTERS.map(c => <Link key={c.key} href={`/staff/mesa-map?cluster=${c.key}`} className={`border px-4 py-2 ${c.key === cluster.key ? "border-accent text-accent" : "border-border"}`}>{c.name}</Link>)}</nav>
    {sp.error && <p role="alert" className="mt-4 text-accent">{sp.error}</p>}{sp.saved && <p role="status" className="mt-4 text-teal">Saved.</p>}
    <p className="mt-5 text-text-muted">Confirm the actual completed wipe. All tribes stay hidden for 24 hours, then the map closes at the next wipe time. A new wipe gets a new location set; old tribe IDs and homes are never carried forward.</p>
    <form action={editMesaMap} className="mt-5 space-y-4 border border-border p-5"><input type="hidden" name="action" value="wipe" /><input type="hidden" name="cluster" value={cluster.key} />
      <h2 className="font-display text-2xl font-bold">{cluster.name} wipe window</h2>
      <div className="grid gap-4 sm:grid-cols-2"><label>Actual wipe completed (UTC)<input className={input} type="datetime-local" name="wiped" required defaultValue={window ? new Date(window.wiped_at).toISOString().slice(0,16) : ""} /></label><label>Next wipe / close map (UTC)<input className={input} type="datetime-local" name="expiry" required defaultValue={window ? new Date(window.expires_at).toISOString().slice(0,16) : ""} /></label></div>
      <button className="border border-accent px-4 py-2 text-accent">Confirm wipe window</button><p className="text-sm text-text-muted">{state.open ? "Map is open." : state.unlock ? `Opens ${state.unlock}` : "Map is closed."}</p>
    </form>
    {window && <form action={editMesaMap} className="mt-6 space-y-4 border border-border p-5"><input type="hidden" name="action" value="location" /><input type="hidden" name="cluster" value={cluster.key} /><input type="hidden" name="wiped" value={window.wiped_at} />
      <h2 className="font-display text-2xl font-bold">Verify an approximate tribe home</h2><p className="text-sm text-text-muted">Use base observations or a verified tribe report. A player&apos;s current position does not establish their home. The verification source stays staff-only.</p>
      <div className="grid gap-4 sm:grid-cols-2"><label>Tribe ID (from tribe profile URL)<input className={input} type="number" name="tribe" min="1" required /></label><label>Home map<select className={input} name="map" required>{caveMaps.map(m => <option key={m.slug}>{m.name}</option>)}</select></label><label>Approximate latitude<input className={input} type="number" name="lat" min="0" max="100" step="0.1" required /></label><label>Approximate longitude<input className={input} type="number" name="lon" min="0" max="100" step="0.1" required /></label><label>Observed (UTC)<input className={input} type="datetime-local" name="observed" required /></label><label>Private verification source<input className={input} name="source" maxLength={1000} required /></label></div><button className="border border-accent px-4 py-2 text-accent">Save verified home</button>
    </form>}
    <ul className="mt-6 space-y-3">{locations.map(l => <li key={l.tribe_id} className="flex flex-wrap items-center justify-between gap-3 border border-border p-4"><span>Tribe {l.tribe_id} · {l.map} · {l.lat}, {l.lon}</span><form action={editMesaMap}><input type="hidden" name="action" value="remove" /><input type="hidden" name="cluster" value={cluster.key} /><input type="hidden" name="wiped" value={window!.wiped_at} /><input type="hidden" name="tribe" value={l.tribe_id} /><button className="text-accent underline">Remove location</button></form></li>)}</ul>
  </StaffShell>;
}
