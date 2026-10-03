import { currentUser } from "@/lib/auth";
import { canSupport } from "@/lib/staff";
import { nativeId, readSupport, supportAssignees } from "@/lib/supportStore";
import { StaffGate, StaffShell } from "@/components/staff/StaffShell";
import { WebsiteTicket } from "@/components/account/WebsiteTicket";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Support ticket",
  robots: { index: false, follow: false },
};
export default async function StaffTicket({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();
  if (!canSupport(user)) return <StaffGate user={user} />;
  const { id } = await params;
  if (!nativeId(id)) notFound();
  const data = await readSupport(user, id.slice(2));
  if (!data?.ticket.staff) notFound();
  const assignees = await supportAssignees(user, id.slice(2));
  return (
    <StaffShell user={user} active="/staff/tickets" title="Support ticket">
      <WebsiteTicket data={data} staff assignees={assignees} />
    </StaffShell>
  );
}
