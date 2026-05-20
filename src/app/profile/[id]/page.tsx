import { getUserById } from "@/actions";
import { notFound } from "next/navigation";
import { PublicProfileClient } from "./public-profile-client";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getUserById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const user = result.data;

  return <PublicProfileClient user={user} />;
}
