import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MatchmakingClient } from "./matchmaking-client";

export default async function MatchmakingPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/api/auth/signin?callbackUrl=/matchmaking");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      teamsCreated: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  // Pre-process serialization
  const serializedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    title: user.title,
    skills: user.skills,
  };

  const serializedTeams = user.teamsCreated.map(t => ({
    id: t.id,
    name: t.name,
  }));

  return (
    <MatchmakingClient 
      currentUser={serializedUser}
      userTeams={serializedTeams}
    />
  );
}
