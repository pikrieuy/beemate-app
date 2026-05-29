import prisma from "@/lib/prisma";
import { LandingClient } from "./landing-client";
import { getTrendingSkills } from "@/actions";

// Revalidate stats every 10 minutes
export const revalidate = 600;

export default async function LandingPage() {
  // Fetch live stats from DB
  const [userCount, teamCount, competitionCount] = await Promise.all([
    prisma.user.count(),
    prisma.team.count(),
    prisma.competition.count(),
  ]);

  // Fetch trending skills
  const trendingResult = await getTrendingSkills(8);
  const trendingSkills = trendingResult.success ? (trendingResult.data?.trending ?? []) : [];

  return (
    <LandingClient
      stats={{ users: userCount, teams: teamCount, competitions: competitionCount }}
      trendingSkills={trendingSkills}
    />
  );
}
