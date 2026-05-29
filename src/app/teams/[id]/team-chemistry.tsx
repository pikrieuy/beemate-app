"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTeamChemistry } from "@/actions";

interface Props {
  teamId: string;
}

interface ChemistryData {
  overallScore: number;
  breakdown: {
    roleBalance: number;
    skillDiversity: number;
    skillCoverage: number;
    teamSize: number;
  };
  strengths: string[];
  weaknesses: string[];
  suggestion: string;
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--t2)" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: 800, color }}>{value}%</span>
      </div>
      <div style={{ height: "8px", borderRadius: "4px", background: "var(--bg3)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ height: "100%", borderRadius: "4px", background: color }}
        />
      </div>
    </div>
  );
}

export function TeamChemistry({ teamId }: Props) {
  const [data, setData] = useState<ChemistryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const result = await getTeamChemistry(teamId);
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error ?? "Gagal memuat data");
      }
      setLoading(false);
    }
    load();
  }, [teamId]);

  if (loading) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        <div style={{
          width: "40px", height: "40px", margin: "0 auto 16px",
          border: "3px solid var(--b)", borderTopColor: "#f5a623",
          borderRadius: "50%", animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ color: "var(--t2)", fontSize: "13px" }}>Menganalisis komposisi tim...</p>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--t2)" }}>
        <i className="ph-fill ph-warning" style={{ fontSize: "32px", marginBottom: "12px", display: "block" }} />
        {error || "Data tidak tersedia"}
      </div>
    );
  }

  const scoreColor = data.overallScore >= 75 ? "#2dd67a" : data.overallScore >= 50 ? "#f5a623" : "#ef4444";

  return (
    <div style={{
      background: "var(--bg2)", border: "1px solid var(--b)",
      borderRadius: "24px", padding: "32px",
    }}>
      {/* Header + Overall Score */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--t)", marginBottom: "4px" }}>
            <i className="ph-fill ph-chart-pie" style={{ marginRight: "8px", color: "#f5a623" }} />
            Team Chemistry Score
          </h2>
          <p style={{ fontSize: "13px", color: "var(--t2)" }}>
            Analisis AI terhadap komposisi dan keseimbangan tim
          </p>
        </div>

        {/* Big Score Circle */}
        <div style={{
          width: "90px", height: "90px", borderRadius: "50%",
          background: `conic-gradient(${scoreColor} ${data.overallScore * 3.6}deg, var(--bg3) 0deg)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column",
          }}>
            <span style={{ fontSize: "24px", fontWeight: 900, color: scoreColor }}>{data.overallScore}</span>
            <span style={{ fontSize: "9px", color: "var(--t3)", fontWeight: 600 }}>/ 100</span>
          </div>
        </div>
      </div>

      {/* Breakdown Bars */}
      <div style={{ marginBottom: "28px" }}>
        <ScoreBar label="Role Balance (Hacker + Hustler + Hipster)" value={data.breakdown.roleBalance} color="#5b9cf6" />
        <ScoreBar label="Skill Diversity" value={data.breakdown.skillDiversity} color="#a78bfa" />
        <ScoreBar label="Skill Coverage (Tech + Business + Design)" value={data.breakdown.skillCoverage} color="#2dd67a" />
        <ScoreBar label="Team Size (optimal: 3-5)" value={data.breakdown.teamSize} color="#f5a623" />
      </div>

      {/* Strengths & Weaknesses */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        {/* Strengths */}
        <div style={{
          padding: "16px", borderRadius: "14px",
          background: "rgba(45,214,122,0.05)", border: "1px solid rgba(45,214,122,0.2)",
        }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#2dd67a", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <i className="ph-fill ph-check-circle" style={{ marginRight: "4px" }} /> Kekuatan
          </div>
          {data.strengths.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "var(--t2)", lineHeight: 1.8 }}>
              {data.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          ) : (
            <p style={{ fontSize: "12px", color: "var(--t3)", margin: 0 }}>Belum terdeteksi</p>
          )}
        </div>

        {/* Weaknesses */}
        <div style={{
          padding: "16px", borderRadius: "14px",
          background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)",
        }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#ef4444", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <i className="ph-fill ph-warning" style={{ marginRight: "4px" }} /> Perlu Ditingkatkan
          </div>
          {data.weaknesses.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "var(--t2)", lineHeight: 1.8 }}>
              {data.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          ) : (
            <p style={{ fontSize: "12px", color: "var(--t3)", margin: 0 }}>Tidak ada kelemahan terdeteksi 🎉</p>
          )}
        </div>
      </div>

      {/* AI Suggestion */}
      <div style={{
        padding: "16px 20px", borderRadius: "14px",
        background: "rgba(245,166,35,0.05)", border: "1px solid rgba(245,166,35,0.2)",
        display: "flex", alignItems: "flex-start", gap: "12px",
      }}>
        <i className="ph-fill ph-lightbulb" style={{ fontSize: "18px", color: "#f5a623", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ho)", marginBottom: "4px" }}>Saran AI</div>
          <p style={{ fontSize: "13px", color: "var(--t2)", margin: 0, lineHeight: 1.6 }}>{data.suggestion}</p>
        </div>
      </div>
    </div>
  );
}
