"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { generateText } from "ai"
import { geminiFlash } from "@/lib/ai"

// ==========================================
// 1. AI SKILL EXTRACTOR
// ==========================================

/**
 * Extract skills from a text (bio, LinkedIn paste, CV text).
 * Returns suggested skills and a generated bio summary.
 */
export async function extractSkillsFromText(text: string) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    if (!text?.trim() || text.trim().length < 10) {
      return { success: false, error: "Teks terlalu pendek (minimal 10 karakter)" }
    }

    if (text.length > 3000) {
      return { success: false, error: "Teks terlalu panjang (maksimal 3000 karakter)" }
    }

    const { text: result } = await generateText({
      model: geminiFlash,
      prompt: `Ekstrak skills dari teks ini. Output HANYA JSON valid, tanpa penjelasan apapun.

Teks: "${text.trim()}"

JSON format:
{"skills":["skill1","skill2"],"title":"Hacker","bio":"ringkasan singkat"}

Rules: skills max 8, title harus Hacker/Hustler/Hipster, bio max 50 kata bahasa Indonesia.`,
      maxTokens: 300,
    })

    // Parse JSON — handle various response formats from Gemini 2.5
    let jsonStr = result.trim()
    // Remove markdown code blocks
    jsonStr = jsonStr.replace(/```json\s*/gi, "").replace(/```\s*/g, "")
    // Find JSON object in response (in case there's extra text)
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("AI raw response:", result)
      return { success: false, error: `AI format error. Raw: ${result.slice(0, 200)}` }
    }
    const parsed = JSON.parse(jsonMatch[0])

    return {
      success: true,
      data: {
        skills: (parsed.skills ?? []).slice(0, 8) as string[],
        title: ["Hacker", "Hustler", "Hipster"].includes(parsed.title) ? parsed.title : "Hacker",
        bio: (parsed.bio ?? "").slice(0, 500) as string,
      },
    }
  } catch (error: any) {
    console.error("Error extracting skills:", error?.message || error)
    const msg = error?.message?.includes("quota") 
      ? "Quota API habis. Coba lagi nanti."
      : error?.message?.includes("deprecated") || error?.message?.includes("no longer available")
      ? "Model AI sedang diupdate. Coba lagi."
      : "Gagal mengekstrak skills. Coba lagi."
    return { success: false, error: msg }
    return { success: false, error: "Gagal mengekstrak skills. Coba lagi." }
  }
}

// ==========================================
// 2. TEAM CHEMISTRY SCORE
// ==========================================

interface ChemistryResult {
  overallScore: number // 0-100
  breakdown: {
    roleBalance: number // 0-100 — apakah ada Hacker+Hustler+Hipster
    skillDiversity: number // 0-100 — seberapa beragam skill
    skillCoverage: number // 0-100 — coverage area (tech, business, design)
    teamSize: number // 0-100 — optimal size (3-5 = 100)
  }
  strengths: string[]
  weaknesses: string[]
  suggestion: string
}

/**
 * Calculate team chemistry score based on member composition.
 */
export async function getTeamChemistry(teamId: string): Promise<{ success: boolean; data?: ChemistryResult; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        leader: { select: { id: true, name: true, title: true, skills: true } },
        members: {
          where: { joinStatus: "ACCEPTED" },
          include: {
            user: { select: { id: true, name: true, title: true, skills: true } },
          },
        },
      },
    })

    if (!team) {
      return { success: false, error: "Tim tidak ditemukan" }
    }

    // Collect all members including leader
    const allMembers = [
      { ...team.leader },
      ...team.members.map((m) => m.user),
    ]

    const totalMembers = allMembers.length
    const roles = allMembers.map((m) => m.title).filter(Boolean)
    const allSkills = allMembers.flatMap((m) => m.skills)
    const uniqueSkills = [...new Set(allSkills)]

    // 1. Role Balance (0-100)
    const hasHacker = roles.includes("Hacker")
    const hasHustler = roles.includes("Hustler")
    const hasHipster = roles.includes("Hipster")
    const roleCount = [hasHacker, hasHustler, hasHipster].filter(Boolean).length
    const roleBalance = Math.round((roleCount / 3) * 100)

    // 2. Skill Diversity (0-100) — unique skills / total skills
    const skillDiversity = allSkills.length > 0
      ? Math.min(100, Math.round((uniqueSkills.length / Math.max(allSkills.length, 1)) * 100 * 1.5))
      : 0

    // 3. Skill Coverage — tech, business, design areas
    const techSkills = ["React", "Node.js", "Python", "TypeScript", "JavaScript", "Flutter", "Docker", "AWS", "PostgreSQL", "Firebase", "REST API", "CI/CD", "Linux", "TensorFlow", "Data Analysis", "Machine Learning"]
    const bizSkills = ["Marketing", "Sales", "Pitching", "Business Model", "Agile", "Scrum", "Leadership", "Communication", "Product", "Community", "Events", "Project Management"]
    const designSkills = ["Figma", "UI Design", "UX", "Prototyping", "Design Systems", "Illustration", "Branding", "Motion Graphics", "Content Strategy", "Copywriting"]

    const hasTech = uniqueSkills.some((s) => techSkills.some((ts) => s.toLowerCase().includes(ts.toLowerCase())))
    const hasBiz = uniqueSkills.some((s) => bizSkills.some((bs) => s.toLowerCase().includes(bs.toLowerCase())))
    const hasDesign = uniqueSkills.some((s) => designSkills.some((ds) => s.toLowerCase().includes(ds.toLowerCase())))
    const coverageCount = [hasTech, hasBiz, hasDesign].filter(Boolean).length
    const skillCoverage = Math.round((coverageCount / 3) * 100)

    // 4. Team Size (optimal: 3-5)
    let teamSize = 100
    if (totalMembers < 2) teamSize = 30
    else if (totalMembers === 2) teamSize = 60
    else if (totalMembers >= 3 && totalMembers <= 5) teamSize = 100
    else if (totalMembers === 6) teamSize = 80
    else teamSize = 60

    // Overall score (weighted)
    const overallScore = Math.round(
      roleBalance * 0.3 +
      skillDiversity * 0.25 +
      skillCoverage * 0.3 +
      teamSize * 0.15
    )

    // Strengths & Weaknesses
    const strengths: string[] = []
    const weaknesses: string[] = []

    if (roleBalance >= 66) strengths.push("Role balance bagus — ada kombinasi yang solid")
    if (roleBalance < 33) weaknesses.push("Kurang variasi role — cari anggota dengan role berbeda")
    if (skillDiversity >= 70) strengths.push("Skill beragam — tim bisa handle banyak aspek")
    if (skillDiversity < 40) weaknesses.push("Skill terlalu mirip — butuh diversifikasi")
    if (skillCoverage >= 66) strengths.push("Coverage lengkap — tech, bisnis, dan desain tercover")
    if (!hasTech) weaknesses.push("Belum ada skill teknis — butuh developer")
    if (!hasDesign) weaknesses.push("Belum ada skill desain — butuh designer")
    if (!hasBiz) weaknesses.push("Belum ada skill bisnis — butuh hustler")
    if (teamSize === 100) strengths.push("Ukuran tim ideal (3-5 orang)")
    if (totalMembers < 3) weaknesses.push("Tim terlalu kecil — rekrut 1-2 orang lagi")

    // AI suggestion
    let suggestion = "Tim kamu sudah solid! Fokus ke eksekusi."
    if (overallScore < 50) {
      suggestion = `Rekrut ${!hasHacker ? "Hacker" : !hasHipster ? "Hipster" : "Hustler"} untuk melengkapi tim. Gunakan BeeMatch AI untuk cari kandidat.`
    } else if (overallScore < 75) {
      suggestion = weaknesses.length > 0 ? `Pertimbangkan: ${weaknesses[0]}` : "Tim cukup bagus, bisa mulai eksekusi."
    }

    return {
      success: true,
      data: {
        overallScore,
        breakdown: { roleBalance, skillDiversity, skillCoverage, teamSize },
        strengths,
        weaknesses,
        suggestion,
      },
    }
  } catch (error) {
    console.error("Error calculating team chemistry:", error)
    return { success: false, error: "Gagal menghitung chemistry tim" }
  }
}

// ==========================================
// 3. AI COMPETITION RECOMMENDER
// ==========================================

/**
 * Recommend competitions based on user's skills and profile.
 */
export async function getCompetitionRecommendations() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { skills: true, title: true, bio: true },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Get upcoming competitions
    const competitions = await prisma.competition.findMany({
      where: {
        deadline: { gte: new Date() },
      },
      orderBy: { deadline: "asc" },
      take: 10,
      select: {
        id: true,
        title: true,
        description: true,
        deadline: true,
      },
    })

    if (competitions.length === 0) {
      return { success: true, data: [] }
    }

    // Use AI to rank competitions by relevance
    const competitionList = competitions
      .map((c, i) => `${i + 1}. "${c.title}" — ${c.description.slice(0, 100)}`)
      .join("\n")

    const { text: result } = await generateText({
      model: geminiFlash,
      prompt: `Kamu adalah AI yang merekomendasikan kompetisi untuk mahasiswa.

PROFIL USER:
- Role: ${user.title ?? "Belum diisi"}
- Skills: ${user.skills.join(", ") || "Belum diisi"}
${user.bio ? `- Bio: ${user.bio}` : ""}

KOMPETISI TERSEDIA:
${competitionList}

Berikan ranking kompetisi dari yang PALING COCOK untuk user ini. Output JSON array (HANYA JSON):
[
  { "index": 1, "reason": "alasan singkat 10 kata" },
  ...
]

Urutkan dari paling cocok. Maksimal 5 kompetisi.`,
      maxTokens: 300,
    })

    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    const rankings = JSON.parse(cleaned) as Array<{ index: number; reason: string }>

    const recommended = rankings
      .filter((r) => r.index >= 1 && r.index <= competitions.length)
      .map((r) => ({
        ...competitions[r.index - 1],
        reason: r.reason,
      }))

    return { success: true, data: recommended }
  } catch (error) {
    console.error("Error getting competition recommendations:", error)
    return { success: false, error: "Gagal mendapatkan rekomendasi" }
  }
}

// ==========================================
// 4. TRENDING SKILLS
// ==========================================

/**
 * Get trending/most common skills across all users.
 * Returns top skills with counts.
 */
export async function getTrendingSkills(limit = 10) {
  try {
    // Get all user skills
    const users = await prisma.user.findMany({
      where: {
        skills: { isEmpty: false },
      },
      select: { skills: true },
    })

    // Count skill frequency
    const skillCounts: Record<string, number> = {}
    for (const user of users) {
      for (const skill of user.skills) {
        skillCounts[skill] = (skillCounts[skill] ?? 0) + 1
      }
    }

    // Sort by count and take top N
    const trending = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([skill, count]) => ({ skill, count }))

    const totalUsers = users.length

    return {
      success: true,
      data: {
        trending,
        totalUsers,
      },
    }
  } catch (error) {
    console.error("Error getting trending skills:", error)
    return { success: false, error: "Gagal memuat trending skills" }
  }
}
