"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExpandingSearchDock } from "@/components/ui/ExpandingSearchDock";

interface Competition {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  registrationLink: string | null;
  deadline: Date | null;
  authorId: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface CompetitionsClientProps {
  competitions: Competition[];
  userEmail: string;
}

export function CompetitionsClient({ competitions, userEmail }: CompetitionsClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  // Check if user is admin (you can enhance this by passing user role from server)
  const isAdmin = userEmail.includes("admin"); // Simple check, enhance as needed

  const filtered = useMemo(() => {
    let result = competitions;

    // Filter by search
    if (search) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by time
    const now = new Date();
    if (filter === "upcoming") {
      result = result.filter(c => c.deadline && new Date(c.deadline) >= now);
    } else if (filter === "past") {
      result = result.filter(c => c.deadline && new Date(c.deadline) < now);
    }

    return result;
  }, [competitions, search, filter]);

  const formatDeadline = (deadline: Date | null) => {
    if (!deadline) return "No deadline";
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Closed";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `${diffDays} days left`;
    
    return date.toLocaleDateString("id-ID", { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    });
  };

  const getDeadlineColor = (deadline: Date | null) => {
    if (!deadline) return "var(--t2)";
    const date = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "#ef4444"; // red
    if (diffDays <= 3) return "#f59e0b"; // orange
    if (diffDays <= 7) return "#f5a623"; // honey
    return "#10b981"; // green
  };

  return (
    <div className="page on" style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h1 style={{ 
                fontFamily: "'Sora', sans-serif", 
                fontSize: 'clamp(32px, 5vw, 42px)', 
                fontWeight: 900, 
                margin: '0 0 8px 0', 
                color: 'var(--t)' 
              }}>
                Competitions
              </h1>
              <p style={{ fontSize: '15px', color: 'var(--t2)', maxWidth: '600px', lineHeight: 1.6 }}>
                Discover competitions and hackathons. Form your team and register before the deadline!
              </p>
            </div>
            
            {isAdmin && (
              <Link href="/competitions/create">
                <button className="btn btn-honey">
                  <i className="ph-fill ph-plus"></i> Create Competition
                </button>
              </Link>
            )}
          </div>
          
          {/* Search and Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
            <ExpandingSearchDock
              value={search}
              onChange={setSearch}
              placeholder="Search competitions..."
            />
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-sm"
                style={{
                  background: filter === "all" ? 'var(--ho)' : 'var(--bg)',
                  border: '1px solid var(--bdr)',
                  color: filter === "all" ? '#fff' : 'var(--t)'
                }}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className="btn btn-sm"
                style={{
                  background: filter === "upcoming" ? 'var(--ho)' : 'var(--bg)',
                  border: '1px solid var(--bdr)',
                  color: filter === "upcoming" ? '#fff' : 'var(--t)'
                }}
                onClick={() => setFilter("upcoming")}
              >
                Upcoming
              </button>
              <button
                className="btn btn-sm"
                style={{
                  background: filter === "past" ? 'var(--ho)' : 'var(--bg)',
                  border: '1px solid var(--bdr)',
                  color: filter === "past" ? '#fff' : 'var(--t)'
                }}
                onClick={() => setFilter("past")}
              >
                Past
              </button>
            </div>
          </div>

          {search && (
            <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--t2)' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
            </div>
          )}
        </div>

        {/* Competitions Grid */}
        {filtered.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '24px' 
          }}>
            {filtered.map((competition, i) => (
              <motion.div 
                key={competition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--bdr)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(245, 166, 35, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => router.push(`/competitions/${competition.id}`)}
              >
                {/* Image */}
                {competition.imageUrl ? (
                  <div style={{
                    width: '100%',
                    height: '180px',
                    background: `url(${competition.imageUrl}) center/cover`,
                  }} />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '180px',
                    background: 'linear-gradient(135deg, #f5a623, #ffc04d)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    color: '#fff'
                  }}>
                    <i className="ph-fill ph-trophy"></i>
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: '24px' }}>
                  <div style={{ 
                    display: 'inline-block',
                    background: 'var(--bg)', 
                    padding: '4px 12px', 
                    borderRadius: '100px', 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    color: getDeadlineColor(competition.deadline),
                    border: `1px solid ${getDeadlineColor(competition.deadline)}20`,
                    marginBottom: '16px'
                  }}>
                    {formatDeadline(competition.deadline)}
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: 800, 
                    margin: '0 0 8px 0', 
                    color: 'var(--t)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {competition.title}
                  </h3>
                  
                  <p style={{ 
                    fontSize: '14px', 
                    color: 'var(--t2)', 
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.5
                  }}>
                    {competition.description}
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--bdr)'
                  }}>
                    {competition.author.image ? (
                      <img 
                        src={competition.author.image} 
                        alt={competition.author.name || "Author"} 
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f5a623, #ffc04d)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 800,
                        color: '#fff'
                      }}>
                        {competition.author.name?.[0] || "?"}
                      </div>
                    )}
                    <span style={{ fontSize: '12px', color: 'var(--t2)' }}>
                      by {competition.author.name || "Unknown"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px', 
            color: 'var(--t2)' 
          }}>
            <i className="ph-fill ph-trophy" style={{ 
              fontSize: '64px', 
              marginBottom: '16px', 
              display: 'block',
              opacity: 0.3
            }}></i>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>
              {search ? "No competitions found" : "No competitions yet"}
            </p>
            <p style={{ fontSize: '14px' }}>
              {search ? "Try a different search term" : isAdmin ? "Create the first competition!" : "Check back later"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
