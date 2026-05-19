"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteTeam, leaveTeam, removeMemberFromTeam } from "@/actions";
import { InviteMemberModal } from "./invite-member-modal";

interface TeamMember {
  id: string;
  userId: string;
  role: string;
  joinStatus: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    title: string | null;
    skills: string[];
  };
}

interface Team {
  id: string;
  name: string;
  description: string | null;
  leaderId: string;
  leader: {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
  };
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

interface TeamDetailClientProps {
  team: Team;
  currentUserId: string;
  isLeader: boolean;
  isMember: boolean;
}

export function TeamDetailClient({ team, currentUserId, isLeader, isMember }: TeamDetailClientProps) {
  const router = useRouter();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getInitials = (name: string | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDeleteTeam = async () => {
    if (!confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    const result = await deleteTeam(team.id);
    
    if (result.success) {
      router.push("/teams");
    } else {
      alert(result.error);
      setLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!confirm("Are you sure you want to leave this team?")) {
      return;
    }

    setLoading(true);
    const result = await leaveTeam(team.id);
    
    if (result.success) {
      router.push("/teams");
    } else {
      alert(result.error);
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string, userName: string | null) => {
    if (!confirm(`Remove ${userName || "this member"} from the team?`)) {
      return;
    }

    const result = await removeMemberFromTeam(team.id, userId);
    
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const acceptedMembers = team.members.filter(m => m.joinStatus === "ACCEPTED");
  const pendingMembers = team.members.filter(m => m.joinStatus === "PENDING");

  return (
    <>
      <div className="page on" style={{ minHeight: '100vh', padding: '24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Back Button */}
          <Link 
            href="/teams" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: 'var(--t2)', 
              textDecoration: 'none',
              fontSize: '14px',
              marginBottom: '24px'
            }}
          >
            <i className="ph-fill ph-arrow-left"></i> Back to Teams
          </Link>

          {/* Team Header */}
          <div style={{
            background: 'var(--bg2)',
            border: '1px solid var(--bdr)',
            borderRadius: '24px',
            padding: '32px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--t)', marginBottom: '12px' }}>
                  {team.name}
                </h1>
                <p style={{ fontSize: '15px', color: 'var(--t)', lineHeight: 1.7, maxWidth: '700px' }}>
                  {team.description || "No description"}
                </p>
              </div>
              
              {isLeader && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-honey btn-sm"
                    onClick={() => setShowInviteModal(true)}
                  >
                    <i className="ph-fill ph-user-plus"></i> Invite Member
                  </button>
                  <button 
                    className="btn btn-sm"
                    style={{ background: 'var(--bg)', border: '1px solid var(--bdr)', color: 'var(--t)' }}
                    onClick={handleDeleteTeam}
                    disabled={loading}
                  >
                    <i className="ph-fill ph-trash"></i>
                  </button>
                </div>
              )}
              
              {!isLeader && isMember && (
                <button 
                  className="btn btn-sm"
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444' }}
                  onClick={handleLeaveTeam}
                  disabled={loading}
                >
                  <i className="ph-fill ph-sign-out"></i> Leave Team
                </button>
              )}
            </div>

            {/* Leader Info */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              paddingTop: '24px',
              borderTop: '1px solid var(--bdr)'
            }}>
              {team.leader.image ? (
                <img 
                  src={team.leader.image} 
                  alt={team.leader.name || "Leader"} 
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f5a623, #ffc04d)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#fff'
                }}>
                  {getInitials(team.leader.name)}
                </div>
              )}
              <div>
                <div style={{ fontSize: '13px', color: 'var(--t2)', marginBottom: '2px' }}>
                  Team Leader
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t)' }}>
                  {team.leader.name || "Unknown"}
                </div>
              </div>
            </div>
          </div>

          {/* Members Section */}
          <div style={{
            background: 'var(--bg2)',
            border: '1px solid var(--bdr)',
            borderRadius: '24px',
            padding: '32px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--t)', marginBottom: '24px' }}>
              Team Members ({acceptedMembers.length})
            </h2>

            {acceptedMembers.length > 0 ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                {acceptedMembers.map(member => (
                  <div 
                    key={member.id}
                    style={{
                      background: 'var(--bg)',
                      border: '1px solid var(--bdr)',
                      borderRadius: '16px',
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {member.user.image ? (
                        <img 
                          src={member.user.image} 
                          alt={member.user.name || "Member"} 
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #f5a623, #ffc04d)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          fontWeight: 800,
                          color: '#fff'
                        }}>
                          {getInitials(member.user.name)}
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t)', marginBottom: '4px' }}>
                          {member.user.name || "Unknown"}
                        </div>
                        {member.user.title && (
                          <div style={{ fontSize: '13px', color: 'var(--t2)', marginBottom: '8px' }}>
                            {member.user.title}
                          </div>
                        )}
                        {member.user.skills && member.user.skills.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {member.user.skills.slice(0, 3).map(skill => (
                              <span
                                key={skill}
                                style={{
                                  background: 'var(--bg2)',
                                  border: '1px solid var(--bdr)',
                                  padding: '3px 8px',
                                  borderRadius: '100px',
                                  fontSize: '11px',
                                  color: 'var(--t)',
                                  fontWeight: 600
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {isLeader && member.userId !== currentUserId && (
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444' }}
                        onClick={() => handleRemoveMember(member.userId, member.user.name)}
                      >
                        <i className="ph-fill ph-x"></i> Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--t2)' }}>
                <i className="ph-fill ph-users" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
                <p>No members yet. {isLeader && "Invite some people to join your team!"}</p>
              </div>
            )}

            {/* Pending Invitations (Leader only) */}
            {isLeader && pendingMembers.length > 0 && (
              <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--bdr)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--t)', marginBottom: '16px' }}>
                  Pending Invitations ({pendingMembers.length})
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {pendingMembers.map(member => (
                    <div 
                      key={member.id}
                      style={{
                        background: 'rgba(245, 166, 35, 0.05)',
                        border: '1px solid rgba(245, 166, 35, 0.2)',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {member.user.image ? (
                          <img 
                            src={member.user.image} 
                            alt={member.user.name || "Member"} 
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #f5a623, #ffc04d)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            fontWeight: 800,
                            color: '#fff'
                          }}>
                            {getInitials(member.user.name)}
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--t)' }}>
                            {member.user.name || "Unknown"}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--t2)' }}>
                            Waiting for response...
                          </div>
                        </div>
                      </div>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'var(--bg)', border: '1px solid var(--bdr)', color: 'var(--t)' }}
                        onClick={() => handleRemoveMember(member.userId, member.user.name)}
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showInviteModal && (
        <InviteMemberModal 
          teamId={team.id}
          teamName={team.name}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </>
  );
}
