"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export function GoogleLoginButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <button disabled className="btn btn-dark">Loading...</button>
  }

  if (session) {
    return (
      <button onClick={() => signOut({ callbackUrl: "/" })} className="btn btn-dark">
        Sign Out
      </button>
    )
  }

  return (
    <button onClick={() => signIn("google", { callbackUrl: "/profile" })} className="btn btn-honey">
      Sign In with Google
    </button>
  )
}
