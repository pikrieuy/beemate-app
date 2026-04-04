"use client";

import { MY_TEAMS } from "@/lib/data";

export default function MyTeamsPage() {
  return (
    <div className="page on">
      <div className="shell">
        <aside className="sidebar">
          <div className="sb-section">
            <span className="sb-label">Manajemen Tim</span>
            <div className="sb-list">
              <button className="sbi on">Tim Aktif</button>
              <button className="sbi">Riwayat Tim</button>
              <button className="sbi">Undangan</button>
            </div>
          </div>
        </aside>

        <div className="main">
          <div className="page-head">
            <div>
              <div className="page-title">Tim Saya</div>
              <div className="page-sub">Manajemen kolaborasi bersama rekan-rekanmu.</div>
            </div>
            <button className="btn btn-honey btn-md">+ Bentuk Tim Baru</button>
          </div>
          
          <div className="grid">
            {MY_TEAMS.map(t => (
              <div key={t.id} className="team-card cursor-pointer">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>{t.title}</h3>
                  <span className="bdg bdg-g">{t.status}</span>
                </div>
                <div style={{ fontSize: "13px", color: "var(--t2)", marginBottom: "20px" }}>
                  Peranmu: <strong>{t.role}</strong>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                   <div className="av-stack" style={{ margin: 0 }}>
                     {t.members.map((m, i) => (
                        <div key={i} className="av av-32" style={{ background: "var(--bg5)" }}>{m}</div>
                     ))}
                   </div>
                   <span style={{ fontSize: "11px", color: "var(--t3)", marginLeft: "8px" }}>{t.members.length} Anggota</span>
                </div>
                <div className="proj-foot" style={{ marginTop: "24px", justifyContent: "space-between" }}>
                  <button className="btn btn-dark btn-sm">Workspace Tim</button>
                  <button className="apply-btn" style={{ background: "rgba(249,107,107,0.1)", color: "var(--rd)" }}>Tinggalkan</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
