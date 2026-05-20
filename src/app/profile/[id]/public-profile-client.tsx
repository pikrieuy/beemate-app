"use client";

import { useState, useTransition } from "react";
import { endorseSkill, removeEndorsement } from "@/actions";

interface PublicProfileClientProps {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
    skills: string[];
    title: string | null;
    portfolioUrl: string | null;
    createdAt: Date;
    _count: {
      teamsCreated: number;
      teamMembers: number;
    };
    endorsementsReceived: {
      senderId: string;
      skill: string;
    }[];
  };
  currentUserId: string | null;
}

export function PublicProfileClient({ user, currentUserId }: PublicProfileClientProps) {
  const [endorsements, setEndorsements] = useState(user.endorsementsReceived || []);
  const [isPending, startTransition] = useTransition();

  const handleToggleEndorsement = (skill: string) => {
    if (!currentUserId) {
      alert("Kamu harus login untuk melakukan endorsement");
      return;
    }
    if (currentUserId === user.id) {
      return;
    }

    const isEndorsed = endorsements.some(
      (e) => e.senderId === currentUserId && e.skill === skill
    );

    if (isEndorsed) {
      setEndorsements((prev) =>
        prev.filter((e) => !(e.senderId === currentUserId && e.skill === skill))
      );
      startTransition(async () => {
        const res = await removeEndorsement(user.id, skill);
        if (!res.success) {
          setEndorsements((prev) => [...prev, { senderId: currentUserId, skill }]);
        }
      });
    } else {
      setEndorsements((prev) => [...prev, { senderId: currentUserId, skill }]);
      startTransition(async () => {
        const res = await endorseSkill(user.id, skill);
        if (!res.success) {
          setEndorsements((prev) =>
            prev.filter((e) => !(e.senderId === currentUserId && e.skill === skill))
          );
        }
      });
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

  const totalTeams = user._count.teamsCreated + user._count.teamMembers;

  return (
    <div className="page on" style={{ minHeight: '100vh', padding: '0 24px 60px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Hero Banner */}
        <div style={{ 
          height: '240px', 
          borderRadius: '24px', 
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
        </div>

        {/* Profile Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--t)', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              {user.name || "No Name"}
            </h1>
            <div style={{ fontSize: '16px', color: 'var(--t2)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {user.title && (
                <span><i className="ph-fill ph-user lc"></i> {user.title}</span>
              )}
              <span>·</span>
              <span>
                <i className="ph-fill ph-calendar lc"></i> Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>

            <p style={{ fontSize: '15px', color: 'var(--t)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '600px' }}>
              {user.bio || "This user hasn't added a bio yet."}
            </p>

            {user.portfolioUrl && (
              <a 
                href={user.portfolioUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-sm"
                style={{ marginBottom: '32px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <i className="ph-fill ph-link"></i> Visit Portfolio
              </a>
            )}

            {/* Invite to Team Button (TODO: Implement later) */}
            <div style={{ marginTop: '32px' }}>
              <button 
                className="btn btn-honey"
                onClick={() => alert('Invite to team feature coming soon!')}
              >
                <i className="ph-fill ph-user-plus"></i> Invite to Team
              </button>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: '24px', padding: '24px' }}>
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
                {user._count.teamsCreated} as leader, {user._count.teamMembers} as member
              </p>
            </div>

            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: '24px', padding: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Skills
              </div>
              {user.skills && user.skills.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {user.skills.map(skill => {
                    const skillEndorsements = endorsements.filter(e => e.skill === skill);
                    const count = skillEndorsements.length;
                    const isEndorsedByMe = skillEndorsements.some(e => e.senderId === currentUserId);
                    const isOwnProfile = currentUserId === user.id;

                    return (
                      <button
                        key={skill}
                        onClick={() => !isOwnProfile && handleToggleEndorsement(skill)}
                        disabled={isOwnProfile || isPending}
                        style={{
                          background: isEndorsedByMe ? 'var(--hbg)' : 'var(--bg)',
                          border: isEndorsedByMe ? '1px solid var(--hbd)' : '1px solid var(--bdr)',
                          padding: '8px 14px',
                          borderRadius: '100px',
                          fontSize: '13px',
                          color: isEndorsedByMe ? 'var(--ho)' : 'var(--t)',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: isOwnProfile ? 'default' : 'pointer',
                          transition: 'all 0.2s ease',
                          outline: 'none',
                        }}
                        onMouseEnter={(e) => {
                          if (!isOwnProfile) {
                            e.currentTarget.style.borderColor = 'var(--hbd)';
                            e.currentTarget.style.background = isEndorsedByMe ? 'var(--hbg)' : 'rgba(245,166,35,0.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isOwnProfile) {
                            e.currentTarget.style.borderColor = isEndorsedByMe ? 'var(--hbd)' : 'var(--bdr)';
                            e.currentTarget.style.background = isEndorsedByMe ? 'var(--hbg)' : 'var(--bg)';
                          }
                        }}
                      >
                        <span>{skill}</span>
                        {(count > 0 || !isOwnProfile) && (
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '3px',
                            color: isEndorsedByMe ? 'var(--ho)' : 'var(--t3)',
                            fontSize: '11px',
                            borderLeft: '1px solid var(--bdr)',
                            paddingLeft: '6px',
                            marginLeft: '2px',
                          }}>
                            <i className={isEndorsedByMe ? "ph-fill ph-thumbs-up" : "ph-bold ph-thumbs-up"} style={{ fontSize: '12px' }}></i>
                            {count > 0 && <span>{count}</span>}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--t2)' }}>
                  No skills listed yet.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
