import { z } from "zod";

// ── User Profile ──
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(50, "Nama maksimal 50 karakter")
    .trim()
    .optional(),
  bio: z.string().max(500, "Bio maksimal 500 karakter").optional(),
  skills: z.array(z.string().max(30)).max(20, "Maksimal 20 skills").optional(),
  title: z.enum(["Hacker", "Hustler", "Hipster"]).optional(),
  portfolioUrl: z
    .string()
    .url("URL portfolio tidak valid")
    .or(z.literal(""))
    .optional(),
  image: z.string().url().optional(),
});

// ── Competition ──
export const createCompetitionSchema = z.object({
  title: z
    .string()
    .min(3, "Judul minimal 3 karakter")
    .max(100, "Judul maksimal 100 karakter")
    .trim(),
  description: z
    .string()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(2000, "Deskripsi maksimal 2000 karakter"),
  imageUrl: z.string().url().optional(),
  registrationLink: z.string().url("Link registrasi tidak valid").optional(),
  deadline: z.coerce.date().optional(),
});

export const updateCompetitionSchema = createCompetitionSchema.partial();

// ── Team ──
export const createTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Nama tim minimal 2 karakter")
    .max(50, "Nama tim maksimal 50 karakter")
    .trim(),
  description: z.string().max(500, "Deskripsi maksimal 500 karakter").optional(),
});

// ── Project ──
export const createProjectSchema = z.object({
  title: z
    .string()
    .min(3, "Judul minimal 3 karakter")
    .max(100, "Judul maksimal 100 karakter")
    .trim(),
  description: z
    .string()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(3000, "Deskripsi maksimal 3000 karakter"),
  imageUrl: z.string().url().optional(),
  demoUrl: z.string().url("Demo URL tidak valid").or(z.literal("")).optional(),
  githubUrl: z.string().url("GitHub URL tidak valid").or(z.literal("")).optional(),
  teamId: z.string().cuid().optional(),
});

// ── Task ──
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Judul task wajib diisi")
    .max(100, "Judul maksimal 100 karakter")
    .trim(),
  description: z.string().max(1000, "Deskripsi maksimal 1000 karakter").optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: z.coerce.date().optional(),
  assigneeId: z.string().cuid().optional(),
  teamId: z.string().cuid(),
});

// ── Message ──
export const sendMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Pesan tidak boleh kosong")
    .max(2000, "Pesan maksimal 2000 karakter")
    .trim(),
  teamId: z.string().cuid(),
});

// ── Endorsement ──
export const endorseSkillSchema = z.object({
  recipientId: z.string().cuid(),
  skill: z.string().min(1).max(30),
});

// ── Comment ──
export const createCommentSchema = z.object({
  projectId: z.string().cuid(),
  content: z
    .string()
    .min(1, "Komentar tidak boleh kosong")
    .max(1000, "Komentar maksimal 1000 karakter")
    .trim(),
});

// ── Helper: validate and return typed result ──
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): 
  { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.errors[0]?.message ?? "Validasi gagal";
    return { success: false, error: firstError };
  }
  return { success: true, data: result.data };
}
