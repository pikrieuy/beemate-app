# BeeMate — Deployment Guide

**Status:** ✅ DEPLOYED & LIVE  
**Platform:** Vercel + Supabase + Google OAuth  
**Repo:** github.com/pikrieuy/beemate-app  
**URL:** beemate-app.vercel.app

---

## Current Infrastructure

| Komponen | Status | Detail |
|----------|--------|--------|
| Vercel Deploy | ✅ Live | Auto-deploy dari `main` branch |
| Supabase Database | ✅ Active | PostgreSQL 17 · `aws-1-ap-southeast-2` |
| Supabase Storage | ✅ Active | Bucket `beemate` (public) |
| Supabase Realtime | ✅ Active | Tabel `Notification` |
| RLS | ✅ Active | Semua 8 tabel + policies |
| Google OAuth | ✅ Working | localhost + production |
| Vercel Analytics | ✅ Active | Tracking page views |
| Email (Resend) | ⚠️ Optional | Perlu `RESEND_API_KEY` di Vercel env |

---

## Environment Variables (Vercel Dashboard)

| Variable | Keterangan |
|----------|-----------|
| `DATABASE_URL` | Supabase pooler URL (port **6543**) |
| `DIRECT_URL` | Supabase direct URL (port 5432) — untuk migrations |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` | `https://beemate-app.vercel.app` |
| `AUTH_GOOGLE_ID` | Google Console OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google Console OAuth client secret |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — jangan expose |
| `NEXT_PUBLIC_APP_URL` | `https://beemate-app.vercel.app` |
| `RESEND_API_KEY` | (Optional) Resend email API key |
| `RESEND_FROM_EMAIL` | (Optional) Verified sender email |

---

## Deploy / Redeploy

```bash
git add .
git commit -m "feat: ..."
git push origin main
# Vercel otomatis build & deploy
```

Build command: `prisma generate && next build`

---

## Menjadi Admin

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@gmail.com';
```

Jalankan di Supabase Dashboard → SQL Editor.

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `redirect_uri_mismatch` | Tambah production URL di Google Console → Authorized Redirect URIs |
| Upload gagal 500 | Cek `SUPABASE_SERVICE_ROLE_KEY` di Vercel env vars |
| `Cannot find module '.prisma/client'` | Build script harus: `prisma generate && next build` |
| Gambar tidak tampil | Bucket harus **public**; cek `next.config.ts` remotePatterns |
| Database error | Pakai pooler URL (port 6543) untuk `DATABASE_URL` |
| Login error production | Cek `AUTH_URL` = domain Vercel yang benar |
| Prisma schema error | Prisma 7: `url`/`directUrl` ada di `prisma.config.ts`, BUKAN di `schema.prisma` |
| Email tidak terkirim | Cek `RESEND_API_KEY` di Vercel env; domain harus verified di Resend |

---

## Database Info

- **12 performance indexes** aktif
- **RLS** aktif di semua tabel
- **Realtime** aktif untuk tabel Notification
- **Schema:** 14 models (User, Team, TeamMember, Competition, Notification, Endorsement, Message, Task, Project, ProjectComment, ProjectLike, Account, Session, VerificationToken)
