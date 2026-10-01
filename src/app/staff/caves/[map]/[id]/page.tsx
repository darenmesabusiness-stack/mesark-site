import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { caveMaps } from "@/data/caves";
import { editableCave, loadCaveMaps } from "@/lib/caveStore";
import { isLead } from "@/lib/staff";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";
import { CaveEditor } from "@/components/staff/CaveEditor";
import { saveCaveAction } from "../../actions";

export default async function EditCave({ params }: { params: Promise<{ map: string; id: string }> }) {
  const user = await currentUser();
  if (!isLead(user)) return <StaffGate user={user} error={user ? "The cave editor is for lead admins and the owner." : undefined} />;
  const { map: mapSlug, id } = await params;
  const map = caveMaps.find((m) => m.slug === mapSlug);
  if (!map) notFound();

  const isNew = id === "new";
  const found = isNew ? null : await editableCave(map.slug, id);
  if (!isNew && !found) notFound();
  const current = (await loadCaveMaps()).find((m) => m.slug === map.slug);
  const others = (current?.caves ?? []).filter((c) => c.id !== id).map((c) => ({ id: c.id, name: c.name, x: c.x, y: c.y }));

  return (
    <StaffShell user={user} active="/staff/caves" title={found ? found.cave.name : "New cave"} kicker={`Cave editor · ${map.name}`}>
      <Link href={`/staff/caves?map=${map.slug}`} className="hud-label mb-8 inline-block !text-text-primary/80 hover:!text-accent">
        ← All {map.name} caves
      </Link>
      <CaveEditor
        action={saveCaveAction}
        map={{ slug: map.slug, name: map.name, image: map.image ? { src: map.image.src, w: map.image.w, h: map.image.h } : null }}
        cave={found?.cave ?? null}
        others={others}
      />
    </StaffShell>
  );
}
