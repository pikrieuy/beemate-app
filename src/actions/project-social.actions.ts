"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { createProjectSchema, createCommentSchema, validate } from "@/lib/validations"

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

    // Zod validation
    const validation = validate(createCommentSchema, { projectId, content })
    if (!validation.success) return validation

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

// ── Project CRUD ──────────────────────────────────────────────────────────────

export async function createProject(data: {
  title: string;
  description: string;
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  teamId?: string;
}) {
  try {
    const user = await getActiveUser();
    if (!user) return { success: false, error: "Not authenticated" };

    // Zod validation
    const validation = validate(createProjectSchema, data);
    if (!validation.success) return validation;

    const project = await prisma.project.create({
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        imageUrl: data.imageUrl?.trim() || null,
        demoUrl: data.demoUrl?.trim() || null,
        githubUrl: data.githubUrl?.trim() || null,
        teamId: data.teamId || null,
        userId: user.id,
      },
      include: {
        user: { select: { id: true, name: true, image: true, title: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    revalidatePath("/explore");
    return { success: true, data: project };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Gagal membuat proyek" };
  }
}

export async function getProjects(options?: { limit?: number; userId?: string }) {
  try {
    const projects = await prisma.project.findMany({
      where: options?.userId ? { userId: options.userId } : undefined,
      orderBy: { createdAt: "desc" },
      take: options?.limit ?? 20,
      include: {
        user: { select: { id: true, name: true, image: true, title: true } },
        team: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return { success: true, data: projects };
  } catch (error) {
    console.error("Error getting projects:", error);
    return { success: false, error: "Gagal memuat proyek" };
  }
}

export async function deleteProject(projectId: string) {
  try {
    const user = await getActiveUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return { success: false, error: "Proyek tidak ditemukan" };
    if (project.userId !== user.id) return { success: false, error: "Unauthorized" };

    await prisma.project.delete({ where: { id: projectId } });
    revalidatePath("/explore");
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Gagal menghapus proyek" };
  }
}
