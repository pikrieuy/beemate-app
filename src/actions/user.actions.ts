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
