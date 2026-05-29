import { createGoogleGenerativeAI } from "@ai-sdk/google";

/**
 * Google Gemini AI client for BeeMate.
 * Uses Gemini 2.0 Flash for fast, cost-effective AI features.
 */
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY ?? "",
});

// Models
export const geminiFlash = google("gemini-2.0-flash");
export const embeddingModel = google.textEmbeddingModel("gemini-embedding-001");
