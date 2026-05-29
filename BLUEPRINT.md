# 🏗️ BeeMate — Killer Features Blueprint

**Generated:** 29 Mei 2026  
**Status:** Ready for Implementation

---

## 1. The "Killer" Features

### 🧠 Feature #1: AI Team Matchmaker (BeeMatch AI)

**Business Value:** Menyelesaikan pain point #1 di hackathon platforms — "Saya punya skill tapi nggak tau siapa yang cocok jadi tim saya." Kompetitor (Devpost, HackerEarth) hanya punya filter manual. BeeMate akan jadi platform pertama yang pakai AI embedding-based matching untuk mahasiswa Indonesia.

**How it works (High-Level):**
1. User klik "Find My Dream Team" 
2. AI menganalisis profil user (skills, role, bio, endorsements)
3. Menggunakan **Gemini API** untuk generate embedding dari skill+bio
4. Cosine similarity matching terhadap semua user lain
5. AI generate penjelasan MENGAPA orang ini cocok (bukan cuma "similar skills")
6. Output: Top 5 rekomendasi dengan "compatibility score" + reasoning

**Differentiator vs kompetitor:**
- Bukan sekadar filter role (Hacker/Hustler/Hipster)
- AI menjelaskan chemistry: "Kamu butuh designer yang paham UX research — Andi punya skill Figma + user testing"
- Mempertimbangkan complementary skills, bukan similar skills

---

### 💬 Feature #2: AI Team Coach (BeeCoach)

**Business Value:** Setelah tim terbentuk, 60% tim hackathon gagal karena koordinasi buruk. BeeCoach adalah AI assistant yang embedded di team chat — membantu brainstorm, bagi tugas, dan kasih feedback.

**How it works (High-Level):**
1. Di team chat, user bisa mention @BeeCoach
2. BeeCoach bisa:
   - Brainstorm ide berdasarkan tema kompetisi
   - Suggest pembagian tugas berdasarkan skill anggota
   - Review progress dan kasih motivasi
   - Generate pitch deck outline
3. Menggunakan **Gemini 2.0 Flash** (fast, cheap, good enough)
4. Context-aware: tau siapa anggota tim, skill mereka, deadline kompetisi

**Differentiator:**
- Bukan chatbot generic — tau konteks tim kamu
- Actionable: bisa langsung bikin Task di board dari suggestion-nya
- Gratis (Gemini API free tier: 15 RPM, 1M tokens/day)

---

## 2. Technical Blueprint & Architecture

### Tech Stack & Libraries

| Layer | Technology | Purpose |
|-------|-----------|---------|
| AI Provider | Google Gemini 2.0 Flash | Text generation + embeddings |
| AI SDK | `@ai-sdk/google` + `ai` (Vercel AI SDK) | Streaming responses, structured output |
| Embedding | Gemini `text-embedding-004` | Skill/bio vectorization |
| Vector Storage | Supabase `pgvector` extension | Store & query embeddings |
| Streaming UI | Vercel AI SDK `useChat` hook | Real-time AI responses |

**New Dependencies:**
```
ai@4.3.16              — Vercel AI SDK core
@ai-sdk/google@1.2.7   — Gemini provider
```

### AI Models

| Model | Use Case | Latency | Cost |
|-------|----------|---------|------|
| `gemini-2.0-flash` | BeeCoach chat, reasoning | ~500ms | Free (15 RPM) |
| `text-embedding-004` | Skill/profile embeddings | ~200ms | Free (1500 RPM) |

### System Flow

```
┌─────────────────────────────────────────────────────┐
│                    BeeMatch AI                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  User Profile ──→ Generate Embedding ──→ pgvector   │
│                        (Gemini)           (Supabase) │
│                                                      │
│  "Find Team" ──→ Query similar vectors ──→ Top 5    │
│                  + Gemini explain WHY     matches    │
│                                                      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                    BeeCoach AI                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Team Chat ──→ @BeeCoach message ──→ Gemini Flash   │
│                                         │            │
│  Context: team members, skills,         ▼            │
│           competition deadline    AI Response        │
│                                  (streaming)         │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Database Changes

```sql
-- Enable pgvector extension (Supabase sudah support)
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to User table
ALTER TABLE "User" ADD COLUMN "embedding" vector(768);

-- Create index for fast similarity search
CREATE INDEX idx_user_embedding ON "User" 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);
```

### API Routes

```
POST /api/ai/match      — Generate matches for current user
POST /api/ai/embed      — Generate/update user embedding
POST /api/ai/coach      — BeeCoach streaming chat endpoint
```

---

## 3. Execution Roadmap

### Phase 1: Setup & AI Integration (2-3 jam)
- [x] Install `ai` + `@ai-sdk/google`
- [ ] Setup Gemini API key (env var)
- [ ] Create `/src/lib/ai.ts` — AI client config
- [ ] Create `/api/ai/embed` — embedding generation
- [ ] Add pgvector extension + embedding column
- [ ] Auto-generate embeddings on profile update

### Phase 2: BeeMatch AI (2-3 jam)
- [ ] Create `/api/ai/match` — similarity search + reasoning
- [ ] Create `/src/app/match/` — AI matching page
- [ ] UI: "Find My Dream Team" button + results cards
- [ ] Show compatibility score + AI reasoning per match
- [ ] "Invite to Team" CTA on each match card

### Phase 3: BeeCoach AI (2-3 jam)
- [ ] Create `/api/ai/coach` — streaming chat endpoint
- [ ] Integrate into team chat UI
- [ ] System prompt with team context (members, skills, competition)
- [ ] Action buttons: "Create Task from suggestion"
- [ ] Rate limiting (max 20 messages/hour per team)

---

*Total estimated time: 6-9 jam untuk single developer*
*Feasibility: HIGH — semua pakai free tier, no infrastructure cost*
