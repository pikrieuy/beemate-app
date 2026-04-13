import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  
  // List of protected routes that require authentication
  const protectedRoutes = ["/profile", "/settings", "/myteams", "/notifications"]
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/api/auth/signin", req.nextUrl.origin)
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.href)
    return Response.redirect(loginUrl)
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
