# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development & Build
- **Install dependencies:** `npm install`
- **Run development server:** `npm run dev` (runs with Turbopack)
- **Build project:** `npm run build` (runs `prisma generate` and Next.js build)
- **Lint code:** `npm run lint`

### Database
- **Generate Prisma client:** `npx prisma generate`
- **Seed database:** `npm run db:seed` (uses `tsx` via package.json to run `prisma/seed.ts`)
- **Clear database:** `node clear-db.mjs` (or `npx tsx clear-db.ts`)

### Testing
- **Run all E2E Tests (Playwright):** `npx playwright test`
- **Run a single E2E test:** `npx playwright test <path-to-test.spec.ts>`
- **Run local manual AI testing scripts:** `npx tsx test-ai-local.ts` or `npx tsx test-vertex.ts`

## High-Level Architecture

BeeMate is a hackathon team matchmaking platform built for a serverless Vercel deployment environment.

### Core Stack & Conventions
- **Next.js 16 (App Router) & React 19:** Server Components are used by default. Client components (`"use client"`) are strictly isolated to interactive islands. 
- **Data Mutations:** Handled strictly via Server Actions in the `src/actions/` directory. API routes are avoided except for AI streaming endpoints.
- **Styling (Tailwind v4):** Uses Tailwind CSS v4 and Vanilla CSS. Note that v4 has modernized configuration (relying on CSS `@theme` / `@import` rather than legacy `tailwind.config.js`).
- **Animation & UI:** Framer Motion 12 is used for UI animations. Zod is used for data validation. `uploadthing` is utilized for file uploads (avatars/banners) with magic byte validation.

### Database & Auth
- **Database (Supabase PostgreSQL 17):** Accessed exclusively via Prisma 7 ORM using the `@prisma/adapter-pg` driver. We do *not* use the Supabase client for standard database queries.
- **AI Vector Store:** Uses the `pgvector` extension in Prisma (`prisma/schema.prisma`) for storing and querying AI embeddings.
- **Authentication (NextAuth v5 Beta):** Google OAuth login implementation. Config is split across `src/auth.ts` and `src/auth.config.ts`. Note: NextAuth v5 has significantly different APIs than v4.
- **Realtime & Services:** Uses Supabase Realtime for instant in-app notifications and Resend for email notifications.

### AI Integration Pipeline
- **AI SDK:** Vercel AI SDK (`ai` and `@ai-sdk/google`) connects the application to Google AI.
- **Models:** Gemini 2.0 Flash (reasoning/chat) and `text-embedding-004` (embeddings).
- **AI Endpoints:** Streaming and real-time AI endpoints live in `src/app/api/ai/`.
  - `/match` - Embedding-based team matching
  - `/coach` - Context-aware streaming team assistant
  - `extractSkillsFromText()` - Auto-detects skills/roles from pasted bios

### Context & Deep Dives
When working on specific domains, always consult the detailed architectural conventions in `.kiro/skills/`:
- `.kiro/skills/beematch-conventions/SKILL.md` (Project specifics & strict tech stack rules)
- `.kiro/skills/react-best-practices/SKILL.md` (React 19 / Next.js 16 performance patterns)
- `.kiro/skills/supabase-postgres/SKILL.md` (DB optimization & Prisma rules)
- `.kiro/skills/deploy-to-vercel/SKILL.md` (Vercel deployment context)