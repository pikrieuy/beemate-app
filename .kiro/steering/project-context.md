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
