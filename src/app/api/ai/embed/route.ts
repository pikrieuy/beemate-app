import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * POST /api/ai/embed
 * Placeholder — embedding generation is handled inline by the match route.
 * This endpoint exists for backward compatibility.
 */
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Embedding is now handled directly in the match flow
    // This endpoint is kept for compatibility but does nothing critical
    return NextResponse.json({ success: true, message: "Embedding handled by match route" });
  } catch (error) {
    console.error("Embed endpoint error:", error);
    return NextResponse.json({ success: true, message: "Skipped" });
  }
}
