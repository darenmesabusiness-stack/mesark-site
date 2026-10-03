import { createHash } from "node:crypto";
import { ownershipQuery, query } from "@/lib/db";
import type { User } from "@/lib/auth";
import { SUPPORT_TYPES, supportLabel } from "@/lib/supportTypes";
export { SUPPORT_TYPES, supportLabel } from "@/lib/supportTypes";

export const uuid = (s: string) =>
  /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(
    s,
  );
export const nativeId = (s: string) => s.startsWith("w_") && uuid(s.slice(2));
const fingerprint = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
// Fresh database roles/scopes are checked in every read and locked mutation.
// Staff start without cluster access; owner grants the matching responsibilities.
export const STAFF_ACCESS = `(a.role = 'owner' or (a.role = 'lead' and t.type not like 'bm_%') or
  (a.role = 'moderator' and t.type = 'question') or
  (a.role in ('staff','lead') and t.type not in ('question','report_staff') and exists(
    select 1 from support_access g where g.steam_id=a.steam_id
      and g.cluster in ('*',t.cluster) and g.type=t.type)))`;
const READ_ACCESS = `(t.opener=a.steam_id or ${STAFF_ACCESS})`;
export type SupportTicket = {
  id: string;
  number: number;
  opener: string;
  opener_name: string;
  type: string;
  cluster: string;
  subject: string;
  details: Record<string, string>;
  status: string;
  assigned_to: string | null;
  assigned_name?: string | null;
  hold: boolean;
  priority: number;
  created_at: string;
  closed_at: string | null;
};
export type SupportMessage = {
  id: string;
  author: string;
  body: string;
  private: boolean;
  created_at: string;
};
export type SupportUpload = {
  id: string;
  name: string;
  mime: string;
  bytes: number;
  ready: boolean;
};

export function parseSupport(form: FormData) {
  const id = String(form.get("request_id") ?? ""),
    type = String(form.get("type") ?? "");
  const cluster = String(form.get("cluster") ?? ""),
    body = String(form.get("body") ?? "").trim();
  if (
    !uuid(id) ||
    !SUPPORT_TYPES.some(([k]) => k === type) ||
    !["Solo", "Duo", "3/6 Man", "4 Man", "100x"].includes(cluster) ||
    !body ||
    body.length > 6000
  )
    return null;
  const details: Record<string, string> = {};
  for (const key of [
    "map",
    "tribe",
    "season",
    "location",
    "members",
    "tour",
    "raids",
    "channel_url",
  ]) {
    const value = String(form.get(key) ?? "").trim();
    if (value.length > (key === "members" || key === "raids" ? 3000 : 500))
      return null;
    if (
      ["tour", "channel_url"].includes(key) &&
      value &&
      !/^https:\/\//.test(value)
    )
      return null;
    if (value) details[key] = value;
  }
  if (
    type === "hof" &&
    (!details.tribe || !details.season || !details.location || !details.members)
  )
    return null;
  if (type === "creator" && !details.channel_url) return null;
  return { id, type, cluster, body, details };
}

export async function createSupport(
  actor: User,
  input: NonNullable<ReturnType<typeof parseSupport>>,
) {
  const subject =
    input.type === "hof" ? input.details.tribe : supportLabel(input.type);
  const hash = fingerprint(input);
  const rows = await ownershipQuery<{ id: string }>(
    `with a as (select * from users where steam_id=$1 and discord_id is not null),
    existing as(select id from support_tickets where id=$2::uuid and opener=$1 and fingerprint=$8),
    opened as(insert into support_tickets(id,opener,opener_name,discord_id,type,cluster,subject,details,fingerprint)
      select $2::uuid,a.steam_id,coalesce(a.persona,'Player'),a.discord_id,$3,$4,$5,$6::jsonb,$8 from a
      where not exists(select 1 from support_tickets where id=$2::uuid)
      and (select count(*) from support_tickets where opener=$1 and status='open')<3
      and (select count(*) from support_tickets where opener=$1 and created_at>now()-interval '1 day')<5
      on conflict(id) do nothing returning id),
    message as(insert into support_messages(id,ticket_id,actor,author,body,fingerprint)
      select $2::uuid,o.id,a.steam_id,coalesce(a.persona,'Player'),$7,$8 from opened o,a returning id)
    select id::text from opened union all select id::text from existing where exists(select 1 from a)`,
    [
      actor.steam_id,
      input.id,
      input.type,
      input.type.startsWith("bm_") ? "MESA" : input.cluster,
      subject,
      JSON.stringify(input.details),
      input.body,
      hash,
    ],
  );
  return rows[0]?.id ?? null;
}

export const listSupport = (actor: User, staff = false, status = "open") =>
  query<SupportTicket>(
    `select t.*,u.persona as assigned_name from support_tickets t
   join users a on a.steam_id=$1 left join users u on u.steam_id=t.assigned_to
   where ${staff ? STAFF_ACCESS : "t.opener=a.steam_id"} ${staff ? "and t.status=$2" : ""}
   order by t.priority desc,t.created_at ${staff ? "asc" : "desc"} limit 200`,
    staff ? [actor.steam_id, status] : [actor.steam_id],
  );

export async function supportAssignees(actor: User, id: string) {
  if (!uuid(id)) return [];
  return query<{ id: string; name: string }>(
    `select a.steam_id as id,coalesce(a.persona,'Staff') as name
    from users a,support_tickets t where t.id=$2::uuid and ${STAFF_ACCESS}
    and exists(select 1 from users a where a.steam_id=$1 and ${STAFF_ACCESS}) order by name`,
    [actor.steam_id, id],
  );
}

export async function readSupport(actor: User, id: string) {
  if (!uuid(id)) return null;
  const [ticket] = await query<SupportTicket & { staff: boolean }>(
    `select t.*,u.persona as assigned_name,${STAFF_ACCESS} as staff
    from support_tickets t join users a on a.steam_id=$1 left join users u on u.steam_id=t.assigned_to
    where t.id=$2::uuid and ${READ_ACCESS}`,
    [actor.steam_id, id],
  );
  if (!ticket) return null;
  const [messages, uploads] = await Promise.all([
    query<SupportMessage>(
      `select m.id,m.author,m.body,m.private,m.created_at from support_messages m
      join support_tickets t on t.id=m.ticket_id join users a on a.steam_id=$1
      where t.id=$2::uuid and ${READ_ACCESS} and (not m.private or ${STAFF_ACCESS}) order by m.created_at,m.id`,
      [actor.steam_id, id],
    ),
    query<SupportUpload>(
      `select f.id,f.name,f.mime,f.bytes,f.ready from support_uploads f
      join support_tickets t on t.id=f.ticket_id join users a on a.steam_id=$1
      where t.id=$2::uuid and ${READ_ACCESS} and f.ready order by f.created_at`,
      [actor.steam_id, id],
    ),
  ]);
  return { ticket, messages, uploads };
}

export async function replySupport(
  actor: User,
  id: string,
  request: string,
  body: string,
  privateNote = false,
) {
  if (!uuid(id) || !uuid(request) || !body.trim() || body.length > 6000)
    return false;
  const hash = fingerprint({ id, body, privateNote });
  const rows = await ownershipQuery<{ id: string }>(
    `with a as(select * from users where steam_id=$1),
    allowed as(select t.* from support_tickets t,a where t.id=$2::uuid and t.status='open'
      and ${READ_ACCESS} and (not $5::boolean or ${STAFF_ACCESS})
      and (t.opener<>a.steam_id or a.discord_id is not null)),
    existing as(select id from support_messages where id=$3::uuid and actor=$1 and fingerprint=$6),
    sent as(insert into support_messages(id,ticket_id,actor,author,body,private,fingerprint)
      select $3::uuid,t.id,a.steam_id,coalesce(a.persona,'Player'),$4,$5,$6 from allowed t,a
      where not exists(select 1 from support_messages where id=$3::uuid)
      and (select count(*) from support_messages where actor=$1 and created_at>now()-interval '10 minutes')<30
      on conflict(id) do nothing returning id),
    touched as(update support_tickets set updated_at=now() where id=$2::uuid and exists(select 1 from sent))
    select id::text from sent union all select id::text from existing where exists(select 1 from allowed)`,
    [actor.steam_id, id, request, body.trim(), privateNote, hash],
  );
  return Boolean(rows.length);
}

export type SupportAction =
  | "claim"
  | "unclaim"
  | "transfer"
  | "close"
  | "reopen"
  | "hold"
  | "unhold"
  | "emergency"
  | "normal"
  | "rank";
export async function actSupport(
  actor: User,
  id: string,
  action: SupportAction,
  value: string,
  request: string,
) {
  if (
    !uuid(id) ||
    !uuid(request) ||
    value.length > 1000 ||
    (action === "close" && !value.trim()) ||
    ![
      "claim",
      "unclaim",
      "transfer",
      "close",
      "reopen",
      "hold",
      "unhold",
      "emergency",
      "normal",
      "rank",
    ].includes(action)
  )
    return false;
  const hash = fingerprint({ id, action, value });
  const rows = await ownershipQuery<{ id: string }>(
    `with a as(select * from users where steam_id=$1),
    allowed as(select t.* from support_tickets t,a where t.id=$2::uuid and ${STAFF_ACCESS}
      and ($3 not in ('transfer','reopen','emergency','normal','rank') or a.role in ('owner','lead'))
      and ($3 not in ('claim','unclaim','close','hold','unhold') or t.status='open')
      and ($3 <> 'claim' or t.assigned_to is null or t.assigned_to=a.steam_id)
      and ($3 <> 'unclaim' or t.assigned_to=a.steam_id or a.role in ('owner','lead'))
      and ($3 <> 'transfer' or exists(select 1 from users a where a.steam_id=$4 and ${STAFF_ACCESS}))),
    prior as(select id from support_messages where id=$5::uuid and actor=$1 and fingerprint=$6),
    changed as(update support_tickets t set
      assigned_to=case when $3='claim' then $1 when $3='unclaim' then null when $3='transfer' then $4 else t.assigned_to end,
      status=case when $3='close' then 'closed' when $3='reopen' then 'open' else t.status end,
      closed_at=case when $3='close' then now() when $3='reopen' then null else t.closed_at end,
      hold=case when $3='hold' then true when $3='unhold' then false else t.hold end,
      priority=case when $3='emergency' then 2 when $3='rank' then 1 when $3='normal' then 0 else t.priority end,
      updated_at=now() where t.id in(select id from allowed) and not exists(select 1 from prior) returning t.id),
    recorded as(insert into support_messages(id,ticket_id,actor,author,body,private,fingerprint,kind)
      select $5::uuid,t.id,a.steam_id,coalesce(a.persona,'Staff'),$7,$3 not in ('close','reopen'),$6,'control' from changed t,a returning id),
    credited as(insert into moderator_credits(ticket_id, moderator)
      select t.id, (
        select m.actor from support_messages m join users u on u.steam_id=m.actor
        where m.ticket_id=t.id and not m.private and m.kind='reply' and u.role='moderator' and m.actor<>t.opener
        group by m.actor order by case when m.actor=$1 then 0 when m.actor=t.assigned_to then 1 else 2 end, count(*) desc, m.actor limit 1
      ) from allowed t join changed c on c.id=t.id where $3='close' and t.type='question'
        and exists(select 1 from support_messages m join users u on u.steam_id=m.actor
          where m.ticket_id=t.id and not m.private and m.kind='reply' and u.role='moderator' and m.actor<>t.opener)
      on conflict(ticket_id) do nothing returning ticket_id)
    select id::text from recorded union all select id::text from prior where exists(select 1 from support_tickets t,a where t.id=$2::uuid and ${STAFF_ACCESS})`,
    [
      actor.steam_id,
      id,
      action,
      value,
      request,
      hash,
      action === "close"
        ? `Ticket closed. ${value}`
        : action === "reopen"
          ? "Ticket reopened."
          : `Staff action: ${action}${action === "rank" ? " · purchased rank verified" : ""}${action === "transfer" ? " · reassigned" : ""}`,
    ],
  );
  return Boolean(rows.length);
}

export async function setSupportAccess(
  actor: User,
  target: string,
  cluster: string,
  type: string,
  enabled: boolean,
) {
  if (
    !["*", "MESA", "Solo", "Duo", "3/6 Man", "4 Man", "100x"].includes(
      cluster,
    ) ||
    !SUPPORT_TYPES.some(([k]) => k === type)
  )
    return false;
  const statement = enabled
    ? `insert into support_access(steam_id,cluster,type,granted_by)
    select $2,$3,$4,$1 from users where steam_id=$1 and role='owner'
    and exists(select 1 from users where steam_id=$2 and role in ('staff','lead','owner'))
    on conflict(steam_id,cluster,type) do update set granted_by=$1 returning steam_id`
    : `delete from support_access where steam_id=$2 and cluster=$3 and type=$4
    and exists(select 1 from users where steam_id=$1 and role='owner') returning steam_id`;
  return Boolean(
    (
      await ownershipQuery(
        `with changed as (${statement}),
    audit as(insert into support_access_audit(actor,target,cluster,type,enabled)
      select $1,$2,$3,$4,$5 from changed returning id) select id from audit`,
        [actor.steam_id, target, cluster, type, enabled],
      )
    ).length,
  );
}
