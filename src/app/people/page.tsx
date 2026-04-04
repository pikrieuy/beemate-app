"use client";

import { useState } from "react";
import { PEOPLE } from "@/lib/data";
import { PersonCard } from "@/components/cards/PersonCard";

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
              <div className="page-title">Browse People</div>
              <div className="page-sub" id="people-count-label">{filtered.filter(p => p.status === 'open').length} orang sedang open to team</div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <div className="search-box" style={{ width: "250px" }}>
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="Cari skill atau nama..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                />
              </div>
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
