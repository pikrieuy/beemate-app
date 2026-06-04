import { createVertex } from "@ai-sdk/google-vertex";

/**
 * Google Cloud Vertex AI client for BeeMate.
 */
export const vertex = createVertex({
  project: process.env.GOOGLE_CLOUD_PROJECT_ID ?? "",
  location: process.env.GOOGLE_CLOUD_LOCATION ?? "us-central1",
  // Google Application Credentials are automatically loaded from GOOGLE_APPLICATION_CREDENTIALS env var
});

// Models
export const geminiFlash = vertex("gemini-2.5-flash");
export const embeddingModel = vertex.textEmbeddingModel("text-embedding-004", {
  outputDimensionality: 768,
});
