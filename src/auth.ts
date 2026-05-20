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
      // Sync image & name from token into session (updated via updateSession())
      if (token.image) session.user.image = token.image as string;
      if (token.name) session.user.name = token.name as string;
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
      }
      // When updateSession() is called from the client, sync the new values into JWT
      if (trigger === "update" && session) {
        if (session.image) token.image = session.image;
        if (session.name) token.name = session.name;
      }
      return token;
    },
  },
})
