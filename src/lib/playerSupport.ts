export type PlayerTicket = { id: string; name: string; cluster: string; type: string; status: string; opened: number; closed: number | null };
export type TicketMessage = { id: string; author: string; body: string; at: number; attachments: { name: string; url: string }[] };
export type TicketConversation = { ticket: PlayerTicket; messages: TicketMessage[]; archived: boolean };
export const TICKET_TYPES = [ ["general", "General support"], ["question", "Question"], ["ban", "Ban appeal"], ["cheater", "Report a player"], ["store", "Store issue"], ["report_staff", "Report staff"] ] as const;
export const TICKET_CLUSTERS = [ ["Solo", "Solo"], ["Duo", "Duo"], ["3/6 Man", "3 Man"], ["4 Man", "4 Man"], ["100x", "100x"] ] as const;

export function supportInput(form: FormData, reply = false) {
  const request_id = String(form.get("request_id") ?? "");
  const body = String(form.get("body") ?? "").trim();
  if (!/^[a-f0-9-]{36}$/.test(request_id) || !body || body.length > 1800) return null;
  if (reply) {
    const channel = String(form.get("channel") ?? "");
    return /^\d{1,20}$/.test(channel) ? { request_id, body, channel } : null;
  }
  const type = String(form.get("type") ?? "");
  const cluster = String(form.get("cluster") ?? "");
  const map = String(form.get("map") ?? "").trim();
  if (!TICKET_TYPES.some(([key]) => key === type) || !TICKET_CLUSTERS.some(([key]) => key === cluster) || map.length > 60) return null;
  return { request_id, body, type, cluster, map };
}
