# BeeMate — Deployment Guide (Phase 13)

Panduan deploy BeeMate ke **Vercel** + **Supabase** (database + file storage) + **Google OAuth**.

---

## Prerequisites

- Akun [Vercel](https://vercel.com)
- Akun [Supabase](https://supabase.com) — database **dan** storage
- Google Cloud OAuth credentials

---

## 1. Database (Supabase)

1. Buat project Supabase (atau pakai yang sudah ada).
2. Salin **Connection string** (Transaction pooler → `DATABASE_URL`).
3. Salin **Direct connection** → `DIRECT_URL` (untuk migrasi lokal).
4. Jalankan schema:

```bash
cp .env.example .env
# isi DATABASE_URL dan DIRECT_URL

npx prisma db push
npm run db:seed   # optional: dummy data
```

---

## 2. Supabase Storage (upload gambar)

Semua upload (avatar profil, banner kompetisi) disimpan di **Supabase Storage**, bukan layanan terpisah.

### 2.1 Buat bucket

**Opsi A — SQL (disarankan)**

1. Buka Supabase Dashboard → **SQL Editor**
2. Jalankan isi file [`supabase/storage-setup.sql`](./supabase/storage-setup.sql)

**Opsi B — UI**

1. Dashboard → **Storage** → **New bucket**
2. Name: `beemate`
3. Centang **Public bucket**
4. Create

### 2.2 Ambil API keys

Dashboard → **Project Settings** → **API**:

| Key | Env variable | Catatan |
|-----|--------------|---------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | Boleh di client |
| `anon` `public` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Boleh di client |
| `service_role` `secret` | `SUPABASE_SERVICE_ROLE_KEY` | **Hanya server** — jangan expose ke browser |

### 2.3 Tambahkan ke `.env`

```env
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

---

## 3. Google OAuth (Production)

1. Buka [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
2. OAuth Client type: **Web application**
3. **Authorized redirect URIs**:
   - `https://YOUR-DOMAIN.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google`
4. Salin Client ID & Secret ke env.

---

## 4. Environment Variables (Vercel)

| Variable | Contoh / Catatan |
|----------|------------------|
| `DATABASE_URL` | Supabase pooler URL |
| `DIRECT_URL` | Supabase direct URL (opsional di Vercel) |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` | `https://your-app.vercel.app` |
| `AUTH_GOOGLE_ID` | Google Console |
| `AUTH_GOOGLE_SECRET` | Google Console |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (secret) |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |

Copy template dari [`.env.example`](./.env.example).

---

## 5. Deploy ke Vercel

### Opsi A: GitHub (disarankan)

1. Push repo ke GitHub.
2. Import project di Vercel.
3. Tambahkan semua env variables (langkah 4).
4. Deploy.

### Opsi B: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 6. Post-Deployment Checklist

- [x] Login Google OAuth ✅ (localhost ready, production URI perlu ditambah saat deploy)
- [x] Upload foto profil (Supabase Storage) ✅
- [x] Gambar tampil (URL `*.supabase.co/storage/...`) ✅
- [ ] Buat tim & undang anggota
- [ ] Admin: buat kompetisi + upload banner

---

## 7. Menjadi Admin

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@gmail.com';
```

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| OAuth redirect mismatch | URI di Google Console harus sama persis |
| Upload gagal "Bucket not found" | Jalankan `storage-setup.sql` atau buat bucket `beemate` |
| Upload gagal "Unauthorized" | User harus login; cek `SUPABASE_SERVICE_ROLE_KEY` |
| Gambar tidak tampil | Bucket harus **public**; cek URL di browser |
| Database error | Pakai pooler URL untuk `DATABASE_URL` |

---

**Stack:** Vercel + Supabase (DB + Storage) + Google OAuth
