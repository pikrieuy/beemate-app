import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminDashboardClient } from "./admin-dashboard-client";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/api/auth/signin");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  const [totalUsers, totalTeams, totalCompetitions, recentUsers, recentCompetitions] =
    await Promise.all([
      prisma.user.count(),
      prisma.team.count(),
      prisma.competition.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
      }),
      prisma.competition.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          deadline: true,
          createdAt: true,
          author: { select: { name: true } },
        },
      }),
    ]);

  return (
    <AdminDashboardClient
      stats={{ totalUsers, totalTeams, totalCompetitions }}
      recentUsers={recentUsers}
      recentCompetitions={recentCompetitions}
    />
  );
}
