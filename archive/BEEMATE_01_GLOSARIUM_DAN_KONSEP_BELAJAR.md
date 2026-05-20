# BeeMate Learning Guide 01: Glosarium dan Konsep Dasar

Dokumen ini dibuat untuk kamu yang ingin paham BeeMate dari nol sampai level mantap.  
Gaya penjelasan dibuat campuran: sederhana dulu, lalu masuk teknis secukupnya.

---

## 1) Cara pakai dokumen ini

Urutan belajar yang disarankan:

1. Baca glosarium sampai paham istilah dasar.
2. Baca konsep arsitektur dan alur request.
3. Lanjut ke dokumen 02 (bedah file-by-file).
4. Buka editor sambil baca agar cepat nyambung.

Target pemahaman realistis:
- 90%: paham struktur, alur data, dan fungsi tiap folder.
- 100%: butuh praktik ubah kode kecil dan debug sendiri.

---

## 2) Glosarium (versi awam + teknis ringan)

- `Next.js`: framework React untuk bikin web app fullstack (frontend + backend route sederhana).
- `App Router`: cara Next.js modern mengatur halaman lewat folder `src/app`.
- `Route`: alamat URL, contoh `/profile`, `/explore`.
- `Page`: file `page.tsx` yang me-render satu halaman route.
- `Layout`: kerangka umum halaman (header, style global, provider).
- `Client Component`: komponen yang jalan di browser (`"use client"`).
- `Server Component`: komponen default Next.js yang bisa jalan di server.
- `API Route`: endpoint backend di dalam project Next.js, contoh auth route.
- `NextAuth`: library autentikasi (login/logout/session).
- `Session`: data user yang sedang login.
- `Provider`: pembungkus context global (misal auth session provider).
- `Prisma`: ORM untuk akses database dengan model terstruktur.
- `Schema Prisma`: blueprint tabel dan relasi database.
- `Middleware/Proxy`: penjaga request sebelum masuk halaman tertentu.
- `Lint`: pemeriksa kualitas kode (gaya, potensi bug, best practice).
- `Build`: proses menyiapkan app jadi versi production.
- `TypeScript`: JavaScript dengan tipe data agar error ketahuan lebih awal.
- `Tailwind`: utility CSS framework.
- `Framer Motion`: library animasi React.
- `Generated file`: file hasil mesin/tool (bukan ditulis manual), contoh cache build.
- `Source of truth`: file utama yang jadi referensi kebenaran konfigurasi/logic.

---

## 2.1) Glosarium versi "kebayang" (analogi sehari-hari)

Kalau masih terasa abstrak, pakai analogi ini:

- `Next.js` = **mal perbelanjaan**
  - Sudah ada kerangka gedung, eskalator, aturan toko.
  - Kamu fokus isi toko (fitur), bukan bangun gedung dari nol.

- `Route` = **alamat toko di mal**
  - `/profile` seperti "Lantai 2, Toko Profil".
  - User masuk alamat, langsung diarahkan ke halaman itu.

- `page.tsx` = **isi toko**
  - Menentukan apa yang dilihat pengunjung di alamat tersebut.

- `layout.tsx` = **fasilitas umum mal**
  - Header/nav/footer/global style itu seperti AC, lift, petunjuk arah yang dipakai semua toko.

- `Component` = **lego/blok bangunan**
  - Tombol, kartu, navbar bisa dirakit ulang di banyak halaman.

- `Client Component` = **petugas di depan pengunjung**
  - Langsung merespons klik, ketik, animasi di browser user.

- `Server Component` = **tim dapur belakang**
  - Menyiapkan data/HTML di server sebelum dikirim ke user.

- `API Route` = **loket layanan internal**
  - Tempat halaman "minta bantuan data/proses".

- `NextAuth` = **satpam + meja login**
  - Ngurus siapa yang boleh masuk, login/logout, cek identitas user.

- `Session` = **kartu pengunjung**
  - Selama kartu masih aktif, sistem tahu kamu sudah login.

- `Prisma` = **admin gudang + formulir stok**
  - Cara rapi ngobrol ke database tanpa tulis SQL mentah tiap saat.

- `schema.prisma` = **blueprint gudang**
  - Menentukan rak data: kolom apa, relasi apa, aturan apa.

- `Middleware/Proxy` = **pos pemeriksaan sebelum masuk area**
  - Bisa cek: "sudah login belum?" sebelum lanjut ke halaman tertentu.

- `Lint` = **QC (quality control) kode**
  - Bukan cek "fitur jalan atau tidak", tapi cek "cara nulis kodenya sehat atau berisiko".

- `Build` = **proses packing sebelum kirim**
  - Mengubah kode jadi paket siap produksi.

- `TypeScript` = **label ukuran di pabrik**
  - Mencegah salah pasang komponen sejak awal (tipe data salah).

- `Generated file` = **struk/cetakan mesin**
  - Dibuat otomatis oleh tool, biasanya tidak perlu diedit manual.

Inti gampangnya:
- `src/` = hasil kerja tangan developer.
- `.next/`, `node_modules/`, `cache/` = hasil kerja mesin/tool.

---

## 3) Konsep inti BeeMate (gambaran besar)

BeeMate ini bisa dipahami sebagai 5 lapisan:

1. **UI Layer**  
   Komponen visual, halaman, interaksi user.
2. **Routing Layer**  
   Mapping URL ke halaman di `src/app`.
3. **Auth Layer**  
   Login Google, session user, proteksi akses.
4. **Data Layer**  
   Prisma + database + helper data.
5. **Tooling Layer**  
   Lint, build, TypeScript, config project.

Kalau analogi rumah:
- `src/app` = denah ruangan,
- `src/components` = furnitur modular,
- `src/auth*` dan `route.ts` = sistem kunci pintu,
- `prisma` = gudang data,
- config files = aturan bangunan.

---

## 4) Alur request sederhana (dari klik sampai tampil)

Contoh user buka `/profile`:

1. Browser meminta route `/profile`.
2. Next.js membaca `src/app/profile/page.tsx`.
3. Layout global dari `src/app/layout.tsx` ikut dipasang.
4. Komponen seperti `Navbar` ikut render.
5. Jika butuh data session, `NextAuth` provider menyuplai state user.
6. Halaman tampil, interaksi terjadi di client component.

Untuk login:

1. User klik tombol login.
2. `NextAuth` arahkan ke Google OAuth.
3. Setelah sukses, callback ke app.
4. Session disimpan dan bisa diakses komponen.

---

## 5) Konsep folder yang paling penting

- `src/app`: route dan halaman.
- `src/components`: potongan UI reusable.
- `src/lib`: helper, utilitas, koneksi prisma, mock/seed data.
- `prisma`: skema database.
- `public`: file statis (logo, svg, icon).
- `graphify-out`: hasil analisis graphify (dokumen, graph, cache AST).
- `.next`: hasil build/dev cache Next.js (generated).
- `node_modules`: semua package dependency (generated eksternal).

---

## 6) Konsep "semua file" termasuk generated

Kamu memilih scope paling lengkap (termasuk generated/cache). Ini tepat untuk belajar mendalam, tapi penting bedakan:

- **File belajar utama (harus dipahami satu-satu):**
  - semua file source, config, prisma, docs utama.
- **File generated (cukup paham pola/fungsi):**
  - `.next/**` (hasil build),
  - `node_modules/**` (library pihak ketiga),
  - `graphify-out/cache/**` (cache AST dengan nama hash).

Kenapa tidak perlu hafal isi tiap file generated?
- Karena isinya sangat banyak, berubah otomatis, dan bukan logic inti produk kamu.
- Yang wajib dipahami adalah: "siapa pembuatnya", "kapan dibuat", "kapan boleh dihapus", "kapan jangan di-commit".

---

## 7) Pola berpikir saat membaca file

Gunakan 4 pertanyaan ini di tiap file:

1. File ini mengatur apa? (UI, data, auth, config, docs, generated)
2. File ini dipakai oleh siapa?
3. Kalau file ini rusak, fitur mana yang terdampak?
4. File ini biasanya diubah manual atau otomatis?

Jika kamu konsisten pakai 4 pertanyaan ini, pemahaman naik sangat cepat.

---

## 8) Checklist belajar sampai paham 90%-100%

- [ ] Bisa jelaskan alur route dari `src/app`.
- [ ] Bisa bedakan client component vs server component.
- [ ] Bisa jelaskan alur login dari tombol sampai session.
- [ ] Bisa baca schema prisma dan tahu relasi data inti.
- [ ] Bisa jalankan `lint` dan `build` tanpa error.
- [ ] Bisa jelaskan mana file source dan mana generated.
- [ ] Bisa ubah 1 fitur kecil, lalu commit dan push dengan percaya diri.

---

## 9) Next step

Lanjut baca dokumen kedua:  
`BEEMATE_02_BEDAH_SEMUA_FILE_PROGRESS_MEI_2026.md`

Dokumen kedua berisi bedah file-by-file yang ada sampai progress saat ini.

