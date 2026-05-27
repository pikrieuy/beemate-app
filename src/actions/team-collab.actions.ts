"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { sendMessageSchema, createTaskSchema, createProjectSchema, validate } from "@/lib/validations"

/**
 * Helper: Verify if user has access to team collaboration
 */
async function verifyTeamAccess(teamId: string, email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })
  if (!user) return null

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: {
        where: {
          userId: user.id,
          joinStatus: "ACCEPTED",
        },
      },
    },
  })

  if (!team) return null

  const isLeader = team.leaderId === user.id
  const isMember = team.members.length > 0

  if (!isLeader && !isMember) return null

  return { userId: user.id, isLeader }
}

// ==========================================
// 1. TEAM CHAT ACTIONS
// ==========================================

export async function sendTeamMessage(teamId: string, content: string) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    // Zod validation
    const validation = validate(sendMessageSchema, { teamId, content })
    if (!validation.success) return validation

    const access = await verifyTeamAccess(teamId, session.user.email)
    if (!access) {
      return { success: false, error: "Anda bukan anggota tim ini" }
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        teamId,
        senderId: access.userId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return { success: true, data: message }
  } catch (error) {
    console.error("Error sending team message:", error)
    return { success: false, error: "Gagal mengirim pesan" }
  }
}

export async function getTeamMessages(teamId: string) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const access = await verifyTeamAccess(teamId, session.user.email)
    if (!access) {
      return { success: false, error: "Anda bukan anggota tim ini" }
    }

    const messages = await prisma.message.findMany({
      where: { teamId },
      orderBy: { createdAt: "asc" },
      take: 100, // Limit to recent 100 messages
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return { success: true, data: messages }
  } catch (error) {
    console.error("Error getting team messages:", error)
    return { success: false, error: "Gagal memuat pesan" }
  }
}

// ==========================================
// 2. KANBAN / TASK ACTIONS
// ==========================================

export async function getTeamTasks(teamId: string) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const access = await verifyTeamAccess(teamId, session.user.email)
    if (!access) {
      return { success: false, error: "Anda bukan anggota tim ini" }
    }

    const tasks = await prisma.task.findMany({
      where: { teamId },
      orderBy: { createdAt: "desc" },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return { success: true, data: tasks }
  } catch (error) {
    console.error("Error getting team tasks:", error)
    return { success: false, error: "Gagal memuat daftar tugas" }
  }
}

export async function createTeamTask(data: {
  teamId: string
  title: string
  description?: string
  priority?: string
  assigneeId?: string
  dueDate?: string
}) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    // Zod validation
    const validation = validate(createTaskSchema, {
      ...data,
      status: "TODO",
      priority: data.priority || "MEDIUM",
    })
    if (!validation.success) return validation

    const access = await verifyTeamAccess(data.teamId, session.user.email)
    if (!access) {
      return { success: false, error: "Anda bukan anggota tim ini" }
    }

    const task = await prisma.task.create({
      data: {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        priority: data.priority || "MEDIUM",
        teamId: data.teamId,
        assigneeId: data.assigneeId || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    revalidatePath(`/teams/${data.teamId}`)
    return { success: true, data: task }
  } catch (error) {
    console.error("Error creating team task:", error)
    return { success: false, error: "Gagal membuat tugas" }
  }
}

export async function updateTeamTaskStatus(taskId: string, status: string) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return { success: false, error: "Tugas tidak ditemukan" }
    }

    const access = await verifyTeamAccess(task.teamId, session.user.email)
    if (!access) {
      return { success: false, error: "Anda bukan anggota tim ini" }
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    revalidatePath(`/teams/${task.teamId}`)
    return { success: true, data: updatedTask }
  } catch (error) {
    console.error("Error updating task status:", error)
    return { success: false, error: "Gagal merubah status tugas" }
  }
}

export async function updateTeamTask(
  taskId: string,
  data: {
    title?: string
    description?: string | null
    priority?: string
    assigneeId?: string | null
    dueDate?: string | null
  }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return { success: false, error: "Tugas tidak ditemukan" }
    }

    const access = await verifyTeamAccess(task.teamId, session.user.email)
    if (!access) {
      return { success: false, error: "Anda bukan anggota tim ini" }
    }

    if (data.title !== undefined && !data.title?.trim()) {
      return { success: false, error: "Judul tugas tidak boleh kosong" }
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId }),
        ...(data.dueDate !== undefined && { dueDate: data.dueDate ? new Date(data.dueDate) : null }),
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    revalidatePath(`/teams/${task.teamId}`)
    return { success: true, data: updatedTask }
  } catch (error) {
    console.error("Error updating team task:", error)
    return { success: false, error: "Gagal memperbarui tugas" }
  }
}

export async function deleteTeamTask(taskId: string) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return { success: false, error: "Tugas tidak ditemukan" }
    }

    const access = await verifyTeamAccess(task.teamId, session.user.email)
    if (!access) {
      return { success: false, error: "Anda bukan anggota tim ini" }
    }

    await prisma.task.delete({
      where: { id: taskId },
    })

    revalidatePath(`/teams/${task.teamId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting team task:", error)
    return { success: false, error: "Gagal menghapus tugas" }
  }
}

// ==========================================
// 3. PROJECT SHOWCASE ACTIONS
// ==========================================

export async function getTeamProject(teamId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { teamId },
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

    return { success: true, data: project }
  } catch (error) {
    console.error("Error getting team project:", error)
    return { success: false, error: "Gagal memuat proyek tim" }
  }
}

export async function createOrUpdateProject(
  teamId: string,
  data: {
    title: string
    description: string
    demoUrl?: string
    githubUrl?: string
    imageUrl?: string
  }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    // Zod validation
    const validation = validate(createProjectSchema, { ...data, teamId })
    if (!validation.success) return validation

    const access = await verifyTeamAccess(teamId, session.user.email)
    if (!access) {
      return { success: false, error: "Anda bukan anggota tim ini" }
    }

    const existingProject = await prisma.project.findUnique({
      where: { teamId },
    })

    let project
    if (existingProject) {
      project = await prisma.project.update({
        where: { teamId },
        data: {
          title: data.title.trim(),
          description: data.description.trim(),
          demoUrl: data.demoUrl?.trim() || null,
          githubUrl: data.githubUrl?.trim() || null,
          imageUrl: data.imageUrl || null,
          userId: access.userId,
        },
      })
    } else {
      project = await prisma.project.create({
        data: {
          title: data.title.trim(),
          description: data.description.trim(),
          demoUrl: data.demoUrl?.trim() || null,
          githubUrl: data.githubUrl?.trim() || null,
          imageUrl: data.imageUrl || null,
          teamId,
          userId: access.userId,
        },
      })
    }

    revalidatePath(`/teams/${teamId}`)
    revalidatePath("/teams")
    return { success: true, data: project }
  } catch (error) {
    console.error("Error creating/updating project showcase:", error)
    return { success: false, error: "Gagal menyimpan proyek showcase" }
  }
}
