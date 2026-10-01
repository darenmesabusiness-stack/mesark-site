import { currentUser } from "@/lib/auth";
import { ROLES, ROLE_HELP, ROLE_LABEL, isOwner, listAccounts } from "@/lib/staff";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";

const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default async function TeamPage({ searchParams }: { searchParams: Promise<{ q?: string; error?: string; saved?: string }> }) {
  const user = await currentUser();
  const sp = await searchParams;
  if (!isOwner(user)) return <StaffGate user={user} error={user ? "The Team page is for owners." : undefined} />;

  const q = (sp.q ?? "").trim().toLowerCase();
  const all = await listAccounts();
  const rows = q ? all.filter((r) => (r.persona ?? "").toLowerCase().includes(q) || r.steam_id.includes(q)) : all;
  const staff = all.filter((r) => r.role !== "player").length;

  return (
    <StaffShell user={user} active="/staff/team" title="Team" kicker={`${staff} on the team · ${all.length} accounts`}>
      <p className="max-w-2xl text-text-muted">
        Anyone who signs in on mesark.net shows up here. Admins work tickets; owners can change everything. Steam IDs on
        this page are for staff only.
      </p>
      {sp.error && <p className="mt-6 border-l-2 border-accent bg-bg-card/80 px-4 py-3 text-sm">{sp.error}</p>}
      {sp.saved && <p className="mt-6 border-l-2 border-teal bg-bg-card/80 px-4 py-3 text-sm">Role saved.</p>}

      <form action="/staff/team" method="get" className="mt-6 flex max-w-md gap-2" role="search">
        <label htmlFor="team-q" className="sr-only">Search accounts</label>
        <input
          id="team-q"
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Steam name or ID"
          className="w-full border border-border bg-bg-card/60 px-3 py-2 text-sm placeholder:text-text-muted/60 focus:border-accent/50 focus:outline-none"
        />
        <button type="submit" className="border border-border px-4 font-display text-base font-extrabold uppercase tracking-wide transition hover:border-accent hover:text-accent">
          Find
        </button>
      </form>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-bg-secondary">
            <tr className="hud-label !text-[10px]">
              <th className="px-4 py-3 font-normal">Account</th>
              <th className="px-3 py-3 font-normal">Steam ID</th>
              <th className="px-3 py-3 font-normal">Joined</th>
              <th className="px-3 py-3 font-normal">Last sign-in</th>
              <th className="px-4 py-3 font-normal">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {rows.map((r) => (
              <tr key={r.steam_id} className="bg-bg-card/40">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-3">
                    {r.avatar && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.avatar} alt="" width={28} height={28} className="h-7 w-7 border border-border" />
                    )}
                    <span className="font-semibold">{r.persona ?? "Unknown"}</span>
                    {r.steam_id === user.steam_id && <span className="font-mono text-[10px] uppercase text-text-muted">you</span>}
                  </span>
                </td>
                <td className="px-3 py-3 font-mono text-xs text-text-muted">{r.steam_id}</td>
                <td className="px-3 py-3 font-mono text-xs">{fmt(r.created_at)}</td>
                <td className="px-3 py-3 font-mono text-xs">{fmt(r.last_login)}</td>
                <td className="px-4 py-3">
                  <form action="/api/staff/role" method="post" className="flex items-center gap-2">
                    <input type="hidden" name="steam_id" value={r.steam_id} />
                    <label htmlFor={`role-${r.steam_id}`} className="sr-only">Role for {r.persona ?? r.steam_id}</label>
                    <select
                      id={`role-${r.steam_id}`}
                      name="role"
                      defaultValue={r.role}
                      className="border border-border bg-bg-primary px-2 py-1 text-sm focus:border-accent/50 focus:outline-none"
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABEL[role]} · {ROLE_HELP[role]}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="border border-border px-2 py-1 font-mono text-[11px] uppercase tracking-wider transition hover:border-accent hover:text-accent">
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-sm text-text-muted">
                  No account matches. They need to sign in on mesark.net once before you can add them.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </StaffShell>
  );
}
