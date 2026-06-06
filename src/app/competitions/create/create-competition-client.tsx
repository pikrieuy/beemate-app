"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCompetition } from "@/actions";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { BackButton } from "@/components/ui/back-button";

export function CreateCompetitionClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    registrationLink: "",
    deadline: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Title and description are required");
      return;
    }

    setLoading(true);

    const result = await createCompetition({
      title: formData.title.trim(),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim() || undefined,
      registrationLink: formData.registrationLink.trim() || undefined,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined
    });

    if (result.success && result.data) {
      router.push(`/competitions/${result.data.id}`);
    } else {
      alert(result.error || "Failed to create competition");
      setLoading(false);
    }
  };

  return (
    <div className="page on" style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/competitions" style={{ display: 'inline-block' }}>
          <BackButton />
        </Link>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--t)', marginBottom: '8px' }}>
            Create Competition
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--t2)' }}>
            Post a new competition or hackathon for teams to join
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{
            background: 'var(--bg2)',
            border: '1px solid var(--bdr)',
            borderRadius: '24px',
            padding: '32px'
          }}>
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--t)', marginBottom: '12px' }}>
                Banner Image (optional)
              </label>
              <ImageUpload
                folder="banners"
                currentImageUrl={formData.imageUrl || null}
                onUploadComplete={(url) => setFormData({ ...formData, imageUrl: url })}
                onUploadError={(err) => alert(`Upload failed: ${err.message}`)}
                shape="rect"
                label="Upload Banner"
              />
              <div style={{ marginTop: '12px' }}>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Or paste image URL directly..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'var(--bg)',
                    border: '1px solid var(--bdr)',
                    borderRadius: '10px',
                    fontSize: '13px',
                    color: 'var(--t)',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--t)', marginBottom: '8px' }}>
                Competition Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., National Hackathon 2026"
                maxLength={100}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--bg)',
                  border: '1px solid var(--bdr)',
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: 'var(--t)',
                  outline: 'none'
                }}
                required
              />
              <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '6px', textAlign: 'right' }}>
                {formData.title.length}/100
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--t)', marginBottom: '8px' }}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the competition, prizes, rules, etc."
                maxLength={1000}
                rows={6}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--bg)',
                  border: '1px solid var(--bdr)',
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: 'var(--t)',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                required
              />
              <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '6px', textAlign: 'right' }}>
                {formData.description.length}/1000
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--t)', marginBottom: '8px' }}>
                Registration Link (optional)
              </label>
              <input
                type="url"
                value={formData.registrationLink}
                onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                placeholder="https://example.com/register"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--bg)',
                  border: '1px solid var(--bdr)',
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: 'var(--t)',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--t)', marginBottom: '8px' }}>
                Registration Deadline (optional)
              </label>
              <input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--bg)',
                  border: '1px solid var(--bdr)',
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: 'var(--t)',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Link href="/competitions">
                <button 
                  type="button"
                  className="btn"
                  style={{ background: 'var(--bg)', border: '1px solid var(--bdr)', color: 'var(--t)' }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </Link>
              <button 
                type="submit"
                className="btn btn-honey"
                disabled={loading}
              >
                {loading ? (
                  <><i className="ph-fill ph-circle-notch" style={{ animation: 'spin 1s linear infinite' }}></i> Creating...</>
                ) : (
                  <><i className="ph-fill ph-check"></i> Create Competition</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
