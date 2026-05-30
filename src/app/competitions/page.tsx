import { auth } from "@/auth";
import { getCompetitions } from "@/actions";
import { CompetitionsClient } from "./competitions-client";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function CompetitionsPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const [result, user] = await Promise.all([
    getCompetitions({ upcoming: false }),
    prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    }),
  ]);

  if (!result.success || !result.data) {
    return (
      <div className="page on" style={{ minHeight: '100vh', padding: '24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', paddingTop: '100px' }}>
          <p style={{ color: 'var(--t2)' }}>Failed to load competitions</p>
        </div>
      </div>
    );
  }

  return (
    <CompetitionsClient
      competitions={result.data.competitions}
      userEmail={session.user.email}
      isAdmin={user?.role === "ADMIN"}
    />
  );
}
