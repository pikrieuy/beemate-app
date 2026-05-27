import { getProjects } from "@/actions";
import { auth } from "@/auth";
import { ExploreClient } from "./explore-client";

export default async function ExplorePage() {
  const session = await auth();
  const result = await getProjects({ limit: 30 });
  const projects = result.success ? (result.data ?? []) : [];

  return (
    <ExploreClient
      projects={projects}
      isLoggedIn={!!session?.user}
    />
  );
}
