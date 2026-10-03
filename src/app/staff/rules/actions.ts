"use server";
import {currentUser} from "@/lib/auth";
import {draftRules,publishRules} from "@/lib/rulesStore";
import {isStaff,isLead} from "@/lib/staff";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
export async function prepareRules(_prev:{error:string|null},form:FormData):Promise<{error:string|null}> {
  const actor=await currentUser();
  if(!isStaff(actor)) return {error:"Staff access is required."};
  let raw=String(form.get("raw")??"");
  const addition=String(form.get("addition")??"").trim(), section=String(form.get("section")??"General Rules").trim();
  if(addition) {
    if(addition.length>6000 || !section || section.length>100 || /[\r\n]/.test(section)) return {error:"Use a section name and a new rule of up to 6,000 characters."};
    raw+=`\n\n# ${section}\n- ${addition}`;
  }
  let id;
  try {id=await draftRules(actor,raw);} catch(e) {return {error:e instanceof Error && e.message.startsWith("Use ") ? e.message : "Could not prepare the draft. Your text is kept; try again."};}
  if(!id) return {error:"Your staff access changed. Sign in again."};
  revalidatePath("/staff/rules"); redirect(`/staff/rules?id=${id}`);
}
export async function publishRulesAction(form:FormData) {
  const actor=await currentUser();
  if(!isLead(actor) || form.get("reviewed")!=="on") redirect("/staff/rules?error=review");
  let saved=false;
  try {saved=await publishRules(actor,String(form.get("id")??""),String(form.get("expected")??""));} catch {redirect("/staff/rules?error=save");}
  if(!saved) redirect("/staff/rules?error=conflict");
  revalidatePath("/rules"); revalidatePath("/staff/rules"); redirect("/staff/rules?published=1");
}
