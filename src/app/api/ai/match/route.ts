import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { geminiFlash, embeddingModel } from "@/lib/ai";
import { embed, generateText } from "ai";

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
 * Find the best team matches for the current user using AI embeddings.
 * Returns top matches with AI-generated reasoning.
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

    // Generate embedding for current user's profile
    const profileText = buildProfileText(user);
    const { embedding } = await embed({
      model: embeddingModel,
      value: profileText,
    });

    const embeddingStr = `[${embedding.join(",")}]`;

    // Find similar users using pgvector cosine similarity
    // We look for COMPLEMENTARY matches (different roles, overlapping interests)
    const matches: MatchedUser[] = await prisma.$queryRawUnsafe(`
      SELECT 
        id, name, image, bio, skills, title,
        1 - (embedding <=> $1::vector) as similarity
      FROM "User"
      WHERE id != $2
        AND embedding IS NOT NULL
        AND title != $3
      ORDER BY embedding <=> $1::vector
      LIMIT $4
    `, embeddingStr, user.id, user.title ?? "", limit);

    // If not enough complementary matches, also get similar-role matches
    if (matches.length < limit) {
      const remaining = limit - matches.length;
      const existingIds = matches.map(m => m.id);
      
      const moreMatches: MatchedUser[] = await prisma.$queryRawUnsafe(`
        SELECT 
          id, name, image, bio, skills, title,
          1 - (embedding <=> $1::vector) as similarity
        FROM "User"
        WHERE id != $2
          AND embedding IS NOT NULL
          AND id != ALL($3::text[])
        ORDER BY embedding <=> $1::vector
        LIMIT $4
      `, embeddingStr, user.id, existingIds, remaining);

      matches.push(...moreMatches);
    }

    // Generate AI reasoning for top matches
    const matchesWithReasoning = await generateMatchReasons(user, matches);

    return NextResponse.json({
      success: true,
      data: matchesWithReasoning,
      userProfile: {
        title: user.title,
        skills: user.skills,
      },
    });
  } catch (error) {
    console.error("AI Match error:", error);
    return NextResponse.json({ error: "Failed to find matches" }, { status: 500 });
  }
}

async function generateMatchReasons(
  currentUser: { name: string | null; skills: string[]; title: string | null; bio: string | null },
  matches: MatchedUser[]
) {
  if (matches.length === 0) return [];

  const matchDescriptions = matches
    .map((m, i) => `${i + 1}. ${m.name} (${m.title}) — Skills: ${m.skills.join(", ")}${m.bio ? ` — Bio: ${m.bio}` : ""}`)
    .join("\n");

  try {
    const { text } = await generateText({
      model: geminiFlash,
      prompt: `Kamu adalah AI matchmaker untuk platform tim hackathon. Jelaskan dalam Bahasa Indonesia kenapa orang-orang ini cocok jadi tim dengan user berikut:

User: ${currentUser.name} (${currentUser.title})
Skills: ${currentUser.skills.join(", ")}
${currentUser.bio ? `Bio: ${currentUser.bio}` : ""}

Kandidat:
${matchDescriptions}

Untuk SETIAP kandidat, berikan 1 kalimat singkat (max 20 kata) kenapa mereka cocok. Format output:
1. [alasan]
2. [alasan]
...

Fokus pada KOMPLEMENTARITAS skill dan potensi kolaborasi. Jangan generic.`,
      maxTokens: 500,
    });

    // Parse reasons
    const reasons = text.split("\n").filter(line => /^\d+\./.test(line.trim()));

    return matches.map((match, i) => ({
      ...match,
      similarity: Math.round((match.similarity ?? 0) * 100),
      reason: reasons[i]?.replace(/^\d+\.\s*/, "").trim() ?? "Skill komplementer yang bagus untuk tim kamu",
    }));
  } catch {
    // Fallback if AI reasoning fails
    return matches.map((match) => ({
      ...match,
      similarity: Math.round((match.similarity ?? 0) * 100),
      reason: `${match.title} dengan skill ${match.skills.slice(0, 2).join(" & ")} — cocok untuk melengkapi tim kamu`,
    }));
  }
}

function buildProfileText(user: {
  name: string | null;
  bio: string | null;
  skills: string[];
  title: string | null;
}): string {
  const parts: string[] = [];
  if (user.title) parts.push(`Role: ${user.title}`);
  if (user.skills.length > 0) parts.push(`Skills: ${user.skills.join(", ")}`);
  if (user.bio) parts.push(`About: ${user.bio}`);
  if (user.name) parts.push(`Name: ${user.name}`);
  return parts.join(". ") || "No profile information available";
}
