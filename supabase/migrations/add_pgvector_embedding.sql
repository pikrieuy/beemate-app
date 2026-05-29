-- Enable pgvector extension for AI-powered team matching
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to User table (768 dimensions for Gemini text-embedding-004)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS embedding vector(768);

-- Create index for fast cosine similarity search
-- Using ivfflat for good balance of speed and accuracy
CREATE INDEX IF NOT EXISTS idx_user_embedding 
ON "User" USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 10);

-- Comment for documentation
COMMENT ON COLUMN "User".embedding IS 'AI-generated embedding from user profile (skills, bio, title) using Gemini text-embedding-004. Used for BeeMatch AI team matching.';
