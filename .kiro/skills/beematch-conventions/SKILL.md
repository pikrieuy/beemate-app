# BeeMate — Project Conventions & Architecture Guide

## Description

BeeMate adalah platform matchmaking tim hackathon. Skill ini menyimpan konvensi kode,
arsitektur, pola-pola yang sudah disepakati, dan konteks teknis spesifik project agar
setiap sesi AI langsung paham tanpa perlu re-explain dari awal.

## Tech Stack (Versi Eksak)

```
Next.js       16         — App Router ONLY, tidak ada Pages Router
React         19         — Server Components by default
TypeScript    5.x        — strict mode aktif
Tailwind CSS  v4         — bukan v3, ada breaking changes di config
Supabase      PG 17      — dengan Prisma ORM (bukan Supabase client langsung untuk DB)
Prisma        7.x        — schema di prisma/schema.prisma
NextAuth      v5 (Beta)  — bukan v4, API berbeda signifikan
Framer Motion 12         — untuk animasi UI
Uploadthing   v7         — untuk file upload (avatar + banner)
Deploy        Vercel     — serverless, bukan long-running server
```

## Struktur Folder

```
beematch/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── admin/                  # Admin-only pages
│   │   ├── api/                    # API Routes
│   │   │   └── auth/[...nextauth]/ # NextAuth handler
│   │   ├── auth/                   # Auth pages (sign-in, dll)
│   │   ├── competitions/           # Competition pages
│   │   ├── dashboard/              # Dashboard
│   │   ├── people/                 # People directory
│   │   ├── profile/                # Profile pages
│   │   ├── teams/                  # Team pages
│   │   └── layout.tsx              # Root layout
│   ├── components/
│   │   ├── ui/                     # Komponen primitif
│   │   └── [feature]/              # Komponen per fitur
│   ├── lib/
│   │   ├── prisma.ts               # Prisma client singleton (BUKAN db.ts)
│   │   ├── data.ts                 # Data fetching helpers
│   │   └── utils.ts                # Helper functions
│   ├── actions/                    # Server Actions
│   │   ├── team.actions.ts
│   │   ├── team-member.actions.ts
│   │   ├── competition.actions.ts
│   │   ├── notification.actions.ts
│   │   └── user.actions.ts
│   ├── auth.ts                     # NextAuth v5 config (di root src/, BUKAN lib/)
│   └── auth.config.ts              # NextAuth config terpisah (untuk middleware)
├── prisma/
│   └── schema.prisma               # Database schema
├── prisma.config.ts                # Prisma 7 connection config (url/directUrl di sini)
└── .kiro/skills/                   # Agent skills (folder ini)
    ├── beematch-conventions/       # Konvensi project BeeMate
    ├── react-best-practices/       # Vercel React/Next.js best practices
    ├── supabase-postgres/          # Supabase Postgres best practices
    └── deploy-to-vercel/           # Vercel deployment guide
```

## Konvensi Kode

### Server vs Client Components

```typescript
// DEFAULT: Server Component (tidak perlu directive)
// Gunakan untuk: data fetching, halaman statis, layout

// CLIENT Component — hanya kalau butuh:
// useState, useEffect, event handlers, browser API
"use client";
```

**Aturan:** Mulai selalu dari Server Component. Tambah `"use client"` hanya kalau
benar-benar butuh interaktivitas. Jangan sampai seluruh halaman jadi client component.

### Server Actions Pattern

```typescript
// actions/team.actions.ts
"use server";

import { auth } from "@/auth";           // BUKAN "@/lib/auth"
import prisma from "@/lib/prisma";       // BUKAN "@/lib/db"
import { revalidatePath } from "next/cache";

export async function createTeam(data: { name: string; description?: string }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return { success: false, error: "User not found" };

    const team = await prisma.team.create({
      data: { name: data.name, description: data.description, leaderId: user.id },
    });

    revalidatePath("/teams");
    return { success: true, data: team };
  } catch (error) {
    console.error("[CREATE_TEAM]", error);
    return { success: false, error: "Failed to create team" };
  }
}
```

**Aturan:**
- Semua mutasi data pakai Server Actions (bukan API Routes)
- Selalu validasi session di awal action
- Selalu `revalidatePath` atau `revalidateTag` setelah mutasi
- Return `{ success: boolean, data?, error? }` — jangan throw ke client

### Data Fetching Pattern

```typescript
// Di Server Component — langsung Prisma, tidak perlu fetch API
async function TeamPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const team = await prisma.team.findUnique({
    where: { id: params.id },
    include: { members: true, leader: true }
  });

  if (!team) notFound();
  return <TeamView team={team} />;
}
```

**Aturan:** Di Server Components, query Prisma langsung. Jangan fetch ke `/api` sendiri.

### Auth Pattern (NextAuth v5)

```typescript
// src/auth.ts — konfigurasi utama (di root src/, BUKAN di lib/)
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./lib/prisma"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) session.user.id = token.sub;
      if (token.image) session.user.image = token.image as string;
      if (token.name) session.user.name = token.name as string;
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) token.sub = user.id;
      if (trigger === "update" && session) {
        if (session.image) token.image = session.image;
        if (session.name) token.name = session.name;
      }
      return token;
    },
  },
})

// Di Server Component / Server Action:
import { auth } from "@/auth"  // BUKAN dari "@/lib/auth"
const session = await auth()

// Di middleware:
export { auth as middleware } from "@/auth"

// JANGAN gunakan: getServerSession() — itu NextAuth v4
// JANGAN gunakan: useSession() di Server Components
```

### Prisma Client Singleton

```typescript
// lib/prisma.ts — WAJIB pakai singleton pattern di Next.js
// Project ini menggunakan Prisma Adapter untuk pg (PgBouncer-compatible)
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

let prisma: PrismaClient

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter })
} else {
  const globalWithPrisma = global as typeof globalThis & { prisma: PrismaClient }
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient({ adapter })
  }
  prisma = globalWithPrisma.prisma
}

export default prisma

// Import di file lain:
import prisma from "@/lib/prisma"  // BUKAN dari "@/lib/db"
```

**PENTING:** Tanpa singleton, Next.js hot reload akan membuat ratusan koneksi Prisma.

## Database Schema — Ringkasan (Aktual)

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          UserRole  @default(USER)
  bio           String?   @db.Text
  skills        String[]
  title         String?   // "Hacker" | "Hustler" | "Hipster"
  portfolioUrl  String?
  accounts      Account[]
  sessions      Session[]
  teamsCreated  Team[]         @relation("TeamLeader")
  teamMembers   TeamMember[]
  competitions  Competition[]  @relation("CompetitionAuthor")
  notificationsReceived Notification[] @relation("Recipient")
  notificationsSent     Notification[] @relation("Sender")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum UserRole { USER ADMIN }
enum JoinStatus { PENDING ACCEPTED REJECTED }
enum NotificationType { INVITE ACCEPT ALERT }
```

## Environment Variables

```bash
# Database (Supabase)
DATABASE_URL="postgresql://...@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://...@aws-0-[region].supabase.com:5432/postgres"

# NextAuth v5
AUTH_SECRET="..."
AUTH_URL="https://beemate-app.vercel.app"
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."  # Server only

# App
NEXT_PUBLIC_APP_URL="https://beemate-app.vercel.app"
```

**KRITIS:** `DATABASE_URL` harus pakai port `6543` (Pooler/PgBouncer) di Vercel.
`DIRECT_URL` untuk Prisma migrations saja (port `5432`).

## Prisma Config untuk Vercel (Prisma 7)

**PENTING:** Prisma 7 tidak lagi menggunakan `url`/`directUrl` di `schema.prisma`.
Konfigurasi koneksi ada di `prisma.config.ts`:

```typescript
// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env["DATABASE_URL"]!,
    ...(process.env["DIRECT_URL"] && { directUrl: process.env["DIRECT_URL"] }),
  },
});
```

```prisma
// prisma/schema.prisma — TIDAK perlu url/directUrl (Prisma 7)
datasource db {
  provider = "postgresql"
}
```

## Tailwind v4 — Perbedaan dari v3

```css
/* v4: Tidak ada tailwind.config.js — konfigurasi di CSS */
@import "tailwindcss";

@theme {
  /* Custom CSS variables — brand color BeeMate: honey/amber */
  --color-primary: #f5a623;
}
```

**JANGAN** gunakan `tailwind.config.js` cara v3 — di v4 sudah deprecated.
Project ini menggunakan vanilla CSS variables di `globals.css` (bukan Tailwind utilities).

## Komponen UI yang Sudah Ada

Sebelum buat komponen baru, cek `components/ui/` terlebih dahulu:
- `Button` — dengan variants (primary, secondary, ghost, danger)
- `Input`, `Textarea` — dengan error state
- `Modal` — dengan Framer Motion animation
- `Avatar` — dengan fallback initials
- `Badge` — untuk skill tags, status
- `Skeleton` — loading states

## Pattern Error Handling

```typescript
// Server Action — return error, jangan throw ke client
export async function someAction(data: SomeType) {
  try {
    return { success: true, data: result };
  } catch (error) {
    console.error("[ACTION_NAME]", error);
    return { success: false, error: "Gagal melakukan aksi. Coba lagi." };
  }
}

// Client Component — handle return value
const result = await someAction(data);
if (!result.success) {
  toast.error(result.error);
  return;
}
```

## Hal yang JANGAN Dilakukan

```
❌ Jangan gunakan getServerSession() — pakai auth() dari "@/auth" (NextAuth v5)
❌ Jangan import auth dari "@/lib/auth" — file auth ada di "@/auth" (src/auth.ts)
❌ Jangan import prisma dari "@/lib/db" — file prisma ada di "@/lib/prisma"
❌ Jangan fetch /api sendiri dari Server Components — query Prisma langsung
❌ Jangan buat PrismaClient baru di setiap file — import dari "@/lib/prisma"
❌ Jangan gunakan port 5432 di DATABASE_URL untuk Vercel — pakai 6543 (Pooler)
❌ Jangan tambah url/directUrl di schema.prisma — taruh di prisma.config.ts (Prisma 7)
❌ Jangan gunakan tailwind.config.js cara lama — konfigurasi di CSS dengan @theme
❌ Jangan letakkan logic bisnis di Client Components — pindah ke Server Actions
❌ Jangan skip revalidatePath setelah mutasi — cache tidak akan update
```

## Status Deployment

- **Platform:** Vercel (auto-deploy dari `main` branch)
- **Database:** Supabase PostgreSQL `aws-1-ap-southeast-2`
- **Storage:** Supabase Storage bucket `beemate`
- **Auth:** Google OAuth (localhost + production)
- **Repo:** github.com/pikrieuy/beemate-app

## Referensi Penting

- [NextAuth v5 Docs](https://authjs.dev)
- [Prisma 7 Config Docs](https://pris.ly/d/config-datasource)
- [Prisma + Supabase Guide](https://supabase.com/docs/guides/integrations/prisma)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Tailwind v4 Docs](https://tailwindcss.com/docs/v4-beta)
- [Uploadthing v7 Docs](https://docs.uploadthing.com)
