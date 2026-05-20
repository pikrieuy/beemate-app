"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

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

export async function toggleProjectLike(projectId: string) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return { success: false, error: "Silakan login terlebih dahulu" }
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { teamId: true }
    })
    if (!project) {
      return { success: false, error: "Proyek tidak ditemukan" }
    }

    const existingLike = await prisma.projectLike.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.id
        }
      }
    })

    if (existingLike) {
      // Unlike
      await prisma.projectLike.delete({
        where: {
          projectId_userId: {
            projectId,
            userId: user.id
          }
        }
      })
    } else {
      // Like
      await prisma.projectLike.create({
        data: {
          projectId,
          userId: user.id
        }
      })
    }

    if (project.teamId) {
      revalidatePath(`/teams/${project.teamId}`)
    }
    return { success: true }
  } catch (error) {
    console.error("Error toggling project like:", error)
    return { success: false, error: "Gagal memproses tombol like" }
  }
}

export async function addProjectComment(projectId: string, content: string) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return { success: false, error: "Silakan login terlebih dahulu" }
    }

    if (!content?.trim()) {
      return { success: false, error: "Komentar tidak boleh kosong" }
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { teamId: true }
    })
    if (!project) {
      return { success: false, error: "Proyek tidak ditemukan" }
    }

    const comment = await prisma.projectComment.create({
      data: {
        projectId,
        userId: user.id,
        content: content.trim()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            title: true
          }
        }
      }
    })

    if (project.teamId) {
      revalidatePath(`/teams/${project.teamId}`)
    }
    return { success: true, data: comment }
  } catch (error) {
    console.error("Error adding project comment:", error)
    return { success: false, error: "Gagal mengirim komentar" }
  }
}

export async function deleteProjectComment(commentId: string) {
  try {
    const user = await getActiveUser()
    if (!user) {
      return { success: false, error: "Silakan login terlebih dahulu" }
    }

    const comment = await prisma.projectComment.findUnique({
      where: { id: commentId },
      include: {
        project: {
          select: {
            teamId: true,
            team: {
              select: {
                leaderId: true
              }
            }
          }
        }
      }
    })

    if (!comment) {
      return { success: false, error: "Komentar tidak ditemukan" }
    }

    const isOwner = comment.userId === user.id
    const isTeamLeader = comment.project?.team?.leaderId === user.id

    if (!isOwner && !isTeamLeader) {
      return { success: false, error: "Anda tidak memiliki akses untuk menghapus komentar ini" }
    }

    await prisma.projectComment.delete({
      where: { id: commentId }
    })

    const teamId = comment.project?.teamId
    if (teamId) {
      revalidatePath(`/teams/${teamId}`)
    }
    return { success: true }
  } catch (error) {
    console.error("Error deleting project comment:", error)
    return { success: false, error: "Gagal menghapus komentar" }
  }
}

export async function getProjectSocials(projectId: string) {
  try {
    const user = await getActiveUser()

    const [comments, likesCount, userLiked] = await Promise.all([
      prisma.projectComment.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              title: true
            }
          }
        }
      }),
      prisma.projectLike.count({
        where: { projectId }
      }),
      user ? prisma.projectLike.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId: user.id
          }
        }
      }) : null
    ])

    return {
      success: true,
      data: {
        comments,
        likesCount,
        hasLiked: !!userLiked
      }
    }
  } catch (error) {
    console.error("Error getting project socials:", error)
    return { success: false, error: "Gagal memuat data interaksi sosial" }
  }
}
