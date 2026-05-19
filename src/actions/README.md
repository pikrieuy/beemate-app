# Server Actions

This folder contains all Server Actions for the BeeMate application.

## 📁 Files

- **`index.ts`** - Central export file for all actions
- **`user.actions.ts`** - User profile management (4 actions)
- **`team.actions.ts`** - Team CRUD operations (6 actions)
- **`team-member.actions.ts`** - Team member management (6 actions)
- **`competition.actions.ts`** - Competition CRUD operations (6 actions)
- **`notification.actions.ts`** - Notification system (6 actions)

**Total: 28 Server Actions**

## 🚀 Quick Start

```typescript
// Import all actions
import * from "@/actions"

// Or import specific actions
import { getCurrentUser, createTeam } from "@/actions"

// Use in your components
const result = await getCurrentUser()
if (result.success) {
  console.log(result.data)
}
```

## 📚 Documentation

- **Full Documentation**: `/SERVER_ACTIONS.md`
- **Quick Start Guide**: `/QUICK_START_ACTIONS.md`
- **Type Definitions**: `/src/types/actions.ts`

## 🔐 Authentication

All actions that require authentication will:
- Use `auth()` from NextAuth
- Return `{ success: false, error: "Not authenticated" }` if not logged in

## 📝 Response Format

All actions use consistent response format:

**Success:**
```typescript
{ success: true, data: T }
```

**Error:**
```typescript
{ success: false, error: string }
```

## 🎯 Examples

### Update User Profile
```typescript
const result = await updateUserProfile({
  name: "John Doe",
  bio: "Full-stack developer",
  skills: ["React", "Next.js"],
  title: "Hacker"
})
```

### Create Team
```typescript
const result = await createTeam({
  name: "Awesome Team",
  description: "We build cool stuff"
})
```

### Invite User to Team
```typescript
const result = await inviteUserToTeam(teamId, userId)
// Automatically sends notification to invited user
```

## 🔄 Auto Revalidation

Actions automatically revalidate paths:
- `/profile` - After profile updates
- `/teams` - After team operations
- `/competitions` - After competition operations
- `/notifications` - After notification operations

## ✅ Status

**Production Ready** - All actions tested and verified
