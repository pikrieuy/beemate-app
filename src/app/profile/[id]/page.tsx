import { getUserById } from "@/actions";
import { notFound } from "next/navigation";
import { PublicProfileClient } from "./public-profile-client";

export default async function PublicProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getUserById(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const user = result.data;

  return <PublicProfileClient user={user} />;
}
