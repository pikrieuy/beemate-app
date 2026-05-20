"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Team {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  _count?: { members: number };
}

interface Props {
  asLeader: Team[];
  asMember: Team[];
}

export function MyTeamsClient({ asLeader, asMember }: Props) {
  const router = useRouter();
  const allTeams = [
    ...asLeader.map((t) => ({ ...t, role: "Leader" as const })),
    ...asMember.map((t) => ({ ...t, role: "Member" as const })),
  ];

  return (
    <div className="page on" style={{ minHeight: "100vh", padding: "16px 24px 60px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <h1 style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 800, margin: "0 0 8px", color: "var(--t)",
          }}>
            Tim{" "}
            <span style={{
              background: "linear-gradient(90deg, var(--bl), #93c5fd)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Saya
            </span>
          </h1>
          <p style={{ fontSize: "14px", color: "var(--t2)", margin: 0 }}>
            {allTeams.length > 0
              ? `${asLeader.length} tim dipimpin · ${asMember.length} tim diikuti`
              : "Kamu belum bergabung ke tim manapun"}
          </p>
        </div>

        {/* Teams list */}
        {allTeams.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {allTeams.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => router.push(`/teams/${t.id}`)}
                style={{
                  background: "var(--bg2)", border: "1px solid var(--b)",
                  borderRadius: "18px", padding: "20px 24px",
                  display: "flex", alignItems: "center", gap: "18px",
                  cursor: "pointer", transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--hbd)";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--b)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                {/* Icon */}
                <div style={{
                  width: "48px", height: "48px", borderRadius: "14px",
                  background: t.role === "Leader" ? "var(--hbg)" : "var(--blb)",
                  border: `1px solid ${t.role === "Leader" ? "var(--hbd)" : "var(--bbd)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px", color: t.role === "Leader" ? "var(--ho)" : "var(--bl)",
                  flexShrink: 0,
                }}>
                  <i className={`ph-fill ${t.role === "Leader" ? "ph-crown" : "ph-users-three"}`} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 800, color: "var(--t)" }}>
                      {t.name}
                    </span>
                    <span style={{
                      fontSize: "10px", fontWeight: 700, padding: "2px 8px",
                      borderRadius: "6px", textTransform: "uppercase", letterSpacing: "0.5px",
                      background: t.role === "Leader" ? "var(--hbg)" : "var(--blb)",
                      color: t.role === "Leader" ? "var(--ho)" : "var(--bl)",
                      border: `1px solid ${t.role === "Leader" ? "var(--hbd)" : "var(--bbd)"}`,
                    }}>
                      {t.role}
                    </span>
                  </div>
                  {t.description && (
                    <p style={{
                      fontSize: "12px", color: "var(--t2)", margin: 0,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {t.description}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <i className="ph-fill ph-arrow-right" style={{ color: "var(--t3)", fontSize: "16px", flexShrink: 0 }} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: "60px 24px",
            border: "1px dashed var(--b)", borderRadius: "20px",
          }}>
            <i className="ph-fill ph-users-three" style={{ fontSize: "52px", color: "var(--t4)", marginBottom: "14px", display: "block" }} />
            <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--t)", marginBottom: "6px" }}>
              Belum ada tim
            </p>
            <p style={{ fontSize: "13px", color: "var(--t3)", marginBottom: "20px" }}>
              Buat tim baru atau tunggu undangan dari orang lain
            </p>
            <button
              className="btn btn-honey btn-md"
              onClick={() => router.push("/teams/create")}
            >
              <i className="ph-fill ph-plus" /> Buat Tim Baru
            </button>
          </div>
        )}

        {/* CTA buat tim baru */}
        {allTeams.length > 0 && (
          <div
            onClick={() => router.push("/teams/create")}
            style={{
              marginTop: "14px", border: "1px dashed var(--b)", borderRadius: "18px",
              padding: "20px", textAlign: "center", cursor: "pointer",
              opacity: 0.7, transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
          >
            <i className="ph-fill ph-plus-circle" style={{ fontSize: "24px", color: "var(--t3)", marginBottom: "6px", display: "block" }} />
            <div style={{ fontWeight: 700, color: "var(--t)", fontSize: "13px" }}>Bentuk Tim Baru</div>
          </div>
        )}
      </div>
    </div>
  );
}
