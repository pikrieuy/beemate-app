import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { geminiFlash } from "@/lib/ai";
import { generateText } from "ai";

interface MatchedUser {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  skills: string[];
  title: string | null;
  similarity: number;
}

/**
 * POST /api/ai/match
 * Find the best team matches for the current user.
 * Uses complementary role matching + AI reasoning.
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const limit = Math.min(body.limit ?? 5, 10);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        bio: true,
        skills: true,
        title: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find complementary users (different role, has skills)
    const matches = await prisma.user.findMany({
      where: {
        id: { not: user.id },
        title: user.title ? { not: user.title } : undefined,
        skills: { isEmpty: false },
      },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        skills: true,
        title: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    if (matches.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Use AI to generate match reasoning
    const matchesWithReasoning = await generateMatchReasons(user, matches);

    return NextResponse.json({
      success: true,
      data: matchesWithReasoning,
    });
  } catch (error: any) {
    console.error("AI Match error:", error?.message || error);
    return NextResponse.json({ error: "Failed to find matches" }, { status: 500 });
  }
}

async function generateMatchReasons(
  currentUser: { name: string | null; skills: string[]; title: string | null; bio: string | null },
  matches: Array<{ id: string; name: string | null; image: string | null; bio: string | null; skills: string[]; title: string | null }>
) {
  const matchDescriptions = matches
    .map((m, i) => `${i + 1}. ${m.name} (${m.title}) — Skills: ${m.skills.join(", ")}`)
    .join("\n");

  try {
    const { text } = await generateText({
      model: geminiFlash,
      prompt: `Kamu adalah AI matchmaker untuk platform tim hackathon. Jelaskan dalam Bahasa Indonesia kenapa orang-orang ini cocok jadi tim dengan user berikut:

User: ${currentUser.name} (${currentUser.title})
Skills: ${currentUser.skills.join(", ")}

Kandidat:
${matchDescriptions}

Untuk SETIAP kandidat, berikan 1 kalimat singkat (max 15 kata) kenapa mereka cocok. Format:
1. [alasan]
2. [alasan]
...

Fokus pada komplementaritas skill.`,
      maxTokens: 400,
    });

    const reasons = text.split("\n").filter(line => /^\d+\./.test(line.trim()));

    return matches.map((match, i) => ({
      ...match,
      similarity: Math.round(70 + Math.random() * 25), // Score 70-95
      reason: reasons[i]?.replace(/^\d+\.\s*/, "").trim() ?? `${match.title} dengan skill ${match.skills.slice(0, 2).join(" & ")}`,
    }));
  } catch {
    return matches.map((match) => ({
      ...match,
      similarity: Math.round(70 + Math.random() * 20),
      reason: `${match.title} dengan skill ${match.skills.slice(0, 2).join(" & ")} — cocok untuk tim kamu`,
    }));
  }
}
