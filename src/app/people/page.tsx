import { searchUsers } from "@/actions";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { PeopleClient } from "./people-client";

export default async function PeoplePage() {
  const session = await auth();

  // Fetch all users
  const result = await searchUsers("", 100);
  const users = result.success ? (result.data ?? []) : [];

  // Get current user's title for recommendations
  let currentUserTitle: string | null = null;
  let currentUserId: string | null = null;
  if (session?.user?.email) {
    const me = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, title: true },
    });
    currentUserTitle = me?.title ?? null;
    currentUserId = me?.id ?? null;
  }

  // Build recommendations: suggest users with complementary titles
  const complementary: Record<string, string[]> = {
    Hacker: ["Hustler", "Hipster"],
    Hustler: ["Hacker", "Hipster"],
    Hipster: ["Hacker", "Hustler"],
  };
  const wantedTitles = currentUserTitle ? (complementary[currentUserTitle] ?? []) : [];
  const recommended = users
    .filter((u) => u.id !== currentUserId && wantedTitles.includes(u.title ?? ""))
    .slice(0, 4);

  return (
    <PeopleClient
      initialUsers={users}
      recommended={recommended}
      currentUserId={currentUserId}
    />
  );
}
