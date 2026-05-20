import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./lib/prisma"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      // Sync image, name, role from token into session
      if (token.image) session.user.image = token.image as string;
      if (token.name) session.user.name = token.name as string;
      if (token.role) (session.user as any).role = token.role as string;
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        // Persist role into JWT on first sign-in
        token.role = (user as any).role ?? "USER";
      }
      // When updateSession() is called from the client, sync the new values into JWT
      if (trigger === "update" && session) {
        if (session.image) token.image = session.image;
        if (session.name) token.name = session.name;
        if (session.role) token.role = session.role;
      }
      return token;
    },
  },
})
