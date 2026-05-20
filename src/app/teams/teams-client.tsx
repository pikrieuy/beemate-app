"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Team {
  id: string;
  name: string;
  description: string | null;
  leaderId: string;
  leader: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count: {
    members: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface TeamsClientProps {
  initialTeams: Team[];
  initialPagination: any;
}

const TEAM_COLORS = [
  { bg: "var(--hbg)", border: "var(--hbd)", text: "var(--ho)", glow: "rgba(245,166,35,0.15)" },
  { bg: "var(--blb)", border: "var(--bbd)", text: "var(--bl)", glow: "rgba(91,156,246,0.15)" },
  { bg: "var(--gnb)", border: "var(--gbd)", text: "var(--gn)", glow: "rgba(45,214,122,0.15)" },
  { bg: "var(--pub)", border: "var(--pbd)", text: "var(--pu)", glow: "rgba(167,139,250,0.15)" },
  { bg: "var(--orb)", border: "rgba(251,146,60,0.3)", text: "var(--or)", glow: "rgba(251,146,60,0.15)" },
  { bg: "var(--cyb)", border: "rgba(34,212,212,0.3)", text: "var(--cy)", glow: "rgba(34,212,212,0.15)" },
];

function getTeamColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  return TEAM_COLORS[Math.abs(hash) % TEAM_COLORS.length];
}

function getInitials(name: string | null) {
  if (!name) return "??";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

type SortKey = "newest" | "oldest" | "members" | "name";

export function TeamsClient({ initialTeams }: TeamsClientProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [sizeFilter, setSizeFilter] = useState<"all" | "small" | "medium" | "large">("all");

  const filtered = useMemo(() => {
    let result = initialTeams.filter((team) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !team.name.toLowerCase().includes(q) &&
          !team.description?.toLowerCase().includes(q) &&
          !team.leader.name?.toLowerCase().includes(q)
        ) return false;
      }
      if (sizeFilter !== "all") {
        const m = team._count.members;
        if (sizeFilter === "small" && m > 3) return false;
        if (sizeFilter === "medium" && (m < 4 || m > 7)) return false;
        if (sizeFilter === "large" && m < 8) return false;
      }
      return true;
    });

    result = [...result].sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === "members") return b._count.members - a._count.members;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [initialTeams, search, sort, sizeFilter]);

  const totalMembers = initialTeams.reduce((s, t) => s + t._count.members, 0);
  const avgMembers = initialTeams.length ? Math.round(totalMembers / initialTeams.length) : 0;
  const largestTeam = [...initialTeams].sort((a, b) => b._count.members - a._count.members)[0];

  const sizeOptions: { key: typeof sizeFilter; label: string; desc: string }[] = [
    { key: "all", label: "Semua", desc: `${initialTeams.length} tim` },
    { key: "small", label: "Kecil", desc: "1–3 orang" },
    { key: "medium", label: "Sedang", desc: "4–7 orang" },
    { key: "large", label: "Besar", desc: "8+ orang" },
  ];

  return (
    <div className="page on">
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 40px 64px" }}>

          {/* ── Page Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: "32px" }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--t3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                  Temukan Tim
                </div>
                <h1 style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 900, margin: "0 0 8px 0",
                  color: "var(--t)", lineHeight: 1.1,
                }}>
                  Browse{" "}
                  <span style={{ background: "linear-gradient(90deg, var(--ho), #ffc04d)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Teams
                  </span>
                </h1>
                <p style={{ fontSize: "14px", color: "var(--t2)", margin: 0 }}>
                  {filtered.length} dari {initialTeams.length} tim — bergabung atau buat timmu sendiri
                </p>
              </div>
              <Link href="/teams/create" className="btn btn-honey" style={{ flexShrink: 0 }}>
                <i className="ph-fill ph-plus" /> Buat Tim
              </Link>
            </div>
          </motion.div>

          {/* ── Two-column layout ── */}
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "24px", alignItems: "start" }}>

            {/* ── LEFT SIDEBAR ── */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{ display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "80px" }}
            >
              {/* Search */}
              <div style={{ background: "var(--bg2)", border: "1px solid var(--b)", borderRadius: "16px", padding: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--t3)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "10px" }}>
                  Cari
                </div>
                <div style={{ position: "relative" }}>
                  <i className="ph-fill ph-magnifying-glass" style={{
                    position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                    color: "var(--t3)", fontSize: "15px", pointerEvents: "none",
                  }} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Nama, deskripsi, leader..."
                    style={{
                      width: "100%", padding: "10px 36px 10px 36px",
                      borderRadius: "10px", border: "1px solid var(--b)",
                      background: "var(--bg3)", color: "var(--t)", fontSize: "13px",
                      outline: "none", transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ho)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b)")}
                  />
                  {search && (
                    <button onClick={() => setSearch("")} style={{
                      position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                      background: "transparent", border: "none", color: "var(--t3)", cursor: "pointer", fontSize: "15px",
                    }}>
                      <i className="ph-fill ph-x-circle" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sort */}
              <div style={{ background: "var(--bg2)", border: "1px solid var(--b)", borderRadius: "16px", padding: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--t3)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "10px" }}>
                  Urutkan
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {([
                    { key: "newest", label: "Terbaru", icon: "ph-clock-clockwise" },
                    { key: "oldest", label: "Terlama", icon: "ph-clock-counter-clockwise" },
                    { key: "members", label: "Anggota terbanyak", icon: "ph-users" },
                    { key: "name", label: "Nama A–Z", icon: "ph-sort-ascending" },
                  ] as { key: SortKey; label: string; icon: string }[]).map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSort(opt.key)}
                      style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "9px 12px", borderRadius: "9px", border: "none",
                        background: sort === opt.key ? "var(--hbg)" : "transparent",
                        color: sort === opt.key ? "var(--ho)" : "var(--t2)",
                        fontSize: "13px", fontWeight: sort === opt.key ? 700 : 500,
                        cursor: "pointer", textAlign: "left", width: "100%",
                        transition: "background 0.15s, color 0.15s",
                      }}
                    >
                      <i className={`ph-fill ${opt.icon}`} style={{ fontSize: "15px" }} />
                      {opt.label}
                      {sort === opt.key && (
                        <i className="ph-fill ph-check" style={{ marginLeft: "auto", fontSize: "13px" }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size filter */}
              <div style={{ background: "var(--bg2)", border: "1px solid var(--b)", borderRadius: "16px", padding: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--t3)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "10px" }}>
                  Ukuran Tim
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {sizeOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSizeFilter(opt.key)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "9px 12px", borderRadius: "9px", border: "none",
                        background: sizeFilter === opt.key ? "var(--hbg)" : "transparent",
                        color: sizeFilter === opt.key ? "var(--ho)" : "var(--t2)",
                        fontSize: "13px", fontWeight: sizeFilter === opt.key ? 700 : 500,
                        cursor: "pointer", textAlign: "left", width: "100%",
                        transition: "background 0.15s, color 0.15s",
                      }}
                    >
                      <span>{opt.label}</span>
                      <span style={{
                        fontSize: "11px", fontWeight: 600,
                        color: sizeFilter === opt.key ? "var(--ho)" : "var(--t3)",
                      }}>
                        {opt.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats summary */}
              <div style={{ background: "var(--bg2)", border: "1px solid var(--b)", borderRadius: "16px", padding: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--t3)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "12px" }}>
                  Statistik
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { label: "Total Tim", value: initialTeams.length, icon: "ph-users-three", color: "var(--ho)" },
                    { label: "Total Anggota", value: totalMembers, icon: "ph-user", color: "var(--bl)" },
                    { label: "Rata-rata Anggota", value: avgMembers, icon: "ph-chart-bar", color: "var(--gn)" },
                  ].map((s) => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "30px", height: "30px", borderRadius: "8px",
                        background: "var(--bg3)", border: "1px solid var(--b)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "14px", color: s.color, flexShrink: 0,
                      }}>
                        <i className={`ph-fill ${s.icon}`} />
                      </div>
                      <div>
                        <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--t)", lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontSize: "11px", color: "var(--t3)", marginTop: "2px" }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── RIGHT: Grid ── */}
            <div>
              <AnimatePresence mode="wait">
                {filtered.length > 0 ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    {filtered.map((team, i) => (
                      <TeamCard key={team.id} team={team} index={i} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      textAlign: "center", padding: "80px 24px",
                      background: "var(--bg2)", border: "1px dashed var(--b)", borderRadius: "20px",
                    }}
                  >
                    <div style={{ fontSize: "52px", color: "var(--t4)", marginBottom: "16px" }}>
                      <i className="ph-fill ph-users-three" />
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--t)", marginBottom: "8px" }}>
                      Tidak ada tim ditemukan
                    </div>
                    <p style={{ fontSize: "14px", color: "var(--t2)", marginBottom: "24px" }}>
                      Coba ubah filter atau kata kunci pencarian
                    </p>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                      <button
                        className="btn btn-sm"
                        style={{ background: "var(--bg3)", border: "1px solid var(--b)", color: "var(--t)" }}
                        onClick={() => { setSearch(""); setSizeFilter("all"); }}
                      >
                        <i className="ph-fill ph-x-circle" /> Reset Filter
                      </button>
                      <Link href="/teams/create" className="btn btn-honey btn-sm">
                        <i className="ph-fill ph-plus" /> Buat Tim
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      {/* Responsive: collapse sidebar on mobile */}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: 260px"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="position: sticky"] {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}

function TeamCard({ team, index }: { team: Team; index: number }) {
  const color = getTeamColor(team.id);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.035, 0.35), duration: 0.35 }}
    >
      <Link href={`/teams/${team.id}`} style={{ textDecoration: "none", display: "block" }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: hovered
              ? `linear-gradient(145deg, var(--bg2) 0%, ${color.glow} 100%)`
              : "var(--bg2)",
            border: `1px solid ${hovered ? color.border : "var(--b)"}`,
            borderRadius: "18px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            transition: "all 0.22s ease",
            transform: hovered ? "translateY(-5px)" : "translateY(0)",
            boxShadow: hovered ? `0 12px 32px ${color.glow}, 0 4px 12px rgba(0,0,0,0.2)` : "none",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative corner accent */}
          <div style={{
            position: "absolute", top: 0, right: 0,
            width: "80px", height: "80px",
            background: `radial-gradient(circle at top right, ${color.glow} 0%, transparent 70%)`,
            pointerEvents: "none",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.22s",
          }} />

          {/* Top row: avatar + badge */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
            <motion.div
              animate={{ scale: hovered ? 1.08 : 1, rotate: hovered ? 3 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                width: "46px", height: "46px", borderRadius: "13px",
                background: color.bg, border: `1px solid ${color.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "17px", fontWeight: 900, color: color.text,
                flexShrink: 0, letterSpacing: "-0.5px",
              }}
            >
              {getInitials(team.name)}
            </motion.div>

            <div style={{
              display: "flex", alignItems: "center", gap: "4px",
              background: "var(--bg3)", border: "1px solid var(--b)",
              padding: "4px 9px", borderRadius: "100px",
              fontSize: "11px", fontWeight: 700, color: "var(--t2)",
            }}>
              <i className="ph-fill ph-users" style={{ fontSize: "12px" }} />
              {team._count.members}
            </div>
          </div>

          {/* Name + description */}
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: "15px", fontWeight: 800, color: "var(--t)",
              marginBottom: "5px", lineHeight: 1.3,
              display: "-webkit-box", WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {team.name}
            </h3>
            <p style={{
              fontSize: "12px", color: "var(--t2)", lineHeight: 1.55,
              display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", overflow: "hidden",
              minHeight: "37px",
            }}>
              {team.description || "Belum ada deskripsi untuk tim ini."}
            </p>
          </div>

          {/* Footer */}
          <div style={{
            paddingTop: "12px", borderTop: `1px solid ${hovered ? color.border : "var(--b)"}`,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px",
            transition: "border-color 0.22s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", minWidth: 0 }}>
              {team.leader.image ? (
                <img
                  src={team.leader.image}
                  alt={team.leader.name || "Leader"}
                  style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                />
              ) : (
                <div style={{
                  width: "24px", height: "24px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #f5a623, #ffc04d)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "9px", fontWeight: 800, color: "#fff", flexShrink: 0,
                }}>
                  {getInitials(team.leader.name)}
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "9px", color: "var(--t3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Leader</div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--t)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {team.leader.name || "Unknown"}
                </div>
              </div>
            </div>

            <motion.div
              animate={{ x: hovered ? 2 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{
                fontSize: "11px", fontWeight: 700, color: color.text,
                background: color.bg, border: `1px solid ${color.border}`,
                padding: "4px 9px", borderRadius: "100px", flexShrink: 0,
                display: "flex", alignItems: "center", gap: "3px",
              }}
            >
              Lihat <i className="ph-fill ph-arrow-right" style={{ fontSize: "10px" }} />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
