"use client";

import { useState } from "react";
import { EditProfileModal } from "./edit-profile-modal";
import { buttonVariants } from "@/components/ui/button";

interface ProfileClientProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    bio: string | null;
    skills: string[];
    title: string | null;
    portfolioUrl: string | null;
    role?: string;
    endorsementsReceived?: {
      senderId: string;
      skill: string;
    }[];
  };
  teams: {
    asLeader: any[];
    asMember: any[];
  } | null;
}

export function ProfileClient({ user, teams }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState("portfolio");
  const [showEditModal, setShowEditModal] = useState(false);

  // Get initials for avatar
  const getInitials = (name: string | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const totalTeams = (teams?.asLeader.length || 0) + (teams?.asMember.length || 0);

  return (
    <>
      <div className="page on" style={{ minHeight: '100vh', padding: '0 24px 60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Hero Banner */}
          <div style={{ 
            height: '240px', 
            borderRadius: "var(--r-pill)", 
            background: 'linear-gradient(135deg, var(--ho), #ffbe4d, var(--bl))',
            position: 'relative',
            marginBottom: '80px'
          }}>
            <div style={{
              position: 'absolute',
              bottom: '-60px',
              left: '40px',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: 'var(--bg)',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {user.image ? (
                <img 
                  src={user.image} 
                  alt={user.name || "User"} 
                  style={{
                    width: '100%', 
                    height: '100%', 
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f5a623, #ffc04d)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '48px', color: '#fff', fontWeight: 800
                }}>
                  {getInitials(user.name)}
                </div>
              )}
            </div>
            
            <button 
              className="btn btn-dark btn-sm" 
              style={{ position: 'absolute', bottom: '24px', right: '24px' }}
              onClick={() => setShowEditModal(true)}
            >
              <i className="ph-fill ph-pencil-simple"></i> Edit Profile
            </button>
          </div>

          {/* Profile Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px' }}>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--t)', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                {user.name || "No Name"}
              </h1>
              {/* Role badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                {user.role === "ADMIN" && (
                  <span style={{
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                    color: '#ef4444', padding: '3px 10px', borderRadius: '100px',
                    fontSize: '11px', fontWeight: 800, letterSpacing: '0.04em',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <i className="ph-fill ph-shield-check" style={{ fontSize: '12px' }} /> ADMIN
                  </span>
                )}
                {user.role === "USER" && (
                  <span style={{
                    background: 'var(--hbg)', border: '1px solid var(--hbd)',
                    color: 'var(--ho)', padding: '3px 10px', borderRadius: '100px',
                    fontSize: '11px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <i className="ph-fill ph-user" style={{ fontSize: '12px' }} /> Member
                  </span>
                )}
              </div>
              <div style={{ fontSize: '16px', color: 'var(--t2)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span><i className="ph-fill ph-envelope lc"></i> {user.email}</span>
                {user.title && (
                  <>
                    <span>·</span>
                    <span><i className="ph-fill ph-user lc"></i> {user.title}</span>
                  </>
                )}
              </div>

              <p style={{ fontSize: '15px', color: 'var(--t)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '600px' }}>
                {user.bio || "Belum ada bio. Klik 'Edit Profile' untuk menambahkan bio Anda."}
              </p>

              {user.portfolioUrl && (
                <a 
                  href={user.portfolioUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={buttonVariants({ size: "sm" })}
                  style={{ marginBottom: '32px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <i className="ph-fill ph-link"></i> Visit Portfolio
                </a>
              )}

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--bdr)' }}>
                <button 
                  onClick={() => setActiveTab('teams')} 
                  style={{ 
                    padding: '12px 24px', 
                    background: 'transparent', 
                    border: 'none', 
                    borderBottom: activeTab === 'teams' ? '3px solid var(--ho)' : '3px solid transparent', 
                    color: activeTab === 'teams' ? 'var(--t)' : 'var(--t2)', 
                    fontWeight: activeTab === 'teams' ? 800 : 500, 
                    fontSize: '15px', 
                    cursor: 'pointer' 
                  }}
                >
                  My Teams ({totalTeams})
                </button>
                <button 
                  onClick={() => setActiveTab('portfolio')} 
                  style={{ 
                    padding: '12px 24px', 
                    background: 'transparent', 
                    border: 'none', 
                    borderBottom: activeTab === 'portfolio' ? '3px solid var(--ho)' : '3px solid transparent', 
                    color: activeTab === 'portfolio' ? 'var(--t)' : 'var(--t2)', 
                    fontWeight: activeTab === 'portfolio' ? 800 : 500, 
                    fontSize: '15px', 
                    cursor: 'pointer' 
                  }}
                >
                  Portfolio
                </button>
              </div>

              {/* Content Area */}
              {activeTab === 'teams' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {teams?.asLeader && teams.asLeader.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--t)', marginBottom: '16px' }}>
                        As Team Leader
                      </h3>
                      {teams.asLeader.map((team: any) => (
                        <div key={team.id} style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: "var(--r-pill)", padding: '24px', marginBottom: '16px' }}>
                          <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--t)', marginBottom: '8px' }}>
                            {team.name}
                          </h4>
                          <p style={{ fontSize: '14px', color: 'var(--t2)', marginBottom: '12px' }}>
                            {team.description || "No description"}
                          </p>
                          <div style={{ fontSize: '13px', color: 'var(--t2)' }}>
                            {team._count?.members || 0} members
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {teams?.asMember && teams.asMember.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--t)', marginBottom: '16px' }}>
                        As Team Member
                      </h3>
                      {teams.asMember.map((team: any) => (
                        <div key={team.id} style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: "var(--r-pill)", padding: '24px', marginBottom: '16px' }}>
                          <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--t)', marginBottom: '8px' }}>
                            {team.name}
                          </h4>
                          <p style={{ fontSize: '14px', color: 'var(--t2)', marginBottom: '12px' }}>
                            {team.description || "No description"}
                          </p>
                          <div style={{ fontSize: '13px', color: 'var(--t2)' }}>
                            Leader: {team.leader?.name || "Unknown"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {totalTeams === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--t2)' }}>
                      <i className="ph-fill ph-users" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
                      <p>Belum ada team. Buat team pertama Anda!</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'portfolio' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                  {/* Portfolio URL */}
                  {user.portfolioUrl ? (
                    <div style={{
                      background: 'var(--bg2)', border: '1px solid var(--hbd)',
                      borderRadius: "var(--r-pill)", padding: '20px',
                      display: 'flex', alignItems: 'center', gap: '16px',
                    }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: "var(--r-pill)",
                        background: 'var(--hbg)', color: 'var(--ho)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '22px', flexShrink: 0,
                      }}>
                        <i className="ph-fill ph-link" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', color: 'var(--t3)', fontWeight: 600, marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Portfolio Link
                        </div>
                        <a
                          href={user.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '14px', color: 'var(--ho)', fontWeight: 700,
                            textDecoration: 'none', overflow: 'hidden',
                            textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block',
                          }}
                        >
                          {user.portfolioUrl}
                        </a>
                      </div>
                      <a href={user.portfolioUrl} target="_blank" rel="noopener noreferrer">
                        <button className="btn btn-dark btn-sm">
                          <i className="ph-fill ph-arrow-square-out" /> Buka
                        </button>
                      </a>
                    </div>
                  ) : (
                    <div style={{
                      background: 'var(--bg2)', border: '1px dashed var(--b)',
                      borderRadius: "var(--r-pill)", padding: '20px',
                      display: 'flex', alignItems: 'center', gap: '14px',
                    }}>
                      <i className="ph-fill ph-link-break" style={{ fontSize: '22px', color: 'var(--t3)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: 'var(--t2)' }}>
                          Belum ada portfolio link.{' '}
                          <button
                            onClick={() => setShowEditModal(true)}
                            style={{ background: 'none', border: 'none', color: 'var(--ho)', fontWeight: 700, cursor: 'pointer', fontSize: '13px', padding: 0 }}
                          >
                            Tambahkan di Edit Profile →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Achievement / Project cards — data contoh */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                      Pencapaian & Proyek
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                      {[
                        { icon: 'ph-trophy', color: 'var(--ho)', bg: 'var(--hbg)', border: 'var(--hbd)', title: 'Hackathon Kampus 2024', desc: 'Juara 2 — Tim 4 orang', tag: 'Kompetisi' },
                        { icon: 'ph-code', color: 'var(--bl)', bg: 'var(--blb)', border: 'var(--bbd)', title: 'Proyek Capstone', desc: 'Sistem manajemen inventori', tag: 'Proyek' },
                        { icon: 'ph-certificate', color: 'var(--pu)', bg: 'var(--pub)', border: 'var(--pbd)', title: 'Google UX Design', desc: 'Coursera Certificate', tag: 'Sertifikat' },
                      ].map((item) => (
                        <div key={item.title} style={{
                          background: 'var(--bg2)', border: `1px solid ${item.border}`,
                          borderRadius: "var(--r-pill)", padding: '16px',
                          display: 'flex', gap: '12px', alignItems: 'flex-start',
                        }}>
                          <div style={{
                            width: '38px', height: '38px', borderRadius: "var(--r-pill)",
                            background: item.bg, color: item.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '18px', flexShrink: 0,
                          }}>
                            <i className={`ph-fill ${item.icon}`} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t)', marginBottom: '3px' }}>{item.title}</div>
                            <div style={{ fontSize: '11px', color: 'var(--t2)', marginBottom: '6px' }}>{item.desc}</div>
                            <span style={{
                              fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                              borderRadius: '6px', background: item.bg, color: item.color,
                              border: `1px solid ${item.border}`,
                            }}>
                              {item.tag}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '12px' }}>
                      * Data contoh — fitur upload pencapaian akan hadir di update berikutnya.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Stats Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: "var(--r-pill)", padding: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                  Teams
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '48px', fontWeight: 900, color: 'var(--ho)', lineHeight: 1 }}>
                    {totalTeams}
                  </span>
                  <span style={{ fontSize: '18px', color: 'var(--t2)', paddingBottom: '6px' }}>
                    total
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: 1.6 }}>
                  {teams?.asLeader.length || 0} as leader, {teams?.asMember.length || 0} as member
                </p>
              </div>

              <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: "var(--r-pill)", padding: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                  Top Skills
                </div>
                {user.skills && user.skills.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {user.skills.map(skill => {
                      const count = (user.endorsementsReceived || []).filter(e => e.skill === skill).length;

                      return (
                        <span 
                          key={skill} 
                          style={{ 
                            background: 'var(--bg)', 
                            border: '1px solid var(--bdr)', 
                            padding: '6px 12px', 
                            borderRadius: '100px', 
                            fontSize: '13px', 
                            color: 'var(--t)', 
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <span>{skill}</span>
                          {count > 0 && (
                            <span style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '3px',
                              color: 'var(--ho)',
                              fontSize: '11px',
                              borderLeft: '1px solid var(--bdr)',
                              paddingLeft: '6px',
                              marginLeft: '2px',
                            }}>
                              <i className="ph-fill ph-thumbs-up" style={{ fontSize: '12px' }}></i>
                              <span>{count}</span>
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--t2)' }}>
                    Belum ada skills. Tambahkan skills Anda!
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {showEditModal && (
        <EditProfileModal 
          user={user} 
          onClose={() => setShowEditModal(false)} 
        />
      )}
    </>
  );
}

