import seed from "@/data/hofMembers.json";
import { dbConfigured, ownershipQuery, query } from "@/lib/db";
import { isBlockedName } from "@/lib/leaderboard";
import { uuid } from "@/lib/supportStore";
import type { User } from "@/lib/auth";
import type { HofWinner } from "@/components/HofGallery";
export const hofSeed = seed;
export const HOF_ART = [
  "/art/ark/hall.jpg",
  "/art/ark/rex.jpg",
  "/art/ark/siege.jpg",
  "/art/ark/hundredx-king.jpg",
];
const validId = (s: string) => uuid(s) || /^\d{17,20}$/.test(s);
export async function publishedHof() {
  const winners = new Map<string, HofWinner>(
    seed.winners.map((w) => [w.id, w]),
  );
  if (dbConfigured()) {
    try {
      for (const row of await query<{
        id: string;
        data: HofWinner;
        published: boolean;
      }>("select id,data,published from hof_entries")) {
        if (row.published) winners.set(row.id, row.data);
        else winners.delete(row.id);
      }
    } catch {
      return []; /* Never restore an entry that staff have hidden during an outage. */
    }
  }
  return [...winners.values()].sort((a, b) => b.date.localeCompare(a.date));
}
export async function staffHof(actor: User) {
  return query<{ id: string; data: HofWinner; published: boolean }>(
    `select id,data,published from hof_entries
    where exists(select 1 from users where steam_id=$1 and role in ('lead','owner'))`,
    [actor.steam_id],
  );
}
export function parseHof(form: FormData): HofWinner | null {
  const get = (key: string) => String(form.get(key) ?? "").trim();
  const id = get("id"),
    tribe = get("tribe"),
    season = get("season"),
    cluster = get("cluster"),
    achievement = get("achievement"),
    video = get("video"),
    source = get("source"),
    art = get("art"),
    date = get("date");
  if (
    !validId(id) ||
    !tribe ||
    tribe.length > 100 ||
    isBlockedName(tribe) ||
    /jew\W*hunt/i.test(tribe) ||
    !/^\d{1,4}$/.test(season) ||
    !["Solo", "Duo", "3 Man", "4 Man", "6 Man", "100x"].includes(cluster) ||
    achievement.length > 1000 ||
    !HOF_ART.includes(art) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(Date.parse(date))
  )
    return null;
  const members: HofWinner["members"] = [];
  for (const line of get("members").split("\n").filter(Boolean)) {
    const [name, profile, ...extra] = line.split("|").map((s) => s.trim());
    const memberId = profile?.match(
      /^(?:https:\/\/discord.com\/users\/)?(\d{17,20})$/,
    )?.[1];
    if (
      extra.length ||
      !name ||
      name.length > 100 ||
      isBlockedName(name) ||
      !memberId ||
      members.some((m) => m.id === memberId)
    )
      return null;
    members.push({ id: memberId, name, honors: [] });
  }
  if (
    !members.length ||
    members.length > 20 ||
    /7656\d{13}/.test([tribe, achievement, get("members")].join(" "))
  )
    return null;
  if (
    video &&
    !/^https:\/\/(?:www\.)?(?:youtube\.com\/watch\?|youtu\.be\/)[a-zA-Z0-9_?=&%./#-]+$/.test(
      video,
    )
  )
    return null;
  if (
    source &&
    !/^https:\/\/discord.com\/channels\/1072737953895415858\/1500222043453391010\/\d{17,20}$/.test(
      source,
    )
  )
    return null;
  return {
    id,
    tribe,
    season,
    cluster,
    achievement,
    video: video || null,
    source: source || `https://mesark.net/hall-of-fame#${id}`,
    art,
    date: new Date(date).toISOString(),
    members,
  };
}
export async function saveHof(
  actor: User,
  data: HofWinner,
  published: boolean,
) {
  if (!validId(data.id)) return false;
  return Boolean(
    (
      await ownershipQuery(
        `with allowed as(select steam_id from users where steam_id=$1 and role in ('lead','owner')),
    saved as(insert into hof_entries(id,data,published,updated_by) select $2,$3::jsonb,$4,$1 from allowed
      on conflict(id) do update set data=excluded.data,published=excluded.published,updated_by=$1,updated_at=now() returning id),
    logged as(insert into hof_audit(entry_id,actor,data,published) select id,$1,$3::jsonb,$4 from saved returning id)
    select id from logged`,
        [actor.steam_id, data.id, JSON.stringify(data), published],
      )
    ).length,
  );
}
