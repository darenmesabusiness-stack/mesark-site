import seed from "@/data/rules.json";
import {query, ownershipQuery, dbConfigured} from "@/lib/db";
import type {User} from "@/lib/auth";
import {parseRules, type RulesDocument} from "@/lib/rulesParse";
export type RulesRevision={id:string; raw:string; data:RulesDocument; created_at:string; editor:string|null};
export async function liveRules():Promise<{id:string;data:RulesDocument}> {
  if(!dbConfigured()) return {id:"seed",data:seed};
  const [row]=await query<{id:string;data:RulesDocument}>(`select r.id,r.data from rules_live l join rules_revisions r on r.id=l.revision where l.id=1`);
  return row ?? {id:"seed",data:seed};
}
export async function staffRules(actor:User) {
  return query<RulesRevision>(`select r.id,r.raw,r.data,r.created_at,u.persona as editor from rules_revisions r left join users u on r.actor=u.steam_id
    where exists(select 1 from users where steam_id=$1 and role in ('staff','lead','owner')) order by created_at desc limit 50`,[actor.steam_id]);
}
export async function draftRules(actor:User,raw:string) {
  const data=parseRules(raw), id=crypto.randomUUID();
  const rows=await ownershipQuery<{id:string}>(`insert into rules_revisions(id,raw,data,actor)
    select $2,$3,$4::jsonb,steam_id from users where steam_id=$1 and role in ('staff','lead','owner') returning id`,[actor.steam_id,id,raw,JSON.stringify(data)]);
  return rows[0]?.id ?? null;
}
export async function publishRules(actor:User,id:string,expected:string) {
  if(!/^[a-f0-9-]{36}$/i.test(id)) return false;
  const rows=await ownershipQuery<{revision:string}>(`with allowed as(select steam_id from users where steam_id=$1 and role in ('lead','owner')),
    changed as(insert into rules_live(id,revision)
      select 1,r.id from rules_revisions r, allowed where r.id=$2
      and coalesce((select revision::text from rules_live where id=1),'seed')=$3
      on conflict(id) do update set revision=excluded.revision returning revision),
    logged as(insert into rules_publish_audit(actor,revision,previous) select $1,revision,$3 from changed returning revision)
    select revision from logged`,[actor.steam_id,id,expected]);
  return rows.length===1;
}
