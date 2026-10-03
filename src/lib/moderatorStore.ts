import { ownershipQuery, query } from "@/lib/db";
import { monthBounds, moderatorRewards, currentRewardMonth } from "@/lib/moderatorRewards";
import { uuid } from "@/lib/supportStore";

export async function moderatorBoard(actor: string, month: string) {
  const bounds = monthBounds(month);
  if (!bounds) return [];
  const rows = await query<{ steam_id: string; persona: string; credits: number; deductions: number }>(
    `with viewer as(select * from users where steam_id=$1),
    credits as(select moderator, count(*)::int as count from moderator_credits where credited_at >= $2::timestamptz and credited_at < $3::timestamptz group by moderator),
    deductions as(select moderator, sum(points)::int as count from moderator_deductions where month=$4 group by moderator)
    select u.steam_id,coalesce(u.persona,'Moderator') as persona,coalesce(c.count,0) as credits,coalesce(d.count,0) as deductions
    from users u cross join viewer v left join credits c on c.moderator=u.steam_id left join deductions d on d.moderator=u.steam_id
    where (u.role='moderator' or c.moderator is not null or d.moderator is not null)
      and (v.role in ('owner','lead') or (v.role='moderator' and u.steam_id=v.steam_id))`, [actor, bounds.start, bounds.end, month]);
  // Winner totals computed independently of viewer filtering, so a moderator cannot
  // get the most-ticket bonus just because they are the only visible row.
  const [leader] = await query<{ highest: number; winners: number }>(`with totals as (
    select u.steam_id, greatest(0, (select count(*) from moderator_credits c where c.moderator=u.steam_id and c.credited_at >= $2::timestamptz and c.credited_at < $3::timestamptz)
      - coalesce((select sum(points) from moderator_deductions d where d.moderator=u.steam_id and d.month=$4),0)) as tickets
    from users u where u.role='moderator' or exists(select 1 from moderator_credits c where c.moderator=u.steam_id)
  ), best as(select max(tickets) as highest from totals)
  select coalesce(highest,0)::int as highest, (select count(*) from totals where tickets=highest and tickets>0)::int as winners from best
    where exists(select 1 from users where steam_id=$1 and role in ('moderator','lead','owner'))`, [actor, bounds.start, bounds.end, month]);
  return rows.map(row => {
    const rewards = moderatorRewards(Number(row.credits), Number(row.deductions));
    const winner = rewards.tickets > 0 && rewards.tickets === Number(leader?.highest);
    return { ...row, ...rewards, winner, tied: winner && Number(leader?.winners) > 1, bonus: winner && Number(leader?.winners) === 1 ? 75 : 0 };
  }).sort((a,b) => b.tickets-a.tickets || a.persona.localeCompare(b.persona));
}

export async function deductModerator(actor: string, input: { id: string; moderator: string; month: string; points: number; severity: string; reason: string }) {
  if (!uuid(input.id) || !monthBounds(input.month) || input.month > currentRewardMonth() || !Number.isInteger(input.points) || input.points < 5 || input.points > 10000 || !['normal','major'].includes(input.severity) || (input.severity === 'normal' ? input.points > 10 : input.points <= 10) || !input.reason.trim() || input.reason.length > 2000) return false;
  const rows = await ownershipQuery(`with allowed as(select 1 from users a where a.steam_id=$1 and a.role in ('owner','lead')
    and exists(select 1 from users u where u.steam_id=$3 and (u.role='moderator' or exists(select 1 from moderator_credits c where c.moderator=u.steam_id)))),
    saved as(insert into moderator_deductions(id,moderator,month,points,severity,reason,actor)
    select $2::uuid,$3,$4,$5,$6,$7,$1 from allowed on conflict(id) do nothing returning id)
    select id from saved union all select id from moderator_deductions where id=$2::uuid and actor=$1 and moderator=$3 and month=$4 and points=$5 and severity=$6 and reason=$7 and exists(select 1 from allowed)`, [actor,input.id,input.moderator,input.month,input.points,input.severity,input.reason.trim()]);
  return Boolean(rows.length);
}

export const moderatorDeductions = (actor: string, month: string) => query<{ persona: string; points: number; reason: string; severity: string; created_at: string }>(
  `select coalesce(u.persona,'Moderator') as persona,d.points,d.reason,d.severity,d.created_at::text
  from moderator_deductions d join users u on u.steam_id=d.moderator join users a on a.steam_id=$1
  where d.month=$2 and (a.role in ('lead','owner') or (a.role='moderator' and d.moderator=a.steam_id)) order by d.created_at desc`, [actor, month]);
