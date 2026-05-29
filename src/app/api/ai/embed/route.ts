import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { embeddingModel } from "@/lib/ai";
import { embed } from "ai";

/**
 * POST /api/ai/embed
 * Generate embedding for the current user's profile and store it.
 * Called automatically when user updates their profile.
 */
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Build a rich text representation of the user's profile for embedding
    const profileText = buildProfileText(user);

    // Generate embedding using Gemini text-embedding-004
    const { embedding } = await embed({
      model: embeddingModel,
      value: profileText,
    });

    // Store embedding in database using raw SQL (pgvector)
    await prisma.$executeRawUnsafe(
      `UPDATE "User" SET embedding = $1::vector WHERE id = $2`,
      `[${embedding.join(",")}]`,
      user.id
    );

    return NextResponse.json({ success: true, dimensions: embedding.length });
  } catch (error) {
    console.error("Embedding generation error:", error);
    return NextResponse.json({ error: "Failed to generate embedding" }, { status: 500 });
  }
}

function buildProfileText(user: {
  name: string | null;
  bio: string | null;
  skills: string[];
  title: string | null;
}): string {
  const parts: string[] = [];

  if (user.title) {
    parts.push(`Role: ${user.title}`);
  }
  if (user.skills.length > 0) {
    parts.push(`Skills: ${user.skills.join(", ")}`);
  }
  if (user.bio) {
    parts.push(`About: ${user.bio}`);
  }
  if (user.name) {
    parts.push(`Name: ${user.name}`);
  }

  return parts.join(". ") || "No profile information available";
}
