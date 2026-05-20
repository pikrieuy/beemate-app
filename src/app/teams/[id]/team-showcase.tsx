"use client"

import { useState, useEffect } from "react"
import { getTeamProject, createOrUpdateProject } from "@/actions"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { motion } from "framer-motion"

interface ProjectShowcaseProps {
  teamId: string
  isMember: boolean
  isLeader: boolean
}

interface ProjectData {
  id: string
  title: string
  description: string
  imageUrl: string | null
  demoUrl: string | null
  githubUrl: string | null
  createdAt: Date
  user: {
    name: string | null
    image: string | null
  }
}

export function ProjectShowcase({ teamId, isMember, isLeader }: ProjectShowcaseProps) {
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  // Form states
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [demoUrl, setDemoUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProject()
  }, [teamId])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const res = await getTeamProject(teamId)
      if (res.success && res.data) {
        // cast to matches client expectation
        const data = res.data as unknown as ProjectData
        setProject(data)
        // prefill form
        setTitle(data.title)
        setDescription(data.description)
        setDemoUrl(data.demoUrl || "")
        setGithubUrl(data.githubUrl || "")
        setImageUrl(data.imageUrl)
      } else {
        setProject(null)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      setError("Judul dan deskripsi proyek wajib diisi")
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      const res = await createOrUpdateProject(teamId, {
        title: title.trim(),
        description: description.trim(),
        demoUrl: demoUrl.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        imageUrl: imageUrl || undefined,
      })

      if (res.success) {
        setIsEditing(false)
        await fetchProject()
      } else {
        setError(res.error || "Gagal menyimpan project showcase")
      }
    } catch (err) {
      console.error(err)
      setError("Terjadi kesalahan sistem")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditClick = () => {
    if (project) {
      setTitle(project.title)
      setDescription(project.description)
      setDemoUrl(project.demoUrl || "")
      setGithubUrl(project.githubUrl || "")
      setImageUrl(project.imageUrl)
    } else {
      setTitle("")
      setDescription("")
      setDemoUrl("")
      setGithubUrl("")
      setImageUrl(null)
    }
    setError(null)
    setIsEditing(true)
  }

  const canEdit = isMember || isLeader

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--bdr)",
          borderRadius: "20px",
          padding: "32px",
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--t)", marginBottom: "24px" }}>
          {project ? "Edit Project Showcase" : "Buat Project Showcase baru"}
        </h3>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              background: "var(--rdb)",
              border: "1px solid var(--rbd)",
              color: "var(--rd)",
              borderRadius: "12px",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
          <div style={{ display: "grid", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: 700, color: "var(--t2)" }}>
              Banner Proyek
            </label>
            <ImageUpload
              folder="banners"
              currentImageUrl={imageUrl}
              onUploadComplete={(url) => setImageUrl(url)}
              label="Unggah Banner Proyek"
            />
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: 700, color: "var(--t2)" }}>
              Judul Proyek *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. BeeMate Collaboration Tool"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid var(--bdr)",
                background: "var(--bg)",
                color: "var(--t)",
              }}
              required
            />
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: 700, color: "var(--t2)" }}>
              Deskripsi Proyek *
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan secara mendalam tentang proyek Anda, fitur-fitur, cara kerja, dan solusi yang dihadirkan..."
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid var(--bdr)",
                background: "var(--bg)",
                color: "var(--t)",
                lineHeight: 1.6,
              }}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ display: "grid", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: 700, color: "var(--t2)" }}>
                Demo URL (Link Live)
              </label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://beemate.vercel.app"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid var(--bdr)",
                  background: "var(--bg)",
                  color: "var(--t)",
                }}
              />
            </div>

            <div style={{ display: "grid", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: 700, color: "var(--t2)" }}>
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid var(--bdr)",
                  background: "var(--bg)",
                  color: "var(--t)",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => setIsEditing(false)}
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-honey"
              disabled={submitting}
            >
              {submitting ? "Menyimpan..." : "Simpan Proyek"}
            </button>
          </div>
        </form>
      </motion.div>
    )
  }

  if (!project) {
    return (
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--bdr)",
          borderRadius: "24px",
          padding: "60px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>🚀</div>
        <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--t)", marginBottom: "8px" }}>
          Project Showcase belum diisi
        </h3>
        <p style={{ color: "var(--t2)", maxWidth: "450px", margin: "0 auto 24px auto", fontSize: "14px", lineHeight: 1.6 }}>
          Pamerkan karya tim Anda kepada dunia! Hubungkan repositori GitHub, taruh link live demo, dan upload banner proyek.
        </p>
        {canEdit && (
          <button
            onClick={handleEditClick}
            className="btn btn-honey"
          >
            <i className="ph-fill ph-plus-circle"></i> Buat Project Showcase
          </button>
        )}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: "grid", gap: "32px" }}
    >
      {/* Banner */}
      {project.imageUrl ? (
        <div
          style={{
            width: "100%",
            height: "350px",
            borderRadius: "24px",
            overflow: "hidden",
            border: "1px solid var(--bdr)",
          }}
        >
          <img
            src={project.imageUrl}
            alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "200px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, rgba(245, 166, 35, 0.08) 0%, rgba(255, 192, 77, 0.08) 100%)",
            border: "1px dashed var(--ho)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ho)",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          <i className="ph-fill ph-image" style={{ fontSize: "32px", marginRight: "10px" }}></i>
          Belum ada banner proyek yang diunggah
        </div>
      )}

      {/* Project Details */}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--bdr)",
          borderRadius: "24px",
          padding: "32px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: 900, color: "var(--t)", marginBottom: "8px" }}>
              {project.title}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--t2)" }}>
              {project.user.image ? (
                <img
                  src={project.user.image}
                  alt={project.user.name || "User"}
                  style={{ width: "20px", height: "20px", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "var(--ho)",
                    color: "#fff",
                    fontSize: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  {project.user.name?.[0].toUpperCase() || "?"}
                </div>
              )}
              <span>Diunggah oleh <strong>{project.user.name}</strong></span>
              <span>•</span>
              <span>{new Date(project.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
          </div>

          {canEdit && (
            <button
              onClick={handleEditClick}
              className="btn btn-dark btn-sm"
            >
              <i className="ph-fill ph-pencil-simple"></i> Edit Showcase
            </button>
          )}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "15px",
            color: "var(--t)",
            lineHeight: 1.8,
            marginBottom: "32px",
            whiteSpace: "pre-wrap",
          }}
        >
          {project.description}
        </div>

        {/* Links */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            borderTop: "1px solid var(--bdr)",
            paddingTop: "24px",
          }}
        >
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-honey"
              style={{ textDecoration: "none" }}
            >
              <i className="ph-fill ph-globe"></i> Kunjungi Live Demo
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid var(--bdr)",
              }}
            >
              <i className="ph-bold ph-github-logo" style={{ fontSize: "18px" }}></i> GitHub Repository
            </a>
          )}

          {!project.demoUrl && !project.githubUrl && (
            <div style={{ fontSize: "13px", color: "var(--t3)", fontStyle: "italic" }}>
              Tidak ada tautan proyek eksternal yang dibagikan.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
