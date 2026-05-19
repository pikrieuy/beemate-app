"use client";

import { useState, useEffect } from "react";
import { searchUsers, inviteUserToTeam } from "@/actions";
import { useRouter } from "next/navigation";

interface InviteMemberModalProps {
  teamId: string;
  teamName: string;
  onClose: () => void;
}

export function InviteMemberModal({ teamId, teamName, onClose }: InviteMemberModalProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      if (search.trim()) {
        setLoading(true);
        const result = await searchUsers(search, 20);
        if (result.success) {
          setUsers(result.data);
        }
        setLoading(false);
      } else {
        setUsers([]);
      }
    }
    
    const timer = setTimeout(loadUsers, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleInvite = async (userId: string) => {
    setInviting(userId);
    const result = await inviteUserToTeam(teamId, userId);
    
    if (result.success) {
      alert("Invitation sent!");
      router.refresh();
      onClose();
    } else {
      alert(result.error);
      setInviting(null);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'var(--bg)',
          borderRadius: '24px',
          padding: '32px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          border: '1px solid var(--bdr)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--t)', marginBottom: '4px' }}>
              Invite Member
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--t2)' }}>
              to {teamName}
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              color: 'var(--t2)',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <i className="ph-fill ph-x"></i>
          </button>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or skills..."
            autoFocus
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid var(--bdr)',
              background: 'var(--bg2)',
              color: 'var(--t)',
              fontSize: '15px'
            }}
          />
        </div>

        {/* Results */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--t2)' }}>
            Loading...
          </div>
        )}

        {!loading && search && users.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--t2)' }}>
            <i className="ph-fill ph-magnifying-glass" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
            <p>No users found</p>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div style={{ display: 'grid', gap: '12px' }}>
            {users.map(user => (
              <div 
                key={user.id}
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--bdr)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name || "User"} 
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
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t)', marginBottom: '2px' }}>
                      {user.name || "Unknown"}
                    </div>
                    {user.title && (
                      <div style={{ fontSize: '13px', color: 'var(--t2)', marginBottom: '6px' }}>
                        {user.title}
                      </div>
                    )}
                    {user.skills && user.skills.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {user.skills.slice(0, 3).map((skill: string) => (
                          <span
                            key={skill}
                            style={{
                              background: 'var(--bg)',
                              border: '1px solid var(--bdr)',
                              padding: '2px 8px',
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
                <button
                  className="btn btn-honey btn-sm"
                  onClick={() => handleInvite(user.id)}
                  disabled={inviting === user.id}
                  style={{ minWidth: '80px' }}
                >
                  {inviting === user.id ? 'Inviting...' : 'Invite'}
                </button>
              </div>
            ))}
          </div>
        )}

        {!search && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--t2)' }}>
            <i className="ph-fill ph-users" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
            <p>Start typing to search for users</p>
          </div>
        )}
      </div>
    </div>
  );
}
