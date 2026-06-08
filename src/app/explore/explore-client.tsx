"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createProject } from "@/actions";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  createdAt: Date;
  user: { id: string; name: string | null; image: string | null; title: string | null };
  team: { id: string; name: string } | null;
  _count: { likes: number; comments: number };
}

interface Props {
  projects: Project[];
  isLoggedIn: boolean;
}

export function ExploreClient({ projects, isLoggedIn }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", demoUrl: "", githubUrl: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await createProject({
      title: form.title,
      description: form.description,
      demoUrl: form.demoUrl || undefined,
      githubUrl: form.githubUrl || undefined,
    });
    if (result.success) {
      setShowForm(false);
      setForm({ title: "", description: "", demoUrl: "", githubUrl: "" });
      router.refresh();
    } else {
      setError(result.error ?? "Gagal membuat proyek");
    }
    setLoading(false);
  };

  return (
    <div className="page on" style={{ minHeight: "100vh", padding: "16px 24px 60px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{
              fontFamily: "'Sora', sans-serif", fontSize: "clamp(28px, 4vw, 38px)",
              fontWeight: 900, margin: "0 0 6px", color: "var(--t)",
            }}>
              Open{" "}
              <span style={{
                background: "linear-gradient(90deg, var(--ho), #ffbe4d)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Projects</span>
            </h1>
            <p style={{ fontSize: "13px", color: "var(--t2)", margin: 0 }}>
              {projects.length} proyek terbuka · Posting proyek dan cari kolaborator
            </p>
          </div>
          {isLoggedIn && (
            <button
              className="btn btn-honey btn-md"
              onClick={() => setShowForm(!showForm)}
            >
              <i className={`ph-fill ${showForm ? "ph-x" : "ph-plus"}`} />
              {showForm ? "Batal" : "Post Proyek"}
            </button>
          )}
        </div>

        {/* Create Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              style={{
                background: "var(--bg2)", border: "1px solid var(--hbd)",
                borderRadius: "20px", padding: "28px", marginBottom: "28px",
                overflow: "hidden",
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--t)", marginBottom: "20px" }}>
                Posting Proyek Baru
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <input
                  type="text" placeholder="Judul proyek *" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required maxLength={100}
                  style={{ background: "var(--bg)", border: "1px solid var(--b)", padding: "12px 16px", borderRadius: "var(--r-pill)", color: "var(--t)", fontSize: "14px", outline: "none" }}
                />
                <textarea
                  placeholder="Deskripsi proyek — apa yang sedang dibangun, skill apa yang dibutuhkan *"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required maxLength={1000} rows={4}
                  style={{ background: "var(--bg)", border: "1px solid var(--b)", padding: "12px 16px", borderRadius: "var(--r-pill)", color: "var(--t)", fontSize: "14px", outline: "none", resize: "vertical", fontFamily: "inherit" }}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <input
                    type="url" placeholder="Demo URL (opsional)" value={form.demoUrl}
                    onChange={e => setForm({ ...form, demoUrl: e.target.value })}
                    style={{ background: "var(--bg)", border: "1px solid var(--b)", padding: "12px 16px", borderRadius: "var(--r-pill)", color: "var(--t)", fontSize: "14px", outline: "none" }}
                  />
                  <input
                    type="url" placeholder="GitHub URL (opsional)" value={form.githubUrl}
                    onChange={e => setForm({ ...form, githubUrl: e.target.value })}
                    style={{ background: "var(--bg)", border: "1px solid var(--b)", padding: "12px 16px", borderRadius: "var(--r-pill)", color: "var(--t)", fontSize: "14px", outline: "none" }}
                  />
                </div>
                {error && (
                  <div style={{ padding: "10px 14px", borderRadius: "var(--r-pill)", background: "var(--rdb)", border: "1px solid var(--rbd)", color: "var(--rd)", fontSize: "13px", fontWeight: 600 }}>
                    {error}
                  </div>
                )}
                <button
                  type="submit" className="btn btn-honey btn-md"
                  disabled={loading} style={{ alignSelf: "flex-start" }}
                >
                  {loading ? "Memposting..." : "Publish Proyek"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: "80px 24px",
            background: "var(--bg2)", border: "1px dashed var(--b)", borderRadius: "20px",
          }}>
            <i className="ph-fill ph-rocket-launch" style={{ fontSize: "52px", color: "var(--t4)", marginBottom: "16px", display: "block" }} />
            <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--t)", marginBottom: "8px" }}>
              Belum ada proyek
            </div>
            <p style={{ fontSize: "13px", color: "var(--t2)", marginBottom: "20px" }}>
              Jadilah yang pertama posting proyek dan cari kolaborator!
            </p>
            {isLoggedIn && (
              <button className="btn btn-honey btn-md" onClick={() => setShowForm(true)}>
                <i className="ph-fill ph-plus" /> Post Proyek Pertama
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);

  const getTimeAgo = (date: Date) => {
    const d = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
    if (d === 0) return "Hari ini";
    if (d === 1) return "Kemarin";
    if (d < 7) return `${d} hari lalu`;
    return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--bg2)", border: `1px solid ${hovered ? "var(--hbd)" : "var(--b)"}`,
        borderRadius: "var(--r-pill)", padding: "22px",
        transition: "all 0.2s", cursor: "default",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 10px 28px rgba(245,166,35,0.1)" : "none",
      }}
    >
      {/* Title */}
      <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--t)", margin: "0 0 8px", lineHeight: 1.3 }}>
        {project.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: "12px", color: "var(--t2)", lineHeight: 1.6, marginBottom: "14px",
        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {project.description}
      </p>

      {/* Links */}
      {(project.demoUrl || project.githubUrl) && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: "11px", fontWeight: 700, color: "var(--bl)", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }}>
              <i className="ph-fill ph-globe" /> Demo
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: "11px", fontWeight: 700, color: "var(--t2)", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }}>
              <i className="ph-fill ph-github-logo" /> Code
            </a>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: "12px", borderTop: "1px solid var(--b)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {project.user.image ? (
            <img src={project.user.image} alt="" style={{ width: "22px", height: "22px", borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "linear-gradient(135deg, #f5a623, #ffc04d)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 800, color: "#fff" }}>
              {project.user.name?.[0] || "?"}
            </div>
          )}
          <span style={{ fontSize: "11px", color: "var(--t2)" }}>{project.user.name}</span>
          <span style={{ fontSize: "10px", color: "var(--t3)" }}>· {getTimeAgo(project.createdAt)}</span>
        </div>
        <div style={{ display: "flex", gap: "10px", fontSize: "11px", color: "var(--t3)" }}>
          <span><i className="ph-fill ph-heart" /> {project._count.likes}</span>
          <span><i className="ph-fill ph-chat-circle" /> {project._count.comments}</span>
        </div>
      </div>
    </motion.div>
  );
}

