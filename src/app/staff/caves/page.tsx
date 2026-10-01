import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { caveMaps } from "@/data/caves";
import { staffCaves, type CaveStatus } from "@/lib/caveStore";
import { isLead } from "@/lib/staff";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";
import { hideCaveAction, restoreCaveAction, unhideCaveAction } from "./actions";

const PILL: Record<CaveStatus, [string, string]> = {
  original: ["Original", "border-border text-text-muted"],
  edited: ["Edited", "border-teal text-teal"],
  new: ["New", "border-accent text-accent"],
  hidden: ["Hidden", "border-border text-text-muted line-through"],
};

export default async function CavesAdmin({ searchParams }: { searchParams: Promise<{ map?: string; saved?: string }> }) {
  const user = await currentUser();
  if (!isLead(user)) return <StaffGate user={user} error={user ? "The cave editor is for lead admins and the owner." : undefined} />;
  const sp = await searchParams;
  const map = caveMaps.find((m) => m.slug === sp.map) ?? caveMaps[0];
  const caves = await staffCaves(map.slug);

  return (
    <StaffShell user={user} active="/staff/caves" title="Caves" kicker="Cave editor">
      <p className="max-w-2xl text-text-muted">
        Add a cave, move its pin, update notes or swap the clip. Changes show on /maps straight away. Hiding a cave takes it off the map
        without losing it.
      </p>

      <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {caveMaps.map((m) => (
          <Link
            key={m.slug}
            href={`/staff/caves?map=${m.slug}`}
            className={`shrink-0 border px-3 py-1.5 font-display text-base font-extrabold uppercase tracking-wide transition ${
              m.slug === map.slug ? "border-accent bg-accent text-bg-primary" : "border-border bg-bg-card/60 text-text-primary/80 hover:border-accent/50"
            }`}
          >
            {m.name}
          </Link>
        ))}
      </div>

      {sp.saved && <p className="mt-6 border-l-2 border-teal bg-bg-card/80 px-4 py-3 text-sm">Saved. It&apos;s on /maps now.</p>}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-4xl font-black">
          {map.name} <span className="font-mono text-base text-text-muted">{caves.filter((c) => c.status !== "hidden").length} caves</span>
        </h2>
        <div className="flex gap-4">
          <a href={`/maps#${map.slug}`} target="_blank" rel="noopener" className="hud-label !text-text-primary/80 hover:!text-accent">
            View on site ↗
          </a>
          <Link
            href={`/staff/caves/${map.slug}/new`}
            className="clip-corner-sm bg-accent px-5 py-2.5 font-display text-xl font-extrabold uppercase tracking-wide text-bg-primary transition hover:bg-[#ff8c45]"
          >
            Add cave
          </Link>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-bg-secondary">
            <tr className="hud-label !text-[10px]">
              <th className="px-4 py-3 font-normal">Cave</th>
              <th className="px-3 py-3 font-normal">GPS</th>
              <th className="px-3 py-3 font-normal">Clip</th>
              <th className="px-3 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {caves.map((c) => (
              <tr key={c.id} className="bg-bg-card/40">
                <td className="px-4 py-3 font-semibold">{c.name}</td>
                <td className="px-3 py-3 font-mono text-xs">
                  {c.lat}, {c.lon}
                </td>
                <td className="px-3 py-3 text-xs text-text-muted">{c.hasClip ? "Yes" : "None"}</td>
                <td className="px-3 py-3">
                  <span className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${PILL[c.status][1]}`}>{PILL[c.status][0]}</span>
                  {c.editor && <span className="ml-2 text-xs text-text-muted">by {c.editor}</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    {c.status !== "hidden" && (
                      <Link href={`/staff/caves/${map.slug}/${c.id}`} className="hud-label !text-text-primary/80 hover:!text-accent">
                        Edit →
                      </Link>
                    )}
                    {c.status === "hidden" ? (
                      <form action={unhideCaveAction}>
                        <input type="hidden" name="map" value={map.slug} />
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className="text-xs text-text-muted underline underline-offset-4 hover:text-accent">
                          Show again
                        </button>
                      </form>
                    ) : (
                      <form action={hideCaveAction}>
                        <input type="hidden" name="map" value={map.slug} />
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className="text-xs text-text-muted underline underline-offset-4 hover:text-accent">
                          Hide
                        </button>
                      </form>
                    )}
                    {c.status === "edited" && (
                      <form action={restoreCaveAction}>
                        <input type="hidden" name="map" value={map.slug} />
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className="text-xs text-text-muted underline underline-offset-4 hover:text-accent">
                          Undo edits
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StaffShell>
  );
}
