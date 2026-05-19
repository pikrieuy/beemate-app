"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  image: string | null;
  role: string;
}

interface Team {
  id: string;
  name: string;
  description: string | null;
  _count: {
    members: number;
  };
}

interface PendingInvitation {
  id: string;
  team: {
    id: string;
    name: string;
    leader: {
      name: string | null;
      image: string | null;
    };
  };
  createdAt: Date;
}

interface Competition {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  deadline: Date | null;
  author: {
    name: string | null;
    image: string | null;
  };
}

interface DashboardClientProps {
  user: User;
  stats: {
    teamsCreated: number;
    teamsJoined: number;
    pendingInvites: number;
    upcomingCompetitions: number;
  };
  teamsCreated: Team[];
  teamMemberships: Team[];
  pendingInvitations: PendingInvitation[];
  upcomingCompetitions: Competition[];
}

export function DashboardClient({
  user,
  stats,
  teamsCreated,
  teamMemberships,
  pendingInvitations,
  upcomingCompetitions
}: DashboardClientProps) {
  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDeadline = (deadline: Date | null) => {
    if (!deadline) return "No deadline";
    const date = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `${diffDays} days`;
    
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="page on" style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}
        >
          <h1 style={{ 
            fontSize: 'clamp(28px, 5vw, 36px)', 
            fontWeight: 900, 
            color: 'var(--t)', 
            marginBottom: '8px' 
          }}>
            {getGreeting()}, {user.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--t2)' }}>
            Welcome to your BeeMate dashboard. Here's what's happening today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'linear-gradient(135deg, #f5a623, #ffc04d)',
              borderRadius: '20px',
              padding: '24px',
              cursor: 'pointer'
            }}
            onClick={() => router.push('/teams')}
          >
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '4px' }}>
              {stats.teamsCreated}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
              Teams Created
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--bdr)',
              borderRadius: '20px',
              padding: '24px',
              cursor: 'pointer'
            }}
            onClick={() => router.push('/teams')}
          >
            <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--t)', marginBottom: '4px' }}>
              {stats.teamsJoined}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--t2)', fontWeight: 600 }}>
              Teams Joined
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--bdr)',
              borderRadius: '20px',
              padding: '24px',
              cursor: 'pointer'
            }}
            onClick={() => router.push('/notifications')}
          >
            <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--t)', marginBottom: '4px' }}>
              {stats.pendingInvites}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--t2)', fontWeight: 600 }}>
              Pending Invites
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--bdr)',
              borderRadius: '20px',
              padding: '24px',
              cursor: 'pointer'
            }}
            onClick={() => router.push('/competitions')}
          >
            <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--t)', marginBottom: '4px' }}>
              {stats.upcomingCompetitions}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--t2)', fontWeight: 600 }}>
              Upcoming Competitions
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: '32px' }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--t)', marginBottom: '16px' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/teams/create">
              <button className="btn btn-honey">
                <i className="ph-fill ph-users"></i> Create Team
              </button>
            </Link>
            <Link href="/people">
              <button className="btn" style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', color: 'var(--t)' }}>
                <i className="ph-fill ph-user-circle-plus"></i> Find People
              </button>
            </Link>
            <Link href="/competitions">
              <button className="btn" style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', color: 'var(--t)' }}>
                <i className="ph-fill ph-trophy"></i> Browse Competitions
              </button>
            </Link>
            {user.role === "ADMIN" && (
              <Link href="/competitions/create">
                <button className="btn" style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', color: 'var(--t)' }}>
                  <i className="ph-fill ph-plus"></i> Post Competition
                </button>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Your Teams */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--bdr)',
              borderRadius: '24px',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--t)' }}>
                Your Teams
              </h3>
              <Link href="/teams" style={{ fontSize: '13px', color: 'var(--ho)', textDecoration: 'none', fontWeight: 600 }}>
                View All →
              </Link>
            </div>

            {teamsCreated.length > 0 || teamMemberships.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {teamsCreated.slice(0, 3).map(team => (
                  <div
                    key={team.id}
                    onClick={() => router.push(`/teams/${team.id}`)}
                    style={{
                      background: 'var(--bg)',
                      border: '1px solid var(--bdr)',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--ho)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--bdr)';
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t)', marginBottom: '4px' }}>
                      {team.name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--t2)' }}>
                      <i className="ph-fill ph-users"></i> {team._count.members} members · Leader
                    </div>
                  </div>
                ))}
                {teamMemberships.slice(0, 2).map(team => (
                  <div
                    key={team.id}
                    onClick={() => router.push(`/teams/${team.id}`)}
                    style={{
                      background: 'var(--bg)',
                      border: '1px solid var(--bdr)',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--ho)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--bdr)';
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t)', marginBottom: '4px' }}>
                      {team.name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--t2)' }}>
                      <i className="ph-fill ph-users"></i> {team._count.members} members · Member
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--t2)' }}>
                <i className="ph-fill ph-users" style={{ fontSize: '48px', marginBottom: '12px', display: 'block', opacity: 0.3 }}></i>
                <p style={{ fontSize: '14px', marginBottom: '16px' }}>No teams yet</p>
                <Link href="/teams/create">
                  <button className="btn btn-sm btn-honey">
                    Create Your First Team
                  </button>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--bdr)',
                borderRadius: '24px',
                padding: '24px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--t)' }}>
                  Pending Invites
                </h3>
                <Link href="/notifications" style={{ fontSize: '13px', color: 'var(--ho)', textDecoration: 'none', fontWeight: 600 }}>
                  View All →
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingInvitations.slice(0, 3).map(invite => (
                  <div
                    key={invite.id}
                    onClick={() => router.push('/notifications')}
                    style={{
                      background: 'rgba(245, 166, 35, 0.05)',
                      border: '1px solid rgba(245, 166, 35, 0.2)',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t)', marginBottom: '4px' }}>
                      {invite.team.name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--t2)' }}>
                      Invited by {invite.team.leader.name || "Unknown"}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Upcoming Competitions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--bdr)',
              borderRadius: '24px',
              padding: '24px',
              gridColumn: pendingInvitations.length === 0 ? 'span 1' : 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--t)' }}>
                Upcoming Competitions
              </h3>
              <Link href="/competitions" style={{ fontSize: '13px', color: 'var(--ho)', textDecoration: 'none', fontWeight: 600 }}>
                View All →
              </Link>
            </div>

            {upcomingCompetitions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {upcomingCompetitions.slice(0, 4).map(comp => (
                  <div
                    key={comp.id}
                    onClick={() => router.push(`/competitions/${comp.id}`)}
                    style={{
                      background: 'var(--bg)',
                      border: '1px solid var(--bdr)',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--ho)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--bdr)';
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t)', marginBottom: '4px' }}>
                      {comp.title}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--t2)' }}>
                      <i className="ph-fill ph-clock"></i> {formatDeadline(comp.deadline)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--t2)' }}>
                <i className="ph-fill ph-trophy" style={{ fontSize: '48px', marginBottom: '12px', display: 'block', opacity: 0.3 }}></i>
                <p style={{ fontSize: '14px' }}>No upcoming competitions</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
