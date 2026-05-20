# BeeMate Server Actions Documentation

Dokumentasi lengkap untuk semua Server Actions yang tersedia di aplikasi BeeMate.

## 📁 Struktur File

```
src/actions/
├── index.ts                    # Export semua actions
├── user.actions.ts             # User profile operations
├── team.actions.ts             # Team CRUD operations
├── team-member.actions.ts      # Team member management
├── competition.actions.ts      # Competition CRUD operations
└── notification.actions.ts     # Notification management
```

## 🔐 Authentication

Semua Server Actions yang memerlukan authentication akan:
- Menggunakan `auth()` dari NextAuth untuk mendapatkan session
- Return `{ success: false, error: "Not authenticated" }` jika user belum login

## 📝 Response Format

Semua Server Actions menggunakan format response yang konsisten:

**Success Response:**
```typescript
{ success: true, data: T }
```

**Error Response:**
```typescript
{ success: false, error: string }
```

**Message Response:**
```typescript
{ success: true, message: string }
```

---

## 👤 User Actions

### `getCurrentUser()`
Mendapatkan profil user yang sedang login.

**Authentication:** Required  
**Returns:** `ActionResponse<UserProfile>`

**Example:**
```typescript
import { getCurrentUser } from "@/actions"

const result = await getCurrentUser()
if (result.success) {
  console.log(result.data.name)
}
```

---

### `updateUserProfile(data)`
Update profil user yang sedang login.

**Authentication:** Required  
**Parameters:**
- `name?: string` - Nama user
- `bio?: string` - Bio/deskripsi
- `skills?: string[]` - Array skills
- `title?: string` - Hacker, Hustler, atau Hipster
- `portfolioUrl?: string` - URL portfolio

**Returns:** `ActionResponse<UserProfile>`

**Example:**
```typescript
const result = await updateUserProfile({
  name: "John Doe",
  bio: "Full-stack developer",
  skills: ["React", "Node.js", "TypeScript"],
  title: "Hacker",
  portfolioUrl: "https://johndoe.com"
})
```

---

### `getUserById(userId)`
Mendapatkan profil public user berdasarkan ID.

**Authentication:** Not required  
**Parameters:**
- `userId: string` - ID user

**Returns:** `ActionResponse<PublicUserProfile>`

---

### `searchUsers(query, limit?)`
Mencari user berdasarkan nama, skills, atau title.

**Authentication:** Not required  
**Parameters:**
- `query: string` - Keyword pencarian
- `limit?: number` - Maksimal hasil (default: 10)

**Returns:** `ActionResponse<UserProfile[]>`

---

## 👥 Team Actions

### `createTeam(data)`
Membuat team baru.

**Authentication:** Required  
**Parameters:**
- `name: string` - Nama team (required)
- `description?: string` - Deskripsi team

**Returns:** `ActionResponse<TeamWithLeader>`

**Example:**
```typescript
const result = await createTeam({
  name: "Awesome Team",
  description: "We build awesome things"
})
```

---

### `getTeams(page?, limit?)`
Mendapatkan daftar semua team dengan pagination.

**Authentication:** Not required  
**Parameters:**
- `page?: number` - Halaman (default: 1)
- `limit?: number` - Items per page (default: 10)

**Returns:** `ActionResponse<PaginatedResponse<TeamWithLeader>>`

---

### `getTeamById(teamId)`
Mendapatkan detail team beserta members.

**Authentication:** Not required  
**Parameters:**
- `teamId: string` - ID team

**Returns:** `ActionResponse<TeamWithMembers>`

---

### `updateTeam(teamId, data)`
Update informasi team.

**Authentication:** Required (Team Leader only)  
**Parameters:**
- `teamId: string` - ID team
- `name?: string` - Nama team baru
- `description?: string` - Deskripsi baru

**Returns:** `ActionResponse<TeamWithLeader>`

---

### `deleteTeam(teamId)`
Menghapus team.

**Authentication:** Required (Team Leader only)  
**Parameters:**
- `teamId: string` - ID team

**Returns:** `ActionMessageResponse`

---

### `getUserTeams()`
Mendapatkan semua team user (sebagai leader atau member).

**Authentication:** Required  
**Returns:** `ActionResponse<{ asLeader: Team[], asMember: Team[] }>`

---

## 🤝 Team Member Actions

### `inviteUserToTeam(teamId, userId)`
Mengundang user ke team.

**Authentication:** Required (Team Leader only)  
**Parameters:**
- `teamId: string` - ID team
- `userId: string` - ID user yang diundang

**Returns:** `ActionResponse<TeamMember>`

**Side Effects:**
- Membuat notifikasi untuk user yang diundang

---

### `acceptTeamInvitation(teamId)`
Menerima undangan team.

**Authentication:** Required  
**Parameters:**
- `teamId: string` - ID team

**Returns:** `ActionResponse<TeamMember>`

**Side Effects:**
- Membuat notifikasi untuk team leader

---

### `rejectTeamInvitation(teamId)`
Menolak undangan team.

**Authentication:** Required  
**Parameters:**
- `teamId: string` - ID team

**Returns:** `ActionResponse<TeamMember>`

---

### `removeMemberFromTeam(teamId, userId)`
Mengeluarkan member dari team.

**Authentication:** Required (Team Leader only)  
**Parameters:**
- `teamId: string` - ID team
- `userId: string` - ID member yang akan dikeluarkan

**Returns:** `ActionMessageResponse`

---

### `leaveTeam(teamId)`
Keluar dari team (untuk member).

**Authentication:** Required  
**Parameters:**
- `teamId: string` - ID team

**Returns:** `ActionMessageResponse`

**Note:** Team leader tidak bisa leave, harus delete team.

---

### `getPendingInvitations()`
Mendapatkan semua undangan team yang pending.

**Authentication:** Required  
**Returns:** `ActionResponse<TeamMemberWithTeam[]>`

---

## 🏆 Competition Actions

### `createCompetition(data)`
Membuat competition baru.

**Authentication:** Required  
**Parameters:**
- `title: string` - Judul competition (required)
- `description: string` - Deskripsi (required)
- `imageUrl?: string` - URL gambar
- `registrationLink?: string` - Link pendaftaran
- `deadline?: Date` - Deadline

**Returns:** `ActionResponse<CompetitionWithAuthor>`

---

### `getCompetitions(options?)`
Mendapatkan daftar competition dengan pagination.

**Authentication:** Not required  
**Parameters:**
- `page?: number` - Halaman (default: 1)
- `limit?: number` - Items per page (default: 10)
- `upcoming?: boolean` - Filter hanya upcoming competitions

**Returns:** `ActionResponse<PaginatedResponse<CompetitionWithAuthor>>`

---

### `getCompetitionById(competitionId)`
Mendapatkan detail competition.

**Authentication:** Not required  
**Parameters:**
- `competitionId: string` - ID competition

**Returns:** `ActionResponse<CompetitionWithAuthor>`

---

### `updateCompetition(competitionId, data)`
Update competition.

**Authentication:** Required (Author or Admin only)  
**Parameters:**
- `competitionId: string` - ID competition
- `title?: string`
- `description?: string`
- `imageUrl?: string`
- `registrationLink?: string`
- `deadline?: Date`

**Returns:** `ActionResponse<CompetitionWithAuthor>`

---

### `deleteCompetition(competitionId)`
Menghapus competition.

**Authentication:** Required (Author or Admin only)  
**Parameters:**
- `competitionId: string` - ID competition

**Returns:** `ActionMessageResponse`

---

### `searchCompetitions(query, limit?)`
Mencari competition berdasarkan title atau description.

**Authentication:** Not required  
**Parameters:**
- `query: string` - Keyword pencarian
- `limit?: number` - Maksimal hasil (default: 10)

**Returns:** `ActionResponse<CompetitionWithAuthor[]>`

---

## 🔔 Notification Actions

### `createNotification(data)`
Membuat notifikasi baru (biasanya dipanggil oleh actions lain).

**Authentication:** Not required (internal use)  
**Parameters:**
- `recipientId: string` - ID penerima
- `senderId?: string` - ID pengirim
- `type: NotificationType` - INVITE | ACCEPT | ALERT
- `message: string` - Pesan notifikasi

**Returns:** `ActionResponse<NotificationWithSender>`

---

### `getNotifications(options?)`
Mendapatkan notifikasi user.

**Authentication:** Required  
**Parameters:**
- `unreadOnly?: boolean` - Filter hanya unread
- `limit?: number` - Maksimal hasil (default: 50)

**Returns:** `ActionResponse<NotificationWithSender[]>`

---

### `markNotificationAsRead(notificationId)`
Menandai notifikasi sebagai sudah dibaca.

**Authentication:** Required  
**Parameters:**
- `notificationId: string` - ID notifikasi

**Returns:** `ActionResponse<Notification>`

---

### `markAllNotificationsAsRead()`
Menandai semua notifikasi sebagai sudah dibaca.

**Authentication:** Required  
**Returns:** `ActionMessageResponse`

---

### `deleteNotification(notificationId)`
Menghapus notifikasi.

**Authentication:** Required  
**Parameters:**
- `notificationId: string` - ID notifikasi

**Returns:** `ActionMessageResponse`

---

### `getUnreadNotificationCount()`
Mendapatkan jumlah notifikasi yang belum dibaca.

**Authentication:** Required  
**Returns:** `ActionResponse<number>`

---

## 🎯 Usage Examples

### Example 1: Update User Profile
```typescript
"use client"

import { updateUserProfile } from "@/actions"
import { useState } from "react"

export function ProfileForm() {
  const [loading, setLoading] = useState(false)
  
  async function handleSubmit(formData: FormData) {
    setLoading(true)
    
    const result = await updateUserProfile({
      name: formData.get("name") as string,
      bio: formData.get("bio") as string,
      skills: formData.get("skills")?.toString().split(",") || [],
      title: formData.get("title") as string,
    })
    
    if (result.success) {
      alert("Profile updated!")
    } else {
      alert(result.error)
    }
    
    setLoading(false)
  }
  
  return <form action={handleSubmit}>...</form>
}
```

### Example 2: Create Team
```typescript
import { createTeam } from "@/actions"

async function handleCreateTeam() {
  const result = await createTeam({
    name: "My Awesome Team",
    description: "We build cool stuff"
  })
  
  if (result.success) {
    console.log("Team created:", result.data.id)
    // Redirect to team page
  }
}
```

### Example 3: Accept Team Invitation
```typescript
import { acceptTeamInvitation } from "@/actions"

async function handleAccept(teamId: string) {
  const result = await acceptTeamInvitation(teamId)
  
  if (result.success) {
    console.log("Joined team!")
  }
}
```

---

## 🔄 Revalidation

Server Actions secara otomatis melakukan `revalidatePath()` untuk:
- `/profile` - Setelah update profile
- `/teams` - Setelah create/update/delete team
- `/teams/[id]` - Setelah update team atau members
- `/competitions` - Setelah create/update/delete competition
- `/notifications` - Setelah create/update/delete notification

---

## 🛡️ Authorization Rules

| Action | Rule |
|--------|------|
| Update Team | Team Leader only |
| Delete Team | Team Leader only |
| Invite Member | Team Leader only |
| Remove Member | Team Leader only |
| Update Competition | Author or Admin only |
| Delete Competition | Author or Admin only |
| Leave Team | Members only (not leader) |

---

## 🧪 Testing

Jalankan test untuk memastikan semua actions berfungsi:

```bash
node test-actions.js
```

---

## 📚 Type Definitions

Import types dari `@/types/actions`:

```typescript
import type { 
  ActionResponse,
  UserProfile,
  TeamWithLeader,
  CompetitionWithAuthor,
  NotificationWithSender 
} from "@/types/actions"
```
