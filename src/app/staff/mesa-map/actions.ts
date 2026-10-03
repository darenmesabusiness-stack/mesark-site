"use server";
import { currentUser } from "@/lib/auth";
import { isLead } from "@/lib/staff";
import { confirmMapWipe, saveMapLocation } from "@/lib/mesaMapStore";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function editMesaMap(form: FormData) {
  const user = await currentUser();
  if (!isLead(user)) redirect("/staff");
  const value = (key: string) => String(form.get(key) ?? "");
  const utc = (key: string) => { const v = value(key); return v ? `${v}Z` : ""; };
  const cluster = value("cluster");
  const coordinate = (key: string) => value(key) === "" ? NaN : Number(value(key));
  const error = value("action") === "wipe"
    ? await confirmMapWipe(user.steam_id, cluster, utc("wiped"), utc("expiry"))
    : await saveMapLocation(user.steam_id, { cluster, wiped: value("wiped"), tribe: Number(value("tribe")), map: value("map"), lat: coordinate("lat"), lon: coordinate("lon"), observed: utc("observed"), source: value("source"), remove: value("action") === "remove" });
  revalidatePath("/live");
  redirect(`/staff/mesa-map?cluster=${encodeURIComponent(cluster)}&${error ? `error=${encodeURIComponent(error)}` : "saved=1"}`);
}
