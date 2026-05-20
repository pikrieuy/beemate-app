"use client"

import { useState, useEffect } from "react"
import { getTeamTasks, createTeamTask, updateTeamTaskStatus, updateTeamTask, deleteTeamTask } from "@/actions"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"

interface Member {
  userId: string
  user: {
    name: string | null
    image: string | null
  }
}

interface Leader {
  id: string
  name: string | null
  image: string | null
}

interface TeamKanbanProps {
  teamId: string
  members: Member[]
  leader: Leader
}

interface TaskData {
  id: string
  title: string
  description: string | null
  status: string // "TODO" | "IN_PROGRESS" | "DONE"
  priority: string // "LOW" | "MEDIUM" | "HIGH"
  dueDate: Date | string | null
  assigneeId: string | null
  assignee?: {
    id: string
    name: string | null
    image: string | null
  } | null
}

export function TeamKanban({ teamId, members, leader }: TeamKanbanProps) {
  const [tasks, setTasks] = useState<TaskData[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState<TaskData | null>(null)

  // Form states
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("MEDIUM")
  const [assigneeId, setAssigneeId] = useState("")
  const [dueDate, setDueDate] = useState("")

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // List of all assignable users (leader + members)
  const assignees = [
    { id: leader.id, name: `${leader.name || "Leader"} (Leader)` },
    ...members.map((m) => ({ id: m.userId, name: m.user.name || "Anggota Tim" })),
  ]

  useEffect(() => {
    fetchTasks()

    // Realtime subscription to refresh board automatically
    let channel: ReturnType<ReturnType<typeof getSupabaseBrowserClient>["channel"]> | null = null
    try {
      const supabase = getSupabaseBrowserClient()
      channel = supabase
        .channel(`team-kanban:${teamId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "Task",
            filter: `teamId=eq.${teamId}`,
          },
          () => {
            // Quick refetch to keep data in sync with relations
            fetchTasksSilent()
          }
        )
        .subscribe()
    } catch (err) {
      console.error(err)
    }

    return () => {
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [teamId])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const res = await getTeamTasks(teamId)
      if (res.success && res.data) {
        setTasks(res.data as unknown as TaskData[])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTasksSilent = async () => {
    try {
      const res = await getTeamTasks(teamId)
      if (res.success && res.data) {
        setTasks(res.data as unknown as TaskData[])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError("Judul tugas wajib diisi")
      return
    }

    try {
      setSaving(true)
      setError(null)
      const res = await createTeamTask({
        teamId,
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        assigneeId: assigneeId || undefined,
        dueDate: dueDate || undefined,
      })

      if (res.success) {
        setIsAdding(false)
        resetForm()
        await fetchTasks()
      } else {
        setError(res.error || "Gagal membuat tugas")
      }
    } catch (err) {
      console.error(err)
      setError("Terjadi kesalahan sistem")
    } finally {
      setSaving(false)
    }
  }

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEditing || !title.trim()) return

    try {
      setSaving(true)
      setError(null)
      const res = await updateTeamTask(isEditing.id, {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        assigneeId: assigneeId || null,
        dueDate: dueDate || null,
      })

      if (res.success) {
        setIsEditing(null)
        resetForm()
        await fetchTasks()
      } else {
        setError(res.error || "Gagal memperbarui tugas")
      }
    } catch (err) {
      console.error(err)
      setError("Terjadi kesalahan sistem")
    } finally {
      setSaving(false)
    }
  }

  const handleMoveStatus = async (taskId: string, currentStatus: string, direction: "left" | "right") => {
    let nextStatus = "TODO"
    if (currentStatus === "TODO") {
      nextStatus = direction === "right" ? "IN_PROGRESS" : "TODO"
    } else if (currentStatus === "IN_PROGRESS") {
      nextStatus = direction === "right" ? "DONE" : "TODO"
    } else if (currentStatus === "DONE") {
      nextStatus = direction === "left" ? "IN_PROGRESS" : "DONE"
    }

    // Optimistic Update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    )

    const res = await updateTeamTaskStatus(taskId, nextStatus)
    if (!res.success) {
      fetchTasksSilent() // rollback
    }
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm("Hapus tugas ini?")) return
    
    // Optimistic Delete
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    
    const res = await deleteTeamTask(taskId)
    if (!res.success) {
      fetchTasksSilent() // rollback
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setPriority("MEDIUM")
    setAssigneeId("")
    setDueDate("")
    setError(null)
  }

  const openAddMode = () => {
    resetForm()
    setIsAdding(true)
  }

  const openEditMode = (task: TaskData) => {
    setIsEditing(task)
    setTitle(task.title)
    setDescription(task.description || "")
    setPriority(task.priority)
    setAssigneeId(task.assigneeId || "")
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "")
    setError(null)
  }

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case "HIGH":
        return { color: "#ef4444", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }
      case "MEDIUM":
        return { color: "#f5a623", background: "rgba(245, 166, 35, 0.1)", border: "1px solid rgba(245, 166, 35, 0.2)" }
      default:
        return { color: "var(--t2)", background: "var(--bg2)", border: "1px solid var(--bdr)" }
    }
  }

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  const columns = [
    { id: "TODO", title: "To Do", icon: "ph-bold ph-circle" },
    { id: "IN_PROGRESS", title: "In Progress", icon: "ph-bold ph-play-circle" },
    { id: "DONE", title: "Done", icon: "ph-bold ph-check-circle" },
  ]

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      {/* Action Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "14px", color: "var(--t2)" }}>
          Kelola tugas tim Anda secara kolaboratif. Klik tanda panah pada tugas untuk memindahkan status.
        </div>
        <button onClick={openAddMode} className="btn btn-honey btn-sm">
          <i className="ph-fill ph-plus-circle"></i> Tambah Tugas
        </button>
      </div>

      {/* Board Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          alignItems: "flex-start",
        }}
      >
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id)
          return (
            <div
              key={col.id}
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--bdr)",
                borderRadius: "20px",
                padding: "20px",
                minHeight: "450px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                  borderBottom: "1px solid var(--bdr)",
                  paddingBottom: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, color: "var(--t)" }}>
                  <i className={col.icon} style={{ color: "var(--ho)", fontSize: "18px" }}></i>
                  <span>{col.title}</span>
                </div>
                <span
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--bdr)",
                    borderRadius: "100px",
                    padding: "2px 8px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--t2)",
                  }}
                >
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div style={{ display: "grid", gap: "12px", flex: 1 }}>
                {colTasks.length === 0 ? (
                  <div style={{ margin: "auto", textAlign: "center", color: "var(--t3)", fontSize: "13px", padding: "40px 0" }}>
                    Belum ada tugas
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <motion.div
                      layoutId={task.id}
                      key={task.id}
                      style={{
                        background: "var(--bg)",
                        border: "1px solid var(--bdr)",
                        borderRadius: "14px",
                        padding: "16px",
                        position: "relative",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.01)",
                      }}
                    >
                      {/* Priority Tag & Actions */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "100px",
                            fontSize: "10px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            ...getPriorityStyle(task.priority),
                          }}
                        >
                          {task.priority}
                        </span>
                        
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={() => openEditMode(task)}
                            style={{ background: "none", border: "none", padding: "4px", cursor: "pointer", color: "var(--t2)" }}
                            title="Edit Tugas"
                          >
                            <i className="ph-fill ph-pencil-simple" style={{ fontSize: "14px" }}></i>
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            style={{ background: "none", border: "none", padding: "4px", cursor: "pointer", color: "#ef4444" }}
                            title="Hapus Tugas"
                          >
                            <i className="ph-fill ph-trash" style={{ fontSize: "14px" }}></i>
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--t)", marginBottom: "6px", lineHeight: 1.4 }}>
                        {task.title}
                      </h4>

                      {/* Description */}
                      {task.description && (
                        <p style={{ fontSize: "13px", color: "var(--t2)", lineHeight: 1.5, marginBottom: "16px" }}>
                          {task.description}
                        </p>
                      )}

                      {/* Due Date & Assignee */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderTop: "1px solid var(--bdr)",
                          paddingTop: "12px",
                          marginTop: "8px",
                        }}
                      >
                        {task.dueDate ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--t3)" }}>
                            <i className="ph-bold ph-calendar"></i>
                            <span>
                              {new Date(task.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                            </span>
                          </div>
                        ) : (
                          <div />
                        )}

                        {/* Assignee Avatar */}
                        {task.assignee ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }} title={task.assignee.name || "Assignee"}>
                            {task.assignee.image ? (
                              <img
                                src={task.assignee.image}
                                alt={task.assignee.name || "User"}
                                style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  borderRadius: "50%",
                                  background: "var(--ho)",
                                  color: "#fff",
                                  fontSize: "9px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 700,
                                }}
                              >
                                {getInitials(task.assignee.name || "?")}
                              </div>
                            )}
                            <span style={{ fontSize: "11px", color: "var(--t2)", fontWeight: 600 }}>
                              {task.assignee.name?.split(" ")[0]}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: "11px", color: "var(--t3)", fontStyle: "italic" }}>No assignee</span>
                        )}
                      </div>

                      {/* Movement Control Arrows */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "12px",
                          background: "var(--bg2)",
                          borderRadius: "8px",
                          padding: "2px",
                        }}
                      >
                        {col.id !== "TODO" ? (
                          <button
                            onClick={() => handleMoveStatus(task.id, task.status, "left")}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--t2)",
                              cursor: "pointer",
                              padding: "4px 8px",
                              flex: 1,
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <i className="ph-bold ph-arrow-left"></i>
                          </button>
                        ) : (
                          <div style={{ flex: 1 }} />
                        )}

                        {col.id !== "DONE" ? (
                          <button
                            onClick={() => handleMoveStatus(task.id, task.status, "right")}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--t2)",
                              cursor: "pointer",
                              padding: "4px 8px",
                              flex: 1,
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <i className="ph-bold ph-arrow-right"></i>
                          </button>
                        ) : (
                          <div style={{ flex: 1 }} />
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add / Edit Task Modal */}
      <AnimatePresence>
        {(isAdding || isEditing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px",
            }}
            onClick={() => {
              setIsAdding(false)
              setIsEditing(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--b)",
                borderRadius: "20px",
                padding: "28px",
                maxWidth: "480px",
                width: "100%",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--t)", marginBottom: "20px" }}>
                {isEditing ? "Edit Tugas" : "Tambah Tugas Baru"}
              </h3>

              {error && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "var(--rdb)",
                    border: "1px solid var(--rbd)",
                    color: "var(--rd)",
                    borderRadius: "10px",
                    fontSize: "13px",
                    marginBottom: "16px",
                  }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={isEditing ? handleEditTask : handleCreateTask} style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "grid", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--t2)" }}>Judul Tugas *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Desain wireframe halaman utama"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--bdr)",
                      background: "var(--bg)",
                      color: "var(--t)",
                      fontSize: "14px",
                    }}
                    required
                  />
                </div>

                <div style={{ display: "grid", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--t2)" }}>Deskripsi</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tambahkan detail penjelasan tugas..."
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--bdr)",
                      background: "var(--bg)",
                      color: "var(--t)",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ display: "grid", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--t2)" }}>Prioritas</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "10px",
                        border: "1px solid var(--bdr)",
                        background: "var(--bg)",
                        color: "var(--t)",
                        fontSize: "14px",
                      }}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>

                  <div style={{ display: "grid", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--t2)" }}>Tenggat Waktu</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: "10px",
                        border: "1px solid var(--bdr)",
                        background: "var(--bg)",
                        color: "var(--t)",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--t2)" }}>Penerima Tugas (*Assignee*)</label>
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid var(--bdr)",
                      background: "var(--bg)",
                      color: "var(--t)",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">Pilih Anggota Tim...</option>
                    {assignees.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                  <button
                    type="button"
                    className="btn btn-dark btn-sm"
                    onClick={() => {
                      setIsAdding(false)
                      setIsEditing(null)
                    }}
                    disabled={saving}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-honey btn-sm" disabled={saving}>
                    {saving ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Buat Tugas"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
