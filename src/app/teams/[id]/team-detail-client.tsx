"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { deleteTeam, leaveTeam, removeMemberFromTeam } from "@/actions";
import { InviteMemberModal } from "./invite-member-modal";
import { TeamChat } from "./team-chat";
import { TeamKanban } from "./team-kanban";
import { ProjectShowcase } from "./team-showcase";
import { TeamChemistry } from "./team-chemistry";

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

// ── Confirm Dialog ────────────────────────────────────────────────────────────
function ConfirmDialog({
  message, onConfirm, onCancel, danger = true,
}: {
  message: string; onConfirm: () => void; onCancel: () => void; danger?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 99999, padding: "20px",
      }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 8 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg2)", border: "1px solid var(--b)",
          borderRadius: "20px", padding: "28px", maxWidth: "400px", width: "100%",
        }}
      >
        <div style={{ fontSize: "14px", color: "var(--t)", lineHeight: 1.6, marginBottom: "20px" }}>
          {message}
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button
            className="btn btn-dark btn-sm"
            onClick={onCancel}
          >
            Batal
          </button>
          <button
            className="btn btn-sm"
            style={danger ? {
              background: "var(--rdb)", color: "var(--rd)",
              border: "1px solid var(--rbd)",
            } : {
              background: "var(--hbg)", color: "var(--ho)",
              border: "1px solid var(--hbd)",
            }}
            onClick={onConfirm}
          >
            Ya, lanjutkan
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
  const show = (text: string, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
}

export function TeamDetailClient({ team, currentUserId, isLeader, isMember }: TeamDetailClientProps) {
  const router = useRouter();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState<{ msg: string; action: () => Promise<void> } | null>(null);
  const { toast, show: showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"members" | "chat" | "kanban" | "showcase" | "chemistry">("members");

  const getInitials = (name: string | null) => {
    if (!name) return "??";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleDeleteTeam = () => {
    setConfirm({
      msg: `Hapus tim "${team.name}"? Tindakan ini tidak bisa dibatalkan.`,
      action: async () => {
        setLoading(true);
        const result = await deleteTeam(team.id);
        if (result.success) router.push("/teams");
        else { showToast(result.error ?? "Gagal menghapus tim", false); setLoading(false); }
      },
    });
  };

  const handleLeaveTeam = () => {
    setConfirm({
      msg: `Keluar dari tim "${team.name}"?`,
      action: async () => {
        setLoading(true);
        const result = await leaveTeam(team.id);
        if (result.success) router.push("/teams");
        else { showToast(result.error ?? "Gagal keluar dari tim", false); setLoading(false); }
      },
    });
  };

  const handleRemoveMember = (userId: string, userName: string | null) => {
    setConfirm({
      msg: `Keluarkan ${userName || "anggota ini"} dari tim?`,
      action: async () => {
        const result = await removeMemberFromTeam(team.id, userId);
        if (result.success) router.refresh();
        else showToast(result.error ?? "Gagal mengeluarkan anggota", false);
      },
    });
  };

  const acceptedMembers = team.members.filter((m) => m.joinStatus === "ACCEPTED");
  const pendingMembers = team.members.filter((m) => m.joinStatus === "PENDING");

  return (
    <>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            style={{
              position: "fixed", top: "72px", left: "50%", transform: "translateX(-50%)",
              zIndex: 9999, padding: "12px 24px", borderRadius: "100px",
              background: toast.ok ? "var(--gnb)" : "var(--rdb)",
              border: `1px solid ${toast.ok ? "var(--gbd)" : "var(--rbd)"}`,
              color: toast.ok ? "var(--gn)" : "var(--rd)",
              fontWeight: 700, fontSize: "13px", whiteSpace: "nowrap",
            }}
          >
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Dialog */}
      <AnimatePresence>
        {confirm && (
          <ConfirmDialog
            message={confirm.msg}
            onConfirm={async () => { setConfirm(null); await confirm.action(); }}
            onCancel={() => setConfirm(null)}
          />
        )}
      </AnimatePresence>

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

          {/* Tabs Navigation */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '28px',
            overflowX: 'auto',
            paddingBottom: '8px',
            borderBottom: '1px solid var(--bdr)'
          }}>
            {[
              { id: 'members', label: 'Anggota Tim', icon: 'ph-fill ph-users' },
              { id: 'showcase', label: 'Project Showcase', icon: 'ph-fill ph-rocket' },
              { id: 'chemistry', label: 'Chemistry Score', icon: 'ph-fill ph-chart-pie' },
              ...((isLeader || isMember) ? [
                { id: 'chat', label: 'Chat Room', icon: 'ph-fill ph-chat-circle-text' },
                { id: 'kanban', label: 'Papan Tugas (Kanban)', icon: 'ph-fill ph-kanban' },
              ] : [])
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`btn btn-sm`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '100px',
                    padding: '10px 20px',
                    fontWeight: 700,
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: isActive ? 'linear-gradient(135deg, #f5a623, #ffb83d)' : 'var(--bg2)',
                    border: isActive ? 'none' : '1px solid var(--bdr)',
                    color: isActive ? '#fff' : 'var(--t2)',
                  }}
                >
                  <i className={tab.icon} style={{ fontSize: '16px' }}></i>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Active Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "members" && (
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
                              borderRadius: '20px',
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
              )}

              {activeTab === "chat" && (isLeader || isMember) && (
                <TeamChat
                  teamId={team.id}
                  currentUserId={currentUserId}
                  members={team.members}
                  leader={{
                    id: team.leaderId,
                    name: team.leader.name,
                    image: team.leader.image,
                  }}
                />
              )}

              {activeTab === "kanban" && (isLeader || isMember) && (
                <TeamKanban
                  teamId={team.id}
                  members={team.members}
                  leader={{
                    id: team.leaderId,
                    name: team.leader.name,
                    image: team.leader.image,
                  }}
                />
              )}

              {activeTab === "showcase" && (
                <ProjectShowcase
                  teamId={team.id}
                  isMember={isMember}
                  isLeader={isLeader}
                />
              )}

              {activeTab === "chemistry" && (
                <TeamChemistry teamId={team.id} />
              )}
            </motion.div>
          </AnimatePresence>
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
