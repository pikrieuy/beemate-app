import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreateCompetitionClient } from "./create-competition-client";

export default async function CreateCompetitionPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  // Get user and check if ADMIN
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/competitions");
  }

  return <CreateCompetitionClient />;
}
