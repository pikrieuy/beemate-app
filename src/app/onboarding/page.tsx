import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { OnboardingClient } from "./onboarding-client";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/api/auth/signin");

  // Check if user already has a title set (already onboarded)
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, title: true, bio: true, skills: true },
  });

  if (!user) redirect("/api/auth/signin");

  // If already onboarded (has title), redirect to dashboard
  if (user.title) redirect("/dashboard");

  return <OnboardingClient userName={user.name} />;
}
