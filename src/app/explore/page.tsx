"use client";

import { useState } from "react";
import { PROJECTS } from "@/lib/data";
import { ProjectCard } from "@/components/cards/ProjectCard";

export default function ExplorePage() {
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("Apply click - to be connected to Shadcn Dialog");
  };

  const q = search.toLowerCase();
  const filtered = PROJECTS.filter(p => {
    const matchType = filterType === "all" || p.type === filterType;
    const matchSearch = q === "" || 
      p.title.toLowerCase().includes(q) || 
      p.desc.toLowerCase().includes(q) || 
      p.needs.join(" ").toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  return (
    <div className="page on">
      <div className="shell">
        <aside className="sidebar">
          <div className="sb-section">
            <span className="sb-label">Tipe Proyek</span>
            <div className="sb-list">
              <button className={`sbi ${filterType === 'all' ? 'on' : ''}`} onClick={() => setFilterType('all')}>
                <span className="sbi-l">
                  <span className="sbi-icon" style={{ background: "rgba(255,255,255,.08)" }}><i className="ph-fill ph-squares-four"></i></span>
                  Semua
                </span>
                <span className="sbi-count">9</span>
              </button>
              <button className={`sbi ${filterType === 'Hackathon' ? 'on' : ''}`} onClick={() => setFilterType('Hackathon')}>
                <span className="sbi-l">
                  <span className="sbi-icon" style={{ background: "rgba(245,166,35,.15)", color: "#f5a623" }}><i className="ph-fill ph-lightning"></i></span>
                  Hackathon
                </span>
                <span className="sbi-count">3</span>
              </button>
              <button className={`sbi ${filterType === 'UI/UX' ? 'on' : ''}`} onClick={() => setFilterType('UI/UX')}>
                <span className="sbi-l">
                  <span className="sbi-icon" style={{ background: "rgba(167,139,250,.15)", color: "#a78bfa" }}><i className="ph-fill ph-paint-brush"></i></span>
                  UI/UX
                </span>
                <span className="sbi-count">2</span>
              </button>
              <button className={`sbi ${filterType === 'Business Plan' ? 'on' : ''}`} onClick={() => setFilterType('Business Plan')}>
                <span className="sbi-l">
                  <span className="sbi-icon" style={{ background: "rgba(45,214,122,.15)", color: "#2dd67a" }}><i className="ph-fill ph-chart-bar"></i></span>
                  Business Plan
                </span>
                <span className="sbi-count">2</span>
              </button>
              <button className={`sbi ${filterType === 'Research' ? 'on' : ''}`} onClick={() => setFilterType('Research')}>
                <span className="sbi-l">
                  <span className="sbi-icon" style={{ background: "rgba(91,156,246,.15)", color: "#5b9cf6" }}><i className="ph-fill ph-flask"></i></span>
                  Research
                </span>
                <span className="sbi-count">2</span>
              </button>
              <button className={`sbi ${filterType === 'Startup' ? 'on' : ''}`} onClick={() => setFilterType('Startup')}>
                <span className="sbi-l">
                  <span className="sbi-icon" style={{ background: "rgba(251,146,60,.15)", color: "#fb923c" }}><i className="ph-fill ph-rocket-launch"></i></span>
                  Startup
                </span>
                <span className="sbi-count">1</span>
              </button>
            </div>
          </div>
        </aside>

        <div className="main">
          <div className="page-head">
            <div>
              <div className="page-title">Open Projects</div>
              <div className="page-sub" id="proj-count-label">{filtered.length} proyek aktif mencari anggota</div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <div className="search-box" style={{ width: "205px" }}>
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="Cari proyek..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                />
              </div>
              <button className="btn btn-honey btn-md">+ Post Project</button>
            </div>
          </div>
          
          <div className="seg-bar">
            <button className="seg on">Terbaru</button>
            <button className="seg">Deadline Terdekat</button>
            <button className="seg">Paling Diminati</button>
          </div>

          <div className="grid" id="proj-grid">
            {filtered.length > 0 ? (
              filtered.map(p => (
                <ProjectCard 
                  key={p.id} 
                  project={p} 
                  onClick={() => alert(`Details for ${p.title}`)} 
                  onApply={handleApply} 
                />
              ))
            ) : (
               <div className="empty-state">
                  <div className="es-title">Belum ada proyek yang cocok</div>
                  <div className="es-sub">Coba ubah filter atau kata kunci pencarian.</div>
                  <div className="es-actions">
                    <button className="btn btn-honey btn-sm" onClick={() => {setFilterType('all');setSearch('');}}>
                      <i className="ph-fill ph-funnel"></i> Reset Filter
                    </button>
                    <button className="btn btn-dark btn-sm">
                      <i className="ph-fill ph-plus"></i> Buat Proyek Baru
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
