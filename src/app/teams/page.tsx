import { getTeams } from "@/actions";
import { TeamsClient } from "./teams-client";

export default async function TeamsPage() {
  const result = await getTeams(1, 50);
  const teams = result.success ? result.data.teams : [];
  const pagination = result.success ? result.data.pagination : null;

  return <TeamsClient initialTeams={teams} initialPagination={pagination} />;
}
