import { publishedProfile } from "@/lib/account-profile";
export const dynamic = "force-dynamic";
export async function GET(_request:Request, {params}:{params:Promise<{id:string}>}) {
  const profile=await publishedProfile((await params).id);
  if(!profile?.share_links) return new Response("Not found", {status:404,headers:{"Cache-Control":"no-store"}});
  return new Response(null,{status:302, headers:{Location:`https://steamcommunity.com/profiles/${profile.steam_id}`, "Cache-Control":"no-store", "X-Robots-Tag":"noindex"}});
}
