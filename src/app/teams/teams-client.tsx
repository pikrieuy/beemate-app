"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Team {
  id: string;
  name: string;
  description: string | null;
  leaderId: string;
  leader: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count: {
    members: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface TeamsClientProps {
  initialTeams: Team[];
  initialPagination: any;
}

export function TeamsClient({ initialTeams, initialPagination }: TeamsClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = initialTeams.filter(team => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      team.name.toLowerCase().includes(q) ||
      team.description?.toLowerCase().includes(q) ||
      team.leader.name?.toLowerCase().includes(q)
    );
  });

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
    <div className="page on">
      <div className="shell">
        <div className="main" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="page-head">
            <div>
              <h1 style={{ 
                fontFamily: "'Sora', sans-serif", 
                fontSize: 'clamp(28px, 4vw, 36px)', 
                fontWeight: 800, 
                margin: '0 0 8px 0', 
                color: 'var(--t)' 
              }}>
                Browse <span style={{ 
                  background: 'linear-gradient(90deg, var(--ho), #ffc04d)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent' 
                }}>Teams</span>
              </h1>
              <div className="page-sub" style={{ fontSize: '15px' }}>
                {filtered.length} {filtered.length === 1 ? 'team' : 'teams'} available
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search teams..."
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--bdr)',
                  background: 'var(--bg2)',
                  color: 'var(--t)',
                  fontSize: '14px',
                  minWidth: '250px'
                }}
              />
              <Link href="/teams/create" className="btn btn-honey">
                <i className="ph-fill ph-plus"></i> Create Team
              </Link>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '20px',
              marginTop: '24px'
            }}>
              {filtered.map(team => (
                <Link 
                  key={team.id} 
                  href={`/teams/${team.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'var(--bg2)',
                    border: '1px solid var(--bdr)',
                    borderRadius: '20px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  className="team-card-hover"
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ 
                        fontSize: '20px', 
                        fontWeight: 800, 
                        color: 'var(--t)', 
                        marginBottom: '8px',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {team.name}
                      </h3>
                      <p style={{ 
                        fontSize: '14px', 
                        color: 'var(--t)', 
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '42px'
                      }}>
                        {team.description || "No description"}
                      </p>
                    </div>

                    <div style={{ 
                      marginTop: 'auto',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--bdr)'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {team.leader.image ? (
                            <img 
                              src={team.leader.image} 
                              alt={team.leader.name || "Leader"} 
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #f5a623, #ffc04d)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 800,
                              color: '#fff'
                            }}>
                              {getInitials(team.leader.name)}
                            </div>
                          )}
                          <div>
                            <div style={{ fontSize: '12px', color: 'var(--t2)' }}>
                              Leader
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t)' }}>
                              {team.leader.name || "Unknown"}
                            </div>
                          </div>
                        </div>
                        <div style={{ 
                          background: 'var(--bg)', 
                          border: '1px solid var(--bdr)',
                          padding: '6px 12px',
                          borderRadius: '100px',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'var(--t)'
                        }}>
                          <i className="ph-fill ph-users"></i> {team._count.members}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="es-title">No teams found</div>
              <div className="es-actions">
                <button 
                  className="btn btn-honey btn-sm" 
                  onClick={() => setSearch('')}
                >
                  <i className="ph-fill ph-x-circle"></i> Reset Search
                </button>
                <Link href="/teams/create" className="btn btn-sm">
                  <i className="ph-fill ph-plus"></i> Create Team
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .team-card-hover:hover {
          transform: translateY(-2px);
          border-color: var(--ho);
        }
      `}</style>
    </div>
  );
}
