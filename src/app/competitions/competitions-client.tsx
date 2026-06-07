"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "@/lib/data";
import { ExpandingSearchDock } from "@/components/ui/ExpandingSearchDock";

interface Competition {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  registrationLink: string | null;
  deadline: Date | null;
  organizer: string | null;
  sourceLink: string | null;
  targetAudience: string | null;
  entryFee: string | null;
  competitionLevel: string | null;
  location: string | null;
  authorId: string;
  author: { id: string; name: string | null; image: string | null };
  createdAt: Date;
  updatedAt: Date;
}

interface CompetitionsClientProps {
  competitions: Competition[];
  userEmail: string;
  isAdmin?: boolean;
}

/* ── helpers ── */
function formatDeadline(deadline: Date | null) {
  if (!deadline) return "No deadline";
  const date = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Closed";
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Besok";
  if (diffDays <= 7) return `${diffDays} hari lagi`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function deadlineColor(deadline: Date | null) {
  if (!deadline) return "var(--t3)";
  const d = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (d < 0) return "var(--rd)";
  if (d <= 3) return "var(--or)";
  if (d <= 7) return "var(--ho)";
  return "var(--gn)";
}

function deadlineBg(deadline: Date | null) {
  if (!deadline) return "var(--bg3)";
  const d = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (d < 0) return "var(--rdb)";
  if (d <= 3) return "var(--orb)";
  if (d <= 7) return "var(--hbg)";
  return "var(--gnb)";
}

/* ── sidebar filter config ── */
const COMP_FILTERS = [
  { key: "all", label: "Semua", icon: "ph-squares-four", color: "rgba(255,255,255,.08)", iconColor: "var(--t)" },
  { key: "upcoming", label: "Upcoming", icon: "ph-clock-countdown", color: "rgba(45,214,122,.15)", iconColor: "#2dd67a" },
  { key: "past", label: "Sudah Lewat", icon: "ph-clock-counter-clockwise", color: "rgba(249,107,107,.15)", iconColor: "#f96b6b" },
];

const PROJ_FILTERS = [
  { key: "all", label: "Semua", icon: "ph-squares-four", color: "rgba(255,255,255,.08)", iconColor: "var(--t)" },
  { key: "Hackathon", label: "Hackathon", icon: "ph-lightning", color: "rgba(245,166,35,.15)", iconColor: "#f5a623" },
  { key: "UI/UX", label: "UI/UX", icon: "ph-paint-brush", color: "rgba(167,139,250,.15)", iconColor: "#a78bfa" },
  { key: "Business Plan", label: "Business Plan", icon: "ph-chart-bar", color: "rgba(45,214,122,.15)", iconColor: "#2dd67a" },
  { key: "Research", label: "Research", icon: "ph-flask", color: "rgba(91,156,246,.15)", iconColor: "#5b9cf6" },
  { key: "Startup", label: "Startup", icon: "ph-rocket-launch", color: "rgba(251,146,60,.15)", iconColor: "#fb923c" },
];

export function CompetitionsClient({ competitions, userEmail, isAdmin }: CompetitionsClientProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"competitions" | "projects">("competitions");
  const [compFilter, setCompFilter] = useState("all");
  const [projFilter, setProjFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const adminUser = isAdmin;

  /* filtered competitions */
  const filteredComps = useMemo(() => {
    const now = new Date();
    return competitions.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        if (!c.title.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q)) return false;
      }
      if (compFilter === "upcoming") return c.deadline && new Date(c.deadline) >= now;
      if (compFilter === "past") return c.deadline && new Date(c.deadline) < now;
      return true;
    });
  }, [competitions, search, compFilter]);

  /* filtered projects */
  const filteredProjs = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.desc.toLowerCase().includes(q) && !p.needs.join(" ").toLowerCase().includes(q)) return false;
      }
      if (projFilter !== "all" && p.type !== projFilter) return false;
      return true;
    });
  }, [search, projFilter]);

  /* count per filter */
  const now = new Date();
  const compCounts: Record<string, number> = {
    all: competitions.length,
    upcoming: competitions.filter((c) => c.deadline && new Date(c.deadline) >= now).length,
    past: competitions.filter((c) => c.deadline && new Date(c.deadline) < now).length,
  };
  const projCounts: Record<string, number> = {
    all: PROJECTS.length,
    ...Object.fromEntries(
      ["Hackathon", "UI/UX", "Business Plan", "Research", "Startup"].map((t) => [
        t,
        PROJECTS.filter((p) => p.type === t).length,
      ])
    ),
  };

  const activeFilters = tab === "competitions" ? COMP_FILTERS : PROJ_FILTERS;
  const activeFilter = tab === "competitions" ? compFilter : projFilter;
  const setActiveFilter = tab === "competitions" ? setCompFilter : setProjFilter;
  const counts = tab === "competitions" ? compCounts : projCounts;

  return (
    <div className="page on">
      <div className="shell">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="sidebar">

          {/* Tab switcher */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "24px" }}>
            {(["competitions", "projects"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setSearch(""); }}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "12px 14px", borderRadius: "12px", border: "none",
                  background: tab === t ? "var(--hbg)" : "transparent",
                  color: tab === t ? "var(--ho)" : "var(--t2)",
                  fontWeight: tab === t ? 800 : 500,
                  fontSize: "14px", cursor: "pointer", textAlign: "left",
                  transition: "all 0.15s",
                  borderLeft: tab === t ? "3px solid var(--ho)" : "3px solid transparent",
                }}
              >
                <i className={`ph-fill ${t === "competitions" ? "ph-trophy" : "ph-briefcase"}`}
                  style={{ fontSize: "18px" }} />
                {t === "competitions" ? "Kompetisi" : "Open Projects"}
              </button>
            ))}
          </div>

          {/* Filter list */}
          <div className="sb-section">
            <span className="sb-label">
              {tab === "competitions" ? "Filter Waktu" : "Tipe Proyek"}
            </span>
            <div className="sb-list">
              {activeFilters.map((f) => (
                <button
                  key={f.key}
                  className={`sbi ${activeFilter === f.key ? "on" : ""}`}
                  onClick={() => setActiveFilter(f.key)}
                >
                  <span className="sbi-l">
                    <span className="sbi-icon" style={{ background: f.color, color: f.iconColor }}>
                      <i className={`ph-fill ${f.icon}`} />
                    </span>
                    {f.label}
                  </span>
                  <span className="sbi-count">{counts[f.key] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Admin action */}
          {adminUser && tab === "competitions" && (
            <div style={{ marginTop: "24px" }}>
              <Link href="/competitions/create" style={{ textDecoration: "none" }}>
                <button className="btn btn-honey btn-sm" style={{ width: "100%" }}>
                  <i className="ph-fill ph-plus" /> Post Kompetisi
                </button>
              </Link>
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="main">

          {/* Header */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
              <div>
                <h1 style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "clamp(26px, 4vw, 34px)",
                  fontWeight: 900,
                  margin: "0 0 4px 0",
                  color: "var(--t)",
                  lineHeight: 1.3,
                  overflow: "visible",
                }}>
                  {tab === "competitions" ? (
                    <>
                      Kompetisi{" "}
                      <span style={{
                        backgroundImage: "linear-gradient(90deg, var(--ho), #ffbe4d)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                      }}>&amp; Lomba</span>
                    </>
                  ) : (
                    <>
                      Open{" "}
                      <span style={{
                        backgroundImage: "linear-gradient(90deg, var(--bl), #93c5fd)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                      }}>Projects</span>
                    </>
                  )}
                </h1>
                <div className="text-[11px] text-[#a8b0d0] mt-[3px] font-[400] text-balance">
                  {tab === "competitions"
                    ? `${filteredComps.length} kompetisi ditemukan`
                    : `${filteredProjs.length} proyek mencari anggota`}
                </div>
              </div>

              {/* Search — same style as People page */}
              <ExpandingSearchDock
                value={search}
                onChange={setSearch}
                placeholder={tab === "competitions" ? "Cari kompetisi..." : "Cari proyek, skill..."}
              />
            </div>
          </div>

          {/* ── COMPETITIONS TAB ── */}
          <AnimatePresence mode="wait">
            {tab === "competitions" && (
              <motion.div key="comps" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {filteredComps.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                    {filteredComps.map((c, i) => (
                      <CompetitionCard key={c.id} competition={c} index={i} onClick={() => router.push(`/competitions/${c.id}`)} onImageClick={setPreviewImage} />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="ph-trophy" title="Tidak ada kompetisi" sub={search ? `Tidak ada hasil untuk "${search}"` : "Belum ada kompetisi saat ini"} />
                )}
              </motion.div>
            )}

            {/* ── PROJECTS TAB ── */}
            {tab === "projects" && (
              <motion.div key="projs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {filteredProjs.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                    {filteredProjs.map((p, i) => (
                      <ProjectCard key={p.id} project={p} index={i} />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="ph-briefcase" title="Tidak ada proyek" sub={search ? `Tidak ada hasil untuk "${search}"` : "Belum ada proyek terbuka"} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── Competition Card ── */
function CompetitionCard({ competition, index, onClick, onImageClick }: { competition: Competition; index: number; onClick: () => void; onImageClick: (url: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const color = deadlineColor(competition.deadline);
  const bg = deadlineBg(competition.deadline);

  // Deterministic fallback data based on competition ID to avoid hydration mismatch
  const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };
  
  const idHash = getHash(competition.id);
  const likesCount = (idHash % 40) + 10;
  const viewsCount = (idHash % 400) + 100;
  const targetAudience = competition.targetAudience || "Umum";
  const entryFee = competition.entryFee || "Gratis";
  const location = competition.location || "Online";

  // Format date correctly
  let formattedDateRange = "TBA";
  if (competition.deadline) {
    const d = new Date(competition.deadline);
    formattedDateRange = `${d.getDate()} - ${d.getDate() + 3} ${d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}`;
  }

  // Calculate H-X format for badge
  let hMinusText = "TBA";
  let hMinusColor = "var(--t2)";
  let hMinusBg = "var(--bg3)";
  if (competition.deadline) {
    const diffDays = Math.ceil((new Date(competition.deadline).getTime() - new Date().getTime()) / 86400000);
    if (diffDays < 0) { hMinusText = "Closed"; hMinusColor = "var(--rd)"; hMinusBg = "var(--rdb)"; }
    else if (diffDays === 0) { hMinusText = "H-0"; hMinusColor = "var(--rd)"; hMinusBg = "var(--rdb)"; }
    else if (diffDays <= 7) { hMinusText = `H-${diffDays}`; hMinusColor = "var(--or)"; hMinusBg = "var(--orb)"; }
    else { hMinusText = `H-${diffDays}`; hMinusColor = "var(--gn)"; hMinusBg = "var(--gnb)"; }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: hovered
          ? `linear-gradient(145deg, var(--bg2) 0%, rgba(245, 166, 35, 0.15) 100%)`
          : "var(--bg2)",
        border: `1px solid ${hovered ? "var(--hbd)" : "var(--b)"}`,
        borderRadius: "20px", overflow: "hidden", cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 28px rgba(245,166,35,0.12)" : "none",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Banner Container */}
      <div style={{ position: "relative", width: "100%", height: "180px" }}>
        {competition.imageUrl ? (
          <div style={{ width: "100%", height: "100%", background: `url(${competition.imageUrl}) top center / cover no-repeat` }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(135deg, var(--hbg) 0%, var(--bg3) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "48px", color: "var(--ho)",
          }}>
            <i className="ph-fill ph-trophy" />
          </div>
        )}
        
        {/* H-X Badge */}
        <div style={{
          position: "absolute", top: "12px", left: "12px",
          backgroundColor: hMinusBg,
          color: hMinusColor, 
          padding: "4px 12px", borderRadius: "8px",
          fontSize: "12px", fontWeight: "bold",
          border: `1px solid ${hMinusColor}40`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          zIndex: 2
        }}>
          {hMinusText}
        </div>
        
      </div>

      <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
        {/* Likes and Views Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <div>
            {competition.sourceLink && (
              <a 
                href={competition.sourceLink} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  fontSize: "11px", fontWeight: 700, color: "var(--bl)",
                  background: "var(--blb)", padding: "4px 8px", borderRadius: "100px",
                  border: "1px solid var(--bl)40",
                  textDecoration: "none"
                }}
              >
                Sumber <i className="ph-bold ph-arrow-up-right" />
              </a>
            )}
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--t2)", fontSize: "12px" }}>
              <i className="ph-fill ph-heart" style={{ color: "var(--rd)" }} /> {likesCount}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--t2)", fontSize: "12px" }}>
              <i className="ph-fill ph-eye" style={{ color: "var(--bl)" }} /> {viewsCount}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: "16px", fontWeight: 800, color: "var(--t)",
          margin: "0 0 16px 0", lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {competition.title}
        </h3>

        {/* Metadata Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--t2)" }}>
            <i className="ph-fill ph-graduation-cap" style={{ color: "var(--bl)", width: "16px", textAlign: "center" }} />
            <span>{targetAudience}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--t2)" }}>
            <i className="ph-fill ph-coins" style={{ color: "var(--or)", width: "16px", textAlign: "center" }} />
            <span>{entryFee}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--t2)" }}>
            <i className="ph-fill ph-map-pin" style={{ color: "var(--rd)", width: "16px", textAlign: "center" }} />
            <span>{location}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--t2)" }}>
            <i className="ph-fill ph-calendar-blank" style={{ color: "var(--gn)", width: "16px", textAlign: "center" }} />
            <span>{formattedDateRange}</span>
          </div>
        </div>

        <div style={{ marginTop: "auto" }}>
          {/* Organizer */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            paddingBottom: "16px",
          }}>
            {competition.author.image ? (
              <img src={competition.author.image} alt="" style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{
                width: "24px", height: "24px", borderRadius: "50%",
                background: "linear-gradient(135deg, var(--hbg) 0%, var(--bg3) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "10px", fontWeight: 800, color: "var(--ho)",
              }}>
                {competition.author.name?.[0] || "?"}
              </div>
            )}
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--t)" }}>
              {competition.organizer || competition.author.name || "Unknown Organizer"}
            </span>
          </div>

          {/* Action Button */}
          <button style={{
            width: "100%", padding: "10px",
            background: "var(--blb)", color: "var(--bl)",
            border: "1px solid rgba(59, 130, 246, 0.4)", borderRadius: "100px",
            fontSize: "13px", fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            transition: "all 0.2s ease"
          }}>
            More Detail <i className="ph-bold ph-arrow-right" style={{ fontSize: "11px" }}/>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Project Card ── */
const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  Hackathon: { bg: "rgba(245,166,35,.15)", color: "#f5a623" },
  "UI/UX": { bg: "rgba(167,139,250,.15)", color: "#a78bfa" },
  "Business Plan": { bg: "rgba(45,214,122,.15)", color: "#2dd67a" },
  Research: { bg: "rgba(91,156,246,.15)", color: "#5b9cf6" },
  Startup: { bg: "rgba(251,146,60,.15)", color: "#fb923c" },
};

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const badge = BADGE_COLORS[project.type] ?? { bg: "var(--bg3)", color: "var(--t2)" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(145deg, var(--bg2) 0%, ${badge.bg} 100%)`
          : "var(--bg2)",
        border: `1px solid ${hovered ? badge.color + "60" : "var(--b)"}`,
        borderRadius: "20px", padding: "20px", cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 12px 28px ${badge.bg}` : "none",
        display: "flex", flexDirection: "column", gap: "12px",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Corner glow */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: "80px", height: "80px",
        background: `radial-gradient(circle at top right, ${badge.bg} 0%, transparent 70%)`,
        opacity: hovered ? 1 : 0, transition: "opacity 0.2s", pointerEvents: "none",
      }} />

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          background: badge.bg, color: badge.color,
          padding: "4px 10px", borderRadius: "100px",
          fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em",
        }}>
          {project.type}
        </span>
        <span style={{
          fontSize: "11px", fontWeight: 600,
          color: project.urgent ? "var(--rd)" : "var(--t3)",
          display: "flex", alignItems: "center", gap: "4px",
        }}>
          <i className={`ph-fill ${project.urgent ? "ph-clock" : "ph-calendar-blank"}`} style={{ fontSize: "11px" }} />
          {project.deadline}
        </span>
      </div>

      {/* Title + desc */}
      <div>
        <h3 style={{
          fontSize: "15px", fontWeight: 800, color: "var(--t)",
          margin: "0 0 5px 0", lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {project.title}
        </h3>
        <p style={{
          fontSize: "12px", color: "var(--t2)", lineHeight: 1.55,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "37px",
        }}>
          {project.desc}
        </p>
      </div>

      {/* Slot terbuka */}
      <div>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
          Slot Terbuka
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {project.needs.map((n) => (
            <span key={n} style={{
              padding: "3px 9px", borderRadius: "100px", fontSize: "11px", fontWeight: 600,
              background: project.open.includes(n) ? badge.bg : "var(--bg3)",
              color: project.open.includes(n) ? badge.color : "var(--t3)",
              border: `1px solid ${project.open.includes(n) ? badge.color + "40" : "var(--b)"}`,
            }}>
              {n}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: "12px", borderTop: "1px solid var(--b)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <div style={{
            width: "24px", height: "24px", borderRadius: "50%",
            background: project.pcolor,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "9px", fontWeight: 800, color: "#fff",
          }}>
            {project.poster}
          </div>
          <span style={{ fontSize: "11px", color: "var(--t2)" }}>{project.posterName}</span>
        </div>
        <motion.button
          animate={{ x: hovered ? 2 : 0 }}
          onClick={(e) => { e.stopPropagation(); alert(`Apply to ${project.title}`); }}
          style={{
            background: badge.bg, color: badge.color,
            border: `1px solid ${badge.color}40`,
            padding: "5px 12px", borderRadius: "100px",
            fontSize: "12px", fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: "4px",
          }}
        >
          Apply <i className="ph-fill ph-arrow-right" style={{ fontSize: "10px" }} />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ── Empty State ── */
function EmptyState({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--t2)" }}>
      <div style={{ fontSize: "52px", color: "var(--t4)", marginBottom: "16px" }}>
        <i className={`ph-fill ${icon}`} />
      </div>
      <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--t)", marginBottom: "6px" }}>{title}</div>
      <p style={{ fontSize: "13px" }}>{sub}</p>
    </div>
  );
}
