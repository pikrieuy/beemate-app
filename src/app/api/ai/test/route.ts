import { NextResponse } from "next/server";
import { generateText } from "ai";
import { geminiFlash } from "@/lib/ai";

/**
 * GET /api/ai/test
 * Simple test endpoint to verify Gemini API connection.
 * Returns the AI response or detailed error.
 */
export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: "GOOGLE_AI_API_KEY not set",
        hasKey: false 
      }, { status: 500 });
    }

    const { text } = await generateText({
      model: geminiFlash,
      prompt: "Say 'BeeMate AI is working!' in exactly those words.",
      maxTokens: 50,
    });

    return NextResponse.json({ 
      success: true, 
      response: text,
      keyPrefix: apiKey.substring(0, 10) + "...",
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Unknown error",
      name: error.name,
      cause: error.cause?.message,
    }, { status: 500 });
  }
}
