"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateCompetition } from "@/actions";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { BackButton } from "@/components/ui/back-button";

interface Competition {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  registrationLink: string | null;
  deadline: Date | null;
}

interface EditCompetitionClientProps {
  competition: Competition;
}

export function EditCompetitionClient({ competition }: EditCompetitionClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Format deadline for datetime-local input
  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    title: competition.title,
    description: competition.description,
    imageUrl: competition.imageUrl || "",
    registrationLink: competition.registrationLink || "",
    deadline: formatDateForInput(competition.deadline)
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Title and description are required");
      return;
    }

    setLoading(true);

    const result = await updateCompetition(competition.id, {
      title: formData.title.trim(),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim() || undefined,
      registrationLink: formData.registrationLink.trim() || undefined,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined
    });

    if (result.success) {
      router.push(`/competitions/${competition.id}`);
    } else {
      alert(result.error || "Failed to update competition");
      setLoading(false);
    }
  };

  return (
    <div className="page on" style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Back Button */}
        <Link href={`/competitions/${competition.id}`} style={{ display: 'inline-block' }}>
          <BackButton />
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 900, 
            color: 'var(--t)', 
            marginBottom: '8px' 
          }}>
            Edit Competition
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--t2)' }}>
            Update competition details
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            background: 'var(--bg2)',
            border: '1px solid var(--bdr)',
            borderRadius: '24px',
            padding: '32px'
          }}>
            {/* Banner Image Upload */}
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

            {/* Title */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                color: 'var(--t)', 
                marginBottom: '8px' 
              }}>
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
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--t3)', 
                marginTop: '6px',
                textAlign: 'right'
              }}>
                {formData.title.length}/100
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
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--t3)', 
                marginTop: '6px',
                textAlign: 'right'
              }}>
                {formData.description.length}/1000
              </div>
            </div>

            {/* Image URL */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                color: 'var(--t)', 
                marginBottom: '8px' 
              }}>
                Banner Image URL (optional)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/banner.jpg"
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
              <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '6px' }}>
                Provide a direct link to an image (jpg, png, etc.)
              </div>
            </div>

            {/* Registration Link */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                color: 'var(--t)', 
                marginBottom: '8px' 
              }}>
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
              <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '6px' }}>
                External registration page or form
              </div>
            </div>

            {/* Deadline */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                color: 'var(--t)', 
                marginBottom: '8px' 
              }}>
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

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Link href={`/competitions/${competition.id}`}>
                <button 
                  type="button"
                  className={buttonVariants({ variant: "default" })}
                  style={{ 
                    background: 'var(--bg)', 
                    border: '1px solid var(--bdr)', 
                    color: 'var(--t)' 
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </Link>
              <button 
                type="submit"
                className={buttonVariants({ variant: "honey" })}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="ph-fill ph-circle-notch" style={{ animation: 'spin 1s linear infinite' }}></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="ph-fill ph-check"></i>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
