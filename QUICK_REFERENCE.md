# 🚀 BeeMate Server Actions - Quick Reference

## Import
```typescript
import { getCurrentUser, createTeam, inviteUserToTeam } from "@/actions"
```

## 👤 User Actions

| Function | Auth | Description |
|----------|------|-------------|
| `getCurrentUser()` | ✅ | Get logged-in user profile |
| `updateUserProfile(data)` | ✅ | Update bio, skills, title, portfolio |
| `getUserById(userId)` | ❌ | Get public user profile |
| `searchUsers(query, limit?)` | ❌ | Search users |

## 👥 Team Actions

| Function | Auth | Permission |
|----------|------|------------|
| `createTeam(data)` | ✅ | Any user |
| `getTeams(page?, limit?)` | ❌ | Public |
| `getTeamById(teamId)` | ❌ | Public |
| `updateTeam(teamId, data)` | ✅ | Leader only |
| `deleteTeam(teamId)` | ✅ | Leader only |
| `getUserTeams()` | ✅ | Own teams |

## 🤝 Team Member Actions

| Function | Auth | Permission |
|----------|------|------------|
| `inviteUserToTeam(teamId, userId)` | ✅ | Leader only |
| `acceptTeamInvitation(teamId)` | ✅ | Invited user |
| `rejectTeamInvitation(teamId)` | ✅ | Invited user |
| `removeMemberFromTeam(teamId, userId)` | ✅ | Leader only |
| `leaveTeam(teamId)` | ✅ | Member only |
| `getPendingInvitations()` | ✅ | Own invitations |

## 🏆 Competition Actions

| Function | Auth | Permission |
|----------|------|------------|
| `createCompetition(data)` | ✅ | Any user |
| `getCompetitions(options?)` | ❌ | Public |
| `getCompetitionById(id)` | ❌ | Public |
| `updateCompetition(id, data)` | ✅ | Author/Admin |
| `deleteCompetition(id)` | ✅ | Author/Admin |
| `searchCompetitions(query, limit?)` | ❌ | Public |

## 🔔 Notification Actions

| Function | Auth | Description |
|----------|------|-------------|
| `getNotifications(options?)` | ✅ | Get user notifications |
| `markNotificationAsRead(id)` | ✅ | Mark as read |
| `markAllNotificationsAsRead()` | ✅ | Mark all as read |
| `deleteNotification(id)` | ✅ | Delete notification |
| `getUnreadNotificationCount()` | ✅ | Get unread count |

## 📝 Response Format

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: string }

// Message
{ success: true, message: string }
```

## 💡 Quick Examples

### Update Profile
```typescript
await updateUserProfile({
  name: "John Doe",
  bio: "Full-stack developer",
  skills: ["React", "Next.js"],
  title: "Hacker"
})
```

### Create Team
```typescript
await createTeam({
  name: "Innovation Squad",
  description: "Building the future"
})
```

### Invite to Team
```typescript
await inviteUserToTeam(teamId, userId)
// Auto-sends notification
```

### Get Notifications
```typescript
// All notifications
await getNotifications()

// Unread only
await getNotifications({ unreadOnly: true })

// Unread count
await getUnreadNotificationCount()
```

## 🔄 Auto Revalidation

| Path | Triggered By |
|------|--------------|
| `/profile` | Profile updates |
| `/teams` | Team create/update/delete |
| `/teams/[id]` | Team/member updates |
| `/competitions` | Competition operations |
| `/notifications` | Notification operations |

## 📚 Full Documentation

- **Complete Guide**: `SERVER_ACTIONS.md`
- **Quick Start**: `QUICK_START_ACTIONS.md`
- **Architecture**: `ARCHITECTURE_DIAGRAM.md`
- **Types**: `src/types/actions.ts`

---

**Total: 28 Server Actions | Status: ✅ Production Ready**
