import { streamText } from "ai";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { geminiFlash } from "@/lib/ai";

/**
 * POST /api/ai/coach
 * BeeCoach — AI team assistant that helps with brainstorming,
 * task delegation, and team coordination.
 * Streams responses for real-time UX.
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages, teamId } = await request.json();

    if (!teamId || !messages?.length) {
      return new Response("Missing teamId or messages", { status: 400 });
    }

    // Get team context
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        leader: { select: { name: true, title: true, skills: true } },
        members: {
          where: { joinStatus: "ACCEPTED" },
          include: {
            user: { select: { name: true, title: true, skills: true } },
          },
        },
      },
    });

    if (!team) {
      return new Response("Team not found", { status: 404 });
    }

    // Verify user is part of the team
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const isMember =
      team.leaderId === user.id ||
      team.members.some((m) => m.userId === user.id);

    if (!isMember) {
      return new Response("Not a team member", { status: 403 });
    }

    // Build team context for the AI
    const teamContext = buildTeamContext(team);

    const result = streamText({
      model: geminiFlash,
      system: `Kamu adalah BeeCoach 🐝 — AI assistant untuk tim hackathon di platform BeeMate.

KONTEKS TIM:
${teamContext}

ATURAN:
- Jawab dalam Bahasa Indonesia casual (boleh campur Inggris untuk istilah teknis)
- Singkat dan actionable (max 150 kata per respons)
- Kalau diminta brainstorm, kasih 3-5 ide konkret
- Kalau diminta bagi tugas, pertimbangkan skill masing-masing anggota
- Kalau diminta review, kasih feedback konstruktif
- Jangan terlalu formal, tapi tetap helpful
- Gunakan emoji secukupnya untuk friendly vibe
- Kalau ada deadline, ingatkan timeline

KEMAMPUAN:
- Brainstorm ide berdasarkan tema/kompetisi
- Suggest pembagian tugas berdasarkan skill anggota
- Review progress dan kasih feedback
- Bantu draft pitch/presentasi
- Motivasi tim kalau stuck`,
      messages,
      maxTokens: 800,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("BeeCoach error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

function buildTeamContext(team: {
  name: string;
  description: string | null;
  leader: { name: string | null; title: string | null; skills: string[] };
  members: Array<{
    user: { name: string | null; title: string | null; skills: string[] };
  }>;
}): string {
  const lines: string[] = [];
  lines.push(`Tim: ${team.name}`);
  if (team.description) lines.push(`Deskripsi: ${team.description}`);
  lines.push(`\nAnggota:`);
  lines.push(`- ${team.leader.name} (Leader, ${team.leader.title ?? "No role"}) — Skills: ${team.leader.skills.join(", ") || "belum diisi"}`);

  for (const member of team.members) {
    lines.push(`- ${member.user.name} (${member.user.title ?? "No role"}) — Skills: ${member.user.skills.join(", ") || "belum diisi"}`);
  }

  return lines.join("\n");
}
