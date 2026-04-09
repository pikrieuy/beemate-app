"use client";

import { useState } from "react";
import { COMPETITIONS } from "@/lib/data";
import { motion } from "framer-motion";
import { ExpandingSearchDock } from "@/components/ui/ExpandingSearchDock";

export default function CompetitionsPage() {
  const [search, setSearch] = useState("");

  const filtered = COMPETITIONS.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.org.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page on" style={{ minHeight: '100vh', padding: '16px 24px 60px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '48px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 800, margin: 0, color: 'var(--t)' }}>
            Lomba & <span style={{ background: 'linear-gradient(90deg, var(--ho), #ffbe4d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Kompetisi</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--t2)', maxWidth: '600px', lineHeight: 1.6 }}>
            Temukan berbagai lomba nasional hingga internasional terbaru. Segera bentuk timmu dan daftarkan diri sebelum pendaftaran ditutup!
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
            <ExpandingSearchDock
              value={search}
              onChange={setSearch}
              placeholder="Cari nama lomba atau institusi..."
            />
            {search && (
              <span style={{ fontSize: 12, color: 'var(--t3)' }}>
                {filtered.length} hasil untuk &ldquo;{search}&rdquo;
              </span>
            )}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filtered.map((c, i) => (
            <motion.div 
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--bdr)',
                borderRadius: '24px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = c.color;
                e.currentTarget.style.boxShadow = `0 12px 24px ${c.color}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--bdr)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '14px', 
                  background: `${c.color}15`, color: c.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'
                }}>
                  <i className="ph-fill ph-trophy"></i>
                </div>
                <div style={{ background: 'var(--bg)', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, color: 'var(--t2)', border: '1px solid var(--bdr)' }}>
                  {c.deadline}
                </div>
              </div>
              
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--t)' }}>{c.title}</h3>
              <div style={{ fontSize: '14px', color: 'var(--t2)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="ph-fill ph-buildings"></i> {c.org}
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {c.tags.map(tag => (
                  <span key={tag} style={{ background: 'var(--bg)', border: '1px solid var(--bdr)', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', color: 'var(--t3)' }}>
                    {tag}
                  </span>
                ))}
              </div>

              <button className="btn" style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bdr)', color: 'var(--t)', padding: '12px', borderRadius: '12px', fontWeight: 600 }}>
                Lihat Detail
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
