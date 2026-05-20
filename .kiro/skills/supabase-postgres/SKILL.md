---
name: supabase-postgres-best-practices
description: Postgres performance optimization and best practices from Supabase. Use this skill when writing, reviewing, or optimizing Postgres queries, schema designs, or database configurations for Supabase projects.
license: MIT
metadata:
  author: supabase
  version: "1.1.1"
---

# Supabase Postgres Best Practices

Comprehensive performance optimization guide for Postgres, maintained by Supabase. Contains rules across 8 categories, prioritized by impact.

## When to Apply

Reference these guidelines when:
- Writing SQL queries or designing schemas
- Implementing indexes or query optimization
- Reviewing database performance issues
- Configuring connection pooling or scaling
- Working with Row-Level Security (RLS)
- Adding Supabase Storage or Auth integrations

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Query Performance | CRITICAL | `query-` |
| 2 | Connection Management | CRITICAL | `conn-` |
| 3 | Security & RLS | CRITICAL | `security-` |
| 4 | Schema Design | HIGH | `schema-` |
| 5 | Concurrency & Locking | MEDIUM-HIGH | `lock-` |
| 6 | Data Access Patterns | MEDIUM | `data-` |
| 7 | Monitoring & Diagnostics | LOW-MEDIUM | `monitor-` |
| 8 | Advanced Features | LOW | `advanced-` |

## Key Rules for BeeMate

### Connection Management (CRITICAL)
BeeMate uses Supabase with PgBouncer (Prisma adapter-pg). Rules:

```
✅ DATABASE_URL → port 6543 (Pooler) — untuk runtime/queries
✅ DIRECT_URL   → port 5432 (Direct) — untuk migrations saja
✅ ?pgbouncer=true&connection_limit=1 di DATABASE_URL
✅ Prisma singleton pattern — jangan buat PrismaClient baru tiap request
```

### Indexes (CRITICAL)
```sql
-- ❌ Query tanpa index pada kolom yang sering di-filter
SELECT * FROM "TeamMember" WHERE "userId" = $1 AND "joinStatus" = 'ACCEPTED';

-- ✅ Tambah index composite
CREATE INDEX idx_team_member_user_status ON "TeamMember"("userId", "joinStatus");

-- ❌ Query notifikasi tanpa index
SELECT * FROM "Notification" WHERE "recipientId" = $1 AND "isRead" = false;

-- ✅ Index untuk notifikasi unread
CREATE INDEX idx_notification_recipient_unread ON "Notification"("recipientId", "isRead")
  WHERE "isRead" = false;  -- partial index — lebih efisien
```

### Row-Level Security (CRITICAL)
Jika menggunakan Supabase client langsung (bukan Prisma), WAJIB aktifkan RLS:

```sql
-- Aktifkan RLS pada semua tabel
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Team" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TeamMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;

-- Contoh policy: user hanya bisa lihat notifikasi miliknya
CREATE POLICY "Users can view own notifications"
  ON "Notification" FOR SELECT
  USING (auth.uid()::text = "recipientId");
```

**Catatan BeeMate:** Project ini menggunakan Prisma ORM dengan service role key,
bukan Supabase client langsung. RLS tetap direkomendasikan sebagai defense-in-depth.

### Schema Design (HIGH)
```sql
-- ✅ Gunakan CUID (sudah dipakai di BeeMate via Prisma @default(cuid()))
-- ✅ Gunakan @db.Text untuk kolom panjang (bio, description, message)
-- ✅ Gunakan String[] untuk skills array (native PostgreSQL array)
-- ✅ Gunakan @@unique([teamId, userId]) untuk mencegah duplikasi TeamMember
```

### Query Optimization
```typescript
// ❌ N+1 query — query per member
const teams = await prisma.team.findMany();
for (const team of teams) {
  team.members = await prisma.teamMember.findMany({ where: { teamId: team.id } });
}

// ✅ Single query dengan include
const teams = await prisma.team.findMany({
  include: {
    members: { include: { user: { select: { id: true, name: true, image: true } } } },
    leader: { select: { id: true, name: true, image: true } },
    _count: { select: { members: true } },
  },
});
```

### Pagination (HIGH)
```typescript
// ✅ Selalu pakai pagination untuk list queries
const teams = await prisma.team.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: "desc" },
});

// ❌ Jangan ambil semua data sekaligus
const allTeams = await prisma.team.findMany(); // bisa ribuan rows
```

### Select Only Needed Fields
```typescript
// ❌ Ambil semua field
const user = await prisma.user.findUnique({ where: { id } });

// ✅ Hanya field yang dibutuhkan
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, name: true, image: true, title: true, skills: true },
});
```

## Supabase Storage (BeeMate)

BeeMate menggunakan Supabase Storage untuk avatar dan banner:
- Bucket: `beemate` (public)
- Avatar: max 4MB, images only
- Banner: max 8MB, images only
- URL format: `https://[project].supabase.co/storage/v1/object/public/beemate/...`

```typescript
// Upload via Supabase client (server-side dengan service role)
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // Server only — jangan expose ke client
);
```

## References

- https://supabase.com/docs/guides/database/overview
- https://supabase.com/docs/guides/auth/row-level-security
- https://supabase.com/docs/guides/integrations/prisma
- https://www.postgresql.org/docs/current/
- https://github.com/supabase/agent-skills
