"use client";

import { useState } from "react";
import { createTeam } from "@/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateTeamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Team name is required");
      return;
    }

    setLoading(true);
    setError("");

    const result = await createTeam({
      name: name.trim(),
      description: description.trim() || undefined,
    });

    if (result.success && result.data?.id) {
      router.push(`/teams/${result.data.id}`);
    } else {
      setError(result.error ?? "Failed to create team");
      setLoading(false);
    }
  };

  return (
    <div className="page on" style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <Link 
            href="/teams" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: 'var(--t2)', 
              textDecoration: 'none',
              fontSize: '14px',
              marginBottom: '16px'
            }}
          >
            <i className="ph-fill ph-arrow-left"></i> Back to Teams
          </Link>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 900, 
            color: 'var(--t)', 
            marginBottom: '8px' 
          }}>
            Create New Team
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--t2)' }}>
            Start building your dream team for competitions and projects
          </p>
        </div>

        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--bdr)',
          borderRadius: '24px',
          padding: '32px'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Team Name */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                color: 'var(--t)', 
                marginBottom: '8px' 
              }}>
                Team Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Innovation Squad"
                maxLength={50}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--bdr)',
                  background: 'var(--bg)',
                  color: 'var(--t)',
                  fontSize: '15px'
                }}
                required
              />
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--t2)', 
                marginTop: '6px',
                textAlign: 'right'
              }}>
                {name.length}/50
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                color: 'var(--t)', 
                marginBottom: '8px' 
              }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell others about your team's goals and what you're looking for..."
                rows={5}
                maxLength={500}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--bdr)',
                  background: 'var(--bg)',
                  color: 'var(--t)',
                  fontSize: '15px',
                  resize: 'vertical'
                }}
              />
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--t2)', 
                marginTop: '6px',
                textAlign: 'right'
              }}>
                {description.length}/500
              </div>
            </div>

            {error && (
              <div style={{ 
                padding: '14px', 
                borderRadius: '12px', 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: '#ef4444', 
                marginBottom: '24px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="ph-fill ph-warning-circle"></i>
                {error}
              </div>
            )}

            {/* Info Box */}
            <div style={{
              background: 'rgba(245, 166, 35, 0.1)',
              border: '1px solid rgba(245, 166, 35, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ 
                display: 'flex', 
                gap: '12px',
                fontSize: '14px',
                color: 'var(--t)'
              }}>
                <i className="ph-fill ph-info" style={{ color: 'var(--ho)', fontSize: '20px' }}></i>
                <div>
                  <strong>You will be the team leader.</strong> As a leader, you can:
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    <li>Invite members to your team</li>
                    <li>Manage team settings</li>
                    <li>Remove members if needed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Link 
                href="/teams"
                className="btn btn-sm"
                style={{ 
                  background: 'var(--bg)', 
                  border: '1px solid var(--bdr)', 
                  color: 'var(--t)',
                  textDecoration: 'none'
                }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-honey btn-sm"
                disabled={loading || !name.trim()}
                style={{ minWidth: '120px' }}
              >
                {loading ? (
                  <>
                    <i className="ph-fill ph-circle-notch" style={{ animation: 'spin 1s linear infinite' }}></i>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="ph-fill ph-check"></i>
                    Create Team
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
