import { getUserTeams } from "@/actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MyTeamsClient } from "./myteams-client";

export default async function MyTeamsPage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const result = await getUserTeams();
  const asLeader = result.success ? (result.data?.asLeader ?? []) : [];
  const asMember = result.success ? (result.data?.asMember ?? []) : [];

  return <MyTeamsClient asLeader={asLeader} asMember={asMember} />;
}
