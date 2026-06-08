import { getNotifications, getPendingInvitations } from "@/actions";
import { redirect } from "next/navigation";
import { NotificationsClient } from "./notifications-client";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const [notificationsResult, invitationsResult] = await Promise.all([
    getNotifications({ limit: 50 }),
    getPendingInvitations(),
  ]);

  if (!notificationsResult.success) {
    redirect("/api/auth/signin");
  }

  const notifications = notificationsResult.data ?? [];
  const invitations = invitationsResult.success ? (invitationsResult.data ?? []) : [];

  return <NotificationsClient notifications={notifications} invitations={invitations} />;
}
