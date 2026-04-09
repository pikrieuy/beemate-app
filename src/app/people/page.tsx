"use client";

import { useState } from "react";
import { PEOPLE } from "@/lib/data";
import { PersonCard } from "@/components/cards/PersonCard";
import { ExpandingSearchDock } from "@/components/ui/ExpandingSearchDock";

export default function PeoplePage() {
  const [search, setSearch] = useState("");
  const [filterMajor, setFilterMajor] = useState("all");

  const q = search.toLowerCase();
  const filtered = PEOPLE.filter(p => {
    const matchMajor = filterMajor === "all" || p.major === filterMajor;
    const matchSearch = q === "" || 
      p.n.toLowerCase().includes(q) || 
      p.skills.join(" ").toLowerCase().includes(q);
    return matchMajor && matchSearch;
  });

  return (
    <div className="page on">
      <div className="shell">
        <aside className="sidebar">
          <div className="sb-section">
            <span className="sb-label">Jurusan Unggulan</span>
            <div className="sb-list">
              <button className={`sbi ${filterMajor === 'all' ? 'on' : ''}`} onClick={() => setFilterMajor('all')}>Semua</button>
              <button className={`sbi ${filterMajor === 'Computer Science' ? 'on' : ''}`} onClick={() => setFilterMajor('Computer Science')}>Computer Science</button>
              <button className={`sbi ${filterMajor === 'Visual Communication Design' ? 'on' : ''}`} onClick={() => setFilterMajor('Visual Communication Design')}>DKV</button>
              <button className={`sbi ${filterMajor === 'Business Management' ? 'on' : ''}`} onClick={() => setFilterMajor('Business Management')}>Business</button>
            </div>
          </div>
        </aside>

        <div className="main">
          <div className="page-head">
            <div>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--t)' }}>
                Browse <span style={{ background: 'linear-gradient(90deg, var(--bl), #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>People</span>
              </h1>
              <div className="page-sub" id="people-count-label" style={{ fontSize: '15px' }}>{filtered.filter(p => p.status === 'open').length} orang sedang open to team</div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <ExpandingSearchDock
                value={search}
                onChange={setSearch}
                placeholder="Cari skill atau nama..."
              />
            </div>
          </div>
          
          <div className="seg-bar">
            <button className="seg on">Rekomendasi</button>
            <button className="seg">Terbaru Hadir</button>
            <button className="seg">Score Tertinggi</button>
          </div>

          <div className="grid people-g" id="people-grid">
            {filtered.length > 0 ? (
              filtered.map(p => (
                <PersonCard 
                  key={p.id} 
                  person={p} 
                  onInvite={(e) => { e.stopPropagation(); alert(`Invite ${p.n} via Shadcn Modal`); }} 
                />
              ))
            ) : (
               <div className="empty-state">
                  <div className="es-title">Tidak ada Binusian yang cocok</div>
                  <div className="es-actions">
                    <button className="btn btn-honey btn-sm" onClick={() => {setFilterMajor('all');setSearch('');}}>
                      <i className="ph-fill ph-x-circle"></i> Reset Pencarian
                    </button>
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
