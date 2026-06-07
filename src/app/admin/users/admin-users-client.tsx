"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { changeUserRole } from "@/actions";
import { BackButton } from "@/components/ui/back-button";

interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  title: string | null;
  skills: string[];
  createdAt: Date;
  _count: { teamsCreated: number; teamMembers: number };
}

interface AdminUsersClientProps {
  users: AdminUser[];
  currentUserId: string;
}

export function AdminUsersClient({ users, currentUserId }: AdminUsersClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "USER" | "ADMIN">("all");
  const [processing, setProcessing] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const confirm = window.confirm(
      `Change ${users.find((u) => u.id === userId)?.name}'s role to ${newRole}?`
    );
    if (!confirm) return;

    setProcessing(userId);
    const result = await changeUserRole(userId, newRole as "USER" | "ADMIN");
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
    setProcessing(null);
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="page on" style={{ minHeight: "100vh", padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <Link href="/admin" style={{ display: 'inline-block' }}>
          <BackButton />
        </Link>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: 900, color: "var(--t)", marginBottom: "8px" }}>
              User Management
            </h1>
            <p style={{ fontSize: "15px", color: "var(--t2)" }}>
              {users.length} total users · {users.filter((u) => u.role === "ADMIN").length} admins
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{
              flex: 1, minWidth: "200px", padding: "10px 16px",
              background: "var(--bg2)", border: "1px solid var(--bdr)",
              borderRadius: "12px", fontSize: "14px", color: "var(--t)", outline: "none"
            }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            {(["all", "USER", "ADMIN"] as const).map((r) => (
              <button
                key={r}
                className={buttonVariants({ size: "sm" })}
                style={{
                  background: roleFilter === r ? "var(--ho)" : "var(--bg2)",
                  border: "1px solid var(--bdr)",
                  color: roleFilter === r ? "#fff" : "var(--t)",
                }}
                onClick={() => setRoleFilter(r)}
              >
                {r === "all" ? "All" : r}
              </button>
            ))}
          </div>
        </div>

        {search && (
          <p style={{ fontSize: "13px", color: "var(--t2)", marginBottom: "16px" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
          </p>
        )}

        {/* Users Table */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--bdr)", borderRadius: "24px", overflow: "hidden" }}>
          {filtered.length > 0 ? (
            filtered.map((u, i) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "16px 24px",
                  borderBottom: i < filtered.length - 1 ? "1px solid var(--bdr)" : "none",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {/* Avatar */}
                {u.image ? (
                  <img src={u.image} alt={u.name || ""} style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "50%",
                    background: "linear-gradient(135deg,#f5a623,#ffc04d)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px", fontWeight: 800, color: "#fff", flexShrink: 0
                  }}>
                    {u.name?.[0] || "?"}
                  </div>
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--t)" }}>
                      {u.name || "Unknown"}
                    </span>
                    {u.id === currentUserId && (
                      <span style={{ fontSize: "10px", background: "rgba(245,166,35,0.1)", color: "var(--ho)", border: "1px solid rgba(245,166,35,0.2)", padding: "2px 8px", borderRadius: "100px", fontWeight: 700 }}>
                        YOU
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--t2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {u.email}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--t3)", marginTop: "2px" }}>
                    {u.title && `${u.title} · `}
                    {u._count.teamsCreated} teams created · Joined {formatDate(u.createdAt)}
                  </div>
                </div>

                {/* Role Badge */}
                <span style={{
                  fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "100px", flexShrink: 0,
                  background: u.role === "ADMIN" ? "rgba(239,68,68,0.1)" : "rgba(245,166,35,0.1)",
                  color: u.role === "ADMIN" ? "#ef4444" : "var(--ho)",
                  border: `1px solid ${u.role === "ADMIN" ? "rgba(239,68,68,0.2)" : "rgba(245,166,35,0.2)"}`,
                }}>
                  {u.role}
                </span>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <Link href={`/profile/${u.id}`}>
                    <button className={buttonVariants({ size: "sm" })} style={{ background: "var(--bg)", border: "1px solid var(--bdr)", color: "var(--t)" }}>
                      <i className="ph-fill ph-user"></i>
                    </button>
                  </Link>
                  {u.id !== currentUserId && (
                    <button
                      className={buttonVariants({ size: "sm" })}
                      style={{
                        background: u.role === "ADMIN" ? "rgba(239,68,68,0.1)" : "rgba(245,166,35,0.1)",
                        border: `1px solid ${u.role === "ADMIN" ? "rgba(239,68,68,0.3)" : "rgba(245,166,35,0.3)"}`,
                        color: u.role === "ADMIN" ? "#ef4444" : "var(--ho)",
                        fontSize: "12px"
                      }}
                      onClick={() => handleRoleChange(u.id, u.role)}
                      disabled={processing === u.id}
                    >
                      {processing === u.id ? "..." : u.role === "ADMIN" ? "Revoke Admin" : "Make Admin"}
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--t2)" }}>
              <i className="ph-fill ph-users" style={{ fontSize: "48px", opacity: 0.3, display: "block", marginBottom: "12px" }}></i>
              <p>No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
