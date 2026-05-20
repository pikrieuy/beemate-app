---
name: deploy-to-vercel
description: Deploy applications and websites to Vercel. Use when the user requests deployment actions like "deploy my app", "deploy and give me the link", "push this live", "redeploy", or troubleshooting Vercel deployment issues.
metadata:
  author: vercel
  version: "3.0.0"
---

# Deploy to Vercel

Deploy any project to Vercel. **Always deploy as preview** (not production) unless the user explicitly asks for production.

## BeeMate Deployment Status

**Status:** ✅ LIVE  
**Repo:** github.com/pikrieuy/beemate-app  
**Platform:** Vercel (auto-deploy dari `main` branch)  
**Database:** Supabase PostgreSQL `aws-1-ap-southeast-2`

## Redeploy (Normal Flow)

BeeMate sudah terhubung ke Vercel via GitHub. Untuk redeploy:

```bash
git add .
git commit -m "feat: <deskripsi perubahan>"
git push origin main
# Vercel otomatis build dan deploy dari push ke main
```

## Environment Variables yang Wajib Ada di Vercel

| Variable | Keterangan |
|----------|-----------|
| `DATABASE_URL` | Supabase pooler URL (port **6543**) |
| `DIRECT_URL` | Supabase direct URL (port 5432) |
| `AUTH_SECRET` | Random secret untuk NextAuth |
| `AUTH_URL` | URL production Vercel |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — jangan expose |
| `NEXT_PUBLIC_APP_URL` | URL production |

## Build Command

Vercel harus menjalankan `prisma generate` sebelum build:

```
prisma generate && next build
```

Atau pastikan ada di `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "next build"
  }
}
```

## Troubleshooting

| Error | Solusi |
|-------|--------|
| `redirect_uri_mismatch` | Tambah production URL di Google Console → Authorized Redirect URIs |
| `Cannot find module '.prisma/client'` | Pastikan build script: `prisma generate && next build` |
| Upload gagal 500 | Cek `SUPABASE_SERVICE_ROLE_KEY` di Vercel env vars |
| Gambar tidak tampil | Bucket harus **public**; cek `next.config.ts` remotePatterns |
| Database error | Pakai pooler URL (port 6543) untuk `DATABASE_URL` |
| Login error di production | Cek `AUTH_URL` = domain Vercel yang benar |
| `DIRECT_URL` error | Prisma 7: taruh di `prisma.config.ts`, bukan `schema.prisma` |

## Menjadi Admin

```sql
-- Jalankan di Supabase Dashboard → SQL Editor
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@gmail.com';
```

## Vercel CLI (Opsional)

```bash
# Install
npm install -g vercel

# Login
vercel login

# Deploy preview
vercel deploy

# Deploy production (hati-hati)
vercel deploy --prod

# Lihat deployment terbaru
vercel ls
```

## Source

Full skill: https://github.com/vercel-labs/agent-skills/tree/main/skills/deploy-to-vercel
