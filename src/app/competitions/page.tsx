import { auth } from "@/auth";
import { getCompetitions } from "@/actions";
import { CompetitionsClient } from "./competitions-client";
import { redirect } from "next/navigation";

export default async function CompetitionsPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const result = await getCompetitions({ upcoming: false });

  if (!result.success || !result.data) {
    return (
      <div className="page on" style={{ minHeight: '100vh', padding: '24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', paddingTop: '100px' }}>
          <p style={{ color: 'var(--t2)' }}>Failed to load competitions</p>
        </div>
      </div>
    );
  }

  return <CompetitionsClient competitions={result.data.competitions} userEmail={session.user.email} />;
}
