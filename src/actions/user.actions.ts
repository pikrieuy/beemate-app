"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * Get current user profile
 */
export async function getCurrentUser() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        skills: true,
        title: true,
        portfolioUrl: true,
        role: true,
        createdAt: true,
        endorsementsReceived: {
          select: {
            senderId: true,
            skill: true,
          },
        },
      },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    return { success: true, data: user }
  } catch (error) {
    console.error("Error getting current user:", error)
    return { success: false, error: "Failed to get user" }
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: {
  name?: string
  bio?: string
  skills?: string[]
  title?: string
  portfolioUrl?: string
  image?: string
}) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    // Server-side validation
    if (data.name !== undefined) {
      if (data.name.trim().length < 2) return { success: false, error: "Nama minimal 2 karakter" }
      if (data.name.trim().length > 50) return { success: false, error: "Nama maksimal 50 karakter" }
    }
    if (data.bio !== undefined && data.bio.length > 500) {
      return { success: false, error: "Bio maksimal 500 karakter" }
    }
    if (data.portfolioUrl !== undefined && data.portfolioUrl) {
      try { new URL(data.portfolioUrl) } catch {
        return { success: false, error: "URL portfolio tidak valid" }
      }
    }
    if (data.skills !== undefined && data.skills.length > 20) {
      return { success: false, error: "Maksimal 20 skills" }
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.skills !== undefined && { skills: data.skills }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.portfolioUrl !== undefined && { portfolioUrl: data.portfolioUrl }),
        ...(data.image !== undefined && { image: data.image }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        skills: true,
        title: true,
        portfolioUrl: true,
      },
    })

    revalidatePath("/profile")
    return { success: true, data: user }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

/**
 * Get user by ID (for public profiles)
 */
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        skills: true,
        title: true,
        portfolioUrl: true,
        createdAt: true,
        _count: {
          select: {
            teamsCreated: true,
            teamMembers: true,
          },
        },
        endorsementsReceived: {
          select: {
            senderId: true,
            skill: true,
          },
        },
      },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    return { success: true, data: user }
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return { success: false, error: "Failed to get user" }
  }
}

/**
 * Search users by name or skills
 */
export async function searchUsers(query: string, limit = 10) {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { skills: { has: query } },
          { title: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        skills: true,
        title: true,
      },
      take: limit,
    })

    return { success: true, data: users }
  } catch (error) {
    console.error("Error searching users:", error)
    return { success: false, error: "Failed to search users" }
  }
}

/**
 * Change user role (ADMIN only)
 */
export async function changeUserRole(targetUserId: string, newRole: "USER" | "ADMIN") {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    })

    if (!currentUser || currentUser.role !== "ADMIN") {
      return { success: false, error: "Only admins can change user roles" }
    }

    if (currentUser.id === targetUserId) {
      return { success: false, error: "Cannot change your own role" }
    }

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: { id: true, name: true, role: true },
    })

    revalidatePath("/admin/users")
    return { success: true, data: updated }
  } catch (error) {
    console.error("Error changing user role:", error)
    return { success: false, error: "Failed to change user role" }
  }
}

/**
 * Get all users (ADMIN only)
 */
export async function getAllUsers() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    })

    if (!currentUser || currentUser.role !== "ADMIN") {
      return { success: false, error: "Only admins can view all users" }
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        title: true,
        skills: true,
        createdAt: true,
        _count: {
          select: { teamsCreated: true, teamMembers: true },
        },
      },
    })

    return { success: true, data: users }
  } catch (error) {
    console.error("Error getting all users:", error)
    return { success: false, error: "Failed to get users" }
  }
}

/**
 * Delete current user account and all associated data
 */
export async function deleteAccount() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Delete in order to respect FK constraints:
    // 1. Notifications (sent & received)
    await prisma.notification.deleteMany({
      where: { OR: [{ recipientId: user.id }, { senderId: user.id }] },
    })

    // 2. TeamMember records
    await prisma.teamMember.deleteMany({ where: { userId: user.id } })

    // 3. Teams led by this user — transfer or delete
    //    For simplicity: delete teams where user is leader (cascades members)
    await prisma.team.deleteMany({ where: { leaderId: user.id } })

    // 4. Competitions authored by this user
    await prisma.competition.deleteMany({ where: { authorId: user.id } })

    // 5. Auth accounts & sessions
    await prisma.account.deleteMany({ where: { userId: user.id } })
    await prisma.session.deleteMany({ where: { userId: user.id } })

    // 6. Finally delete the user
    await prisma.user.delete({ where: { id: user.id } })

    return { success: true }
  } catch (error) {
    console.error("Error deleting account:", error)
    return { success: false, error: "Gagal menghapus akun. Coba lagi." }
  }
}

/**
 * Endorse a skill of another user
 */
export async function endorseSkill(recipientId: string, skill: string) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!sender) {
      return { success: false, error: "Sender not found" }
    }

    if (sender.id === recipientId) {
      return { success: false, error: "Cannot endorse your own skills" }
    }

    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
      select: { id: true, skills: true }
    })

    if (!recipient) {
      return { success: false, error: "Recipient not found" }
    }

    if (!recipient.skills.includes(skill)) {
      return { success: false, error: "User does not have this skill" }
    }

    const existing = await prisma.endorsement.findUnique({
      where: {
        senderId_recipientId_skill: {
          senderId: sender.id,
          recipientId,
          skill,
        }
      }
    })

    if (existing) {
      return { success: false, error: "Already endorsed this skill" }
    }

    await prisma.endorsement.create({
      data: {
        senderId: sender.id,
        recipientId,
        skill,
      }
    })

    revalidatePath(`/profile/${recipientId}`)
    return { success: true }
  } catch (error) {
    console.error("Error endorsing skill:", error)
    return { success: false, error: "Failed to endorse skill" }
  }
}

/**
 * Remove an endorsement from a skill of another user
 */
export async function removeEndorsement(recipientId: string, skill: string) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!sender) {
      return { success: false, error: "Sender not found" }
    }

    await prisma.endorsement.delete({
      where: {
        senderId_recipientId_skill: {
          senderId: sender.id,
          recipientId,
          skill,
        }
      }
    })

    revalidatePath(`/profile/${recipientId}`)
    return { success: true }
  } catch (error) {
    console.error("Error removing endorsement:", error)
    return { success: false, error: "Failed to remove endorsement" }
  }
}
