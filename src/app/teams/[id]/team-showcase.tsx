"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
  getTeamProject, 
  createOrUpdateProject,
  getProjectSocials,
  toggleProjectLike,
  addProjectComment,
  deleteProjectComment
} from "@/actions"
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
  const { data: session } = useSession()
  const userId = (session?.user as any)?.id

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

  // Social states
  const [likesCount, setLikesCount] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [commentSubmitting, setCommentSubmitting] = useState(false)

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

        // Fetch socials
        const socialRes = await getProjectSocials(data.id)
        if (socialRes.success && socialRes.data) {
          setLikesCount(socialRes.data.likesCount)
          setHasLiked(socialRes.data.hasLiked)
          setComments(socialRes.data.comments)
        }
      } else {
        setProject(null)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!project) return
    const prevLiked = hasLiked
    const prevCount = likesCount
    setHasLiked(!prevLiked)
    setLikesCount(prev => prevLiked ? prev - 1 : prev + 1)

    const res = await toggleProjectLike(project.id)
    if (!res.success) {
      setHasLiked(prevLiked)
      setLikesCount(prevCount)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project || !newComment.trim() || commentSubmitting) return

    try {
      setCommentSubmitting(true)
      const res = await addProjectComment(project.id, newComment.trim())
      if (res.success && res.data) {
        setNewComment("")
        setComments(prev => [res.data, ...prev])
      } else {
        alert(res.error || "Gagal mengirim komentar")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setCommentSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus komentar ini?")) return
    const prevComments = [...comments]
    setComments(prev => prev.filter(c => c.id !== commentId))

    const res = await deleteProjectComment(commentId)
    if (!res.success) {
      setComments(prevComments)
      alert(res.error || "Gagal menghapus komentar")
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
              borderRadius: "16px",
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
                borderRadius: "16px",
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
                borderRadius: "16px",
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
                  borderRadius: "16px",
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
                  borderRadius: "16px",
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

        {/* Likes & Comments Section */}
        <div style={{ marginTop: "40px", borderTop: "1px solid var(--bdr)", paddingTop: "32px" }}>
          
          {/* Like Button & Stats */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px" }}>
            <button
              onClick={handleLike}
              style={{
                background: hasLiked ? "rgba(245, 166, 35, 0.12)" : "var(--bg)",
                border: hasLiked ? "1px solid var(--ho)" : "1px solid var(--bdr)",
                borderRadius: "30px",
                padding: "10px 24px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: hasLiked ? "var(--ho)" : "var(--t2)",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              className="like-btn"
            >
              <i className={hasLiked ? "ph-fill ph-heart" : "ph-bold ph-heart"} style={{ fontSize: "20px" }}></i>
              <span>{hasLiked ? "Disukai" : "Sukai Proyek"}</span>
            </button>
            <span style={{ fontSize: "14px", color: "var(--t2)" }}>
              <strong>{likesCount}</strong> orang menyukai proyek ini
            </span>
          </div>

          {/* Comments Section */}
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--t)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="ph-fill ph-chat-centered-text" style={{ color: "var(--ho)" }}></i>
              Diskusi & Umpan Balik ({comments.length})
            </h3>

            {/* Comment Form */}
            {session?.user ? (
              <form onSubmit={handleAddComment} style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    border: "1px solid var(--bdr)",
                  }}
                >
                  {session.user.image ? (
                    <img src={session.user.image} alt="You" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "var(--ho)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                      {session.user.name?.[0].toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tulis pendapat atau pertanyaan Anda tentang proyek ini..."
                    rows={2}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "16px",
                      border: "1px solid var(--bdr)",
                      background: "var(--bg)",
                      color: "var(--t)",
                      fontSize: "14px",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="submit"
                      className="btn btn-honey btn-sm"
                      disabled={commentSubmitting || !newComment.trim()}
                    >
                      {commentSubmitting ? "Mengirim..." : "Kirim Komentar"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--bdr)",
                  borderRadius: "16px",
                  padding: "16px 20px",
                  textAlign: "center",
                  fontSize: "14px",
                  color: "var(--t2)",
                  marginBottom: "32px",
                }}
              >
                Silakan login untuk bergabung dalam diskusi proyek.
              </div>
            )}

            {/* Comments List */}
            <div style={{ display: "grid", gap: "20px" }}>
              {comments.length > 0 ? (
                comments.map((comment) => {
                  const isCommentOwner = comment.userId === userId
                  const isLeaderOrOwner = isCommentOwner || isLeader

                  return (
                    <div
                      key={comment.id}
                      style={{
                        display: "flex",
                        gap: "12px",
                        background: "rgba(255, 255, 255, 0.01)",
                        border: "1px solid var(--bdr)",
                        borderRadius: "16px",
                        padding: "16px",
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          flexShrink: 0,
                          background: "var(--bg2)",
                        }}
                      >
                        {comment.user.image ? (
                          <img src={comment.user.image} alt={comment.user.name || "User"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "var(--ho)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px" }}>
                            {comment.user.name?.[0].toUpperCase() || "?"}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "4px" }}>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--t)" }}>
                              {comment.user.name}
                            </span>
                            {comment.user.title && (
                              <span
                                style={{
                                  marginLeft: "8px",
                                  background: "rgba(245, 166, 35, 0.1)",
                                  color: "var(--ho)",
                                  fontSize: "10px",
                                  fontWeight: 800,
                                  padding: "2px 6px",
                                  borderRadius: "100px",
                                  textTransform: "uppercase",
                                }}
                              >
                                {comment.user.title}
                              </span>
                            )}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "11px", color: "var(--t3)" }}>
                              {new Date(comment.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {isLeaderOrOwner && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#ef4444",
                                  cursor: "pointer",
                                  padding: "2px",
                                  opacity: 0.7,
                                  transition: "opacity 0.2s",
                                }}
                                title="Hapus komentar"
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
                              >
                                <i className="ph-bold ph-trash" style={{ fontSize: "14px" }}></i>
                              </button>
                            )}
                          </div>
                        </div>
                        <div style={{ fontSize: "14px", color: "var(--t)", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 0",
                    color: "var(--t3)",
                    fontSize: "14px",
                    fontStyle: "italic",
                  }}
                >
                  Belum ada komentar. Jadilah yang pertama memberikan masukan!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
