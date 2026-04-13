"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function GoogleLoginButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Button disabled>Loading...</Button>
  }

  if (session) {
    return (
      <Button onClick={() => signOut({ callbackUrl: "/" })} variant="outline">
        Sign Out
      </Button>
    )
  }

  return (
    <Button onClick={() => signIn("google", { callbackUrl: "/profile" })}>
      Sign In with Google
    </Button>
  )
}
