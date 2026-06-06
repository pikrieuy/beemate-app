import { NextResponse } from "next/server";
import { generateText } from "ai";
import { geminiFlash } from "@/lib/ai";

/**
 * GET /api/ai/test
 * Simple test endpoint to verify Gemini API connection.
 * Returns the AI response or detailed error.
 */
export async function GET() {
  const isVertexMode = !!process.env.K_SERVICE || process.env.USE_VERTEX_AI === "true";

  try {
    const { text } = await generateText({
      model: geminiFlash,
      prompt: "Say 'BeeMate AI is working!' in exactly those words.",
      maxOutputTokens: 1024,
    });

    return NextResponse.json({
      success: true,
      response: text,
      mode: isVertexMode ? "vertex-ai" : "ai-studio",
      project: process.env.GOOGLE_CLOUD_PROJECT ?? null,
      location: process.env.GOOGLE_CLOUD_LOCATION ?? null,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error",
      name: error.name,
      cause: error.cause?.message,
      mode: isVertexMode ? "vertex-ai" : "ai-studio",
    }, { status: 500 });
  }
}
