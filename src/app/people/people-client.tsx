"use client";

import { useState, useEffect } from "react";
import { searchUsers } from "@/actions";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ExpandingSearchDock } from "@/components/ui/ExpandingSearchDock";

interface User {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  skills: string[];
  title: string | null;
}

interface PeopleClientProps {
  initialUsers: User[];
}

/* ── Role config ── */
const ROLES = [
  {
    key: "all",
    label: "Semua",
    icon: "ph-users-three",
    color: "rgba(255,255,255,.08)",
    iconColor: "var(--t2)",
  },
  {
    key: "Hacker",
    label: "Hacker",
    desc: "Developer / Engineer",
    icon: "ph-code",
    color: "rgba(91,156,246,.15)",
    iconColor: "#5b9cf6",
    badge: { bg: "rgba(91,156,246,.15)", text: "#5b9cf6", border: "rgba(91,156,246,.3)" },
  },
  {
    key: "Hustler",
    label: "Hustler",
    desc: "Business / Marketing",
    icon: "ph-briefcase",
    color: "rgba(45,214,122,.15)",
    iconColor: "#2dd67a",
    badge: { bg: "rgba(45,214,122,.15)", text: "#2dd67a", border: "rgba(45,214,122,.3)" },
  },
  {
    key: "Hipster",
    label: "Hipster",
    desc: "Designer / Creative",
    icon: "ph-paint-brush",
    color: "rgba(167,139,250,.15)",
    iconColor: "#a78bfa",
    badge: { bg: "rgba(167,139,250,.15)", text: "#a78bfa", border: "rgba(167,139,250,.3)" },
  },
];

const AVATAR_COLORS = [
  "linear-gradient(135deg, #f5a623, #ffc04d)",
  "linear-gradient(135deg, #5b9cf6, #93c5fd)",
  "linear-gradient(135deg, #2dd67a, #6ee7b7)",
  "linear-gradient(135deg, #a78bfa, #c4b5fd)",
  "linear-gradient(135deg, #fb923c, #fcd34d)",
  "linear-gradient(135deg, #f472b6, #f9a8d4)",
];

function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string | null) {
  if (!name) return "??";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getRoleConfig(title: string | null) {
  return ROLES.find((r) => r.key === title) ?? null;
}

export function PeopleClient({ initialUsers }: PeopleClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterTitle, setFilterTitle] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      if (search.trim()) {
        setLoading(true);
        const result = await searchUsers(search, 100);
        if (result.success) setUsers(result.data ?? []);
        setLoading(false);
      } else {
        setUsers(initialUsers);
      }
    }
    const timer = setTimeout(loadUsers, 300);
    return () => clearTimeout(timer);
  }, [search, initialUsers]);

  const filtered = users.filter((u) =>
    filterTitle === "all" ? true : u.title === filterTitle
  );

  const counts: Record<string, number> = {
    all: users.length,
    Hacker: users.filter((u) => u.title === "Hacker").length,
    Hustler: users.filter((u) => u.title === "Hustler").length,
    Hipster: users.filter((u) => u.title === "Hipster").length,
  };

  return (
    <div className="page on">
      <div className="shell">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sb-section">
            <span className="sb-label">Filter Role</span>
            <div className="sb-list">
              {ROLES.map((r) => (
                <button
                  key={r.key}
                  className={`sbi ${filterTitle === r.key ? "on" : ""}`}
                  onClick={() => setFilterTitle(r.key)}
                >
                  <span className="sbi-l">
                    <span className="sbi-icon" style={{ background: r.color, color: r.iconColor }}>
                      <i className={`ph-fill ${r.icon}`} />
                    </span>
                    <span>
                      <span style={{ display: "block" }}>{r.label}</span>
                      {"desc" in r && r.desc && (
                        <span style={{ fontSize: "10px", color: "var(--t3)", fontWeight: 400 }}>
                          {r.desc}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="sbi-count">{counts[r.key] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="main">
          {/* Header */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
              <div>
                <h1 style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "clamp(26px, 4vw, 34px)",
                  fontWeight: 900, margin: "0 0 4px 0",
                  color: "var(--t)", lineHeight: 1.3,
                }}>
                  Browse{" "}
                  <span style={{
                    backgroundImage: "linear-gradient(90deg, var(--bl), #93c5fd)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    WebkitTextFillColor: "transparent",
                  }}>People</span>
                </h1>
                <div className="page-sub">
                  {filtered.length} {filtered.length === 1 ? "orang" : "orang"} ditemukan
                </div>
              </div>
              <ExpandingSearchDock
                value={search}
                onChange={setSearch}
                placeholder="Cari nama atau skill..."
              />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  background: "var(--bg2)", border: "1px solid var(--b)",
                  borderRadius: "20px", padding: "24px", height: "220px",
                  animation: "pulse 1.5s ease-in-out infinite",
                  opacity: 0.5,
                }} />
              ))}
            </div>
          )}

          {/* Grid */}
          {!loading && filtered.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "16px",
            }}>
              <AnimatePresence>
                {filtered.map((user, i) => (
                  <PersonCard key={user.id} user={user} index={i} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div style={{
              textAlign: "center", padding: "80px 24px",
              background: "var(--bg2)", border: "1px dashed var(--b)", borderRadius: "20px",
            }}>
              <div style={{ fontSize: "52px", color: "var(--t4)", marginBottom: "16px" }}>
                <i className="ph-fill ph-users" />
              </div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--t)", marginBottom: "8px" }}>
                Tidak ada orang ditemukan
              </div>
              <p style={{ fontSize: "13px", color: "var(--t2)", marginBottom: "20px" }}>
                Coba ubah filter atau kata kunci pencarian
              </p>
              <button
                className="btn btn-honey btn-sm"
                onClick={() => { setFilterTitle("all"); setSearch(""); }}
              >
                <i className="ph-fill ph-x-circle" /> Reset
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

/* ── Person Card ── */
function PersonCard({ user, index }: { user: User; index: number }) {
  const [hovered, setHovered] = useState(false);
  const roleConfig = getRoleConfig(user.title);
  const avatarGradient = getAvatarColor(user.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.3 }}
    >
      <Link href={`/profile/${user.id}`} style={{ textDecoration: "none", display: "block" }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: "var(--bg2)",
            border: `1px solid ${hovered ? (roleConfig?.badge?.border ?? "var(--hbd)") : "var(--b)"}`,
            borderRadius: "20px",
            padding: "22px",
            cursor: "pointer",
            transition: "all 0.22s ease",
            transform: hovered ? "translateY(-5px)" : "translateY(0)",
            boxShadow: hovered
              ? `0 12px 32px ${roleConfig?.badge?.bg ?? "rgba(245,166,35,0.12)"}, 0 4px 12px rgba(0,0,0,0.15)`
              : "none",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Corner glow */}
          <div style={{
            position: "absolute", top: 0, right: 0,
            width: "100px", height: "100px",
            background: `radial-gradient(circle at top right, ${roleConfig?.badge?.bg ?? "rgba(245,166,35,0.1)"} 0%, transparent 70%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.22s",
            pointerEvents: "none",
          }} />

          {/* Top: avatar + role badge */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
            {/* Avatar */}
            <motion.div
              animate={{ scale: hovered ? 1.06 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ position: "relative", flexShrink: 0 }}
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  style={{
                    width: "56px", height: "56px", borderRadius: "16px",
                    objectFit: "cover",
                    border: `2px solid ${hovered ? (roleConfig?.badge?.border ?? "var(--hbd)") : "var(--b)"}`,
                    transition: "border-color 0.22s",
                  }}
                />
              ) : (
                <div style={{
                  width: "56px", height: "56px", borderRadius: "16px",
                  background: avatarGradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "20px", fontWeight: 900, color: "#fff",
                  border: `2px solid ${hovered ? (roleConfig?.badge?.border ?? "var(--hbd)") : "transparent"}`,
                  transition: "border-color 0.22s",
                }}>
                  {getInitials(user.name)}
                </div>
              )}
            </motion.div>

            {/* Role badge */}
            {roleConfig && roleConfig.key !== "all" && (
              <div style={{
                display: "flex", alignItems: "center", gap: "5px",
                background: roleConfig.badge?.bg,
                color: roleConfig.badge?.text,
                border: `1px solid ${roleConfig.badge?.border}`,
                padding: "4px 10px", borderRadius: "100px",
                fontSize: "11px", fontWeight: 700,
              }}>
                <i className={`ph-fill ${roleConfig.icon}`} style={{ fontSize: "11px" }} />
                {roleConfig.label}
              </div>
            )}
          </div>

          {/* Name + bio */}
          <div>
            <h3 style={{
              fontSize: "16px", fontWeight: 800, color: "var(--t)",
              margin: "0 0 4px 0", lineHeight: 1.3,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {user.name || "No Name"}
            </h3>
            {user.bio ? (
              <p style={{
                fontSize: "12px", color: "var(--t2)", lineHeight: 1.55,
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical", overflow: "hidden",
                minHeight: "37px",
              }}>
                {user.bio}
              </p>
            ) : (
              <p style={{ fontSize: "12px", color: "var(--t3)", fontStyle: "italic", minHeight: "37px" }}>
                Belum ada bio
              </p>
            )}
          </div>

          {/* Skills */}
          {user.skills && user.skills.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {user.skills.slice(0, 3).map((skill) => (
                <span key={skill} style={{
                  background: "var(--bg3)",
                  border: "1px solid var(--b)",
                  padding: "3px 9px", borderRadius: "100px",
                  fontSize: "11px", fontWeight: 600, color: "var(--t2)",
                }}>
                  {skill}
                </span>
              ))}
              {user.skills.length > 3 && (
                <span style={{
                  background: "var(--bg3)", border: "1px solid var(--b)",
                  padding: "3px 9px", borderRadius: "100px",
                  fontSize: "11px", fontWeight: 600, color: "var(--t3)",
                }}>
                  +{user.skills.length - 3}
                </span>
              )}
            </div>
          ) : (
            <div style={{ height: "26px" }} />
          )}

          {/* Footer CTA */}
          <div style={{
            paddingTop: "12px",
            borderTop: `1px solid ${hovered ? (roleConfig?.badge?.border ?? "var(--hbd)") : "var(--b)"}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            transition: "border-color 0.22s",
          }}>
            <span style={{ fontSize: "12px", color: "var(--t3)" }}>
              {user.skills?.length ?? 0} skill{(user.skills?.length ?? 0) !== 1 ? "s" : ""}
            </span>
            <motion.div
              animate={{ x: hovered ? 3 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{
                fontSize: "12px", fontWeight: 700,
                color: roleConfig?.badge?.text ?? "var(--ho)",
                display: "flex", alignItems: "center", gap: "4px",
              }}
            >
              Lihat Profil <i className="ph-fill ph-arrow-right" style={{ fontSize: "11px" }} />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
