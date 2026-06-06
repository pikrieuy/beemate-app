import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createVertex } from "@ai-sdk/google-vertex";

const project = process.env.GOOGLE_CLOUD_PROJECT || "beemate-app";
const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";

// 1. Fallback / Local Provider: Google AI Studio
const aiStudioGoogle = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY ?? "",
});

// 2. Production Provider: Google Vertex AI (bills to GCP Credits)
const vertex = createVertex({
  project,
  location,
});

// K_SERVICE is set automatically by Cloud Run environment
const isCloudRun = !!process.env.K_SERVICE;
export const useVertex = isCloudRun || process.env.USE_VERTEX_AI === "true";

// Language model — gemini-2.5-flash
export const geminiFlash = useVertex
  ? vertex("gemini-2.5-flash")
  : aiStudioGoogle("gemini-2.5-flash");

// Embedding model
export const embeddingModel = useVertex
  ? vertex.textEmbeddingModel("text-embedding-004")
  : aiStudioGoogle.textEmbeddingModel("text-embedding-004");
