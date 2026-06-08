"use client";

import { useState } from "react";
import { updateUserProfile } from "@/actions";
import { extractSkillsFromText } from "@/actions/matchmaking.actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { buttonVariants } from "@/components/ui/button";

interface EditProfileModalProps {
  user: {
    name: string | null;
    image: string | null;
    bio: string | null;
    skills: string[];
    title: string | null;
    portfolioUrl: string | null;
  };
  onClose: () => void;
}

export function EditProfileModal({ user, onClose }: EditProfileModalProps) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [skills, setSkills] = useState<string[]>(user.skills || []);
  const [title, setTitle] = useState(user.title || "");
  const [portfolioUrl, setPortfolioUrl] = useState(user.portfolioUrl || "");
  const [skillInput, setSkillInput] = useState("");
  const [imageUrl, setImageUrl] = useState(user.image || "");

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await updateUserProfile({
      name: name.trim() || undefined,
      bio: bio.trim() || undefined,
      skills: skills.length > 0 ? skills : undefined,
      title: title || undefined,
      portfolioUrl: portfolioUrl.trim() || undefined,
      image: imageUrl || undefined,
    });

    if (result.success) {
      // Update session JWT so navbar avatar reflects the new image immediately
      await updateSession({ image: imageUrl, name: name.trim() || undefined });
      router.refresh();
      onClose();
    } else {
      setError(result.error || "Failed to update profile");
    }

    setLoading(false);
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
          borderRadius: "var(--r-pill)",
          padding: '32px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid var(--bdr)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--t)' }}>
            Edit Profile
          </h2>
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

        <form onSubmit={handleSubmit}>

          {/* Avatar Upload */}
          <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--t)', marginBottom: '12px', alignSelf: 'flex-start' }}>
              Profile Photo
            </label>
            <ImageUpload
              folder="avatars"
              currentImageUrl={imageUrl}
              onUploadComplete={(url) => setImageUrl(url)}
              onUploadError={(err) => setError(`Upload failed: ${err.message}`)}
              shape="circle"
              label="Change Photo"
              previewSize={100}
            />
          </div>

          {/* Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--t)', marginBottom: '8px' }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: "var(--r-pill)",
                border: '1px solid var(--bdr)',
                background: 'var(--bg2)',
                color: 'var(--t)',
                fontSize: '15px'
              }}
            />
          </div>

          {/* Bio */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--t)', marginBottom: '8px' }}>
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: "var(--r-pill)",
                border: '1px solid var(--bdr)',
                background: 'var(--bg2)',
                color: 'var(--t)',
                fontSize: '15px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            {bio.length >= 10 && (
              <button
                type="button"
                onClick={async () => {
                  setAiLoading(true);
                  setError("");
                  const result = await extractSkillsFromText(bio);
                  if (result.success && result.data) {
                    setSkills(result.data.skills);
                    setTitle(result.data.title);
                  } else {
                    setError(result.error || "AI extraction failed");
                  }
                  setAiLoading(false);
                }}
                disabled={aiLoading}
                style={{
                  marginTop: '8px', padding: '6px 14px', borderRadius: "var(--r-pill)",
                  border: '1px solid rgba(245,166,35,0.3)', background: 'rgba(245,166,35,0.08)',
                  color: '#f5a623', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  opacity: aiLoading ? 0.6 : 1,
                }}
              >
                <i className="ph-fill ph-sparkle" style={{ marginRight: '4px' }} />
                {aiLoading ? "Menganalisis..." : "✨ AI Auto-detect Skills dari Bio"}
              </button>
            )}
          </div>

          {/* Title */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--t)', marginBottom: '8px' }}>
              Title
            </label>
            <select
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: "var(--r-pill)",
                border: '1px solid var(--bdr)',
                background: 'var(--bg2)',
                color: 'var(--t)',
                fontSize: '15px'
              }}
            >
              <option value="">Select title...</option>
              <option value="Hacker">Hacker (Developer/Engineer)</option>
              <option value="Hustler">Hustler (Business/Marketing)</option>
              <option value="Hipster">Hipster (Designer/Creative)</option>
            </select>
          </div>

          {/* Skills */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--t)', marginBottom: '8px' }}>
              Skills
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Add a skill..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: "var(--r-pill)",
                  border: '1px solid var(--bdr)',
                  background: 'var(--bg2)',
                  color: 'var(--t)',
                  fontSize: '15px'
                }}
              />
              <button
                type="button"
                onClick={addSkill}
                className={buttonVariants({ size: "sm" })}
                style={{ background: 'var(--ho)', color: '#fff' }}
              >
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.map(skill => (
                <span
                  key={skill}
                  style={{
                    background: 'var(--bg2)',
                    border: '1px solid var(--bdr)',
                    padding: '6px 12px',
                    borderRadius: '100px',
                    fontSize: '13px',
                    color: 'var(--t)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--t2)',
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: '16px'
                    }}
                  >
                    <i className="ph-fill ph-x"></i>
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio URL */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--t)', marginBottom: '8px' }}>
              Portfolio URL
            </label>
            <input
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://yourportfolio.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: "var(--r-pill)",
                border: '1px solid var(--bdr)',
                background: 'var(--bg2)',
                color: 'var(--t)',
                fontSize: '15px'
              }}
            />
          </div>

          {error && (
            <div style={{ 
              padding: '12px', 
              borderRadius: "var(--r-pill)", 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: '#ef4444', 
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              className={buttonVariants({ size: "sm" })}
              style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', color: 'var(--t)' }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={buttonVariants({ size: "sm" })}
              style={{ background: 'var(--ho)', color: '#fff' }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

