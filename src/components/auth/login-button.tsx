"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { buttonVariants } from "@/components/ui/button";

export function GoogleLoginButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <button disabled className={buttonVariants({ variant: "dark" })}>Loading...</button>
  }

  if (session) {
    return (
      <button onClick={() => signOut({ callbackUrl: "/" })} className={buttonVariants({ variant: "dark" })}>
        Sign Out
      </button>
    )
  }

  return (
    <button onClick={() => signIn("google", { callbackUrl: "/profile" })} className={buttonVariants({ variant: "honey" })}>
      Sign In with Google
    </button>
  )
}
