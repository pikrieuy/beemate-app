"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AdminDashboardClientProps {
  stats: { totalUsers: number; totalTeams: number; totalCompetitions: number };
  recentUsers: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
    createdAt: Date;
  }[];
  recentCompetitions: {
    id: string;
    title: string;
    deadline: Date | null;
    createdAt: Date;
    author: { name: string | null };
  }[];
}

export function AdminDashboardClient({ stats, recentUsers, recentCompetitions }: AdminDashboardClientProps) {
  const router = useRouter();

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: "ph-users", color: "#5b9cf6", href: "/admin/users" },
    { label: "Total Teams", value: stats.totalTeams, icon: "ph-users-three", color: "#f5a623", href: "/teams" },
    { label: "Competitions", value: stats.totalCompetitions, icon: "ph-trophy", color: "#22d17a", href: "/admin/competitions" },
  ];

  return (
    <div className="page on" style={{ minHeight: "100vh", padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: 700
            }}>
              ADMIN
            </div>
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: 900, color: "var(--t)", marginBottom: "8px" }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: "15px", color: "var(--t2)" }}>
            Manage users, competitions, and platform content.
          </p>
        </motion.div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => router.push(card.href)}
              style={{
                background: "var(--bg2)", border: "1px solid var(--bdr)", borderRadius: "20px",
                padding: "24px", cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = card.color; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--bdr)"; }}
            >
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: `${card.color}15`, color: card.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "22px", marginBottom: "16px"
              }}>
                <i className={`ph-fill ${card.icon}`}></i>
              </div>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "var(--t)", marginBottom: "4px" }}>
                {card.value}
              </div>
              <div style={{ fontSize: "14px", color: "var(--t2)", fontWeight: 600 }}>{card.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ marginBottom: "32px" }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--t)", marginBottom: "16px" }}>
            Quick Actions
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/admin/users">
              <button className="btn btn-honey">
                <i className="ph-fill ph-users"></i> Manage Users
              </button>
            </Link>
            <Link href="/admin/competitions">
              <button className="btn" style={{ background: "var(--bg2)", border: "1px solid var(--bdr)", color: "var(--t)" }}>
                <i className="ph-fill ph-trophy"></i> Manage Competitions
              </button>
            </Link>
            <Link href="/competitions/create">
              <button className="btn" style={{ background: "var(--bg2)", border: "1px solid var(--bdr)", color: "var(--t)" }}>
                <i className="ph-fill ph-plus"></i> Post Competition
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Two-column: Recent Users + Recent Competitions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>

          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{ background: "var(--bg2)", border: "1px solid var(--bdr)", borderRadius: "24px", padding: "24px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--t)" }}>Recent Users</h3>
              <Link href="/admin/users" style={{ fontSize: "13px", color: "var(--ho)", textDecoration: "none", fontWeight: 600 }}>
                View All →
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentUsers.map((u) => (
                <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {u.image ? (
                    <img src={u.image} alt={u.name || ""} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: "linear-gradient(135deg,#f5a623,#ffc04d)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "14px", fontWeight: 800, color: "#fff", flexShrink: 0
                    }}>
                      {u.name?.[0] || "?"}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--t)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {u.name || "Unknown"}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--t2)" }}>{formatDate(u.createdAt)}</div>
                  </div>
                  <span style={{
                    fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "100px",
                    background: u.role === "ADMIN" ? "rgba(239,68,68,0.1)" : "rgba(245,166,35,0.1)",
                    color: u.role === "ADMIN" ? "#ef4444" : "var(--ho)",
                    border: `1px solid ${u.role === "ADMIN" ? "rgba(239,68,68,0.2)" : "rgba(245,166,35,0.2)"}`,
                    flexShrink: 0
                  }}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Competitions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ background: "var(--bg2)", border: "1px solid var(--bdr)", borderRadius: "24px", padding: "24px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--t)" }}>Recent Competitions</h3>
              <Link href="/admin/competitions" style={{ fontSize: "13px", color: "var(--ho)", textDecoration: "none", fontWeight: 600 }}>
                View All →
              </Link>
            </div>
            {recentCompetitions.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {recentCompetitions.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => router.push(`/competitions/${c.id}`)}
                    style={{ cursor: "pointer", padding: "12px", background: "var(--bg)", borderRadius: "12px", border: "1px solid var(--bdr)", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--ho)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--bdr)"; }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--t)", marginBottom: "4px" }}>{c.title}</div>
                    <div style={{ fontSize: "12px", color: "var(--t2)" }}>
                      by {c.author.name} · {formatDate(c.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "32px", color: "var(--t2)" }}>
                <i className="ph-fill ph-trophy" style={{ fontSize: "40px", opacity: 0.3, display: "block", marginBottom: "8px" }}></i>
                <p style={{ fontSize: "14px" }}>No competitions yet</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
