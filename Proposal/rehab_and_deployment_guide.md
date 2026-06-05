# 🛠️ Panduan Perbaikan (Rehab) & Konfigurasi Deployment BeeMate

Dokumen ini mendiagnosis error yang terjadi pada deployment **Google Cloud Run** Anda (`https://beemate-568735138336.asia-southeast1.run.app/`), memberikan solusi konkret, serta menyusun checklist langkah perbaikan ke depannya.

---

## 1. Diagnosis & Analisis Masalah

### 🔴 Masalah 1: Vercel Web Analytics 404 & MIME Type Error di Cloud Run
**Gejala:**
- Browser mencoba mengambil `/_vercel/insights/script.js` tetapi menerima respon `404 Not Found` (berupa halaman HTML).
- Browser memunculkan error: *Refused to execute script... because its MIME type ('text/html') is not executable.*

**Penyebab:**
- Komponen `<Analytics />` dari `@vercel/analytics/next` diimpor di `src/app/layout.tsx`.
- Ketika dijalankan di Vercel, infrastruktur Vercel otomatis mencegat (*intercept*) request `/_vercel/insights/script.js` dan menyajikan script analytics.
- Namun, ketika dijalankan di **Google Cloud Run**, server tidak memiliki file/routing tersebut, sehingga Next.js mengembalikan halaman error 404 (HTML) yang membuat browser menolaknya karena menganggap itu file JS rusak.

**Solusi Konkret:**
Kita harus me-render komponen `<Analytics />` secara **kondisional** hanya jika aplikasi berjalan di platform Vercel. Kita bisa mendeteksinya menggunakan environment variable bawaan Vercel:
```tsx
// Di src/app/layout.tsx
{process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID && <Analytics />}
```
*Vercel otomatis mengisi `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` saat di-deploy di platform mereka. Di Cloud Run, variabel ini kosong, sehingga script tidak akan dimuat dan error 404 hilang.*

---

### 🔴 Masalah 2: AI Skill Extractor Gagal di Cloud Run
**Gejala:**
- Fitur ekstraksi skill menggunakan AI gagal memproses data masukan bio/teks.

**Penyebab Utama & Cara Mengatasinya:**

1.  **Environment Variable `GOOGLE_AI_API_KEY` Belum Di-set di Cloud Run:**
    *   File `src/lib/ai.ts` menginisialisasi Gemini menggunakan `process.env.GOOGLE_AI_API_KEY`.
    *   Jika Anda belum memasukkan variabel ini di konfigurasi environment variables Google Cloud Run service Anda, maka API key bernilai kosong (`""`) dan permintaan AI akan ditolak.
    *   **Solusi:** Masuk ke Google Cloud Console → Cloud Run → Pilih Service `beemate` → Edit & Deploy New Revision → Tambahkan env var `GOOGLE_AI_API_KEY` dengan API Key Gemini Anda.

2.  **Masalah `AUTH_URL` & Google OAuth Callback di Cloud Run:**
    *   NextAuth v5 membutuhkan environment variable `AUTH_URL` untuk mengetahui domain tempat ia berjalan demi keamanan *redirect*.
    *   Jika `AUTH_URL` di konfigurasi Cloud Run masih mengarah ke Vercel (`https://beemate-app.vercel.app`), maka session OAuth Google akan gagal didekripsi, membuat user dianggap "tidak terautentikasi" (`session.user` null).
    *   Karena kode `extractSkillsFromText` memverifikasi sesi di awal (`if (!session?.user?.email)`), fungsi tersebut langsung melempar error *"Not authenticated"*.
    *   **Solusi:** Set `AUTH_URL` di Cloud Run Anda secara spesifik ke domain Cloud Run: `https://beemate-568735138336.asia-southeast1.run.app`. Jangan lupa tambahkan URL redirect ini di Google Cloud Console API Credentials OAuth Anda.

3.  **Koneksi Database Supabase (PgBouncer/Direct):**
    *   Pastikan variabel `DATABASE_URL` (dengan port pooler `6543`) dan `DIRECT_URL` (port `5432`) sudah dimasukkan di Cloud Run. Jika koneksi database gagal, Server Action Next.js tidak bisa mengambil atau memverifikasi data user di DB.

---

## 2. Checklist Langkah Perbaikan (Roadmap Rehab)

Berikut adalah daftar pekerjaan terperinci yang harus kita selesaikan untuk menstabilkan deployment Cloud Run dan Vercel secara bersamaan:

### Tahap 1: Perbaikan Kode Sumber (Codebase)
- [ ] **Modifikasi layout utama ([layout.tsx](file:///c:/belajar%20luar%20kampus/Project%20CI/beemate-app/src/app/layout.tsx)):**
  Ubah bagian pemanggilan `<Analytics />` agar hanya aktif jika dideploy di Vercel:
  ```diff
  - <Analytics />
  + {process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID && <Analytics />}
  ```
- [ ] **Review Penanganan Error AI ([matchmaking.actions.ts](file:///c:/belajar%20luar%20kampus/Project%20CI/beemate-app/src/actions/matchmaking.actions.ts)):**
  Pastikan pesan error dari AI di-log ke console server agar jika terjadi kegagalan lagi di Cloud Run, kita bisa membaca log error pastinya lewat *Google Cloud Logging*.

### Tahap 2: Pengaturan Environment di Google Cloud Run Console
Masuk ke [Google Cloud Console](https://console.cloud.google.com/) dan pastikan daftar Environment Variables berikut telah terpasang dengan benar di konfigurasi Service Cloud Run Anda:

| Variable Name | Value yang Harus Diisi | Keterangan |
| :--- | :--- | :--- |
| `AUTH_SECRET` | *[Random Secret Key]* | Sama dengan yang ada di Vercel |
| `AUTH_URL` | `https://beemate-568735138336.asia-southeast1.run.app` | **Wajib diubah** ke domain Cloud Run Anda |
| `AUTH_GOOGLE_ID` | *[Google Client ID]* | Untuk login OAuth |
| `AUTH_GOOGLE_SECRET`| *[Google Client Secret]* | Untuk login OAuth |
| `DATABASE_URL` | *[Supabase Connection Pooler URL]* | Port 6543 |
| `DIRECT_URL` | *[Supabase Direct Connection URL]* | Port 5432 |
| `GOOGLE_AI_API_KEY` | *[Gemini API Key Anda]* | **Wajib ada** agar fitur AI (Skill Extractor) bekerja |
| `NEXT_PUBLIC_SUPABASE_URL` | *[Supabase Project URL]* | Untuk Supabase client / Storage |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *[Supabase Anon Key]* | Untuk Supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | *[Supabase Service Role Key]* | Untuk bypass RLS saat admin upload |
| `NEXT_PUBLIC_APP_URL` | `https://beemate-568735138336.asia-southeast1.run.app` | Domain utama aplikasi |

### Tahap 3: Update Google Cloud Console Credentials (OAuth)
- [ ] Masuk ke Google Cloud Console → APIs & Services → **Credentials**.
- [ ] Edit Kredensial OAuth 2.0 Client ID yang digunakan BeeMate.
- [ ] Tambahkan domain Cloud Run ke **Authorized JavaScript origins**:
  `https://beemate-568735138336.asia-southeast1.run.app`
- [ ] Tambahkan URI redirect ke **Authorized redirect URIs**:
  `https://beemate-568735138336.asia-southeast1.run.app/api/auth/callback/google`

---

## 3. Cara Mengecek Log dan Debugging di Google Cloud Run

Jika Anda lupa cara memantau error di Cloud Run, berikut panduannya:
1. Masuk ke **Google Cloud Console**.
2. Cari dan klik menu **Cloud Run** di bilah navigasi kiri.
3. Pilih nama service Anda (misal: `beemate`).
4. Klik tab **Logs** di bagian atas halaman detail service.
5. Anda akan melihat *real-time logs* dari Next.js. Jika ekstraksi skill gagal, error-nya akan tercetak di log tersebut (misal: *API Key Invalid* atau *Prisma Database Connection Timeout*).
