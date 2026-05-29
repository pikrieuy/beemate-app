# 🗺️ BeeMate — Roadmap & Planning

**Last Updated:** 29 Mei 2026  
**Current Status:** Live in Production · 13+ users · 7 teams · 5 competitions · 6 AI Features Active

---

## 🎯 Vision

BeeMate menjadi platform #1 untuk mahasiswa Indonesia mencari tim lomba dan kolaborasi proyek — menggantikan grup WA yang tidak terstruktur.

---

## ✅ Completed (Short Term)

### Security Hardening ✅
- [x] Security headers (X-Frame-Options, CSP, nosniff, Referrer-Policy, Permissions-Policy)
- [x] Image restrict ke project-specific Supabase URL
- [x] Magic byte validation di upload route
- [x] Pin next-auth version (exact, no caret)
- [x] `poweredByHeader: false`
- [x] CSP includes unpkg.com for Phosphor icons

### Quick Wins ✅
- [x] Hapus dead code (PersonCard.tsx, api/uploadthing/, picsum.photos)
- [x] Fix auth redirect (`/auth/signin` → `/api/auth/signin`)
- [x] Setup Resend (API key di Vercel, email notifications aktif)
- [x] Onboarding flow dengan AI Skill Extractor

### AI Features ✅
- [x] **BeeMatch AI** — embedding-based team matching + AI reasoning (`/match`)
- [x] **BeeCoach AI** — streaming team assistant (`/api/ai/coach`)
- [x] **AI Skill Extractor** — paste bio → auto-detect skills/role/bio
- [x] **Team Chemistry Score** — analisis komposisi tim
- [x] **Competition Recommender** — AI rank kompetisi by relevance
- [x] **Trending Skills** — top skills di landing page

### Infrastructure ✅
- [x] Zod input validation di semua server actions
- [x] Cursor-based pagination di People page
- [x] pgvector extension + embedding column
- [x] Vercel AI SDK + Gemini integration

---

## 📅 Next Up (1–2 Minggu)

### Growth (Non-Code)
- [ ] Ajak 10 user pertama (teman sekelas)
- [ ] Post di grup kampus
- [ ] Hubungi dosen untuk mentoring/kolaborasi
- [ ] Deploy ke Google Cloud Run (untuk #JuaraVibeCoding)

### Fitur
- [ ] **Team Chat UI** — real-time messaging + BeeCoach integration
- [ ] **Task Board UI** — kanban drag-and-drop
- [ ] **Team Chemistry Score UI** — radar chart di team page
- [ ] **Competition Recommender UI** — section di dashboard
- [ ] "Looking for Team" badge di profil

---

## 📅 Medium Term (1 Bulan)

### Fitur
- [ ] **Open Projects real** — user posting proyek sendiri (ganti data palsu di `/explore`)
- [ ] **Project Showcase UI** — tim publish hasil proyek
- [ ] Rate limiting (Upstash Redis)
- [ ] Error monitoring (Sentry)
- [ ] Mobile responsive audit

---

## 📅 Long Term (3–6 Bulan)

- [ ] Kerjasama BEM/Himpunan
- [ ] Featured Competition (monetisasi)
- [ ] PWA + push notifications
- [ ] Export kalender (Google Calendar)
- [ ] Migrate next-auth ke stable release

---

## 📅 Dream (6–12 Bulan)

- [ ] Mobile app (React Native / PWA)
- [ ] Multi-university support
- [ ] Real-time video call
- [ ] Leaderboard & gamification
- [ ] Startup incubator integration

---

## 📊 Success Metrics

| Metric | Target 1 Bulan | Target 3 Bulan |
|--------|---------------|----------------|
| Registered users | 50 | 500 |
| Active teams | 15 | 100 |
| Competitions posted | 10 | 30 |
| AI matches made | 50 | 500 |
| Email open rate | 40%+ | 40%+ |

---

## 🔑 Key Decisions Made

1. **Prisma 7** — connection config di `prisma.config.ts`
2. **NextAuth v5 beta** — App Router support, pinned version
3. **Supabase Storage** — unified with DB provider
4. **RLS + Prisma service role** — defense-in-depth
5. **Supabase Realtime** — instant notifications
6. **Resend** — 100 email/hari free tier
7. **Gemini 2.0 Flash** — AI features (free 15 RPM, 1M tokens/day)
8. **Vercel AI SDK** — streaming, structured output, provider-agnostic
9. **pgvector** — embedding similarity search in Postgres

---

*Last reviewed: 29 Mei 2026*
