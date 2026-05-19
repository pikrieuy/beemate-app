"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteCompetition } from "@/actions";

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
    email: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface CompetitionDetailClientProps {
  competition: Competition;
  canEdit: boolean;
}

export function CompetitionDetailClient({ competition, canEdit }: CompetitionDetailClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return "No deadline";
    return new Date(date).toLocaleDateString("en-US", { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (deadline: Date | null) => {
    if (!deadline) return null;
    const now = new Date();
    const date = new Date(deadline);
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Registration closed", color: "#ef4444" };
    if (diffDays === 0) return { text: "Closes today!", color: "#f59e0b" };
    if (diffDays === 1) return { text: "Closes tomorrow", color: "#f59e0b" };
    if (diffDays <= 7) return { text: `${diffDays} days remaining`, color: "#f5a623" };
    return { text: `${diffDays} days remaining`, color: "#10b981" };
  };

  const timeRemaining = getTimeRemaining(competition.deadline);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this competition? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    const result = await deleteCompetition(competition.id);
    
    if (result.success) {
      router.push("/competitions");
    } else {
      alert(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="page on" style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Back Button */}
        <Link 
          href="/competitions" 
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
          <i className="ph-fill ph-arrow-left"></i> Back to Competitions
        </Link>

        {/* Banner Image */}
        {competition.imageUrl ? (
          <div style={{
            width: '100%',
            height: '400px',
            borderRadius: '24px',
            background: `url(${competition.imageUrl}) center/cover`,
            marginBottom: '24px',
            border: '1px solid var(--bdr)'
          }} />
        ) : (
          <div style={{
            width: '100%',
            height: '400px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #f5a623, #ffc04d)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '120px',
            color: '#fff',
            marginBottom: '24px',
            border: '1px solid var(--bdr)'
          }}>
            <i className="ph-fill ph-trophy"></i>
          </div>
        )}

        {/* Main Content */}
        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--bdr)',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '24px'
        }}>
          {/* Header with Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ 
                fontSize: '36px', 
                fontWeight: 900, 
                color: 'var(--t)', 
                marginBottom: '16px',
                lineHeight: 1.2
              }}>
                {competition.title}
              </h1>
              
              {timeRemaining && (
                <div style={{ 
                  display: 'inline-block',
                  background: `${timeRemaining.color}15`,
                  border: `1px solid ${timeRemaining.color}40`,
                  padding: '8px 16px', 
                  borderRadius: '100px', 
                  fontSize: '13px', 
                  fontWeight: 700, 
                  color: timeRemaining.color,
                  marginBottom: '16px'
                }}>
                  <i className="ph-fill ph-clock"></i> {timeRemaining.text}
                </div>
              )}
            </div>
            
            {canEdit && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href={`/competitions/${competition.id}/edit`}>
                  <button className="btn btn-sm btn-honey">
                    <i className="ph-fill ph-pencil"></i> Edit
                  </button>
                </Link>
                <button 
                  className="btn btn-sm"
                  style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    border: '1px solid #ef4444', 
                    color: '#ef4444' 
                  }}
                  onClick={handleDelete}
                  disabled={loading}
                >
                  <i className="ph-fill ph-trash"></i>
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ 
            fontSize: '16px', 
            color: 'var(--t)', 
            lineHeight: 1.8,
            marginBottom: '32px',
            whiteSpace: 'pre-wrap'
          }}>
            {competition.description}
          </div>

          {/* Info Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            paddingTop: '32px',
            borderTop: '1px solid var(--bdr)'
          }}>
            {/* Deadline */}
            <div style={{
              background: 'var(--bg)',
              border: '1px solid var(--bdr)',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{ 
                fontSize: '13px', 
                color: 'var(--t2)', 
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <i className="ph-fill ph-calendar"></i> Deadline
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t)' }}>
                {formatDate(competition.deadline)}
              </div>
            </div>

            {/* Posted By */}
            <div style={{
              background: 'var(--bg)',
              border: '1px solid var(--bdr)',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{ 
                fontSize: '13px', 
                color: 'var(--t2)', 
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <i className="ph-fill ph-user"></i> Posted By
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {competition.author.image ? (
                  <img 
                    src={competition.author.image} 
                    alt={competition.author.name || "Author"} 
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f5a623, #ffc04d)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#fff'
                  }}>
                    {competition.author.name?.[0] || "?"}
                  </div>
                )}
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t)' }}>
                  {competition.author.name || "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Registration Button */}
          {competition.registrationLink && (
            <div style={{ marginTop: '32px' }}>
              <a 
                href={competition.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <button 
                  className="btn btn-honey"
                  style={{ 
                    width: '100%', 
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: 700
                  }}
                >
                  <i className="ph-fill ph-arrow-square-out"></i> Register Now
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
