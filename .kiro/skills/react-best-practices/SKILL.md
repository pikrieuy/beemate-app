---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimization, or performance improvements.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# Vercel React Best Practices

Comprehensive performance optimization guide for React and Next.js applications, maintained by Vercel. Contains 70 rules across 8 categories, prioritized by impact to guide automated refactoring and code generation.

## When to Apply

Reference these guidelines when:
- Writing new React components or Next.js pages
- Implementing data fetching (client or server-side)
- Reviewing code for performance issues
- Refactoring existing React/Next.js code
- Optimizing bundle size or load times

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Eliminating Waterfalls | CRITICAL | `async-` |
| 2 | Bundle Size Optimization | CRITICAL | `bundle-` |
| 3 | Server-Side Performance | HIGH | `server-` |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH | `client-` |
| 5 | Re-render Optimization | MEDIUM | `rerender-` |
| 6 | Rendering Performance | MEDIUM | `rendering-` |
| 7 | JavaScript Performance | LOW-MEDIUM | `js-` |
| 8 | Advanced Patterns | LOW | `advanced-` |

## Quick Reference

### 1. Eliminating Waterfalls (CRITICAL)

- `async-parallel` — Use Promise.all() for independent async operations
- `async-defer-await` — Move await into branches where actually used
- `async-suspense-boundaries` — Use Suspense to stream content
- `async-api-routes` — Start promises early, await late in API routes

### 2. Bundle Size Optimization (CRITICAL)

- `bundle-barrel-imports` — Import directly, avoid barrel files (e.g. `import { X } from './X'` not `from './index'`)
- `bundle-dynamic-imports` — Use `next/dynamic` for heavy components
- `bundle-defer-third-party` — Load analytics/logging after hydration
- `bundle-conditional` — Load modules only when feature is activated

### 3. Server-Side Performance (HIGH)

- `server-auth-actions` — Authenticate server actions like API routes
- `server-cache-react` — Use `React.cache()` for per-request deduplication
- `server-parallel-fetching` — Restructure components to parallelize fetches
- `server-serialization` — Minimize data passed to client components
- `server-after-nonblocking` — Use `after()` for non-blocking operations

### 4. Re-render Optimization (MEDIUM)

- `rerender-memo` — Extract expensive work into memoized components
- `rerender-derived-state` — Subscribe to derived booleans, not raw values
- `rerender-functional-setstate` — Use functional setState for stable callbacks
- `rerender-no-inline-components` — Don't define components inside components
- `rerender-transitions` — Use `startTransition` for non-urgent updates

### 5. Rendering Performance (MEDIUM)

- `rendering-conditional-render` — Use ternary, not `&&` for conditionals with objects
- `rendering-hydration-no-flicker` — Use inline script for client-only data
- `rendering-activity` — Use Activity component for show/hide

### 6. JavaScript Performance (LOW-MEDIUM)

- `js-index-maps` — Build Map for repeated lookups
- `js-early-exit` — Return early from functions
- `js-set-map-lookups` — Use Set/Map for O(1) lookups

## Key Rules for BeeMate (Next.js 16 + React 19)

### Avoid Waterfalls in Server Components
```typescript
// ❌ Sequential — slow
const user = await getUser(id);
const teams = await getTeams(user.id);

// ✅ Parallel — fast
const [user, teams] = await Promise.all([
  getUser(id),
  getTeams(id),
]);
```

### Don't Import from Barrel Files
```typescript
// ❌ Barrel import — pulls entire module
import { Button, Input, Modal } from "@/components/ui";

// ✅ Direct import — tree-shakeable
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
```

### Use next/dynamic for Heavy Components
```typescript
// ❌ Static import — always in bundle
import { HeavyChart } from "./HeavyChart";

// ✅ Dynamic import — only loaded when needed
import dynamic from "next/dynamic";
const HeavyChart = dynamic(() => import("./HeavyChart"), { ssr: false });
```

### Minimize Client Component Surface
```typescript
// ❌ Entire page is client component
"use client";
export default function TeamPage() {
  const [open, setOpen] = useState(false);
  // ... lots of server-renderable content
}

// ✅ Only interactive part is client
// TeamPage = Server Component (fetches data)
// TeamModal = Client Component (handles open/close)
```

## Source

Full rules: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices
