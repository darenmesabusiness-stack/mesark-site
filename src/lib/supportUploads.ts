import { ownershipQuery, query } from "@/lib/db";
import { STAFF_ACCESS, uuid } from "@/lib/supportStore";
import type { User } from "@/lib/auth";
import { UPLOAD_TYPES, MAX_UPLOAD } from "@/lib/supportUploadTypes";
export { MAX_UPLOAD } from "@/lib/supportUploadTypes";

export async function reserveUpload(
  actor: User,
  ticket: string,
  id: string,
  name: string,
  mime: string,
  bytes: number,
) {
  if (
    !uuid(ticket) ||
    !uuid(id) ||
    !Object.hasOwn(UPLOAD_TYPES,mime) ||
    !Number.isInteger(bytes) ||
    bytes < 1 ||
    bytes > MAX_UPLOAD
  )
    return null;
  name = name.replace(/[\r\n\x00-\x1f/\\]/g, "_").slice(0, 120) || "attachment";
  const pathname = `support/${ticket}/${id}.${UPLOAD_TYPES[mime]}`;
  const rows = await ownershipQuery<{ pathname: string }>(
    `with a as(select * from users where steam_id=$1),
    allowed as(select t.* from support_tickets t,a where t.id=$2::uuid and t.status='open'
      and ((t.opener=a.steam_id and a.discord_id is not null) or ${STAFF_ACCESS})),
    added as(insert into support_uploads(id,ticket_id,actor,name,pathname,mime,bytes)
      select $3::uuid,t.id,$1,$4,$5,$6,$7::integer from allowed t
      where (select count(*) from support_uploads where ticket_id=t.id)<40
      and (select coalesce(sum(bytes),0) from support_uploads where actor=$1 and created_at>now()-interval '1 day')+$7::integer<=268435456
      on conflict(id) do nothing returning pathname)
    select pathname from added union all select f.pathname from support_uploads f where f.id=$3::uuid
      and f.actor=$1 and f.ticket_id=$2::uuid and f.pathname=$5 and f.bytes=$7 and f.mime=$6 and f.name=$4
      and exists(select 1 from allowed)`,
    [actor.steam_id, ticket, id, name, pathname, mime, bytes],
  );
  return rows[0]?.pathname ?? null;
}

export async function completeUpload(
  id: string,
  actor: string,
  pathname: string,
) {
  if (!uuid(id)) return false;
  // The signed SDK webhook must also match a reservation and current access.
  return Boolean(
    (
      await ownershipQuery(
        `update support_uploads f set ready=true
    from support_tickets t,users a where f.id=$1::uuid and f.actor=$2 and f.pathname=$3
    and t.id=f.ticket_id and a.steam_id=$2
    and ((t.opener=a.steam_id and a.discord_id is not null) or ${STAFF_ACCESS}) returning f.id`,
        [id, actor, pathname],
      )
    ).length,
  );
}

export async function authorizedUpload(actor: User, id: string) {
  if (!uuid(id)) return null;
  const [f] = await query<{ pathname: string; name: string; mime: string }>(
    `select f.pathname,f.name,f.mime from support_uploads f
    join support_tickets t on t.id=f.ticket_id join users a on a.steam_id=$1
    where f.id=$2::uuid and f.ready and (t.opener=a.steam_id or ${STAFF_ACCESS})`,
    [actor.steam_id, id],
  );
  return f ?? null;
}
