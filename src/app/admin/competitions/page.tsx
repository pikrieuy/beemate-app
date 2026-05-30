import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminCompetitionsClient } from "./admin-competitions-client";

export default async function AdminCompetitionsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/api/auth/signin");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  const competitions = await prisma.competition.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  });

  return <AdminCompetitionsClient competitions={competitions} />;
}
