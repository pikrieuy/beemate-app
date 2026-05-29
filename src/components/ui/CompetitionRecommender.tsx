"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getCompetitionRecommendations } from "@/actions";

interface RecommendedCompetition {
  id: string;
  title: string;
  description: string;
  deadline: Date | null;
  reason: string;
}

export function CompetitionRecommender() {
  const [recommendations, setRecommendations] = useState<RecommendedCompetition[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function loadRecommendations() {
    setLoading(true);
    const result = await getCompetitionRecommendations();
    if (result.success && result.data) {
      setRecommendations(result.data);
    }
    setLoaded(true);
    setLoading(false);
  }

  if (!loaded) {
    return (
      <div style={{
        background: "var(--bg2)", border: "1px solid var(--b)",
        borderRadius: "20px", padding: "24px", textAlign: "center",
      }}>
        <div style={{ fontSize: "28px", marginBottom: "12px" }}>🏆</div>
        <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--t)", marginBottom: "8px" }}>
          AI Competition Recommender
        </h3>
        <p style={{ fontSize: "12px", color: "var(--t2)", marginBottom: "16px", lineHeight: 1.6 }}>
          AI akan merekomendasikan kompetisi yang paling cocok berdasarkan skill dan profil kamu
        </p>
        <button
          onClick={loadRecommendations}
          disabled={loading}
          style={{
            padding: "10px 20px", borderRadius: "10px",
            background: "linear-gradient(135deg, #f5a623, #ffc04d)",
            color: "#000", border: "none", fontSize: "13px",
            fontWeight: 700, cursor: "pointer",
          }}
        >
          {loading ? "Menganalisis..." : "✨ Lihat Rekomendasi"}
        </button>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div style={{
        background: "var(--bg2)", border: "1px solid var(--b)",
        borderRadius: "20px", padding: "24px", textAlign: "center",
      }}>
        <p style={{ fontSize: "13px", color: "var(--t2)" }}>
          Belum ada kompetisi yang cocok. Cek lagi nanti!
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: "var(--bg2)", border: "1px solid var(--b)",
      borderRadius: "20px", padding: "24px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <i className="ph-fill ph-trophy" style={{ color: "#f5a623", fontSize: "16px" }} />
        <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--t)", margin: 0 }}>
          Rekomendasi untuk Kamu
        </h3>
        <span style={{
          fontSize: "10px", padding: "2px 8px", borderRadius: "6px",
          background: "rgba(245,166,35,0.1)", color: "#f5a623",
          border: "1px solid rgba(245,166,35,0.2)", fontWeight: 700,
        }}>AI</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <AnimatePresence>
          {recommendations.map((comp, i) => (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/competitions/${comp.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "14px 16px", borderRadius: "12px",
                  background: "var(--bg)", border: "1px solid var(--b)",
                  transition: "border-color 0.15s",
                  cursor: "pointer",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(245,166,35,0.4)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--b)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--t)", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {comp.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--ho)", fontStyle: "italic" }}>
                        💡 {comp.reason}
                      </div>
                    </div>
                    {comp.deadline && (
                      <span style={{
                        fontSize: "10px", fontWeight: 700, color: "var(--t3)",
                        background: "var(--bg2)", padding: "3px 8px", borderRadius: "6px",
                        whiteSpace: "nowrap", flexShrink: 0,
                      }}>
                        {Math.max(0, Math.ceil((new Date(comp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}d left
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
