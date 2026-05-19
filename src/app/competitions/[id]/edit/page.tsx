import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getCompetitionById } from "@/actions";
import { redirect } from "next/navigation";
import { EditCompetitionClient } from "./edit-competition-client";

export default async function EditCompetitionPage({ params }: { params: { id: string } }) {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const result = await getCompetitionById(params.id);

  if (!result.success || !result.data) {
    redirect("/competitions");
  }

  // Get current user to check if they're the author or admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true }
  });

  const canEdit = user && (user.id === result.data.authorId || user.role === "ADMIN");

  if (!canEdit) {
    redirect(`/competitions/${params.id}`);
  }

  return <EditCompetitionClient competition={result.data} />;
}
