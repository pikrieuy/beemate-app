# 🧠 Brainstorming & Technical Breakdown: BeeMate Proposal & AI Scraper

Dokumen ini berisi hasil analisis terhadap codebase BeeMate, perbandingan dengan proposal referensi (*TampungIn*), analisis teknis pembuatan bot scraper kompetisi menggunakan AI (menggunakan Google Cloud Credit), serta draf struktur proposal agar BeeMate dapat diadopsi dan didanai oleh **BINUS University (khususnya BINUS Bandung)**.

---

## 1. Analisis Codebase BeeMate Saat Ini
Berdasarkan pembacaan codebase, BeeMate adalah platform matchmaking yang sangat matang untuk MVP:
- **Tech Stack Core:** Next.js 16 (App Router), Prisma 7, PostgreSQL (Supabase), Tailwind v4, NextAuth v5, Supabase Realtime, dan Resend.
- **AI Stack:** Menggunakan Gemini 2.0 Flash (`gemini-2.0-flash`) dan model embedding (`text-embedding-004`) lewat Vercel AI SDK (`@ai-sdk/google`).
- **Fitur AI yang Sudah Aktif:**
  1. **BeeMatch AI:** Rekomendasi tim berdasarkan embedding profil + *compatibility reasoning*.
  2. **BeeCoach AI:** Streaming chatbot di team chat yang paham konteks tim/kompetisi.
  3. **Skill Extractor:** Ekstraksi otomatis skill/role dari bio menggunakan AI.
  4. **Team Chemistry Score:** Analisis komposisi tim (Hacker, Hustler, Hipster).
  5. **Competition Recommender:** Perankingan kompetisi yang relevan bagi user.
  6. **Trending Skills:** Statistik skill paling dicari di landing page.
- **Database Model (`prisma/schema.prisma`):**
  - Model `Competition` menyimpan data kompetisi dengan skema: `id`, `title`, `description`, `imageUrl`, `registrationLink`, `deadline`, dan `authorId`.

---

## 2. Arsitektur Teknis: AI Competition Scraper Bot & Search Grounding
Tantangan utama dalam melakukan scraping media sosial (Instagram & Twitter/X) secara mandiri adalah **blokir IP, CAPTCHA, login wall, dan perubahan struktur HTML**. 

Berdasarkan eksplorasi terbaru terhadap library `@ai-sdk/google` (Vercel AI SDK) yang sudah terpasang di BeeMate (`^3.0.80`), kita memiliki fitur super optimal: **Gemini Search Grounding** (`useSearchGrounding: true`).

Berikut adalah opsi arsitektur teknis terbaru untuk dipertimbangkan:

### Opsi A: Gemini Google Search Grounding (SANGAT DIREKOMENDASIKAN - Solusi Terbaik)
Alih-alih membuat web crawler/scraper sendiri yang rumit dan mudah diblokir oleh Instagram/Twitter, kita membiarkan model Gemini melakukan pencarian langsung ke mesin pencari Google Search untuk menemukan info kompetisi terupdate.
1. **Flow:**
   - Setup server action / API endpoint di Next.js untuk memanggil Gemini model dengan `useSearchGrounding: true`.
   - Jalankan prompt: *"Cari info kompetisi hackathon, business plan, atau UI/UX mahasiswa Indonesia terbaru tahun 2026 yang deadlinenya belum lewat."*
   - Gemini secara internal akan melakukan pencarian Google Search, mengakses halaman web relevan (termasuk post Instagram publik, Twitter, dan portal lomba), lalu mengembalikan hasilnya.
2. **AI Processing:**
   - Gunakan `generateObject` dari Vercel AI SDK dengan skema Zod (`Competition` schema) agar output dari Gemini langsung terstruktur rapi ke JSON.
   - Lakukan penyimpanan data secara otomatis ke database Supabase.
3. **Kelebihan:** 
   - 0% maintenance scraper code (tidak perlu repot ngurusin HTML parser/selector).
   - Tidak ada risiko IP banned karena menggunakan infrastruktur pencarian Google.
   - Mengambil data real-time dan langsung ter-grounding (minim halusinasi).
   - Gratis di free-tier atau dibayarkan melalui billing Google Cloud Credit.

### Opsi B: Menggunakan API Pihak Ketiga Khusus (Aggregator/Scraper API)
Alih-alih Apify, kita bisa menggunakan beberapa penyedia API alternatif yang sudah menangani proxy rotation dan login wall secara otomatis:
1. **RapidAPI (Opsi Termurah & Paling Realistis untuk Mahasiswa):**
   - **Cara Kerja:** Banyak developer independen menjual API Instagram/Twitter Scraper eceran di platform RapidAPI.
   - **Kelebihan:** Sangat murah (biasanya ada free tier 50-100 request/bulan, plan berbayar mulai dari $5-$10/bulan). Sangat mudah diintegrasikan dengan `fetch` standar di Node.js.
2. **Bright Data / Oxylabs (Skala Enterprise & Paling Stabil):**
   - **Cara Kerja:** Menyediakan API khusus media sosial yang langsung mengembalikan data JSON profil/postingan tanpa diblokir.
   - **Kelebihan:** Keberhasilan mendekati 100%, performa luar biasa cepat.
   - **Kekurangan:** Relatif mahal untuk proyek mahasiswa (skema pay-per-use, minimal deposit $10-$20/bulan).
3. **Phantombuster (No-Code Cloud Automation):**
   - **Cara Kerja:** Platform otomatisasi berbasis cloud. Kita menaruh session cookie Instagram kita ke sana, dan "Phantom" mereka akan otomatis merayap mengambil data di cloud.
   - **Kelebihan:** Tidak perlu menulis kode scraper sama sekali.
   - **Kekurangan:** Free tier membatasi waktu jalan (10 menit/hari), dan butuh akun Instagram tumbal karena rentan diblokir jika aktivitas terlalu cepat.

### Opsi C: Self-Hosted Playwright dengan Session Cookie (Opsi Mandiri & 100% Gratis)
Membangun bot scraper mandiri di Google Cloud Run tanpa pusing membuat logic login otomatis (yang sering diblokir CAPTCHA):
1. **Flow:**
   - Kita membuat service Node.js + Playwright di **Google Cloud Run**.
   - Kita **tidak** memprogram bot untuk mengetik username dan password. Sebagai gantinya, kita login manual sekali di browser pribadi, lalu menyalin **Session Cookie** (cookie `sessionid` untuk Instagram).
   - Simpan cookie tersebut di **Google Secret Manager**.
   - Setiap kali Cloud Scheduler memicu Cloud Run, bot akan membaca cookie tersebut dan menempelkannya di header request untuk langsung membuka halaman target sebagai "user terautentikasi".
2. **AI Processing:**
   - HTML/Text yang berhasil diambil dioper ke Gemini untuk diekstrak menjadi database `Competition`.
3. **Kelebihan:** 
   - 100% GRATIS karena dideploy di Cloud Run (menggunakan credit Google Cloud Anda).
   - Jauh lebih stabil dibanding mencoba menembus halaman login Instagram menggunakan bot secara langsung.
4. **Kekurangan:** Jika session cookie kedaluwarsa (misal setelah beberapa bulan), Anda harus menyalin ulang cookie baru dari browser dan memperbarui nilai di Google Secret Manager secara manual.

---

## 3. Pemanfaatan Google Cloud Credit
Karena Anda memiliki credit Google Cloud, arsitektur ini dapat berjalan tanpa biaya keluar dari dompet pribadi:
- **Hosting Scraper:** Deploy scraper sebagai microservice di **Google Cloud Run** (hanya membayar saat container menyala/running).
- **Scheduler:** Gunakan **Cloud Scheduler** (free tier sangat luas) untuk memicu scraper secara berkala.
- **AI Processing:** Gunakan **Vertex AI API** (akses ke Gemini 2.0 Flash) yang terhubung langsung ke billing Google Cloud Credit Anda, alih-alih menggunakan API key personal.
- **Database Connection:** Hubungkan service Cloud Run langsung ke PostgreSQL DB.

---

## 4. Analisis Referensi Proposal (TampungIn)
Proposal "TampungIn" ditujukan sebagai proposal kompetisi bisnis (Business Plan) dengan format:
1. **Ringkasan Eksekutif:** Penjelasan singkat solusi & peluang pasar.
2. **Pendahuluan:** Latar belakang masalah (contoh: timbulan sampah di Kab. Bandung), Visi & Misi, Penjelasan Produk.
3. **Pembahasan:** Analisis SWOT, Rencana Operasi, Rencana Pemasaran (STP & 4P), Rencana SDM (Struktur Organisasi), Rencana Keuangan (Laba/Rugi, BEP, rincian dana).
4. **Outcome:** Keberlanjutan (SDG), dampak masyarakat.
5. **Lampiran:** CV Tim, BMC, Wireframe Aplikasi, Analisis Kompetitor, User Journey.

### Adaptasi untuk Proposal BeeMate ke BINUS
Proposal BeeMate akan dimodifikasi menjadi **Proposal Adopsi Proyek & Pendanaan Internal Kampus**. Fokus utamanya bukan hanya jualan bisnis, tetapi bagaimana BeeMate **membantu ekosistem akademik dan prestasi BINUS University Bandung**.

---

## 5. Draf Struktur Proposal BeeMate untuk BINUS

### Halaman Judul (Cover)
*   **Judul:** Proposal Adopsi dan Pengembangan Platform Matchmaking "BeeMate" Berbasis Artificial Intelligence di Lingkungan BINUS University Bandung.
*   **Sub-Judul:** Solusi Kolaborasi Antar-Disiplin Ilmu untuk Meningkatkan Prestasi Hackathon dan Kompetisi Mahasiswa.
*   **Tim Pengusul:** (Nama Anda & NIM, BINUS University Bandung).

### BAB I: Ringkasan Eksekutif
*   Menjelaskan singkat apa itu BeeMate, masalah yang diselesaikan (sulitnya membentuk tim lomba yang seimbang di kampus), dan hasil yang diharapkan (peningkatan partisipasi dan kemenangan mahasiswa BINUS dalam kompetisi nasional/internasional).

### BAB II: Pendahuluan
*   **2.1 Latar Belakang:**
    *   BINUS University memiliki fokus kuat pada *Entrepreneurship* (program 3+1) dan inovasi teknologi.
    *   Mahasiswa BINUS sering didorong mengikuti kompetisi (hackathon, business plan, UI/UX).
    *   **Masalah Nyata:** Mahasiswa School of Computer Science (SoCS) kesulitan mencari desainer dari School of Design (SoD) atau konseptor bisnis dari BINUS Business School (BBS) di kampus Bandung. Akibatnya, tim yang terbentuk kurang seimbang (misal: isinya programmer semua tanpa desainer/hustler).
    *   Koordinasi tim pasca-terbentuk seringkali berantakan (WA group tidak terstruktur).
*   **2.2 Visi & Misi BeeMate:**
    *   *Visi:* Menjadi platform kolaborasi mahasiswa #1 di BINUS University untuk mendorong lahirnya startup mahasiswa berprestasi.
    *   *Misi:* Menyediakan teknologi pencocokan berbasis AI, mempermudah manajemen tugas tim, dan mengagregasi kompetisi relevan secara otomatis.
*   **2.3 Penjelasan Produk:**
    *   Detail fitur: BeeMatch AI, BeeCoach (AI mentor di chat), Chemistry Score, dan **Fitur Baru: AI Competition Aggregator (Scraper)**.

### BAB III: Pembahasan & Rencana Fungsional
*   **3.1 Analisis SWOT:**
    *   *Strengths:* Menggunakan teknologi AI termutakhir (Gemini), integrasi single-sign-on (direncanakan menggunakan email BINUS), codebase sudah siap pakai/live.
    *   *Weaknesses:* Ketergantungan awal pada Google Cloud API / credit (butuh dukungan kampus).
    *   *Opportunities:* Dukungan dari Inkubator BINUS (Bandung Creative Center / Binus Start), integrasi dengan program 3+1 (Enrichment).
    *   *Threats:* Platform sejenis berskala global (Devpost) yang tidak melokalisasi kebutuhan mahasiswa Indonesia.
*   **3.2 Rencana Operasional (BINUS Ecosystem):**
    *   Bagaimana mahasiswa login (menggunakan akun email `@binus.ac.id`).
    *   Kerjasama dengan Student Activity Unit (SAU) / Himpunan Mahasiswa (HIMTI, dll) untuk penyebaran platform.
*   **3.3 Rencana Pemasaran (STP & 4P di Kampus):**
    *   *Segmenting/Targeting:* Mahasiswa aktif BINUS Bandung dari semua jurusan.
    *   *Positioning:* "BeeMate — Find Your Hive: Jembatan kolaborasi AI untuk mahasiswa BINUS."
*   **3.4 Rencana SDM:**
    *   Struktur tim pengembang mahasiswa + Dosen Pembimbing (Mentor Akademik).
*   **3.5 Rencana Keuangan & Permohonan Pendanaan:**
    *   Penggunaan Google Cloud Credit (sudah dimiliki secara personal/tim) untuk operasional awal.
    *   Kebutuhan pendanaan dari BINUS untuk: Biaya maintenance server (Vercel Pro/Supabase DB), kampanye pemasaran internal, dan insentif pengembangan fitur.

### BAB IV: Dampak bagi BINUS (Outcomes & KPI)
*   **Keselarasan dengan SDGs:** SDG 4 (Pendidikan Berkualitas), SDG 8 (Pekerjaan Layak & Pertumbuhan Ekonomi).
*   **KPI Kunci untuk BINUS:**
    *   Peningkatan jumlah tim BINUS Bandung yang lolos ke tahap final kompetisi nasional.
    *   Terbentuknya startup mahasiswa lintas jurusan sejak dini.
    *   Platform ini dapat menjadi portofolio unggulan riset dan inovasi BINUS Bandung.

---

## 6. Implementasi Detail: Menggunakan RapidAPI di Next.js

Jika memilih **Opsi B (RapidAPI)** untuk mengambil data Instagram secara terarah, berikut adalah langkah-langkah implementasinya secara lengkap dari pendaftaran hingga penyimpanan database:

### Langkah 1: Registrasi & Dapatkan API Key di RapidAPI
1. Buka [RapidAPI.com](https://rapidapi.com).
2. Cari API dengan kata kunci **"Instagram Scraper"** (contoh populer: *Instagram Scraper* oleh `apidojo` atau `social-media-scraper`).
3. Masuk ke tab **"Pricing"** dan berlangganan **Free Plan** (biasanya memberikan 50–100 request gratis per bulan untuk uji coba).
4. Setelah berlangganan, buka tab **"Endpoints"**. Anda akan menemukan `x-rapidapi-key` (API Key personal Anda) dan `x-rapidapi-host` di bagian header panel kanan.

### Langkah 2: Buat Environment Variables
Tambahkan key tersebut di file `.env` (lokal) dan di settings environment variables Vercel (production):
```bash
RAPIDAPI_KEY="masukkan_key_anda_di_sini"
RAPIDAPI_HOST="instagram-scraper-api-host-dari-rapidapi"
```

### Langkah 3: Tulis Kode Server Action di Next.js
Kita membuat Server Action untuk melakukan fetch ke RapidAPI, mengambil postingan dari profil target (misal akun `@infomahasiswa`), kemudian memproses data teksnya menggunakan Gemini AI untuk diekstraksi ke database Supabase.

```typescript
// src/actions/instagram-scraper.actions.ts
"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Definisi skema ekstraksi AI
const competitionExtractorSchema = z.object({
  isCompetition: z.boolean().describe("Apakah postingan ini berisi tentang info kompetisi/lomba aktif?"),
  title: z.string().optional().describe("Nama kompetisi"),
  description: z.string().optional().describe("Deskripsi singkat syarat, hadiah, dan kategori lomba"),
  deadline: z.string().optional().describe("Tanggal deadline pendaftaran (format ISO 8601 YYYY-MM-DD)"),
  registrationLink: z.string().optional().describe("Link pendaftaran atau link bio yang tercantum"),
});

// src/actions/instagram-scraper.actions.ts
"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseAdmin, BEEMATE_STORAGE_BUCKET } from "@/lib/supabase/admin";

// Definisi skema ekstraksi AI
const competitionExtractorSchema = z.object({
  isCompetition: z.boolean().describe("Apakah postingan ini berisi tentang info kompetisi/lomba aktif?"),
  title: z.string().optional().describe("Nama kompetisi"),
  description: z.string().optional().describe("Deskripsi singkat syarat, hadiah, dan kategori lomba"),
  deadline: z.string().optional().describe("Tanggal deadline pendaftaran (format ISO 8601 YYYY-MM-DD)"),
  registrationLink: z.string().optional().describe("Link pendaftaran atau link bio yang tercantum"),
});

export async function scrapeInstagramAccount(targetUsername: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // 1. Panggil RapidAPI Instagram Scraper untuk mengambil postingan terbaru
    const response = await fetch(
      `https://${process.env.RAPIDAPI_HOST}/user/posts?username=${targetUsername}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
          "x-rapidapi-host": process.env.RAPIDAPI_HOST!,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`RapidAPI returned status ${response.status}`);
    }

    const result = await response.json();
    const posts = result.data?.items || []; // Tergantung struktur JSON dari provider API
    let newItemsCount = 0;

    // 2. Loop postingan dan saring menggunakan Gemini AI
    for (const post of posts) {
      const captionText = post.caption?.text || "";
      const imageUrl = post.image_versions2?.candidates?.[0]?.url || post.thumbnail_url || null;

      if (!captionText) continue;

      // Gunakan Gemini untuk menganalisis dan mengekstrak info lomba dari caption
      const aiResponse = await generateObject({
        model: google("gemini-2.0-flash"),
        schema: competitionExtractorSchema,
        prompt: `Analisis teks caption postingan Instagram berikut:\n\n"${captionText}"\n\n
                 Tentukan apakah postingan ini merupakan info lomba/kompetisi mahasiswa. 
                 Jika ya, ekstrak nama lomba, deskripsi singkat, deadline, dan link pendaftaran.`,
      });

      const data = aiResponse.object;

      // Jika postingan dikonfirmasi sebagai lomba oleh AI dan deadline belum lewat
      if (data.isCompetition && data.title && data.deadline) {
        const deadlineDate = new Date(data.deadline);
        
        if (deadlineDate > new Date()) { // Hanya simpan lomba yang belum kedaluwarsa
          
          // Cek apakah lomba dengan judul yang sama sudah ada di DB
          const existing = await prisma.competition.findFirst({
            where: {
              title: {
                equals: data.title,
                mode: "insensitive",
              },
            },
          });

          if (!existing) {
            let finalImageUrl: string | null = null;

            // PENTING: Download dan upload gambar ke Supabase Storage
            // karena URL gambar bawaan Instagram CDN akan kedaluwarsa/mati dalam 24 jam!
            if (imageUrl) {
              try {
                const imgResponse = await fetch(imageUrl);
                if (imgResponse.ok) {
                  const imageBuffer = Buffer.from(await imgResponse.arrayBuffer());
                  const fileExt = "jpg"; // format standard Instagram CDN
                  const storagePath = `competitions/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
                  
                  const supabase = createSupabaseAdmin();
                  const { error: uploadError } = await supabase.storage
                    .from(BEEMATE_STORAGE_BUCKET)
                    .upload(storagePath, imageBuffer, {
                      contentType: "image/jpeg",
                      upsert: false,
                    });

                  if (!uploadError) {
                    const { data: { publicUrl } } = supabase.storage
                      .from(BEEMATE_STORAGE_BUCKET)
                      .getPublicUrl(storagePath);
                    finalImageUrl = publicUrl;
                  } else {
                    console.error("Supabase upload error:", uploadError);
                  }
                }
              } catch (imgErr) {
                console.error("Failed to download or upload Instagram image:", imgErr);
              }
            }

            await prisma.competition.create({
              data: {
                title: data.title,
                description: data.description || "Detail dapat dilihat pada link pendaftaran.",
                registrationLink: data.registrationLink || `https://instagram.com/p/${post.code}`,
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
    return { success: true, message: `Scraping selesai. Menambahkan ${newItemsCount} lomba baru.` };

  } catch (error) {
    console.error("[SCRAPE_INSTAGRAM_ERROR]", error);
    return { success: false, error: "Gagal memproses data Instagram." };
  }
}
```

---

## 7. Langkah Kerja Selanjutnya
1.  **Pembuatan Draft Proposal:** Saya akan mulai membuat draf proposal lengkap dalam bentuk Markdown di folder `Proposal` (misalnya `Proposal/Proposal_BeeMate_BINUS.md`).
2.  **Visual Asset:** Membuat rancangan arsitektur data/flow diagram menggunakan format Mermaid di dalam dokumen proposal.
3.  **Uji Coba Kode:** Setelah draf proposal disetujui, kita bisa langsung menulis file Server Action di atas ke dalam codebase riil kita untuk mulai menguji coba fiturnya!
