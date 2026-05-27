# 🗺️ BeeMate — Roadmap & Planning

**Last Updated:** 27 Mei 2026  
**Current Status:** Live in Production · 13+ users · 7 teams · 5 competitions

---

## 🎯 Vision

BeeMate menjadi platform #1 untuk mahasiswa Indonesia mencari tim lomba dan kolaborasi proyek — menggantikan grup WA yang tidak terstruktur.

---

## 📅 Short Term (1–2 Minggu)

### Security Hardening
- [x] Tambah security headers (X-Frame-Options, CSP, nosniff)
- [x] Fix image wildcard `*.supabase.co` → restrict ke project spesifik
- [x] Tambah magic byte validation di upload route
- [x] Pin next-auth version (hapus caret range)
- [x] Tambah `poweredByHeader: false` di next.config.ts

### Quick Wins
- [ ] Setup Resend (daftar, verify domain, isi API key di Vercel)
- [x] Hapus dead code: `PersonCard.tsx`, `api/uploadthing/`, `picsum.photos` pattern
- [x] Fix auth redirect di `competitions/[id]/page.tsx` (`/auth/signin` → `/api/auth/signin`)
- [ ] Tambah onboarding flow untuk user baru

### Growth
- [ ] Ajak 10 user pertama (teman sekelas)
- [ ] Post di grup kampus
- [ ] Hubungi dosen untuk mentoring/kolaborasi

---

## 📅 Medium Term (1 Bulan)

### Fitur Baru
- [ ] **Open Projects real** — user bisa posting proyek sendiri (ganti data palsu di `/explore`)
- [ ] **Team Chat** — messaging antar anggota tim (schema `Message` sudah ada)
- [ ] **Task Board** — bagi tugas dalam tim (schema `Task` sudah ada)
- [ ] **Project Showcase** — tim publish hasil proyek (schema `Project` sudah ada)
- [ ] **Skill Endorsement** — user endorse skill teman (schema `Endorsement` sudah ada)

### Infrastructure
- [ ] Rate limiting (Upstash Redis free tier)
- [ ] Error monitoring (Sentry free tier)
- [x] Input validation dengan Zod di semua server actions
- [x] Pagination di People page (cursor-based)

### UX
- [ ] Onboarding wizard (isi profil → pilih role → lihat rekomendasi)
- [ ] "Looking for Team" badge di profil
- [ ] Landing page stats auto-update (sudah dinamis, tinggal tunggu user)
- [ ] Mobile responsive audit

---

## 📅 Long Term (3–6 Bulan)

### Scale
- [ ] Kerjasama BEM/Himpunan — dapat ratusan user per event
- [ ] Featured Competition (monetisasi pertama — penyelenggara bayar)
- [ ] AI Recommendation — matching berbasis embedding skills
- [ ] PWA + push notifications
- [ ] Export kalender (Google Calendar integration)

### Monetisasi
- [ ] B2B: penyelenggara lomba bayar untuk featured listing
- [ ] Premium profile: badge verified, prioritas di search
- [ ] Partnership kampus: lisensi per universitas

### Technical
- [ ] Migrate next-auth ke stable release (saat keluar)
- [ ] Database sharding / read replicas (jika >10K users)
- [ ] CDN untuk uploaded images
- [ ] Automated testing (Playwright E2E)

---

## 📅 Dream (6–12 Bulan)

- [ ] Mobile app (React Native atau PWA serius)
- [ ] Multi-university support (bukan hanya BINUS)
- [ ] Real-time video call untuk team meetings
- [ ] Leaderboard & gamification
- [ ] Startup incubator integration

---

## 📊 Success Metrics

| Metric | Target 1 Bulan | Target 3 Bulan |
|--------|---------------|----------------|
| Registered users | 50 | 500 |
| Active teams | 15 | 100 |
| Competitions posted | 10 | 30 |
| Team invites sent | 30 | 200 |
| Email open rate | 40%+ | 40%+ |

---

## 🧰 Tech Debt (Backlog)

| Item | Priority | Notes |
|------|----------|-------|
| `/explore` page data palsu | Medium | Ganti dengan real Open Projects |
| `confirm()`/`alert()` di beberapa tempat | Low | Sudah fix di team & competition, cek sisanya |
| ~~`searchUsers("")` full table scan~~ | ~~Medium~~ | ✅ Sudah pakai cursor-based pagination |
| Notification preferences hanya localStorage | Low | Pindah ke DB kalau ada email system |
| Landing page testimonials hardcoded | Low | Bisa diganti dengan real testimonials nanti |

---

## 🔑 Key Decisions Made

1. **Prisma 7** — connection config di `prisma.config.ts`, bukan `schema.prisma`
2. **NextAuth v5 beta** — dipilih karena App Router support, monitor untuk stable release
3. **Supabase Storage** — dipilih over Uploadthing karena sudah pakai Supabase untuk DB
4. **RLS + Prisma service role** — RLS sebagai defense-in-depth, Prisma handle auth logic
5. **Realtime via Supabase** — bukan polling, untuk notifikasi instant
6. **Resend** — dipilih karena free tier generous (100 email/hari) dan API simpel
7. **Vanilla CSS** — dipilih over Tailwind utilities untuk kontrol penuh atas design system

---

*Last reviewed: 27 Mei 2026*
