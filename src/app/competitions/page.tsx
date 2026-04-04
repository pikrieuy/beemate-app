"use client";

import { COMPETITIONS } from "@/lib/data";

export default function CompetitionsPage() {
  return (
    <div className="page on">
      <div className="shell">
        <aside className="sidebar">
          <div className="sb-section">
            <span className="sb-label">Jenis Lomba</span>
            <div className="sb-list">
              <button className="sbi on">Semua Lomba</button>
              <button className="sbi">Dukungan Universitas</button>
              <button className="sbi">Hackathon</button>
              <button className="sbi">Game Jam</button>
            </div>
          </div>
        </aside>

        <div className="main">
          <div className="page-head">
            <div>
              <div className="page-title">Info Lomba Terkini</div>
              <div className="page-sub">Temukan wadah untuk membuktikan keahlian timmu.</div>
            </div>
            <button className="btn btn-honey btn-md">+ Tambah Info Lomba</button>
          </div>
          
          <div className="grid">
            {COMPETITIONS.map(c => (
              <div key={c.id} className="comp-card cursor-pointer" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${c.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, fontSize: '24px' }}>
                      <i className="ph-fill ph-trophy"></i>
                    </div>
                    <span className="proj-deadline" style={{ background: 'var(--bg5)', padding: '6px 10px', borderRadius: '8px', color: 'var(--t2)' }}>
                      <i className="ph-fill ph-clock"></i> {c.deadline}
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: '19px', fontWeight: '800', lineHeight: 1.3, marginBottom: '6px', color: 'var(--t)' }}>
                    {c.title}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--t2)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="ph-fill ph-buildings"></i> Penyelenggara: <b>{c.org}</b>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    {c.tags.map(t => (
                      <span key={t} style={{ fontSize: '10px', fontWeight: '600', padding: '5px 12px', borderRadius: '20px', background: 'var(--b)', color: 'var(--t2)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  
                  <div style={{ borderTop: '1px solid var(--b)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--t3)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Kategori: <span style={{ color: c.color }}>{c.type}</span>
                    </span>
                    <button className="apply-btn" style={{ background: 'var(--t)', color: 'var(--bg)', border: 'none', padding: '6px 14px' }}>Detail <i className="ph-bold ph-arrow-right"></i></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
