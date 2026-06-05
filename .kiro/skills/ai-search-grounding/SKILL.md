---
name: ai-search-grounding
description: Best practices for implementing Google Search Grounding with Gemini in BeeMate using Vercel AI SDK. Use when creating or optimizing features that retrieve real-time external data (e.g. competitions, trending tech, external hackathons).
metadata:
  author: beemate-team
  version: "1.0.0"
---

# AI Search Grounding & Competition Aggregation Guide

Panduan ini mengatur implementasi pencarian real-time menggunakan **Gemini Google Search Grounding** pada platform BeeMate, yang menggantikan web scraper konvensional untuk mengumpulkan info kompetisi secara otomatis.

## 1. Konsep Utama

Pencarian kompetisi dilakukan secara dinamis menggunakan model Gemini dengan grounding Google Search. Model AI secara mandiri melakukan pencarian web, menganalisis halaman web target, menyaring konten, dan menstrukturkan hasilnya ke format JSON yang sesuai dengan skema database `Competition`.

## 2. Dependensi & Provider

Gunakan `@ai-sdk/google` dan `ai` yang sudah terpasang di project:
- Model: `gemini-2.0-flash` atau `gemini-2.5-flash`
- Flag Grounding: `useSearchGrounding: true`

## 3. Implementasi Kode (Server Action)

Berikut adalah pola standar untuk melakukan pencarian kompetisi dan menyimpannya ke database:

```typescript
// src/actions/competition-aggregator.actions.ts
"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Skema Zod yang sesuai dengan database Competition
const competitionSchema = z.object({
  competitions: z.array(
    z.object({
      title: z.string().describe("Nama kompetisi lengkap"),
      description: z.string().describe("Deskripsi singkat mengenai kategori lomba, ketentuan, dan hadiah"),
      registrationLink: z.string().url().describe("Link pendaftaran atau link sumber pengumuman resmi"),
      deadline: z.string().describe("Tanggal deadline pendaftaran format ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)"),
      imageUrl: z.string().url().nullable().describe("Link URL gambar/poster jika tersedia, atau null jika tidak ada"),
    })
  ),
});

export async function aggregateCompetitions() {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Panggil Gemini dengan Search Grounding diaktifkan
    const { object } = await generateObject({
      model: google("gemini-2.0-flash", {
        useSearchGrounding: true, // AKTIFKAN SEARCH GROUNDING
      }),
      schema: competitionSchema,
      prompt: `Cari informasi kompetisi mahasiswa terbaru di Indonesia tahun 2026 yang deadline-nya belum lewat. 
               Fokus pada kategori: Hackathon, Business Plan, Karya Tulis Ilmiah, UI/UX Design, dan Startup Pitch.
               Ekstrak detail penting seperti link pendaftaran resmi, deskripsi detail, dan tanggal deadline secara akurat.`,
    });

    let newItemsCount = 0;

    // Simpan ke database dengan memeriksa duplikasi (deduplikasi berdasarkan judul)
    for (const comp of object.competitions) {
      const existing = await prisma.competition.findFirst({
        where: {
          title: {
            equals: comp.title,
            mode: "insensitive",
          },
        },
      });

      if (!existing) {
        await prisma.competition.create({
          data: {
            title: comp.title,
            description: comp.description,
            registrationLink: comp.registrationLink,
            deadline: new Date(comp.deadline),
            imageUrl: comp.imageUrl,
            authorId: session.user.id, // Ditambahkan oleh user/admin yang memicu aksi
          },
        });
        newItemsCount++;
      }
    }

    revalidatePath("/competitions");
    revalidatePath("/dashboard");

    return { 
      success: true, 
      message: `Berhasil mengagregasi kompetisi. Menambahkan ${newItemsCount} kompetisi baru.` 
    };
  } catch (error) {
    console.error("[AGGREGATE_COMPETITIONS]", error);
    return { success: false, error: "Gagal memproses agregasi data kompetisi." };
  }
}
```

## 4. Keuntungan vs Web Scraper Tradisional

1. **Anti-Blocking:** Request ke Google Search tidak memicu IP ban/CAPTCHA pada platform sosial media (Instagram/Twitter).
2. **Dynamic Adaptation:** Tidak ada kode HTML selector (XPath/CSS selector) yang perlu dipelihara jika layout situs eksternal berubah.
3. **Structured Context:** Gemini secara otomatis memformat tanggal relatif (misalnya "pendaftaran ditutup akhir bulan depan") menjadi format ISO standard.
4. **Reliability:** Data bersumber langsung dari hasil pencarian terindeks Google.

## 5. Kebutuhan Environment Variables

Pastikan API key Google AI Studio Anda dikonfigurasi dengan benar di file `.env`:
- `GOOGLE_AI_API_KEY` (dengan akses kuota pencarian grounding).
