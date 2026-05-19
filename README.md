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

- ✅ Phase 1: Database Setup
- ✅ Phase 2: Server Actions (28 functions)
- ✅ Phase 3: Core UI Pages (Profile, People)
- ✅ Phase 4: Team Management (Complete workflow)
- 🔜 Phase 5: Competition System (Next)

**Overall:** 60% Complete

See [PROGRESS_SUMMARY.md](./PROGRESS_SUMMARY.md) for details.

## 📁 Project Structure

```
src/
├── app/              # Next.js pages
├── components/       # React components
├── actions/          # Server Actions (28 functions)
├── lib/              # Utilities
└── types/            # TypeScript types
```

## 🎯 Current Focus

**Phase 5: Competition System**
- Competitions List
- Create Competition (ADMIN only)
- Competition Detail
- Edit/Delete (ADMIN only)

See [MASTER_PLAN.md](./MASTER_PLAN.md) for full roadmap.

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in:
- `DATABASE_URL` - Supabase connection string
- `DIRECT_URL` - Supabase direct connection
- `AUTH_SECRET` - NextAuth secret
- `AUTH_GOOGLE_ID` - Google OAuth Client ID
- `AUTH_GOOGLE_SECRET` - Google OAuth Secret

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)

## 🚀 Deploy

Deploy to Vercel (Phase 13):

```bash
vercel deploy
```
