# BeeMate — Deployment Guide

**Status:** ✅ DEPLOYED  
**Platform:** Vercel + Supabase + Google OAuth  
**Repo:** github.com/pikrieuy/beemate-app

---

## Status Deployment

| Komponen | Status | Catatan |
|----------|--------|---------|
| Vercel Deploy | ✅ Live | Auto-deploy dari `main` branch |
| Supabase Database | ✅ Active | PostgreSQL di `aws-1-ap-southeast-2` |
| Supabase Storage | ✅ Active | Bucket `beemate` — avatars & banners |
| Google OAuth localhost | ✅ Working | `http://localhost:3000` |
| Google OAuth production | ✅ Working | URI production sudah ditambahkan |

---

## Setup Awal (sudah selesai)

### 1. Database (Supabase)
```bash
cp .env.example .env
# isi DATABASE_URL dan DIRECT_URL
npx prisma db push
npm run db:seed   # optional
```

### 2. Supabase Storage
1. Supabase Dashboard → **SQL Editor**
2. Jalankan [`supabase/storage-setup.sql`](./supabase/storage-setup.sql)
3. Isi env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### 3. Google OAuth
- Google Cloud Console → Credentials → OAuth Client
- Authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://YOUR-DOMAIN.vercel.app/api/auth/callback/google`

### 4. Environment Variables (Vercel)

| Variable | Catatan |
|----------|---------|
| `DATABASE_URL` | Supabase pooler URL |
| `DIRECT_URL` | Supabase direct URL |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` | `https://your-app.vercel.app` |
| `AUTH_GOOGLE_ID` | Google Console |
| `AUTH_GOOGLE_SECRET` | Google Console |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — jangan expose |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |

### 5. Deploy
```bash
git push origin main
# Vercel auto-deploy dari GitHub
```

---

## Redeploy / Update

```bash
git add .
git commit -m "feat: ..."
git push
# Vercel otomatis redeploy
```

---

## Menjadi Admin

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@gmail.com';
```

Jalankan di Supabase Dashboard → **SQL Editor**.

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `redirect_uri_mismatch` | Tambah URI production di Google Console |
| Upload gagal 500 | Cek `SUPABASE_SERVICE_ROLE_KEY` di Vercel env vars |
| `Cannot find module '.prisma/client'` | Pastikan build script: `prisma generate && next build` |
| Gambar tidak tampil | Bucket harus **public**; cek `next.config.ts` remotePatterns |
| Database error | Pakai pooler URL untuk `DATABASE_URL` |
| Login error di production | Cek `AUTH_URL` = domain Vercel yang benar |

---

## Post-Deployment Checklist

- [x] Login Google OAuth ✅
- [x] Upload foto profil (Supabase Storage) ✅
- [x] Gambar tampil dengan URL `*.supabase.co/storage/...` ✅
- [ ] Buat tim & undang anggota (test di production)
- [ ] Admin: buat kompetisi + upload banner (test di production)
- [ ] Test mobile viewport

---

**Stack:** Next.js 16 + Vercel + Supabase (DB + Storage) + Google OAuth + Prisma + NextAuth v5
