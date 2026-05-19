// Type definitions for Server Actions responses

export type ActionResponse<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string }

export type ActionMessageResponse = 
  | { success: true; message: string }
  | { success: false; error: string }

// User types
export type UserProfile = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  bio: string | null
  skills: string[]
  title: string | null
  portfolioUrl: string | null
  role: string
  createdAt: Date
}

export type PublicUserProfile = {
  id: string
  name: string | null
  image: string | null
  bio: string | null
  skills: string[]
  title: string | null
  portfolioUrl: string | null
  createdAt: Date
  _count: {
    teamsCreated: number
    teamMembers: number
  }
}

// Team types
export type TeamWithLeader = {
  id: string
  name: string
  description: string | null
  leaderId: string
  leader: {
    id: string
    name: string | null
    image: string | null
  }
  _count: {
    members: number
  }
  createdAt: Date
  updatedAt: Date
}

export type TeamWithMembers = {
  id: string
  name: string
  description: string | null
  leaderId: string
  leader: {
    id: string
    name: string | null
    image: string | null
    email: string | null
  }
  members: Array<{
    id: string
    teamId: string
    userId: string
    role: string
    joinStatus: string
    createdAt: Date
    user: {
      id: string
      name: string | null
      image: string | null
      title: string | null
      skills: string[]
    }
  }>
  createdAt: Date
  updatedAt: Date
}

// Competition types
export type CompetitionWithAuthor = {
  id: string
  title: string
  description: string
  imageUrl: string | null
  registrationLink: string | null
  deadline: Date | null
  authorId: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
  createdAt: Date
  updatedAt: Date
}

// Notification types
export type NotificationWithSender = {
  id: string
  recipientId: string
  senderId: string | null
  type: string
  message: string
  isRead: boolean
  createdAt: Date
  sender: {
    id: string
    name: string | null
    image: string | null
  } | null
}

// Pagination types
export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
