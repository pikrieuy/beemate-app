"use client";

import { useState, useEffect } from "react";
import { searchUsers } from "@/actions";
import Link from "next/link";
import { ExpandingSearchDock } from "@/components/ui/ExpandingSearchDock";

interface User {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  skills: string[];
  title: string | null;
}

interface PeopleClientProps {
  initialUsers: User[];
}

export function PeopleClient({ initialUsers }: PeopleClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterTitle, setFilterTitle] = useState("all");
  const [loading, setLoading] = useState(false);

  // Filter users based on search and title
  useEffect(() => {
    async function loadUsers() {
      if (search.trim()) {
        setLoading(true);
        const result = await searchUsers(search, 100);
        if (result.success) {
          setUsers(result.data ?? []);
        }
        setLoading(false);
      } else {
        setUsers(initialUsers);
      }
    }
    
    const timer = setTimeout(loadUsers, 300); // Debounce
    return () => clearTimeout(timer);
  }, [search, initialUsers]);

  // Filter by title
  const filtered = users.filter(user => {
    if (filterTitle === "all") return true;
    return user.title === filterTitle;
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
        <aside className="sidebar">
          <div className="sb-section">
            <span className="sb-label">Filter by Role</span>
            <div className="sb-list">
              <button 
                className={`sbi ${filterTitle === 'all' ? 'on' : ''}`} 
                onClick={() => setFilterTitle('all')}
              >
                All
              </button>
              <button 
                className={`sbi ${filterTitle === 'Hacker' ? 'on' : ''}`} 
                onClick={() => setFilterTitle('Hacker')}
              >
                Hacker (Developer)
              </button>
              <button 
                className={`sbi ${filterTitle === 'Hustler' ? 'on' : ''}`} 
                onClick={() => setFilterTitle('Hustler')}
              >
                Hustler (Business)
              </button>
              <button 
                className={`sbi ${filterTitle === 'Hipster' ? 'on' : ''}`} 
                onClick={() => setFilterTitle('Hipster')}
              >
                Hipster (Designer)
              </button>
            </div>
          </div>
        </aside>

        <div className="main">
          <div className="page-head">
            <div>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--t)' }}>
                Browse <span style={{ background: 'linear-gradient(90deg, var(--bl), #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>People</span>
              </h1>
              <div className="page-sub" style={{ fontSize: '15px' }}>
                {filtered.length} {filtered.length === 1 ? 'person' : 'people'} found
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <ExpandingSearchDock
                value={search}
                onChange={setSearch}
                placeholder="Search by name or skills..."
              />
            </div>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--t2)' }}>
              Loading...
            </div>
          )}

          {!loading && filtered.length > 0 ? (
            <div className="grid people-g">
              {filtered.map(user => (
                <Link 
                  key={user.id} 
                  href={`/profile/${user.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'var(--bg2)',
                    border: '1px solid var(--bdr)',
                    borderRadius: '20px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    height: '100%'
                  }}
                  className="person-card-hover"
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                      {user.image ? (
                        <img 
                          src={user.image} 
                          alt={user.name || "User"} 
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
                          {getInitials(user.name)}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--t)', marginBottom: '4px' }}>
                          {user.name || "No Name"}
                        </h3>
                        {user.title && (
                          <div style={{ fontSize: '13px', color: 'var(--t2)', marginBottom: '8px' }}>
                            {user.title}
                          </div>
                        )}
                      </div>
                    </div>

                    {user.bio && (
                      <p style={{ 
                        fontSize: '14px', 
                        color: 'var(--t)', 
                        lineHeight: 1.6, 
                        marginBottom: '16px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {user.bio}
                      </p>
                    )}

                    {user.skills && user.skills.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {user.skills.slice(0, 3).map(skill => (
                          <span
                            key={skill}
                            style={{
                              background: 'var(--bg)',
                              border: '1px solid var(--bdr)',
                              padding: '4px 10px',
                              borderRadius: '100px',
                              fontSize: '12px',
                              color: 'var(--t)',
                              fontWeight: 600
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                        {user.skills.length > 3 && (
                          <span style={{ fontSize: '12px', color: 'var(--t2)', padding: '4px 10px' }}>
                            +{user.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : !loading && (
            <div className="empty-state">
              <div className="es-title">No people found</div>
              <div className="es-actions">
                <button 
                  className="btn btn-honey btn-sm" 
                  onClick={() => {
                    setFilterTitle('all');
                    setSearch('');
                  }}
                >
                  <i className="ph-fill ph-x-circle"></i> Reset Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .person-card-hover:hover {
          transform: translateY(-2px);
          border-color: var(--ho);
        }
      `}</style>
    </div>
  );
}
