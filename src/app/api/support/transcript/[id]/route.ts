import { currentUser } from "@/lib/auth";
import { readSupport } from "@/lib/supportStore";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await currentUser();
  if (!user) return new Response("Not found", { status: 404 });
  const d = await readSupport(user, (await params).id);
  if (!d) return new Response("Not found", { status: 404 });
  const text = [
    `MESA Support #${d.ticket.number}`,
    `${d.ticket.subject} · ${d.ticket.cluster} · ${d.ticket.status}`,
    ...Object.entries(d.ticket.details).map(([k, v]) => `${k}: ${v}`),
    "",
    ...d.messages.filter((m) => !m.private).map(
      (m) =>
        `[${new Date(m.created_at).toISOString()}] ${m.author}${m.private ? " (internal note)" : ""}\n${m.body}\n`,
    ),
    "Attachments:",
    ...d.uploads.map(
      (f) => `${f.name} (${f.bytes} bytes) · /api/support/files/${f.id}`,
    ),
  ].join("\n");
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="mesa-ticket-${d.ticket.number}.txt"`,
      "Cache-Control": "private, no-store",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
