# BeeMate — Project Context (Always Loaded)

## What is BeeMate
Platform matchmaking tim hackathon untuk mahasiswa. Mempertemukan Hacker, Hustler, dan Hipster.
Live di: beemate-app.vercel.app | Repo: github.com/pikrieuy/beemate-app

## Tech Stack
- Next.js 16 App Router | React 19 | TypeScript 5
- Tailwind CSS v4 (config di CSS, bukan tailwind.config.js)
- Supabase PostgreSQL 17 + Prisma 7 (connection di prisma.config.ts)
- NextAuth v5 beta (Google OAuth) — auth di `src/auth.ts`, import dari `@/auth`
- Supabase Storage (avatars + banners) | Supabase Realtime (notifications)
- Resend (email) | Vercel Analytics | Vercel deploy

## Critical Rules
- Import auth dari `@/auth` — BUKAN `@/lib/auth`
- Import prisma dari `@/lib/prisma` — BUKAN `@/lib/db`
- Prisma 7: url/directUrl di `prisma.config.ts`, BUKAN di schema.prisma
- Tailwind v4: konfigurasi di CSS `@theme {}`, BUKAN tailwind.config.js
- Server Actions return `{ success, data?, error? }` — jangan throw ke client
- Selalu `revalidatePath` setelah mutasi
- Selalu validasi session di awal setiap server action
- Next.js 16: `params` di dynamic routes harus di-`await`

## Database
- Supabase project: wtegmqkajcdajbjdmvcu (ap-southeast-2)
- 14 models, 12 indexes, RLS aktif semua tabel
- Realtime aktif untuk tabel Notification

## Troubleshooting & Critical Lessons Learned
- **NextAuth v5 (Auth.js) Middleware Redirect Loop:** Jangan pernah mengecualikan `/api/auth` secara penuh dari `matcher` di `middleware.ts`. Jika `matcher` di-*exclude* (misal: `/((?!api|...`), NextAuth *Edge Runtime* tidak akan bisa memproses `/api/auth/session` yang menyebabkan *infinite loop redirect* ke halaman login atau merespons dengan HTML *error page*. Pastikan rute API ditangani dengan benar oleh `NextAuth.auth`.
- **UI Components (shadcn/buttonVariants):** JANGAN PERNAH menggunakan `buttonVariants()` di dalam *Client Components* tanpa meng-import fungsinya. Jika lupa `import { buttonVariants } from "@/components/ui/button";`, Next.js 16 *Turbopack* akan mogok dan memunculkan `ReferenceError: buttonVariants is not defined`.
- **React Unique Keys:** Hati-hati saat menggabungkan dua array (misalnya `teamsCreated` dan `teamMemberships`) untuk dirender ke UI. Jika ada entitas yang sama, `key={item.id}` akan bentrok. Selalu gunakan *composite key* seperti `key={\`\${team.id}-\${team.role}\`}`.
- **Button Styling:** Desain project ini mengharuskan SEMUA tombol melengkung penuh (*pill-shape/rounded-full*) dan memiliki padding lega. Gunakan kelas Tailwind `rounded-full` atau global CSS variable `var(--r-pill)`. Sudah ada paksaan CSS di `globals.css` menggunakan `!important`, jadi jangan mencoba membuat tombol kotak (bersudut lancip).

## Workflow Preferences (dari user)
- User suka mode "nyuruh-nyuruh" — langsung kerjakan, jangan banyak tanya
- Untuk fitur kecil/bug fix: langsung kerjakan tanpa spec
- Untuk fitur besar: bisa pakai spec kalau perlu, tapi default langsung kerjakan
- Selalu TypeScript check + push ke production setelah selesai
- Bahasa komunikasi: Bahasa Indonesia casual

## File Structure
```
README.md       — intro project
ROADMAP.md      — planning ke depan
DEPLOYMENT.md   — deploy guide
CHECKLIST.md    — progress tracker
AGENTS.md       — AI agent instructions
.kiro/skills/   — 6 agent skills
.kiro/steering/ — file ini
```
