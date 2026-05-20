---
name: security-best-practices
description: Security best practices for web applications. Use when reviewing authentication, authorization, input validation, API security, or when asked to "audit security", "check for vulnerabilities", "harden auth", or "review security".
metadata:
  author: community
  version: "1.0.0"
---

# Security Best Practices for BeeMate

Security guidelines tailored for Next.js 16 + NextAuth v5 + Supabase + Prisma stack.

## When to Apply

- Reviewing or writing authentication/authorization code
- Adding new API routes or Server Actions
- Handling user input or file uploads
- Reviewing database queries
- Before deployment or security audit

## 1. Authentication (NextAuth v5)

```typescript
// ✅ Selalu validasi session di Server Actions
export async function sensitiveAction() {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, error: "Unauthorized" };
  }
  // ...
}

// ✅ Validasi role untuk admin actions
export async function adminAction() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Forbidden" };
  }
  // ...
}

// ❌ Jangan percaya data dari client
export async function badAction(userId: string) {
  // userId bisa dimanipulasi dari client!
  await prisma.user.update({ where: { id: userId }, data: { role: "ADMIN" } });
}

// ✅ Selalu ambil userId dari session
export async function goodAction() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  // gunakan user.id dari database, bukan dari client
}
```

## 2. Input Validation

```typescript
// ✅ Validasi semua input sebelum query database
export async function createTeam(data: { name: string; description?: string }) {
  // Validasi panjang
  if (!data.name || data.name.trim().length < 2) {
    return { success: false, error: "Nama tim minimal 2 karakter" };
  }
  if (data.name.length > 50) {
    return { success: false, error: "Nama tim maksimal 50 karakter" };
  }
  if (data.description && data.description.length > 500) {
    return { success: false, error: "Deskripsi maksimal 500 karakter" };
  }
  // ...
}
```

## 3. Authorization — Ownership Check

```typescript
// ✅ Selalu cek ownership sebelum update/delete
export async function deleteTeam(teamId: string) {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) return { success: false, error: "Tim tidak ditemukan" };

  // Cek apakah user adalah leader tim
  if (team.leaderId !== user.id) {
    return { success: false, error: "Hanya leader yang bisa menghapus tim" };
  }
  // ...
}
```

## 4. File Upload Security (Supabase Storage)

```typescript
// ✅ Validasi file type dan size di server
// Uploadthing sudah handle ini via config:
avatarUploader: f({ image: { maxFileSize: "4MB" } })
  .middleware(async () => {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    return { userId: session.user.id };
  })

// ✅ Jangan expose SUPABASE_SERVICE_ROLE_KEY ke client
// Hanya gunakan di server-side code
```

## 5. Environment Variables

```
✅ SUPABASE_SERVICE_ROLE_KEY — server only, jangan ada di NEXT_PUBLIC_*
✅ AUTH_SECRET — jangan commit ke git
✅ DATABASE_URL — jangan commit ke git
❌ Jangan hardcode secrets di kode
❌ Jangan log secrets ke console
```

## 6. SQL Injection Prevention

Prisma ORM otomatis mencegah SQL injection via parameterized queries.
Jangan pernah gunakan raw SQL dengan input dari user tanpa sanitasi:

```typescript
// ❌ Berbahaya
await prisma.$queryRawUnsafe(`SELECT * FROM "User" WHERE name = '${userInput}'`);

// ✅ Aman — Prisma parameterized
await prisma.$queryRaw`SELECT * FROM "User" WHERE name = ${userInput}`;

// ✅ Lebih baik — gunakan Prisma ORM
await prisma.user.findMany({ where: { name: userInput } });
```

## 7. Rate Limiting (Future)

Untuk production yang lebih serius, tambahkan rate limiting di:
- `/api/auth/*` — mencegah brute force login
- Server Actions yang mutasi data — mencegah spam

Rekomendasi: `@upstash/ratelimit` + Vercel Edge Middleware.

## 8. BeeMate-Specific Checklist

```
✅ Session divalidasi di semua Server Actions
✅ Role ADMIN dicek sebelum admin actions
✅ Ownership dicek sebelum update/delete team
✅ File upload dibatasi type (image only) dan size
✅ SUPABASE_SERVICE_ROLE_KEY tidak di-expose ke client
✅ Prisma ORM digunakan (bukan raw SQL dengan user input)
⚠️  RLS belum diaktifkan di Supabase (aman karena pakai Prisma service role)
⚠️  Rate limiting belum ada
⚠️  Input validation bisa diperkuat dengan Zod
```

## References

- [NextAuth v5 Security](https://authjs.dev/getting-started/migrating-to-v5)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/authentication)
