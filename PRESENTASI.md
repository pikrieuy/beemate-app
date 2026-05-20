# BeeMate — Presentasi Produk

> Platform matchmaking untuk mahasiswa yang ingin membentuk tim, ikut kompetisi, dan berkolaborasi dalam proyek.

---

## Apa itu BeeMate?

BeeMate adalah platform web yang mempertemukan tiga tipe mahasiswa:

- **Hacker** — Developer, engineer, programmer
- **Hustler** — Business, marketing, product
- **Hipster** — Designer, creative, UI/UX

Tujuannya sederhana: mahasiswa sering punya ide atau mau ikut lomba, tapi susah cari tim yang tepat. BeeMate menjadi jembatan itu.

---

## Fitur yang Sudah Jalan ✅

### 1. Autentikasi — Google OAuth
- Login satu klik dengan akun Google
- Session aman dengan JWT (NextAuth v5)
- Redirect otomatis ke halaman profil setelah login pertama

### 2. Profil Pengguna
- Upload foto profil (tersimpan di Supabase Storage)
- Isi bio, title (Hacker/Hustler/Hipster), skills, portfolio URL
- Foto langsung update di navbar tanpa reload
- Halaman profil publik — bisa dilihat orang lain

### 3. People Directory (`/people`)
- Lihat semua pengguna terdaftar
- Filter berdasarkan role: Hacker, Hustler, Hipster
- Search real-time by nama atau skill
- Kartu profil dengan avatar, role badge berwarna, skill chips
- Klik kartu → langsung ke profil lengkap

### 4. Team Management (`/teams`)
- Browse semua tim yang ada
- Sidebar filter: sort by terbaru/terlama/anggota/nama, filter ukuran tim
- Buat tim baru dengan nama dan deskripsi
- Halaman detail tim: info, daftar anggota, skill tiap anggota
- **Leader bisa:** undang anggota, hapus anggota, hapus tim
- **Member bisa:** keluar dari tim

### 5. Sistem Undangan Tim
- Leader cari user → kirim undangan
- User terima notifikasi → bisa Accept atau Reject
- Status undangan: Pending / Accepted / Rejected
- Badge notifikasi real-time di navbar (update tiap 30 detik)

### 6. Kompetisi & Open Projects (`/competitions`)
- **Tab Kompetisi:** lomba/hackathon yang diposting admin, filter upcoming/past
- **Tab Open Projects:** proyek mahasiswa yang cari anggota, filter by tipe
- Sidebar bergaya icon berwarna per kategori
- Search terintegrasi untuk kedua tab
- Admin bisa post kompetisi baru dengan banner image

### 7. Dashboard (`/dashboard`)
- Greeting personal berdasarkan waktu
- Stats card animasi: tim dibuat, tim diikuti, undangan masuk, kompetisi aktif
- Hero card dengan efek tilt 3D saat hover
- Section: Tim Kamu, Undangan Masuk, Kompetisi Mendatang
- Quick actions: Buat Tim, Cari Orang, Kompetisi

### 8. Notifikasi (`/notifications`)
- Semua notifikasi masuk (undangan tim, dll)
- Accept/Reject langsung dari halaman notifikasi
- Mark as read

### 9. Admin Panel (`/admin`)
- Dashboard admin: total user, tim, kompetisi
- Manajemen user: lihat semua user, ubah role (USER ↔ ADMIN)
- Manajemen kompetisi: edit/hapus semua kompetisi
- Hanya bisa diakses oleh user dengan role ADMIN

### 10. Settings (`/settings`)
- Akun & Profil
- Tampilan (dark/light mode toggle)
- Sign out

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript |
| UI | React 19 + Framer Motion |
| Styling | Tailwind CSS v4 + Vanilla CSS |
| Auth | NextAuth v5 (Google OAuth) |
| Database | PostgreSQL via Supabase |
| ORM | Prisma v7 |
| Storage | Supabase Storage |
| Deployment | Vercel |
| Icons | Phosphor Icons |
| Fonts | Sora + Plus Jakarta Sans |

---

## Database Schema (8 Tabel)

```
User          → profil, role, skills, bio
Account       → OAuth data (NextAuth)
Session       → session management
Team          → nama, deskripsi, leader
TeamMember    → relasi user-team, status undangan
Competition   → lomba, deadline, banner
Notification  → notifikasi antar user
VerificationToken → auth token
```

---

## Status Deployment

| Komponen | Status |
|----------|--------|
| Web App | ✅ Live di Vercel |
| Database | ✅ Supabase PostgreSQL |
| File Storage | ✅ Supabase Storage |
| Google OAuth | ✅ Production ready |
| Auto-deploy | ✅ Push ke GitHub → langsung deploy |

---

## Yang Belum Ada / Masih Dummy 🔜

### Data Dummy (belum connect ke database)
- **Open Projects** di tab Competitions — masih hardcoded, belum ada tabel `Project` di database
- **Settings page** — form nama/email masih hardcoded, belum baca dari session

### Fitur Belum Dibangun
- Halaman profil publik belum ada tombol "Invite to Team" yang fungsional
- Tidak ada sistem rating/review antar user
- Tidak ada fitur chat/messaging antar anggota tim
- Tidak ada email notification (hanya in-app)
- Mobile app belum ada

---

## Roadmap Pengembangan Selanjutnya

### Jangka Pendek (1–2 bulan)
1. **Connect Open Projects ke database** — buat tabel `Project`, user bisa post proyek dan cari anggota
2. **Fix Settings page** — baca nama/email dari session, bisa update langsung
3. **Invite to Team dari profil publik** — tombol invite langsung dari halaman profil orang lain
4. **Mobile responsive** — optimasi tampilan untuk layar kecil

### Jangka Menengah (3–6 bulan)
5. **Real-time notifications** — pakai Supabase Realtime, tidak perlu polling 30 detik
6. **Email notifications** — kirim email saat dapat undangan tim
7. **Team workspace** — halaman kolaborasi tim: task list, file sharing, progress tracking
8. **Skill endorsement** — anggota tim bisa endorse skill satu sama lain
9. **Advanced search** — filter people by kampus, semester, ketersediaan

### Jangka Panjang (6+ bulan)
10. **Recommendation system** — AI matching berdasarkan skill dan preferensi
11. **Competition registration** — daftar lomba langsung dari platform, bukan redirect ke link eksternal
12. **Portfolio showcase** — user bisa upload project portfolio dengan gambar
13. **Analytics dashboard** — statistik untuk organizer lomba
14. **Mobile app** — React Native untuk iOS dan Android

---

## Angka Saat Ini

- **28** Server Actions (fungsi backend)
- **8** Tabel database
- **15+** Halaman/route
- **100%** TypeScript
- **0** Downtime sejak deploy

---

## Demo Flow (untuk presentasi)

1. Buka `beemate-app.vercel.app`
2. Login dengan Google
3. Lengkapi profil → upload foto, isi skills
4. Browse People → filter by Hacker
5. Buat tim baru → undang anggota
6. Cek notifikasi → accept undangan
7. Buka Competitions → lihat lomba + open projects
8. Dashboard → lihat stats dan tim

---

*BeeMate — Find Your Hive 🐝*
