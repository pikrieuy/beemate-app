"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { NotificationType } from "@prisma/client"

/**
 * Create a notification
 */
export async function createNotification(data: {
  recipientId: string
  senderId?: string
  type: NotificationType
  message: string
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        recipientId: data.recipientId,
        senderId: data.senderId,
        type: data.type,
        message: data.message,
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

    revalidatePath("/notifications")
    return { success: true, data: notification }
  } catch (error) {
    console.error("Error creating notification:", error)
    return { success: false, error: "Failed to create notification" }
  }
}

/**
 * Get notifications for current user
 */
export async function getNotifications(options?: {
  unreadOnly?: boolean
  limit?: number
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

    const where = {
      recipientId: user.id,
      ...(options?.unreadOnly && { isRead: false }),
    }

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: options?.limit || 50,
    })

    return { success: true, data: notifications }
  } catch (error) {
    console.error("Error getting notifications:", error)
    return { success: false, error: "Failed to get notifications" }
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
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

    // Check if notification belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification) {
      return { success: false, error: "Notification not found" }
    }

    if (notification.recipientId !== user.id) {
      return { success: false, error: "Unauthorized" }
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    })

    revalidatePath("/notifications")
    return { success: true, data: updatedNotification }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return { success: false, error: "Failed to mark notification as read" }
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead() {
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

    await prisma.notification.updateMany({
      where: {
        recipientId: user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    revalidatePath("/notifications")
    return { success: true, message: "All notifications marked as read" }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return { success: false, error: "Failed to mark all notifications as read" }
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string) {
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

    // Check if notification belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification) {
      return { success: false, error: "Notification not found" }
    }

    if (notification.recipientId !== user.id) {
      return { success: false, error: "Unauthorized" }
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    })

    revalidatePath("/notifications")
    return { success: true, message: "Notification deleted" }
  } catch (error) {
    console.error("Error deleting notification:", error)
    return { success: false, error: "Failed to delete notification" }
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount() {
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

    const count = await prisma.notification.count({
      where: {
        recipientId: user.id,
        isRead: false,
      },
    })

    return { success: true, data: count }
  } catch (error) {
    console.error("Error getting unread count:", error)
    return { success: false, error: "Failed to get unread count" }
  }
}
