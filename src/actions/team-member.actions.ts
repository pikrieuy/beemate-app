"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { createNotification } from "./notification.actions"
import { sendTeamInviteEmail, sendInviteAcceptedEmail } from "@/lib/email"

/**
 * Invite user to team
 */
export async function inviteUserToTeam(teamId: string, userId: string) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return { success: false, error: "User not found" }
    }

    // Check if current user is team leader
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    })

    if (!team) {
      return { success: false, error: "Team not found" }
    }

    if (team.leaderId !== currentUser.id) {
      return { success: false, error: "Only team leader can invite members" }
    }

    // Check if user already in team
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    })

    if (existingMember) {
      return { success: false, error: "User already invited or in team" }
    }

    // Create team member with PENDING status
    const teamMember = await prisma.teamMember.create({
      data: {
        teamId,
        userId,
        role: "MEMBER",
        joinStatus: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Create notification for invited user
    await createNotification({
      recipientId: userId,
      senderId: currentUser.id,
      type: "INVITE",
      message: `${currentUser.name} invited you to join team "${team.name}"`,
    })

    // Send email notification (fire-and-forget, non-blocking)
    const invitedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    })
    if (invitedUser?.email) {
      sendTeamInviteEmail({
        recipientEmail: invitedUser.email,
        recipientName: invitedUser.name ?? "Pengguna",
        senderName: currentUser.name ?? "Seseorang",
        teamName: team.name,
        teamDescription: team.description,
      }).catch(() => {}); // silently ignore email errors
    }

    revalidatePath(`/teams/${teamId}`)
    return { success: true, data: teamMember }
  } catch (error) {
    console.error("Error inviting user to team:", error)
    return { success: false, error: "Failed to invite user" }
  }
}

/**
 * Accept team invitation
 */
export async function acceptTeamInvitation(teamId: string) {
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

    const teamMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
      include: {
        team: {
          include: {
            leader: true,
          },
        },
      },
    })

    if (!teamMember) {
      return { success: false, error: "Invitation not found" }
    }

    if (teamMember.joinStatus !== "PENDING") {
      return { success: false, error: "Invitation already processed" }
    }

    // Update status to ACCEPTED
    const updatedMember = await prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
      data: {
        joinStatus: "ACCEPTED",
      },
    })

    // Notify team leader
    await createNotification({
      recipientId: teamMember.team.leaderId,
      senderId: user.id,
      type: "ACCEPT",
      message: `${user.name} accepted your invitation to join "${teamMember.team.name}"`,
    })

    // Send email to team leader (fire-and-forget)
    const leader = await prisma.user.findUnique({
      where: { id: teamMember.team.leaderId },
      select: { email: true, name: true },
    })
    if (leader?.email) {
      sendInviteAcceptedEmail({
        recipientEmail: leader.email,
        recipientName: leader.name ?? "Leader",
        acceptorName: user.name ?? "Seseorang",
        teamName: teamMember.team.name,
        teamId,
      }).catch(() => {});
    }

    revalidatePath(`/teams/${teamId}`)
    revalidatePath("/notifications")
    return { success: true, data: updatedMember }
  } catch (error) {
    console.error("Error accepting invitation:", error)
    return { success: false, error: "Failed to accept invitation" }
  }
}

/**
 * Reject team invitation
 */
export async function rejectTeamInvitation(teamId: string) {
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

    const teamMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    })

    if (!teamMember) {
      return { success: false, error: "Invitation not found" }
    }

    if (teamMember.joinStatus !== "PENDING") {
      return { success: false, error: "Invitation already processed" }
    }

    // Update status to REJECTED
    const updatedMember = await prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
      data: {
        joinStatus: "REJECTED",
      },
    })

    revalidatePath("/notifications")
    return { success: true, data: updatedMember }
  } catch (error) {
    console.error("Error rejecting invitation:", error)
    return { success: false, error: "Failed to reject invitation" }
  }
}

/**
 * Remove member from team
 */
export async function removeMemberFromTeam(teamId: string, userId: string) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return { success: false, error: "User not found" }
    }

    // Check if current user is team leader
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    })

    if (!team) {
      return { success: false, error: "Team not found" }
    }

    if (team.leaderId !== currentUser.id) {
      return { success: false, error: "Only team leader can remove members" }
    }

    // Delete team member
    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    })

    revalidatePath(`/teams/${teamId}`)
    return { success: true, message: "Member removed successfully" }
  } catch (error) {
    console.error("Error removing member:", error)
    return { success: false, error: "Failed to remove member" }
  }
}

/**
 * Leave team (for members)
 */
export async function leaveTeam(teamId: string) {
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

    // Check if user is team leader
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    })

    if (!team) {
      return { success: false, error: "Team not found" }
    }

    if (team.leaderId === user.id) {
      return { success: false, error: "Team leader cannot leave. Delete team instead." }
    }

    // Delete team member
    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    })

    revalidatePath(`/teams/${teamId}`)
    revalidatePath("/teams")
    return { success: true, message: "Left team successfully" }
  } catch (error) {
    console.error("Error leaving team:", error)
    return { success: false, error: "Failed to leave team" }
  }
}

/**
 * Get pending invitations for current user
 */
export async function getPendingInvitations() {
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

    const invitations = await prisma.teamMember.findMany({
      where: {
        userId: user.id,
        joinStatus: "PENDING",
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
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, data: invitations }
  } catch (error) {
    console.error("Error getting pending invitations:", error)
    return { success: false, error: "Failed to get invitations" }
  }
}

export async function requestToJoinTeam(teamId: string) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return { success: false, error: "User tidak ditemukan" }
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    })

    if (!team) {
      return { success: false, error: "Tim tidak ditemukan" }
    }

    if (team.leaderId === user.id) {
      return { success: false, error: "Anda adalah pemimpin tim ini" }
    }

    // Check if user already in team or has pending status
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    })

    if (existingMember) {
      return { success: false, error: "Anda sudah tergabung atau sudah mengirim permintaan bergabung" }
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        teamId,
        userId: user.id,
        role: "MEMBER",
        joinStatus: "PENDING",
      },
    })

    // Notify team leader
    await createNotification({
      recipientId: team.leaderId,
      senderId: user.id,
      type: "ALERT",
      message: `${user.name} mengajukan permintaan bergabung dengan tim "${team.name}"`,
    })

    revalidatePath(`/teams/${teamId}`)
    return { success: true, data: teamMember }
  } catch (error) {
    console.error("Error requesting to join team:", error)
    return { success: false, error: "Gagal mengirim permintaan bergabung" }
  }
}
