"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { deleteCompetition } from "@/actions";
import { BackButton } from "@/components/ui/back-button";

interface Competition {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  registrationLink: string | null;
  deadline: Date | null;
  createdAt: Date;
  author: { id: string; name: string | null; image: string | null };
}

export function AdminCompetitionsClient({ competitions }: { competitions: Competition[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = useMemo(() =>
    competitions.filter((c) =>
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.author.name?.toLowerCase().includes(search.toLowerCase())
    ), [competitions, search]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    const result = await deleteCompetition(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
      setDeleting(null);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "No deadline";
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getDeadlineStatus = (deadline: Date | null) => {
    if (!deadline) return { text: "No deadline", color: "var(--t2)" };
    const diff = new Date(deadline).getTime() - Date.now();
    const days = Math.ceil(diff / 86400000);
    if (days < 0) return { text: "Closed", color: "#ef4444" };
    if (days <= 7) return { text: `${days}d left`, color: "#f59e0b" };
    return { text: `${days}d left`, color: "#10b981" };
  };

  return (
    <div className="page on" style={{ minHeight: "100vh", padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        <Link href="/admin" style={{ display: 'inline-block' }}>
          <BackButton />
        </Link>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: 900, color: "var(--t)", marginBottom: "8px" }}>
              Competition Management
            </h1>
            <p style={{ fontSize: "15px", color: "var(--t2)" }}>
              {competitions.length} total competitions
            </p>
          </div>
          <Link href="/competitions/create">
            <button className={buttonVariants({ variant: "honey" })}>
              <i className="ph-fill ph-plus"></i> Post Competition
            </button>
          </Link>
        </div>

        {/* Search */}
        <div style={{ marginBottom: "24px" }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search competitions..."
            style={{
              width: "100%", maxWidth: "400px", padding: "10px 16px",
              background: "var(--bg2)", border: "1px solid var(--bdr)",
              borderRadius: "12px", fontSize: "14px", color: "var(--t)", outline: "none"
            }}
          />
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.length > 0 ? filtered.map((c, i) => {
            const status = getDeadlineStatus(c.deadline);
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  background: "var(--bg2)", border: "1px solid var(--bdr)", borderRadius: "16px",
                  padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px"
                }}
              >
                {/* Banner thumbnail */}
                <div style={{
                  width: "56px", height: "56px", borderRadius: "12px", flexShrink: 0, overflow: "hidden",
                  background: c.imageUrl ? `url(${c.imageUrl}) center/cover` : "linear-gradient(135deg,#f5a623,#ffc04d)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "24px", color: "#fff"
                }}>
                  {!c.imageUrl && <i className="ph-fill ph-trophy"></i>}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--t)", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.title}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--t2)" }}>
                    by {c.author.name} · Posted {formatDate(c.createdAt)}
                  </div>
                </div>

                {/* Deadline */}
                <span style={{
                  fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "100px", flexShrink: 0,
                  background: `${status.color}15`, color: status.color, border: `1px solid ${status.color}30`
                }}>
                  {status.text}
                </span>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button
                    className={buttonVariants({ size: "sm" })}
                    style={{ background: "var(--bg)", border: "1px solid var(--bdr)", color: "var(--t)" }}
                    onClick={() => router.push(`/competitions/${c.id}`)}
                  >
                    <i className="ph-fill ph-eye"></i>
                  </button>
                  <Link href={`/competitions/${c.id}/edit`}>
                    <button className="btn btn-sm btn-honey">
                      <i className="ph-fill ph-pencil"></i>
                    </button>
                  </Link>
                  <button
                    className={buttonVariants({ size: "sm" })}
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
                    onClick={() => handleDelete(c.id, c.title)}
                    disabled={deleting === c.id}
                  >
                    <i className="ph-fill ph-trash"></i>
                  </button>
                </div>
              </motion.div>
            );
          }) : (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--t2)" }}>
              <i className="ph-fill ph-trophy" style={{ fontSize: "48px", opacity: 0.3, display: "block", marginBottom: "12px" }}></i>
              <p>{search ? "No competitions found" : "No competitions yet"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
