"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { createTeamSchema, validate } from "@/lib/validations"

/**
 * Create a new team
 */
export async function createTeam(data: {
  name: string
  description?: string
}) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    // Zod validation
    const validation = validate(createTeamSchema, data)
    if (!validation.success) return validation

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    const team = await prisma.team.create({
      data: {
        name: data.name,
        description: data.description,
        leaderId: user.id,
      },
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    })

    revalidatePath("/teams")
    return { success: true, data: team }
  } catch (error) {
    console.error("Error creating team:", error)
    return { success: false, error: "Failed to create team" }
  }
}

/**
 * Get all teams (with pagination)
 */
export async function getTeams(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          leader: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              members: true,
            },
          },
        },
      }),
      prisma.team.count(),
    ])

    return {
      success: true,
      data: {
        teams,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    }
  } catch (error) {
    console.error("Error getting teams:", error)
    return { success: false, error: "Failed to get teams" }
  }
}

/**
 * Get team by ID with members
 */
export async function getTeamById(teamId: string) {
  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                title: true,
                skills: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!team) {
      return { success: false, error: "Team not found" }
    }

    return { success: true, data: team }
  } catch (error) {
    console.error("Error getting team:", error)
    return { success: false, error: "Failed to get team" }
  }
}

/**
 * Update team
 */
export async function updateTeam(
  teamId: string,
  data: {
    name?: string
    description?: string
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

    // Check if user is the team leader
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    })

    if (!team) {
      return { success: false, error: "Team not found" }
    }

    if (team.leaderId !== user.id) {
      return { success: false, error: "Only team leader can update team" }
    }

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
      },
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    revalidatePath(`/teams/${teamId}`)
    revalidatePath("/teams")
    return { success: true, data: updatedTeam }
  } catch (error) {
    console.error("Error updating team:", error)
    return { success: false, error: "Failed to update team" }
  }
}

/**
 * Delete team
 */
export async function deleteTeam(teamId: string) {
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

    // Check if user is the team leader
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    })

    if (!team) {
      return { success: false, error: "Team not found" }
    }

    if (team.leaderId !== user.id) {
      return { success: false, error: "Only team leader can delete team" }
    }

    await prisma.team.delete({
      where: { id: teamId },
    })

    revalidatePath("/teams")
    return { success: true, message: "Team deleted successfully" }
  } catch (error) {
    console.error("Error deleting team:", error)
    return { success: false, error: "Failed to delete team" }
  }
}

/**
 * Get user's teams (as leader or member)
 */
export async function getUserTeams() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        teamsCreated: {
          include: {
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
        teamMembers: {
          where: {
            joinStatus: "ACCEPTED",
          },
          include: {
            team: {
              include: {
                leader: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
                _count: {
                  select: {
                    members: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    return {
      success: true,
      data: {
        asLeader: user.teamsCreated,
        asMember: user.teamMembers.map((tm) => tm.team),
      },
    }
  } catch (error) {
    console.error("Error getting user teams:", error)
    return { success: false, error: "Failed to get user teams" }
  }
}
