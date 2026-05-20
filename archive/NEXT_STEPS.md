# 🚀 Phase 3: Core UI Pages - Getting Started

**Status:** 🔜 READY TO START  
**Estimated Duration:** 3-4 days  
**Priority:** 🔴 HIGH

---

## 📋 Overview

Phase 3 fokus pada pembuatan halaman-halaman UI inti untuk:
1. **Profile Page** - View & edit user profile
2. **Public Profile** - View other users
3. **People Directory** - Browse and search users

---

## 🎯 Goals

By the end of Phase 3, users should be able to:
- ✅ View their own profile
- ✅ Edit their profile (name, bio, skills, title, portfolio)
- ✅ View other users' profiles
- ✅ Browse all users in the people directory
- ✅ Search users by name, skills, or title
- ✅ Filter users by title (Hacker/Hustler/Hipster)

---

## 📁 Files to Create

### 1. Profile Page (`/profile`)
```
src/app/(auth)/profile/
├── page.tsx              # Main profile page
└── edit/
    └── page.tsx          # Edit profile page (optional, or use modal)
```

### 2. Public Profile Page (`/profile/[id]`)
```
src/app/(auth)/profile/[id]/
└── page.tsx              # Public profile view
```

### 3. People Directory (`/people`)
```
src/app/(auth)/people/
└── page.tsx              # People directory page
```

### 4. Components
```
src/components/
├── profile/
│   ├── ProfileCard.tsx       # Profile display card
│   ├── ProfileEditForm.tsx   # Edit profile form
│   └── SkillsInput.tsx       # Skills management component
├── people/
│   ├── UserCard.tsx          # User card for directory
│   ├── UserSearch.tsx        # Search component
│   └── UserFilters.tsx       # Filter component
└── ui/
    ├── Badge.tsx             # For skills display
    ├── Input.tsx             # Form input
    ├── Textarea.tsx          # Form textarea
    └── Select.tsx            # Form select
```

---

## 🔧 Implementation Steps

### Step 1: Profile Page (`/profile`)

**What it does:**
- Displays current user's profile
- Shows name, email, bio, skills, title, portfolio
- "Edit Profile" button
- Shows teams (as leader and member)

**Server Actions to use:**
```typescript
import { getCurrentUser, getUserTeams } from "@/actions"
```

**Key Features:**
- Server Component (fetch data on server)
- Display user info
- Link to edit page/modal
- Show user's teams

**Example Structure:**
```typescript
export default async function ProfilePage() {
  const userResult = await getCurrentUser()
  const teamsResult = await getUserTeams()
  
  if (!userResult.success) {
    return <div>Error loading profile</div>
  }
  
  const user = userResult.data
  const teams = teamsResult.success ? teamsResult.data : null
  
  return (
    <div>
      <ProfileCard user={user} />
      <TeamsSection teams={teams} />
    </div>
  )
}
```

---

### Step 2: Edit Profile Form

**What it does:**
- Form to edit name, bio, skills, title, portfolio
- Client Component (needs interactivity)
- Uses Server Action to save

**Server Actions to use:**
```typescript
import { updateUserProfile } from "@/actions"
```

**Key Features:**
- Form validation
- Skills management (add/remove chips)
- Title dropdown (Hacker/Hustler/Hipster)
- Loading state during save
- Success/error messages

**Example Structure:**
```typescript
"use client"

export function ProfileEditForm({ user }) {
  const [loading, setLoading] = useState(false)
  const [skills, setSkills] = useState(user.skills || [])
  
  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.target)
    const result = await updateUserProfile({
      name: formData.get("name"),
      bio: formData.get("bio"),
      skills: skills,
      title: formData.get("title"),
      portfolioUrl: formData.get("portfolioUrl")
    })
    
    if (result.success) {
      // Show success message
      // Redirect or close modal
    }
    
    setLoading(false)
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

---

### Step 3: Public Profile Page (`/profile/[id]`)

**What it does:**
- Shows another user's public profile
- Cannot edit (read-only)
- "Invite to Team" button (if you're a team leader)

**Server Actions to use:**
```typescript
import { getUserById } from "@/actions"
```

**Key Features:**
- Server Component
- Fetch user by ID from URL params
- Display public info only
- Show teams they're in

**Example Structure:**
```typescript
export default async function PublicProfilePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const result = await getUserById(params.id)
  
  if (!result.success) {
    return <div>User not found</div>
  }
  
  const user = result.data
  
  return (
    <div>
      <ProfileCard user={user} isPublic />
      <InviteToTeamButton userId={user.id} />
    </div>
  )
}
```

---

### Step 4: People Directory (`/people`)

**What it does:**
- Lists all users
- Search by name
- Filter by skills and title
- Pagination

**Server Actions to use:**
```typescript
import { searchUsers } from "@/actions"
```

**Key Features:**
- Search input
- Filter dropdowns
- User cards grid
- Pagination
- Click card to view profile

**Example Structure:**
```typescript
"use client"

export default function PeoplePage() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  
  useEffect(() => {
    async function loadUsers() {
      if (search) {
        const result = await searchUsers(search)
        if (result.success) {
          setUsers(result.data)
        }
      }
    }
    loadUsers()
  }, [search])
  
  return (
    <div>
      <UserSearch onSearch={setSearch} />
      <UserFilters onFilter={setFilter} />
      <UserGrid users={users} />
    </div>
  )
}
```

---

## 🎨 UI Components to Build

### 1. ProfileCard Component
```typescript
interface ProfileCardProps {
  user: UserProfile
  isPublic?: boolean
}

export function ProfileCard({ user, isPublic }: ProfileCardProps) {
  return (
    <div className="card">
      <img src={user.image} alt={user.name} />
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
      <div className="skills">
        {user.skills.map(skill => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </div>
      {!isPublic && <EditButton />}
    </div>
  )
}
```

### 2. SkillsInput Component
```typescript
export function SkillsInput({ skills, onChange }) {
  const [input, setInput] = useState("")
  
  function addSkill() {
    if (input && !skills.includes(input)) {
      onChange([...skills, input])
      setInput("")
    }
  }
  
  function removeSkill(skill) {
    onChange(skills.filter(s => s !== skill))
  }
  
  return (
    <div>
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
      />
      <div className="skills-list">
        {skills.map(skill => (
          <Badge key={skill} onRemove={() => removeSkill(skill)}>
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  )
}
```

### 3. UserCard Component
```typescript
export function UserCard({ user }) {
  return (
    <Link href={`/profile/${user.id}`}>
      <div className="user-card">
        <img src={user.image} alt={user.name} />
        <h3>{user.name}</h3>
        <p className="title">{user.title}</p>
        <div className="skills">
          {user.skills.slice(0, 3).map(skill => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>
      </div>
    </Link>
  )
}
```

---

## ✅ Checklist

### Profile Page
- [ ] Create `/profile` page
- [ ] Fetch current user data
- [ ] Display profile information
- [ ] Show user's teams
- [ ] Add "Edit Profile" button
- [ ] Create ProfileCard component

### Edit Profile
- [ ] Create edit form component
- [ ] Add form fields (name, bio, title, portfolio)
- [ ] Implement SkillsInput component
- [ ] Add form validation
- [ ] Connect to updateUserProfile action
- [ ] Add loading state
- [ ] Add success/error messages
- [ ] Redirect after save

### Public Profile
- [ ] Create `/profile/[id]` page
- [ ] Fetch user by ID
- [ ] Display public profile
- [ ] Handle user not found
- [ ] Add "Invite to Team" button (optional for now)

### People Directory
- [ ] Create `/people` page
- [ ] Implement search functionality
- [ ] Add filter by title
- [ ] Create UserCard component
- [ ] Create UserSearch component
- [ ] Create UserFilters component
- [ ] Add pagination (optional)
- [ ] Add loading states

### UI Components
- [ ] Badge component
- [ ] Input component
- [ ] Textarea component
- [ ] Select component
- [ ] Button component (if not exists)

---

## 🧪 Testing Checklist

- [ ] Can view own profile
- [ ] Can edit profile successfully
- [ ] Skills can be added/removed
- [ ] Form validation works
- [ ] Can view other user's profile
- [ ] People directory loads users
- [ ] Search works correctly
- [ ] Filter works correctly
- [ ] Links work correctly
- [ ] Responsive on mobile

---

## 📚 Resources

**Server Actions:**
- `getCurrentUser()` - Get logged-in user
- `updateUserProfile(data)` - Update profile
- `getUserById(id)` - Get user by ID
- `searchUsers(query)` - Search users

**Documentation:**
- `SERVER_ACTIONS.md` - Full API docs
- `QUICK_START_ACTIONS.md` - Usage examples

**Design System:**
- Tailwind CSS v4
- Existing components in `src/components/`

---

## 🚀 Ready to Start?

1. Read this guide
2. Check existing components
3. Start with Profile Page
4. Then Edit Form
5. Then Public Profile
6. Finally People Directory

**Let's build Phase 3!** 🎉
