# 🐝 BeeMate

Platform matchmaking untuk **Hacker, Hustler, dan Hipster** — bentuk tim, ikuti kompetisi, dan temukan rekan kerja kampus.

**Live:** [beemate-app.vercel.app](https://beemate-app.vercel.app)

## 🚀 Quick Start

```bash
cp .env.example .env   # isi semua env vars
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + Vanilla CSS |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 7 |
| Auth | NextAuth v5 (Google OAuth) |
| Realtime | Supabase Realtime |
| Email | Resend |
| File Upload | Supabase Storage |
| Analytics | Vercel Analytics |
| Deploy | Vercel |

## ✅ Features

- Google OAuth login (no password needed)
- User profiles with skills, bio, portfolio
- People directory with role filter (Hacker/Hustler/Hipster)
- Recommendation system (complementary skills)
- Team creation, invite, accept/reject
- Real-time notifications (Supabase Realtime)
- Email notifications (Resend)
- Competition listings with deadline countdown
- Dashboard with stats
- Admin panel (user & competition management)
- File upload (avatar + banner via Supabase Storage)
- Settings page (account, notifications, privacy, delete account)
- Dark mode

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components (ui/, layout/, cards/)
├── actions/          # Server Actions (8 modules)
├── lib/              # Utilities (prisma, supabase, email)
└── auth.ts           # NextAuth v5 config
```

## 🔐 Environment Variables

See [`.env.example`](./.env.example) for all required variables.

## 📖 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** — Deploy guide + troubleshooting
- **[CHECKLIST.md](./CHECKLIST.md)** — Development progress
- **[ROADMAP.md](./ROADMAP.md)** — Future planning

## 🤖 AI Agent Setup

This project uses Agent Skills (`.kiro/skills/`) and Supabase MCP for AI-assisted development. See `AGENTS.md` for details.

---

*BeeMate — Find Your Hive 🐝*
