import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@/lib/auth";
import { setRole, type Role } from "@/lib/staff";

/** Admin changes someone's role from /staff/team. */
export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const user = await currentUser();
  const form = await request.formData();
  const error = user
    ? await setRole(user, String(form.get("steam_id") ?? ""), String(form.get("role") ?? "") as Role)
    : "Sign in first.";
  const qs = error ? `error=${encodeURIComponent(error)}` : "saved=1";
  return NextResponse.redirect(`${origin}/staff/team?${qs}`, 303);
}
