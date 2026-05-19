"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * Create a new competition
 */
export async function createCompetition(data: {
  title: string
  description: string
  imageUrl?: string
  registrationLink?: string
  deadline?: Date
}) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    const competition = await prisma.competition.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        registrationLink: data.registrationLink,
        deadline: data.deadline,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    revalidatePath("/competitions")
    return { success: true, data: competition }
  } catch (error) {
    console.error("Error creating competition:", error)
    return { success: false, error: "Failed to create competition" }
  }
}

/**
 * Get all competitions (with pagination and filters)
 */
export async function getCompetitions(options?: {
  page?: number
  limit?: number
  upcoming?: boolean
}) {
  try {
    const page = options?.page || 1
    const limit = options?.limit || 10
    const skip = (page - 1) * limit

    const where = options?.upcoming
      ? {
          deadline: {
            gte: new Date(),
          },
        }
      : {}

    const [competitions, total] = await Promise.all([
      prisma.competition.findMany({
        where,
        skip,
        take: limit,
        orderBy: { deadline: "asc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.competition.count({ where }),
    ])

    return {
      success: true,
      data: {
        competitions,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    }
  } catch (error) {
    console.error("Error getting competitions:", error)
    return { success: false, error: "Failed to get competitions" }
  }
}

/**
 * Get competition by ID
 */
export async function getCompetitionById(competitionId: string) {
  try {
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
    })

    if (!competition) {
      return { success: false, error: "Competition not found" }
    }

    return { success: true, data: competition }
  } catch (error) {
    console.error("Error getting competition:", error)
    return { success: false, error: "Failed to get competition" }
  }
}

/**
 * Update competition
 */
export async function updateCompetition(
  competitionId: string,
  data: {
    title?: string
    description?: string
    imageUrl?: string
    registrationLink?: string
    deadline?: Date
  }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Check if user is the author or admin
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
    })

    if (!competition) {
      return { success: false, error: "Competition not found" }
    }

    if (competition.authorId !== user.id && user.role !== "ADMIN") {
      return { success: false, error: "Only author or admin can update competition" }
    }

    const updatedCompetition = await prisma.competition.update({
      where: { id: competitionId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.registrationLink !== undefined && { registrationLink: data.registrationLink }),
        ...(data.deadline !== undefined && { deadline: data.deadline }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    revalidatePath(`/competitions/${competitionId}`)
    revalidatePath("/competitions")
    return { success: true, data: updatedCompetition }
  } catch (error) {
    console.error("Error updating competition:", error)
    return { success: false, error: "Failed to update competition" }
  }
}

/**
 * Delete competition
 */
export async function deleteCompetition(competitionId: string) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Check if user is the author or admin
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
    })

    if (!competition) {
      return { success: false, error: "Competition not found" }
    }

    if (competition.authorId !== user.id && user.role !== "ADMIN") {
      return { success: false, error: "Only author or admin can delete competition" }
    }

    await prisma.competition.delete({
      where: { id: competitionId },
    })

    revalidatePath("/competitions")
    return { success: true, message: "Competition deleted successfully" }
  } catch (error) {
    console.error("Error deleting competition:", error)
    return { success: false, error: "Failed to delete competition" }
  }
}

/**
 * Search competitions
 */
export async function searchCompetitions(query: string, limit = 10) {
  try {
    const competitions = await prisma.competition.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      take: limit,
      orderBy: { deadline: "asc" },
    })

    return { success: true, data: competitions }
  } catch (error) {
    console.error("Error searching competitions:", error)
    return { success: false, error: "Failed to search competitions" }
  }
}
