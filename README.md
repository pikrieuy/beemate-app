# 🐝 BeeMate

Platform untuk mempertemukan **Hacker, Hustler, dan Hipster** untuk membentuk tim dan mengikuti kompetisi.

## 🚀 Quick Start

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

**New to the project?** Start with **[DOCS_GUIDE.md](./DOCS_GUIDE.md)** for navigation help.

**Key Documents:**
- **[MASTER_PLAN.md](./MASTER_PLAN.md)** - Complete development roadmap (13 phases)
- **[NEXT_STEPS.md](./NEXT_STEPS.md)** - Current phase guide (Phase 3)
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - One-page cheat sheet
- **[SERVER_ACTIONS.md](./SERVER_ACTIONS.md)** - Backend API documentation
- **[QUICK_START_ACTIONS.md](./QUICK_START_ACTIONS.md)** - Quick examples

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma 7
- **Auth:** NextAuth v5 (Google OAuth)

## ✅ Progress

- ✅ Phases 1–9: Full MVP (Profile, Teams, Competitions, Dashboard, Admin, Uploads)
- ✅ Phase 10–12: Build fixes + deployment prep
- 🔜 Phase 13: Deploy to Vercel → see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

**Overall:** ~95% — `npm run build` passes ✅

## 📁 Project Structure

```
src/
├── app/              # Next.js pages
├── components/       # React components
├── actions/          # Server Actions (28 functions)
├── lib/              # Utilities
└── types/            # TypeScript types
```

## 🔐 Environment Variables

Copy [`.env.example`](./.env.example) to `.env` and fill in all values.

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)

## 🚀 Deploy

Follow **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full Vercel + Supabase + OAuth checklist.
