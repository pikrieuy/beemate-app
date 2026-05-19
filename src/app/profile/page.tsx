import { getCurrentUser, getUserTeams } from "@/actions";
import { redirect } from "next/navigation";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  // Fetch user data from database
  const userResult = await getCurrentUser();
  
  if (!userResult.success) {
    redirect("/api/auth/signin");
  }
  
  const user = userResult.data;
  
  // Fetch user's teams
  const teamsResult = await getUserTeams();
  const teams = teamsResult.success ? teamsResult.data : null;
  
  return <ProfileClient user={user} teams={teams} />;
}
