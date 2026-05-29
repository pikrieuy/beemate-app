# 🐝 BeeMate — Find Your Hive

Platform matchmaking untuk **Hacker, Hustler, dan Hipster** — bentuk tim hackathon, ikuti kompetisi, dan temukan rekan kerja kampus dengan bantuan AI.

**Live:** [beemate-app.vercel.app](https://beemate-app.vercel.app)

---

## ✨ Highlights

- **AI-Powered Matching** — Gemini AI menemukan tim yang cocok berdasarkan skill komplementer
- **AI Skill Extractor** — Paste bio/CV → otomatis detect skills dan role
- **Team Chemistry Score** — Analisis seberapa balanced komposisi tim
- **Real-time Notifications** — Instant via Supabase Realtime
- **Email Notifications** — Team invite & accept via Resend
- **13+ Users, 7 Teams, 5 Competitions** — Live in production

---

## 🚀 Quick Start

```bash
cp .env.example .env   # isi semua env vars
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Vanilla CSS + Tailwind v4 |
| Database | PostgreSQL 17 (Supabase) + pgvector |
| ORM | Prisma 7 |
| Auth | NextAuth v5 (Google OAuth) |
| AI | Gemini 2.0 Flash + text-embedding-004 |
| AI SDK | Vercel AI SDK (`ai` + `@ai-sdk/google`) |
| Realtime | Supabase Realtime |
| Email | Resend |
| Storage | Supabase Storage |
| Validation | Zod |
| Analytics | Vercel Analytics |
| Deploy | Vercel |

## 🤖 AI Features

| Feature | Description | Endpoint |
|---------|-------------|----------|
| BeeMatch AI | Embedding-based team matching + AI reasoning | `/match`, `/api/ai/match` |
| BeeCoach AI | Streaming team assistant (context-aware) | `/api/ai/coach` |
| Skill Extractor | Paste text → auto-detect skills/role/bio | `extractSkillsFromText()` |
| Team Chemistry | Analyze team composition balance | `getTeamChemistry()` |
| Competition Recommender | AI rank competitions by user relevance | `getCompetitionRecommendations()` |
| Trending Skills | Most popular skills across platform | `getTrendingSkills()` |

## ✅ Core Features

- Google OAuth login
- User profiles (skills, bio, portfolio, role)
- People directory with role filter + cursor pagination
- AI-powered recommendations (complementary skills)
- Team creation, invite, accept/reject
- Team chat + task board + project showcase (schema ready)
- Competition listings with deadline countdown
- Onboarding wizard with AI Skill Extractor
- Dashboard with stats
- Admin panel
- File upload (avatar + banner, magic byte validation)
- Settings page (account, notifications, delete account)
- Dark mode
- Trending Skills on landing page

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── match/        # BeeMatch AI page
│   ├── onboarding/   # Onboarding wizard + AI
│   ├── api/ai/       # AI endpoints (embed, match, coach)
│   └── ...
├── components/       # React components (ui/, layout/)
├── actions/          # Server Actions (8 modules)
├── lib/              # Utilities (prisma, supabase, email, ai, validations)
└── auth.ts           # NextAuth v5 config
```

## 🔐 Environment Variables

See [`.env.example`](./.env.example) for all required variables.

Key vars:
- `DATABASE_URL` / `DIRECT_URL` — Supabase PostgreSQL
- `AUTH_SECRET` / `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — NextAuth
- `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — Supabase
- `GOOGLE_AI_API_KEY` — Gemini AI (BeeMatch, BeeCoach, Skill Extractor)
- `RESEND_API_KEY` / `RESEND_FROM_EMAIL` — Email notifications

## 📖 Documentation

- **[ROADMAP.md](./ROADMAP.md)** — Future planning & completed items
- **[CHECKLIST.md](./CHECKLIST.md)** — Development progress tracker
- **[BLUEPRINT.md](./BLUEPRINT.md)** — AI features technical architecture
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** — Deploy guide + troubleshooting

---

*BeeMate — Find Your Hive 🐝*
