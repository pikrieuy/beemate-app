"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"

/**
 * Helper to get active user ID from session
 */
async function getActiveUser() {
  const session = await auth()
  if (!session?.user?.email) return null
  return prisma.user.findUnique({
    where: { email: session.user.email },
  })
}

/**
 * Mendapatkan rekomendasi developer untuk suatu tim (untuk dibaca oleh Leader)
 */
export async function getDeveloperRecommendationsForTeam(teamId: string) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return { success: false, error: "Silakan login terlebih dahulu" }
    }

    // Ambil detail tim beserta anggota & leadernya
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        leader: true,
        members: {
          where: { joinStatus: "ACCEPTED" },
          include: {
            user: true
          }
        }
      }
    })

    if (!team) {
      return { success: false, error: "Tim tidak ditemukan" }
    }

    if (team.leaderId !== user.id) {
      return { success: false, error: "Hanya pemimpin tim yang dapat melihat rekomendasi ini" }
    }

    // Tentukan role yang sudah ada di tim
    const currentRoles = new Set<string>()
    if (team.leader.title) {
      currentRoles.add(team.leader.title.toUpperCase())
    }
    team.members.forEach(m => {
      if (m.user.title) {
        currentRoles.add(m.user.title.toUpperCase())
      }
    })

    // Tentukan role yang belum ada di tim
    const allRoles = ["HACKER", "HUSTLER", "HIPSTER"]
    const missingRoles = allRoles.filter(r => !currentRoles.has(r))

    // Kumpulkan ID user yang sudah ada di tim (termasuk leader) atau yang sedang pending diundang
    const existingMemberUsers = await prisma.teamMember.findMany({
      where: { teamId },
      select: { userId: true, joinStatus: true }
    })
    const excludedUserIds = new Set<string>()
    excludedUserIds.add(team.leaderId)
    existingMemberUsers.forEach(m => excludedUserIds.add(m.userId))

    // Ambil daftar semua user lain di database
    const allOtherUsers = await prisma.user.findMany({
      where: {
        id: {
          notIn: Array.from(excludedUserIds)
        }
      },
      select: {
        id: true,
        name: true,
        image: true,
        title: true,
        bio: true,
        skills: true
      }
    })

    // Kumpulkan status undangan untuk user lain ini (apakah sudah diundang/PENDING)
    const pendingInvites = existingMemberUsers.filter(m => m.joinStatus === "PENDING").map(m => m.userId)

    // Hitung kecocokan score untuk masing-masing user
    const recommendations = allOtherUsers.map(u => {
      let score = 0
      const userRole = u.title?.toUpperCase() || ""

      // 1. Role komplementer: +10 poin jika memenuhi role yang belum ada di tim
      if (userRole && missingRoles.includes(userRole)) {
        score += 10
      }

      // 2. Keterkaitan Keahlian: +3 poin per kecocokan skill
      const teamDescription = (team.description || "").toLowerCase()
      const matchingSkills = u.skills.filter(skill => 
        teamDescription.includes(skill.toLowerCase())
      )
      score += matchingSkills.length * 3

      return {
        user: u,
        score,
        isAlreadyInvited: pendingInvites.includes(u.id),
        matchingSkills
      }
    })

    // Urutkan berdasarkan score tertinggi, limit 10
    recommendations.sort((a, b) => b.score - a.score)
    const topRecommendations = recommendations.slice(0, 10)

    return {
      success: true,
      data: {
        recommendations: topRecommendations,
        missingRoles,
        currentRoles: Array.from(currentRoles)
      }
    }
  } catch (error) {
    console.error("Error recommending developers:", error)
    return { success: false, error: "Gagal memuat rekomendasi developer" }
  }
}

/**
 * Mendapatkan rekomendasi tim untuk developer individu (untuk dibaca oleh Anggota)
 */
export async function getTeamRecommendationsForUser() {
  try {
    const user = await getActiveUser()
    if (!user) {
      return { success: false, error: "Silakan login terlebih dahulu" }
    }

    const userRole = user.title?.toUpperCase() || ""
    const userSkills = user.skills || []

    // Cari tim yang di mana user belum bergabung dan bukan leader
    const userMemberships = await prisma.teamMember.findMany({
      where: { userId: user.id },
      select: { teamId: true }
    })
    const excludedTeamIds = userMemberships.map(m => m.teamId)

    const allOtherTeams = await prisma.team.findMany({
      where: {
        leaderId: { not: user.id },
        id: { notIn: excludedTeamIds }
      },
      include: {
        leader: true,
        members: {
          where: { joinStatus: "ACCEPTED" },
          include: {
            user: true
          }
        }
      }
    })

    const recommendations = allOtherTeams.map(team => {
      let score = 0

      // Tentukan role yang ada di tim saat ini
      const teamRoles = new Set<string>()
      if (team.leader.title) {
        teamRoles.add(team.leader.title.toUpperCase())
      }
      team.members.forEach(m => {
        if (m.user.title) {
          teamRoles.add(m.user.title.toUpperCase())
        }
      })

      // 1. Role komplementer: jika role user belum ada di tim, berikan poin +10
      if (userRole && !teamRoles.has(userRole)) {
        score += 10
      }

      // 2. Skill alignment: jika deskripsi tim memuat salah satu skill user, berikan +3 poin per skill
      const teamDesc = (team.description || "").toLowerCase()
      const matchingSkills = userSkills.filter(skill => 
        teamDesc.includes(skill.toLowerCase())
      )
      score += matchingSkills.length * 3

      return {
        team,
        score,
        matchingSkills
      }
    })

    // Urutkan berdasarkan score tertinggi, limit 10
    recommendations.sort((a, b) => b.score - a.score)
    const topRecommendations = recommendations.slice(0, 10)

    return {
      success: true,
      data: topRecommendations
    }
  } catch (error) {
    console.error("Error recommending teams:", error)
    return { success: false, error: "Gagal memuat rekomendasi tim" }
  }
}
