"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseAdmin, BEEMATE_STORAGE_BUCKET } from "@/lib/supabase/admin";
import { geminiFlash } from "@/lib/ai";

// ==========================================
// SCHEMA DEFINITIONS
// ==========================================

const competitionSchema = z.object({
  competitions: z.array(
    z.object({
      title: z.string().describe("Nama kompetisi lengkap"),
      description: z.string().describe("Deskripsi singkat mengenai kategori lomba, ketentuan, dan hadiah"),
      registrationLink: z.string().url().describe("Link pendaftaran atau pengumuman resmi"),
      deadline: z.string().describe("Tanggal deadline pendaftaran format ISO 8601 (YYYY-MM-DD)"),
      imageUrl: z.string().url().nullable().describe("Link URL gambar/poster jika ada, atau null"),
    })
  ),
});

const instagramExtractorSchema = z.object({
  isCompetition: z.boolean().describe("Apakah postingan ini berisi info lomba/kompetisi aktif?"),
  title: z.string().optional().describe("Nama kompetisi"),
  description: z.string().optional().describe("Deskripsi singkat syarat, hadiah, dan kategori lomba"),
  deadline: z.string().optional().describe("Tanggal deadline pendaftaran (format ISO 8601 YYYY-MM-DD)"),
  registrationLink: z.string().optional().describe("Link pendaftaran atau link bio yang tercantum di caption (jika ada)"),
  organizer: z.string().optional().describe("Nama penyelenggara / organisasi yang mengadakan lomba ini"),
  targetAudience: z.string().optional().describe("Target peserta lomba (misal: 'Mahasiswa, Umum', 'SMA/Sederajat', 'Nasional', dll)"),
  entryFee: z.string().optional().describe("Biaya pendaftaran (misal: 'Gratis', 'Rp 30.000', 'Start from Rp 50k')"),
  competitionLevel: z.string().optional().describe("Tingkat kompetisi (misal: 'Nasional', 'Internasional', 'Provinsi')"),
  location: z.string().optional().describe("Lokasi lomba diadakan (misal: 'Online', 'Offline di Jakarta', 'Hybrid')"),
});

// ==========================================
// HELPER: UPLOAD IMAGE TO SUPABASE
// ==========================================
async function uploadImageToSupabase(imageUrl: string): Promise<string | null> {
  try {
    const imgResponse = await fetch(imageUrl);
    if (!imgResponse.ok) return null;
    
    const arrayBuffer = await imgResponse.arrayBuffer();
    // buffer conversion for node fetch
    const imageBuffer = Buffer.from(arrayBuffer);
    const fileExt = "jpg";
    const fileName = `competitions/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    
    const supabase = createSupabaseAdmin();
    const { error: uploadError } = await supabase.storage
      .from(BEEMATE_STORAGE_BUCKET)
      .upload(fileName, imageBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BEEMATE_STORAGE_BUCKET)
      .getPublicUrl(fileName);
      
    return publicUrl;
  } catch (error) {
    console.error("Failed to upload image:", error);
    return null;
  }
}

// ==========================================
// ACTION 1: GOOGLE SEARCH GROUNDING (OPSI A)
// ==========================================
export async function aggregateCompetitionsGrounded(topic: string = "Hackathon dan Business Plan") {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const { object } = await generateObject({
      // We use standard google provider for grounding to ensure it uses the local API key with grounding capabilities
      model: google("gemini-2.5-flash", { useSearchGrounding: true }),
      schema: competitionSchema,
      prompt: `Cari informasi kompetisi mahasiswa terbaru di Indonesia tahun 2026 yang deadline-nya belum lewat. 
               Fokus pada kategori: ${topic}.
               Ekstrak detail penting seperti link pendaftaran resmi, deskripsi detail, dan tanggal deadline secara akurat.`,
    });

    let newItemsCount = 0;

    for (const comp of object.competitions) {
      const existing = await prisma.competition.findFirst({
        where: { title: { equals: comp.title, mode: "insensitive" } },
      });

      if (!existing && new Date(comp.deadline) > new Date()) {
        let finalImageUrl = comp.imageUrl;
        // Optionally upload to Supabase if it's a valid remote URL
        if (finalImageUrl && finalImageUrl.startsWith("http")) {
          const uploaded = await uploadImageToSupabase(finalImageUrl);
          if (uploaded) finalImageUrl = uploaded;
        }

        await prisma.competition.create({
          data: {
            title: comp.title,
            description: comp.description,
            registrationLink: comp.registrationLink,
            deadline: new Date(comp.deadline),
            imageUrl: finalImageUrl,
            authorId: session.user.id,
          },
        });
        newItemsCount++;
      }
    }

    revalidatePath("/competitions");
    return { success: true, message: `Berhasil mengagregasi via Google Search. Menambahkan ${newItemsCount} lomba baru.` };
  } catch (error: any) {
    console.error("[AGGREGATE_GROUNDED]", error);
    return { success: false, error: error?.message || "Gagal melakukan pencarian AI." };
  }
}

// ==========================================
// ACTION 2: INSTAGRAM SCRAPER (OPSI B)
// ==========================================
export async function scrapeInstagramAccount(targetUsername: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    if (!process.env.RAPIDAPI_KEY || !process.env.RAPIDAPI_HOST) {
      return { success: false, error: "RapidAPI credentials belum dikonfigurasi di .env" };
    }

    const url = `https://${process.env.RAPIDAPI_HOST}/get_ig_user_posts.php`;
    const response = await fetch(url,
      {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": process.env.RAPIDAPI_HOST,
        },
        body: new URLSearchParams({
          username_or_url: `https://www.instagram.com/${targetUsername.replace("@", "")}/`,
          amount: '12' // Scraping last 12 posts is enough
        })
      }
    );

    if (!response.ok) throw new Error(`RapidAPI returned ${response.status}`);
    const result = await response.json();
    const posts = result.posts || [];
    let newItemsCount = 0;

    for (const postWrapper of posts) {
      const post = postWrapper.node || postWrapper; // Based on API structure
      const captionText = post.caption?.text || "";
      // Grab image URL - API returns various formats
      const imageUrl = post.display_url || post.thumbnail_src || post.image_versions2?.candidates?.[0]?.url || null;

      if (!captionText) continue;

      const aiResponse = await generateObject({
        model: geminiFlash,
        schema: instagramExtractorSchema,
        prompt: `Analisis teks caption postingan Instagram berikut:\n\n"${captionText}"\n\n
                 Tentukan apakah postingan ini merupakan info lomba/kompetisi aktif. 
                 Jika ya, ekstrak nama lomba, deskripsi, deadline, dan link.`,
      });

      const data = aiResponse.object;

      if (data.isCompetition && data.title && data.deadline) {
        const deadlineDate = new Date(data.deadline);
        
        if (deadlineDate > new Date()) {
          const existing = await prisma.competition.findFirst({
            where: { title: { equals: data.title, mode: "insensitive" } },
          });

          if (!existing) {
            let finalImageUrl = null;
            if (imageUrl) {
              const uploaded = await uploadImageToSupabase(imageUrl);
              if (uploaded) finalImageUrl = uploaded;
            }

            await prisma.competition.create({
              data: {
                title: data.title,
                description: data.description || "Detail pada link pendaftaran.",
                registrationLink: data.registrationLink || "", // AI extracted link or empty
                sourceLink: `https://instagram.com/p/${post.code}`, // The actual source post
                organizer: data.organizer || post.owner?.username || targetUsername.replace("@", ""),
                targetAudience: data.targetAudience || "Umum",
                entryFee: data.entryFee || "Tidak diketahui",
                competitionLevel: data.competitionLevel || "Nasional",
                location: data.location || "Online",
                deadline: deadlineDate,
                imageUrl: finalImageUrl,
                authorId: session.user.id,
              },
            });
            newItemsCount++;
          }
        }
      }
    }

    revalidatePath("/competitions");
    return { success: true, message: `Scraping ${targetUsername} selesai. ${newItemsCount} lomba baru ditambahkan.` };
  } catch (error: any) {
    console.error("[SCRAPE_INSTAGRAM]", error);
    return { success: false, error: error?.message || "Gagal memproses data Instagram." };
  }
}
