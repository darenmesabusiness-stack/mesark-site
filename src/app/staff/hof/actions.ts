"use server";
import { currentUser } from "@/lib/auth";
import { parseHof, saveHof } from "@/lib/hofStore";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function saveWinner(
  _prev: { error: string | null; saved?: boolean },
  form: FormData,
) {
  const user = await currentUser(),
    data = parseHof(form);
  if (!user || !data || form.get("verified") !== "on")
    return {
      error:
        "Confirm the winner and check all public fields. Each roster line needs a name | Discord profile URL. Never publish Steam IDs, private evidence or base coordinates.",
    };
  try {
    if (!(await saveHof(user, data, form.get("published") === "on", String(form.get("evidence")??""))))
      return { error: "Only leads and the owner can save. Verified results need a private evidence reference of up to 1,000 characters." };
  } catch {
    return { error: "Could not save. Your form is kept; try again." };
  }
  revalidatePath("/hall-of-fame");
  revalidatePath("/staff/hof");
  redirect(`/staff/hof?id=${data.id}&saved=1`);
}
