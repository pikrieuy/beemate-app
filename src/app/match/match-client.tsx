"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface MatchResult {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  skills: string[];
  title: string | null;
  similarity: number;
  reason: string;
}

const ROLE_STYLES: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  Hacker: { bg: "rgba(91,156,246,.15)", text: "#5b9cf6", border: "rgba(91,156,246,.3)", icon: "ph-code" },
  Hustler: { bg: "rgba(45,214,122,.15)", text: "#2dd67a", border: "rgba(45,214,122,.3)", icon: "ph-briefcase" },
  Hipster: { bg: "rgba(167,139,250,.15)", text: "#a78bfa", border: "rgba(167,139,250,.3)", icon: "ph-paint-brush" },
};

export function MatchClient() {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function findMatches() {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Find matches directly (no embedding step needed)
      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 5 }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mencari match");
        return;
      }

      setMatches(data.data ?? []);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page on">
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px", paddingTop: "20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🐝✨</div>
          <h1 style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "clamp(28px, 5vw, 40px)",
            fontWeight: 900,
            margin: "0 0 12px 0",
            lineHeight: 1.2,
          }}>
            <span style={{
              backgroundImage: "linear-gradient(135deg, #f5a623, #ffc04d, #f5a623)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}>
              BeeMatch AI
            </span>
          </h1>
          <p style={{ fontSize: "15px", color: "var(--t2)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
            AI menganalisis profil kamu dan menemukan orang yang paling cocok jadi tim — berdasarkan skill komplementer, bukan sekadar kesamaan.
          </p>
        </div>

        {/* CTA Button */}
        {!loading && (
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <button
              onClick={findMatches}
              style={{
                background: "linear-gradient(135deg, #f5a623, #ffc04d)",
                color: "#000",
                border: "none",
                padding: "14px 32px",
                borderRadius: "var(--r-pill)",
                fontSize: "15px",
                fontWeight: 800,
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 20px rgba(245, 166, 35, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(245, 166, 35, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(245, 166, 35, 0.3)";
              }}
            >
              <i className="ph-fill ph-sparkle" style={{ marginRight: "8px" }} />
              {hasSearched ? "Cari Lagi" : "Find My Dream Team"}
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{
              width: "48px", height: "48px", margin: "0 auto 16px",
              border: "3px solid var(--b)", borderTopColor: "#f5a623",
              borderRadius: "50%", animation: "spin 0.8s linear infinite",
            }} />
            <p style={{ color: "var(--t2)", fontSize: "14px" }}>
              AI sedang menganalisis profil dan mencari match terbaik...
            </p>
          </div>
        )}

        {/* Error / Incomplete Profile */}
        {error && (
          <div style={{
            background: "var(--bg2)",
            border: "1px solid rgba(239,68,68,0.4)",
            borderRadius: "20px",
            padding: "36px 24px",
            textAlign: "center",
            marginBottom: "24px"
          }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "16px",
              background: "rgba(239,68,68,.15)", color: "#ef4444",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px", margin: "0 auto 16px"
            }}>
              <i className="ph-fill ph-warning-circle" />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--t)", marginBottom: "8px" }}>
              Profil BeeMatch Belum Aktif
            </h3>
            <p style={{ color: "var(--t2)", fontSize: "14px", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto 24px" }}>
              {typeof error === "string" && error.includes("profil") ? error : "Sistem tidak dapat mencocokkan Anda karena data profil/skill belum lengkap. Silakan lengkapi profil BeeMatch Anda terlebih dahulu."}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/settings" style={{ textDecoration: "none" }}>
                <button className="btn btn-honey rounded-full">
                  Update Profil BeeMatch
                </button>
              </Link>
              <Link href="/dashboard" style={{ textDecoration: "none" }}>
                <button className="btn rounded-full" style={{ background: "var(--bg3)", border: "1px solid var(--b)", color: "var(--t)" }}>
                  Kembali ke Dashboard
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && matches.length > 0 && (
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              marginBottom: "20px",
            }}>
              <i className="ph-fill ph-lightning" style={{ color: "#f5a623" }} />
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--t2)", textTransform: "uppercase", letterSpacing: "1px" }}>
                Top {matches.length} Matches untuk Kamu
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <AnimatePresence>
                {matches.map((match, i) => (
                  <MatchCard key={match.id} match={match} index={i} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* No results */}
        {!loading && hasSearched && matches.length === 0 && !error && (
          <div style={{
            textAlign: "center", padding: "60px 24px",
            background: "var(--bg2)", border: "1px dashed var(--b)", borderRadius: "20px",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
            <p style={{ color: "var(--t2)", fontSize: "14px" }}>
              Belum cukup user dengan profil lengkap untuk matching. Ajak teman-teman kamu join BeeMate!
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function MatchCard({ match, index }: { match: MatchResult; index: number }) {
  const roleStyle = ROLE_STYLES[match.title ?? ""] ?? { bg: "rgba(255,255,255,.08)", text: "var(--t2)", border: "var(--b)", icon: "ph-user" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Link href={`/profile/${match.id}`} style={{ textDecoration: "none" }}>
        <div style={{
          background: "var(--bg2)",
          border: `1px solid ${roleStyle.border}`,
          borderRadius: "var(--r-pill)",
          padding: "20px",
          display: "flex",
          gap: "16px",
          alignItems: "flex-start",
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "pointer",
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 8px 24px ${roleStyle.bg}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* Avatar */}
          <div style={{ flexShrink: 0 }}>
            {match.image ? (
              <img
                src={match.image}
                alt={match.name || "User"}
                style={{
                  width: "52px", height: "52px", borderRadius: "var(--r-pill)",
                  objectFit: "cover", border: `2px solid ${roleStyle.border}`,
                }}
              />
            ) : (
              <div style={{
                width: "52px", height: "52px", borderRadius: "var(--r-pill)",
                background: `linear-gradient(135deg, ${roleStyle.text}, ${roleStyle.border})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", fontWeight: 900, color: "#fff",
              }}>
                {(match.name ?? "?")[0]?.toUpperCase()}
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--t)", margin: 0 }}>
                {match.name || "No Name"}
              </h3>
              {match.title && (
                <span style={{
                  fontSize: "11px", fontWeight: 700,
                  background: roleStyle.bg, color: roleStyle.text,
                  border: `1px solid ${roleStyle.border}`,
                  padding: "2px 8px", borderRadius: "100px",
                  display: "inline-flex", alignItems: "center", gap: "4px",
                }}>
                  <i className={`ph-fill ${roleStyle.icon}`} style={{ fontSize: "10px" }} />
                  {match.title}
                </span>
              )}
              <span style={{
                fontSize: "11px", fontWeight: 700,
                background: "rgba(245,166,35,.15)", color: "#f5a623",
                border: "1px solid rgba(245,166,35,.3)",
                padding: "2px 8px", borderRadius: "100px",
              }}>
                {match.similarity}% match
              </span>
            </div>

            {/* AI Reason */}
            <p style={{
              fontSize: "13px", color: "var(--t2)", margin: "0 0 10px 0",
              lineHeight: 1.5, fontStyle: "italic",
            }}>
              💡 {match.reason}
            </p>

            {/* Skills */}
            {match.skills.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {match.skills.slice(0, 4).map((skill) => (
                  <span key={skill} style={{
                    background: "var(--bg3)", border: "1px solid var(--b)",
                    padding: "2px 8px", borderRadius: "100px",
                    fontSize: "11px", fontWeight: 600, color: "var(--t3)",
                  }}>
                    {skill}
                  </span>
                ))}
                {match.skills.length > 4 && (
                  <span style={{
                    fontSize: "11px", color: "var(--t3)", padding: "2px 4px",
                  }}>
                    +{match.skills.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

