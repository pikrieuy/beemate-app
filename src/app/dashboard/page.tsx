import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  // Get current user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      image: true,
      role: true,
    }
  });

  if (!user) {
    redirect("/auth/signin");
  }

  // Get user's teams (as leader)
  const teamsCreated = await prisma.team.findMany({
    where: { leaderId: user.id },
    select: {
      id: true,
      name: true,
      description: true,
      _count: {
        select: { members: true }
      }
    },
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  // Get user's team memberships
  const teamMemberships = await prisma.teamMember.findMany({
    where: {
      userId: user.id,
      joinStatus: "ACCEPTED"
    },
    select: {
      team: {
        select: {
          id: true,
          name: true,
          description: true,
          _count: {
            select: { members: true }
          }
        }
      }
    },
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  // Get pending invitations
  const pendingInvitations = await prisma.teamMember.findMany({
    where: {
      userId: user.id,
      joinStatus: "PENDING"
    },
    select: {
      id: true,
      team: {
        select: {
          id: true,
          name: true,
          leader: {
            select: {
              name: true,
              image: true
            }
          }
        }
      },
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  });

  // Get upcoming competitions
  const upcomingCompetitions = await prisma.competition.findMany({
    where: {
      deadline: {
        gte: new Date()
      }
    },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      deadline: true,
      author: {
        select: {
          name: true,
          image: true
        }
      }
    },
    take: 6,
    orderBy: { deadline: 'asc' }
  });

  // Get stats
  const stats = {
    teamsCreated: teamsCreated.length,
    teamsJoined: teamMemberships.length,
    pendingInvites: pendingInvitations.length,
    upcomingCompetitions: upcomingCompetitions.length
  };

  return (
    <DashboardClient
      user={user}
      stats={stats}
      teamsCreated={teamsCreated}
      teamMemberships={teamMemberships.map(tm => tm.team)}
      pendingInvitations={pendingInvitations}
      upcomingCompetitions={upcomingCompetitions}
    />
  );
}
