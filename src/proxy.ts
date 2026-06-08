import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// Wrap your auth function using the Edge-compatible config
export default NextAuth(authConfig).auth

// Matcher controls which routes run through middleware
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
