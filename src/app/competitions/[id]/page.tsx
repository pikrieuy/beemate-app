import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getCompetitionById } from "@/actions";
import { redirect } from "next/navigation";
import { CompetitionDetailClient } from "./competition-detail-client";

export default async function CompetitionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const result = await getCompetitionById(id);

  if (!result.success || !result.data) {
    return (
      <div className="page on" style={{ minHeight: '100vh', padding: '24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', paddingTop: '100px' }}>
          <p style={{ color: 'var(--t2)' }}>Competition not found</p>
        </div>
      </div>
    );
  }

  // Get current user to check if they're the author or admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true }
  });

  const canEdit = user && (user.id === result.data.authorId || user.role === "ADMIN");

  return (
    <CompetitionDetailClient 
      competition={result.data} 
      canEdit={!!canEdit}
    />
  );
}
