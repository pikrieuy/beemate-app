import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// Use the Edge-compatible authConfig for the proxy layer.
// The authorized() callback in authConfig handles route protection.
export default NextAuth(authConfig).auth

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
