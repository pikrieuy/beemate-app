import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

/**
 * This config is Edge-compatible (no Prisma/pg/crypto dependencies).
 * Used in proxy.ts which runs on the Edge Runtime (Next.js 16 replacement for middleware).
 */
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/api/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = nextUrl

      // Always allow NextAuth's own routes to avoid infinite redirect loops
      if (pathname.startsWith("/api/auth")) {
        return true
      }

      const protectedRoutes = [
        "/profile",
        "/settings",
        "/myteams",
        "/notifications",
        "/dashboard",
        "/teams/create",
        "/competitions/create",
        "/admin",
      ]
      const isProtectedRoute = protectedRoutes.some((route) => {
        if (route === "/profile") {
          return pathname === "/profile"
        }
        return pathname.startsWith(route)
      })

      if (isProtectedRoute && !isLoggedIn) {
        const loginUrl = new URL("/api/auth/signin", nextUrl.origin)
        loginUrl.searchParams.set("callbackUrl", nextUrl.href)
        return Response.redirect(loginUrl)
      }

      return true
    },
  },
} satisfies NextAuthConfig
