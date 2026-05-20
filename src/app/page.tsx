import prisma from "@/lib/prisma";
import { LandingClient } from "./landing-client";

// Revalidate stats every 10 minutes
export const revalidate = 600;

export default async function LandingPage() {
  // Fetch live stats from DB
  const [userCount, teamCount, competitionCount] = await Promise.all([
    prisma.user.count(),
    prisma.team.count(),
    prisma.competition.count(),
  ]);

  return (
    <LandingClient
      stats={{ users: userCount, teams: teamCount, competitions: competitionCount }}
    />
  );
}
