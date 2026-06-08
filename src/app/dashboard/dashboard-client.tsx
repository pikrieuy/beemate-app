"use client";

import { useRouter } from "next/navigation";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CompetitionRecommender } from "@/components/ui/CompetitionRecommender";

interface User {
  id: string;
  name: string | null;
  image: string | null;
  role: string;
}

interface Team {
  id: string;
  name: string;
  description: string | null;
  _count: {
    members: number;
  };
}

interface PendingInvitation {
  id: string;
  team: {
    id: string;
    name: string;
    leader: {
      name: string | null;
      image: string | null;
    };
  };
  createdAt: Date;
}

interface Competition {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  deadline: Date | null;
  author: {
    name: string | null;
    image: string | null;
  };
}

interface DashboardClientProps {
  user: User;
  stats: {
    teamsCreated: number;
    teamsJoined: number;
    pendingInvites: number;
    upcomingCompetitions: number;
  };
  teamsCreated: Team[];
  teamMemberships: Team[];
  pendingInvitations: PendingInvitation[];
  upcomingCompetitions: Competition[];
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: "easeOut" as const },
});

/* Animated number counter */
function AnimatedCounter({ value, color }: { value: number; color: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, { duration: 0.9, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [value]);

  return (
    <span style={{ fontSize: "30px", fontWeight: 900, color, lineHeight: 1 }}>
      {display}
    </span>
  );
}

export function DashboardClient({
  user,
  stats,
  teamsCreated,
  teamMemberships,
  pendingInvitations,
  upcomingCompetitions,
}: DashboardClientProps) {
  const router = useRouter();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Selamat pagi";
    if (h < 18) return "Selamat siang";
    return "Selamat malam";
  };

  const formatDeadline = (deadline: Date | null) => {
    if (!deadline) return "No deadline";
    const date = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Besok";
    if (diffDays <= 7) return `${diffDays} hari lagi`;
    return date.toLocaleDateString("id-ID", { month: "short", day: "numeric" });
  };

  const getDeadlineUrgency = (deadline: Date | null) => {
    if (!deadline) return "normal";
    const diffDays = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 3) return "urgent";
    if (diffDays <= 7) return "soon";
    return "normal";
  };

  const allTeams = [
    ...teamsCreated.map((t) => ({ ...t, role: "Leader" as const })),
    ...teamMemberships.map((t) => ({ ...t, role: "Member" as const })),
  ];

  const statsData = [
    {
      label: "Tim Dibuat",
      value: stats.teamsCreated,
      icon: "ph-crown",
      color: "var(--ho)",
      bg: "var(--hbg)",
      border: "var(--hbd)",
      href: "/teams",
    },
    {
      label: "Tim Diikuti",
      value: stats.teamsJoined,
      icon: "ph-users-three",
      color: "var(--bl)",
      bg: "var(--blb)",
      border: "var(--bbd)",
      href: "/teams",
    },
    {
      label: "Undangan Masuk",
      value: stats.pendingInvites,
      icon: "ph-envelope-open",
      color: stats.pendingInvites > 0 ? "var(--rd)" : "var(--t2)",
      bg: stats.pendingInvites > 0 ? "var(--rdb)" : "var(--bg3)",
      border: stats.pendingInvites > 0 ? "var(--rbd)" : "var(--b)",
      href: "/notifications",
    },
    {
      label: "Kompetisi Aktif",
      value: stats.upcomingCompetitions,
      icon: "ph-trophy",
      color: "var(--gn)",
      bg: "var(--gnb)",
      border: "var(--gbd)",
      href: "/competitions",
    },
  ];

  const quickActions = [
    { label: "Buat Tim", icon: "ph-users-three", href: "/teams/create", primary: true },
    { label: "Cari Orang", icon: "ph-user-circle-plus", href: "/people", primary: false },
    { label: "Kompetisi", icon: "ph-trophy", href: "/competitions", primary: false },
    ...(user.role === "ADMIN"
      ? [{ label: "Post Lomba", icon: "ph-plus-circle", href: "/competitions/create", primary: false }]
      : []),
  ];

  return (
    <div style={{ minHeight: "100vh", padding: "28px 24px 48px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* ── Hero / Welcome ── */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: "36px" }}>
          <HeroCard user={user} greeting={getGreeting()} />
        </motion.div>

        {/* ── Stats Row ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "14px",
          marginBottom: "32px",
        }}>
          {statsData.map((s, i) => (
            <motion.div key={s.label} {...fadeUp(0.08 + i * 0.06)}>
              <StatCard stat={s} />
            </motion.div>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <motion.div {...fadeUp(0.32)} style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--t3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
            Aksi Cepat
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {quickActions.map((a) => (
              <Link key={a.href} href={a.href} style={{ textDecoration: "none" }}>
                <button
                  className={`${a.primary ? "btn btn-honey btn-sm" : "btn btn-sm"} rounded-full`}
                  style={a.primary ? {} : {
                    background: "var(--bg2)",
                    border: "1px solid var(--b)",
                    color: "var(--t)",
                  }}
                >
                  <i className={`ph-fill ${a.icon}`} /> {a.label}
                </button>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── Main Grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          alignItems: "start",
        }}>

          {/* Your Teams */}
          <motion.div {...fadeUp(0.38)}>
            <SectionCard
              title="Tim Kamu"
              icon="ph-users-three"
              iconColor="var(--bl)"
              viewAllHref="/teams"
            >
              {allTeams.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {allTeams.slice(0, 5).map((team) => (
                    <TeamRow
                      key={`${team.id}-${team.role}`}
                      team={team}
                      role={team.role}
                      onClick={() => router.push(`/teams/${team.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="ph-users-three"
                  message="Belum ada tim"
                  sub="Buat tim pertamamu dan mulai kolaborasi"
                  action={{ label: "Buat Tim", href: "/teams/create" }}
                />
              )}
            </SectionCard>
          </motion.div>

          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <motion.div {...fadeUp(0.44)}>
              <SectionCard
                title="Undangan Masuk"
                icon="ph-envelope-open"
                iconColor="var(--rd)"
                badge={pendingInvitations.length}
                viewAllHref="/notifications"
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {pendingInvitations.slice(0, 4).map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => router.push("/notifications")}
                      style={{
                        background: "var(--rdb)",
                        border: "1px solid var(--rbd)",
                        borderRadius: "var(--r-pill)",
                        padding: "14px 16px",
                        cursor: "pointer",
                        transition: "opacity 0.15s",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "0.8")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "1")}
                    >
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "var(--r-pill)",
                        background: "var(--rdb)", border: "1px solid var(--rbd)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "18px", color: "var(--rd)", flexShrink: 0,
                      }}>
                        <i className="ph-fill ph-users-three" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--t)", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {inv.team.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--t2)" }}>
                          Diundang oleh {inv.team.leader.name || "Unknown"}
                        </div>
                      </div>
                      <i className="ph-fill ph-arrow-right" style={{ color: "var(--t3)", fontSize: "16px", flexShrink: 0 }} />
                    </div>
                  ))}
                </div>
              </SectionCard>
            </motion.div>
          )}

          {/* Upcoming Competitions */}
          <motion.div {...fadeUp(0.5)}>
            <SectionCard
              title="Kompetisi Mendatang"
              icon="ph-trophy"
              iconColor="var(--gn)"
              viewAllHref="/competitions"
            >
              {upcomingCompetitions.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {upcomingCompetitions.slice(0, 5).map((comp) => {
                    const urgency = getDeadlineUrgency(comp.deadline);
                    const deadlineColor = urgency === "urgent" ? "var(--rd)" : urgency === "soon" ? "var(--or)" : "var(--t3)";
                    return (
                      <div
                        key={comp.id}
                        onClick={() => router.push(`/competitions/${comp.id}`)}
                        style={{
                          background: "var(--bg3)",
                          border: "1px solid var(--b)",
                          borderRadius: "var(--r-pill)",
                          padding: "14px 16px",
                          cursor: "pointer",
                          transition: "border-color 0.15s, transform 0.15s",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--ho)";
                          (e.currentTarget as HTMLDivElement).style.transform = "translateX(3px)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--b)";
                          (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)";
                        }}
                      >
                        <div style={{
                          width: "36px", height: "36px", borderRadius: "var(--r-pill)",
                          background: "var(--gnb)", border: "1px solid var(--gbd)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "18px", color: "var(--gn)", flexShrink: 0,
                        }}>
                          <i className="ph-fill ph-trophy" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--t)", marginBottom: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {comp.title}
                          </div>
                          <div style={{ fontSize: "12px", color: deadlineColor, fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                            <i className="ph-fill ph-clock" style={{ fontSize: "11px" }} />
                            {formatDeadline(comp.deadline)}
                          </div>
                        </div>
                        <i className="ph-fill ph-arrow-right" style={{ color: "var(--t3)", fontSize: "16px", flexShrink: 0 }} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon="ph-trophy"
                  message="Belum ada kompetisi"
                  sub="Cek kembali nanti untuk kompetisi terbaru"
                />
              )}
            </SectionCard>
          </motion.div>

          {/* AI Competition Recommender */}
          <motion.div {...fadeUp(0.5)}>
            <CompetitionRecommender />
          </motion.div>

        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function HeroCard({ user, greeting }: { user: User; greeting: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -4, y: dx * 4 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
      style={{
        background: "linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)",
        border: `1px solid ${hovered ? "var(--hbd)" : "var(--b)"}`,
        borderRadius: "var(--r-pill)",
        padding: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
        flexWrap: "wrap",
        position: "relative",
        overflow: "hidden",
        transformStyle: "preserve-3d",
        transition: "border-color 0.2s",
        cursor: "default",
      }}
    >
      {/* Animated glow that follows mouse */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0.5 }}
        style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "220px", height: "220px",
          background: "radial-gradient(circle, rgba(245,166,35,0.14) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "12px", color: "var(--t3)", fontWeight: 700, marginBottom: "6px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {greeting}
        </div>
        <h1 style={{ fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 900, color: "var(--t)", marginBottom: "8px", lineHeight: 1.2 }}>
          {user.name?.split(" ")[0] || "Hive Member"} 👋
        </h1>
        <p style={{ fontSize: "14px", color: "var(--t2)", maxWidth: "480px", lineHeight: 1.6 }}>
          Selamat datang di dashboard BeeMate. Pantau tim, undangan, dan kompetisi kamu di sini.
        </p>
      </div>
      {user.image && (
        <motion.div
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ position: "relative", zIndex: 1, flexShrink: 0 }}
        >
          <Image
            src={user.image}
            alt={user.name || "Avatar"}
            width={72}
            height={72}
            unoptimized
            style={{ borderRadius: "50%", objectFit: "cover", border: "3px solid var(--hbd)" }}
          />
          {/* Online indicator */}
          <div style={{
            position: "absolute", bottom: "2px", right: "2px",
            width: "14px", height: "14px", borderRadius: "50%",
            background: "var(--gn)", border: "2px solid var(--bg2)",
          }} />
        </motion.div>
      )}
    </motion.div>
  );
}

function StatCard({ stat }: { stat: { label: string; value: number; icon: string; color: string; bg: string; border: string; href: string } }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => router.push(stat.href)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: stat.bg,
        border: `1px solid ${hovered ? stat.color : stat.border}`,
        borderRadius: "var(--r-pill)",
        padding: "20px 22px",
        cursor: "pointer",
        transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 24px ${stat.bg}, var(--shadow-md)` : "none",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Shimmer on hover */}
      {hovered && (
        <motion.div
          initial={{ x: "-100%", opacity: 0.4 }}
          animate={{ x: "200%", opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: "absolute", top: 0, left: 0,
            width: "60%", height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
            pointerEvents: "none",
          }}
        />
      )}
      <motion.div
        animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? -5 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          width: "44px", height: "44px", borderRadius: "var(--r-pill)",
          background: "rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "22px", color: stat.color, flexShrink: 0,
        }}
      >
        <i className={`ph-fill ${stat.icon}`} />
      </motion.div>
      <div>
        <AnimatedCounter value={stat.value} color={stat.color} />
        <div style={{ fontSize: "12px", color: "var(--t2)", fontWeight: 600, marginTop: "4px" }}>
          {stat.label}
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  iconColor,
  badge,
  viewAllHref,
  children,
}: {
  title: string;
  icon: string;
  iconColor: string;
  badge?: number;
  viewAllHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "var(--bg2)",
      border: "1px solid var(--b)",
      borderRadius: "20px",
      padding: "22px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "9px",
            background: "var(--bg3)", border: "1px solid var(--b)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", color: iconColor,
          }}>
            <i className={`ph-fill ${icon}`} />
          </div>
          <span style={{ fontSize: "15px", fontWeight: 800, color: "var(--t)" }}>{title}</span>
          {badge !== undefined && badge > 0 && (
            <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{
                  position: "absolute", inset: 0, borderRadius: "100px",
                  background: "var(--rd)", opacity: 0.4,
                }}
              />
              <span style={{
                position: "relative",
                background: "var(--rd)", color: "#fff",
                fontSize: "11px", fontWeight: 700,
                padding: "2px 7px", borderRadius: "100px",
              }}>
                {badge}
              </span>
            </span>
          )}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} style={{ fontSize: "12px", color: "var(--ho)", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>
            Lihat semua <i className="ph-fill ph-arrow-right" style={{ fontSize: "11px" }} />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

function TeamRow({ team, role, onClick }: { team: Team; role: "Leader" | "Member"; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--bg3)",
        border: "1px solid var(--b)",
        borderRadius: "var(--r-pill)",
        padding: "14px 16px",
        cursor: "pointer",
        transition: "border-color 0.15s, transform 0.15s",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--ho)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateX(3px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--b)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)";
      }}
    >
      <div style={{
        width: "36px", height: "36px", borderRadius: "var(--r-pill)",
        background: role === "Leader" ? "var(--hbg)" : "var(--blb)",
        border: `1px solid ${role === "Leader" ? "var(--hbd)" : "var(--bbd)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "18px", color: role === "Leader" ? "var(--ho)" : "var(--bl)",
        flexShrink: 0,
      }}>
        <i className={`ph-fill ${role === "Leader" ? "ph-crown" : "ph-users"}`} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--t)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {team.name}
        </div>
        <div style={{ fontSize: "12px", color: "var(--t2)", marginTop: "2px", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{
            background: role === "Leader" ? "var(--hbg)" : "var(--blb)",
            color: role === "Leader" ? "var(--ho)" : "var(--bl)",
            padding: "1px 7px", borderRadius: "100px", fontSize: "10px", fontWeight: 700,
          }}>
            {role}
          </span>
          <span><i className="ph-fill ph-users" style={{ fontSize: "10px" }} /> {team._count.members} anggota</span>
        </div>
      </div>
      <i className="ph-fill ph-arrow-right" style={{ color: "var(--t3)", fontSize: "16px", flexShrink: 0 }} />
    </div>
  );
}

function EmptyState({
  icon,
  message,
  sub,
  action,
}: {
  icon: string;
  message: string;
  sub: string;
  action?: { label: string; href: string };
}) {
  return (
    <div style={{ textAlign: "center", padding: "32px 16px" }}>
      <div style={{ fontSize: "40px", color: "var(--t4)", marginBottom: "12px" }}>
        <i className={`ph-fill ${icon}`} />
      </div>
      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--t2)", marginBottom: "4px" }}>{message}</div>
      <div style={{ fontSize: "12px", color: "var(--t3)", marginBottom: action ? "16px" : 0 }}>{sub}</div>
      {action && (
        <Link href={action.href}>
          <button className="btn btn-honey btn-sm rounded-full">{action.label}</button>
        </Link>
      )}
    </div>
  );
}

