import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminUsersClient } from "./admin-users-client";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/api/auth/signin");

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true },
  });

  if (!currentUser || currentUser.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      title: true,
      skills: true,
      createdAt: true,
      _count: {
        select: { teamsCreated: true, teamMembers: true },
      },
    },
  });

  return <AdminUsersClient users={users} currentUserId={currentUser.id} />;
}
