import { searchUsers } from "@/actions";
import { PeopleClient } from "./people-client";

export default async function PeoplePage() {
  // Fetch all users initially (empty search returns all)
  const result = await searchUsers("", 100);
  const users = result.success ? result.data : [];
  
  return <PeopleClient initialUsers={users} />;
}
