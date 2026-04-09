"use client";

import { MY_TEAMS } from "@/lib/data";
import { motion } from "framer-motion";

export default function MyTeamsPage() {
  return (
    <div className="page on" style={{ minHeight: '100vh', padding: '16px 24px 60px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '48px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 800, margin: 0, color: 'var(--t)' }}>
            Tim <span style={{ background: 'linear-gradient(90deg, var(--bl), #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Saya</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--t2)', maxWidth: '600px', lineHeight: 1.6 }}>
            Kelola tim yang sedang kamu pimpin atau ikuti. Cek status proyek, diskusikan progres, dan manage pembagian tugasmu.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {MY_TEAMS.map((t, i) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--bdr)',
                borderRadius: '24px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--bg)', border: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'var(--t)' }}>
                    <i className="ph-fill ph-users-three"></i>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--t)' }}>{t.title}</h3>
                    <div style={{ fontSize: '14px', color: 'var(--t2)' }}>{t.role}</div>
                  </div>
                </div>
                <div style={{ background: 'var(--bg)', padding: '6px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: 700, color: 'var(--ho)', border: '1px solid rgba(245,166,35,0.2)' }}>
                  {t.status}
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', padding: '16px 20px', borderRadius: '16px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--t2)', fontWeight: 600 }}>Anggota:</span>
                  <div className="av-stack">
                    {t.members.map((m, idx) => (
                      <div key={idx} className="av av-32" style={{ background: `linear-gradient(135deg, var(--ho), #ffc04d)` }}>{m}</div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-dark btn-sm">Chat Tim</button>
                  <button className="btn btn-honey btn-sm">Buka Workspace</button>
                </div>
              </div>
            </motion.div>
          ))}
          
          <div style={{ border: '1px dashed var(--bdr)', borderRadius: '24px', padding: '40px', textAlign: 'center', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity='1'} onMouseLeave={e => e.currentTarget.style.opacity='0.7'}>
            <div style={{ fontSize: '32px', color: 'var(--t3)', marginBottom: '12px' }}><i className="ph-fill ph-plus-circle"></i></div>
            <div style={{ fontWeight: 700, color: 'var(--t)', marginBottom: '4px' }}>Bentuk Tim Baru</div>
            <div style={{ fontSize: '14px', color: 'var(--t2)' }}>Buat proyek dan mulai cari orang</div>
          </div>
        </div>
      </div>
    </div>
  );
}
