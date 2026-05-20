# BeeMate Learning Guide 02: Bedah Semua File (Progress Mei 2026)

Dokumen ini melanjutkan Guide 01.  
Tujuan: kamu paham fungsi semua file yang ada di repo pada progress saat ini.

Catatan penting:
- File source/config dibahas individual.
- File generated massal (cache/hash) dibahas per pola agar tetap efektif dipelajari.

---

## A. Root files (inti project)

- `.gitignore`  
  Aturan file/folder yang tidak ikut git. Penting agar cache/build/secrets tidak ter-push.

- `AGENTS.md`  
  Rule kerja agent/AI di workspace ini.

- `CLAUDE.md`  
  Pointer ke rule lain (`@AGENTS.md`), jadi entry kecil untuk instruksi AI.

- `README.md`  
  Dokumen pengantar project (cara jalanin, konteks umum).

- `BEEMATE_MASTER_PLAN.md`  
  Dokumen roadmap/arah besar produk BeeMate.

- `package.json`  
  Pusat script dan dependency project (`dev`, `build`, `lint`).

- `package-lock.json`  
  Kunci versi dependency agar install konsisten.

- `tsconfig.json`  
  Konfigurasi TypeScript (path alias, strictness, include/exclude).

- `next.config.ts`  
  Konfigurasi framework Next.js.

- `next-env.d.ts`  
  File generated untuk dukungan typing Next.js.

- `eslint.config.mjs`  
  Aturan linting quality code.

- `postcss.config.mjs`  
  Konfigurasi PostCSS (terkait styling pipeline).

- `prisma.config.ts`  
  Konfigurasi Prisma CLI/runtime tertentu.

- `.env`  
  Variabel rahasia: URL DB, secret auth, OAuth key (jangan di-commit).

---

## B. Folder `.agents` (AI workflow internal repo)

- `.agents/rules/graphify.md`  
  Rule khusus proses graphify.

- `.agents/workflows/graphify.md`  
  Alur workflow graphify.

Ini bukan runtime user app, tapi tooling/operational docs untuk agent workflow.

---

## C. Folder `prisma` (data schema)

- `prisma/schema.prisma`  
  Blueprint model database: tabel, relasi, enum, dan generator datasource.

Ini source of truth data model.  
Kalau schema berubah, biasanya diikuti migration/generate.

---

## D. Folder `public` (aset statis)

- `public/logo.png` dan `public/logo-dark.png`  
  Aset brand utama.

- `public/next.svg`, `public/vercel.svg`, `public/globe.svg`, `public/window.svg`, `public/file.svg`  
  Aset svg statis.

Semua file di `public` bisa diakses langsung via URL root.

---

## E. Folder `src/app` (routing + halaman)

- `src/app/layout.tsx`  
  Kerangka global app (layout, provider, metadata dasar).

- `src/app/globals.css`  
  Style global seluruh aplikasi.

- `src/app/favicon.ico`  
  Icon tab browser.

- `src/app/page.tsx`  
  Halaman root `/`.

- `src/app/explore/page.tsx`  
  Halaman `/explore`.

- `src/app/people/page.tsx`  
  Halaman `/people`.

- `src/app/competitions/page.tsx`  
  Halaman `/competitions`.

- `src/app/myteams/page.tsx`  
  Halaman `/myteams`.

- `src/app/notifications/page.tsx`  
  Halaman `/notifications`.

- `src/app/profile/page.tsx`  
  Halaman `/profile`.

- `src/app/settings/page.tsx`  
  Halaman `/settings`.

- `src/app/api/auth/[...nextauth]/route.ts`  
  Endpoint auth NextAuth (callback, session flow, provider hooks).

Konsep utama folder ini:
- Setiap subfolder dengan `page.tsx` = route.
- API route coexist di bawah `app/api`.

---

## F. Folder `src/components` (UI modular)

### F1. Auth components
- `src/components/auth/login-button.tsx`  
  Tombol login reusable (hub ke flow auth).

### F2. Cards components
- `src/components/cards/PersonCard.tsx`  
  Komponen kartu profil/orang.
- `src/components/cards/ProjectCard.tsx`  
  Komponen kartu project.

### F3. Layout components
- `src/components/layout/Navbar.tsx`  
  Navigasi atas, theme toggle, avatar, menu mobile, akses auth UI.
- `src/components/layout/BottomNav.tsx`  
  Navigasi bawah (kemungkinan untuk mobile layout).
- `src/components/layout/providers.tsx`  
  Penyedia context global di sisi client (mis. SessionProvider).

### F4. UI components
- `src/components/ui/PostModal.tsx`  
  Modal untuk membuat post.
- `src/components/ui/ExpandingSearchDock.tsx`  
  Search bar yang expand/collapse interaktif.
- `src/components/ui/typewriter.tsx`  
  Efek ketik animasi.
- `src/components/ui/the-infinite-grid.tsx`  
  Background grid animasi.
- `src/components/ui/background-gradient-animation.tsx`  
  Layer animasi gradient/background.
- `src/components/ui/GlobalGrid.tsx`  
  Komponen grid global dekoratif.
- `src/components/ui/HeroHoneycombNode.tsx`  
  Komponen visual hero bertema honeycomb.
- `src/components/ui/TestimonialsColumn.tsx`  
  Komponen kolom testimonial.

---

## G. Folder `src/lib` (helper/data/utilitas)

- `src/lib/prisma.ts`  
  Inisialisasi client Prisma agar koneksi rapi dan reusable.

- `src/lib/utils.ts`  
  Fungsi utilitas umum (misalnya className merging seperti `cn`).

- `src/lib/data.ts`  
  Data helper/mocked data/constant dataset yang dipakai UI.

---

## H. File auth/proxy di `src`

- `src/auth.config.ts`  
  Konfigurasi auth (provider, callbacks, strategy).

- `src/auth.ts`  
  Ekspor helper auth yang dipakai app.

- `src/proxy.ts`  
  Layer proxy/middleware logic untuk filter request atau proteksi route.

---

## I. Folder `graphify-out` (hasil analisis graphify)

### I1. Dokumen hasil
- `graphify-out/graphify_wiki.md`
- `graphify-out/deep-wiki.md`
- `graphify-out/GRAPH_REPORT.md`

Fungsi: ringkasan analisis struktur project dan relasi knowledge graph.

### I2. Visual/data graph
- `graphify-out/graph.html`  
  Visual graph interaktif (biasanya dibuka browser).
- `graphify-out/graph.json`  
  Data graph mentah (node-edge).

### I3. Marker root
- `graphify-out/.graphify_root`  
  Penanda direktori hasil graphify.

### I4. Cache AST (banyak file hash)
- `graphify-out/cache/ast/*.json` (contoh: `02ec...json`, `f7b2...json`, dll)

Konsep file ini:
- Isinya hasil parse AST per file sumber.
- Nama hash = identitas unik konten.
- Ini file generated/cache; biasanya tidak perlu dibaca satu-satu kecuali debugging tool graphify.

---

## J. Folder generated eksternal besar (ada di workspace, tidak semua di-git)

### J1. `.next/`
Generated oleh Next.js saat dev/build.  
Berisi artefak compile, cache route, output server/client.

Kapan dihapus?
- Boleh dihapus saat troubleshooting build (`rm -rf .next` setara).
Kapan jangan di-commit?
- Hampir selalu jangan di-commit.

### J2. `node_modules/`
Semua dependency npm ter-install.  
Tidak ditulis manual, dibangkitkan dari `package.json` + lock file.

Kapan dihapus?
- Saat dependency rusak, bisa reinstall.
Kapan jangan di-commit?
- Standar: tidak di-commit.

---

## K. Peta hubungan antar file (mental model)

1. User buka route (`src/app/.../page.tsx`)
2. Layout global (`layout.tsx`) membungkus route
3. Komponen UI (`src/components/**`) ditarik oleh page
4. Jika butuh auth, memakai `src/auth.ts`, `src/auth.config.ts`, dan API auth route
5. Jika butuh data DB, lewat `src/lib/prisma.ts` dan schema di `prisma/schema.prisma`
6. Styling global/tailwind/config menopang output visual

Kalau kamu paham urutan ini, kamu sudah mendekati level 90% pemahaman struktur.

---

## L. Prioritas belajar per file (agar cepat naik level)

Urutan yang paling efektif:

1. `package.json` -> paham script utama.
2. `src/app/layout.tsx` -> paham rangka aplikasi.
3. `src/app/page.tsx` + satu halaman lain (`/profile`) -> paham route.
4. `src/components/layout/Navbar.tsx` -> paham interaksi global.
5. `src/auth.config.ts` + `src/app/api/auth/[...nextauth]/route.ts` -> paham login.
6. `src/lib/prisma.ts` + `prisma/schema.prisma` -> paham data layer.
7. Komponen UI animasi -> paham polish dan UX.

---

## M. Progress checkpoint (sampai titik chat ini)

Pada progress ini:
- Error lint utama sudah dibereskan.
- Warning lint juga sudah dibersihkan.
- Build production berhasil.

Artinya codebase sekarang dalam kondisi bagus untuk dipelajari sambil praktik.

