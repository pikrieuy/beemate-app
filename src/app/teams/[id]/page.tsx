import { getTeamById, getCurrentUser } from "@/actions";
import { notFound, redirect } from "next/navigation";
import { TeamDetailClient } from "./team-detail-client";

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [teamResult, userResult] = await Promise.all([
    getTeamById(id),
    getCurrentUser(),
  ]);

  if (!teamResult.success || !teamResult.data) {
    notFound();
  }

  if (!userResult.success || !userResult.data) {
    redirect("/api/auth/signin");
  }

  const team = teamResult.data;
  const currentUser = userResult.data;
  
  // Check if current user is the leader
  const isLeader = team.leaderId === currentUser.id;
  
  // Check if current user is a member
  const isMember = team.members.some(m => m.userId === currentUser.id && m.joinStatus === "ACCEPTED");

  return (
    <TeamDetailClient 
      team={team} 
      currentUserId={currentUser.id}
      isLeader={isLeader}
      isMember={isMember}
    />
  );
}
