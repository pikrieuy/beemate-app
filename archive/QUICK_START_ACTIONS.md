# Quick Start: Server Actions

Panduan cepat untuk mulai menggunakan Server Actions di BeeMate.

## 🚀 Import Actions

```typescript
// Import semua actions
import * from "@/actions"

// Atau import spesifik
import { 
  getCurrentUser, 
  updateUserProfile,
  createTeam,
  getTeams 
} from "@/actions"
```

## 📋 Common Use Cases

### 1. Get Current User Profile
```typescript
const result = await getCurrentUser()
if (result.success) {
  const user = result.data
  console.log(user.name, user.email, user.skills)
}
```

### 2. Update Profile
```typescript
const result = await updateUserProfile({
  name: "John Doe",
  bio: "Full-stack developer passionate about web tech",
  skills: ["React", "Next.js", "TypeScript", "Node.js"],
  title: "Hacker",
  portfolioUrl: "https://johndoe.com"
})
```

### 3. Create Team
```typescript
const result = await createTeam({
  name: "Innovation Squad",
  description: "Building the future, one line of code at a time"
})

if (result.success) {
  const teamId = result.data.id
  // Redirect ke /teams/${teamId}
}
```

### 4. Get All Teams
```typescript
const result = await getTeams(1, 10) // page 1, 10 items
if (result.success) {
  const { teams, pagination } = result.data
  console.log(`Showing ${teams.length} of ${pagination.total} teams`)
}
```

### 5. Invite User to Team
```typescript
const result = await inviteUserToTeam(teamId, userId)
if (result.success) {
  console.log("Invitation sent!")
  // Notifikasi otomatis terkirim ke user
}
```

### 6. Accept Team Invitation
```typescript
const result = await acceptTeamInvitation(teamId)
if (result.success) {
  console.log("You're now part of the team!")
  // Notifikasi otomatis terkirim ke team leader
}
```

### 7. Create Competition
```typescript
const result = await createCompetition({
  title: "Hackathon 2026",
  description: "Build innovative solutions in 48 hours",
  imageUrl: "https://example.com/image.jpg",
  registrationLink: "https://hackathon.com/register",
  deadline: new Date("2026-12-31")
})
```

### 8. Get Upcoming Competitions
```typescript
const result = await getCompetitions({ 
  page: 1, 
  limit: 10, 
  upcoming: true 
})
```

### 9. Get Notifications
```typescript
// Get all notifications
const result = await getNotifications()

// Get only unread
const unread = await getNotifications({ unreadOnly: true })

// Get unread count
const count = await getUnreadNotificationCount()
```

### 10. Search Users
```typescript
const result = await searchUsers("React", 10)
if (result.success) {
  result.data.forEach(user => {
    console.log(user.name, user.skills)
  })
}
```

## 🎨 Usage in Client Components

```typescript
"use client"

import { updateUserProfile } from "@/actions"
import { useState } from "react"

export function ProfileForm({ user }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    
    const result = await updateUserProfile({
      name: formData.get("name") as string,
      bio: formData.get("bio") as string,
      skills: (formData.get("skills") as string).split(",").map(s => s.trim()),
      title: formData.get("title") as string,
    })
    
    if (result.success) {
      alert("Profile updated successfully!")
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" defaultValue={user.name} />
      <textarea name="bio" defaultValue={user.bio} />
      <input name="skills" defaultValue={user.skills.join(", ")} />
      <select name="title" defaultValue={user.title}>
        <option value="Hacker">Hacker</option>
        <option value="Hustler">Hustler</option>
        <option value="Hipster">Hipster</option>
      </select>
      
      {error && <p className="error">{error}</p>}
      
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  )
}
```

## 🔄 Usage in Server Components

```typescript
import { getTeams } from "@/actions"

export default async function TeamsPage() {
  const result = await getTeams(1, 10)
  
  if (!result.success) {
    return <div>Error: {result.error}</div>
  }
  
  const { teams, pagination } = result.data
  
  return (
    <div>
      <h1>Teams ({pagination.total})</h1>
      {teams.map(team => (
        <div key={team.id}>
          <h2>{team.name}</h2>
          <p>{team.description}</p>
          <p>Leader: {team.leader.name}</p>
          <p>Members: {team._count.members}</p>
        </div>
      ))}
    </div>
  )
}
```

## ⚡ With React Hook Form

```typescript
"use client"

import { useForm } from "react-hook-form"
import { createTeam } from "@/actions"
import { useRouter } from "next/navigation"

type FormData = {
  name: string
  description: string
}

export function CreateTeamForm() {
  const router = useRouter()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>()
  
  async function onSubmit(data: FormData) {
    const result = await createTeam(data)
    
    if (result.success) {
      router.push(`/teams/${result.data.id}`)
    } else {
      alert(result.error)
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name", { required: true })} placeholder="Team Name" />
      <textarea {...register("description")} placeholder="Description" />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Team"}
      </button>
    </form>
  )
}
```

## 🎯 Error Handling Pattern

```typescript
async function handleAction() {
  try {
    const result = await someAction()
    
    if (result.success) {
      // Success case
      console.log("Success:", result.data)
      // Update UI, redirect, etc.
    } else {
      // Error case
      console.error("Error:", result.error)
      // Show error message to user
      toast.error(result.error)
    }
  } catch (error) {
    // Unexpected error
    console.error("Unexpected error:", error)
    toast.error("Something went wrong")
  }
}
```

## 🔐 Authorization Checks

Server Actions sudah include authorization checks:

```typescript
// ✅ Ini akan otomatis check apakah user adalah team leader
const result = await updateTeam(teamId, { name: "New Name" })

if (!result.success && result.error === "Only team leader can update team") {
  // Handle unauthorized
}
```

## 📱 Real-time Updates

Gunakan `revalidatePath` yang sudah built-in:

```typescript
// Setelah action, Next.js akan otomatis refresh data di path yang di-revalidate
await createTeam({ name: "New Team" })
// Path "/teams" otomatis di-revalidate
```

## 🎉 That's It!

Server Actions sudah siap digunakan. Lihat `SERVER_ACTIONS.md` untuk dokumentasi lengkap.
