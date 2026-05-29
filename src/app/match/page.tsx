import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MatchClient } from "./match-client";

export default async function MatchPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  return <MatchClient />;
}
