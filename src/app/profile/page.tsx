"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("portfolio");

  return (
    <div className="page on" style={{ minHeight: '100vh', padding: '0 24px 60px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Hero Banner */}
        <div style={{ 
          height: '240px', 
          borderRadius: '24px', 
          background: 'linear-gradient(135deg, var(--ho), #ffbe4d, var(--bl))',
          position: 'relative',
          marginBottom: '80px'
        }}>
          <div style={{
            position: 'absolute',
            bottom: '-60px',
            left: '40px',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'var(--bg)',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
               width: '100%', height: '100%', borderRadius: '50%',
               background: 'linear-gradient(135deg, #f5a623, #ffc04d)',
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               fontSize: '48px', color: '#fff', fontWeight: 800
            }}>RK</div>
          </div>
          
          <button className="btn btn-dark btn-sm" style={{ position: 'absolute', bottom: '24px', right: '24px' }}>
             <i className="ph-fill ph-pencil-simple"></i> Edit Profile
          </button>
        </div>

        {/* Profile Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--t)', marginBottom: '8px', letterSpacing: '-0.5px' }}>Raka Kusuma</h1>
            <div style={{ fontSize: '16px', color: 'var(--t2)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span><i className="ph-fill ph-student lc"></i> Computer Science</span>
              <span>·</span>
              <span><i className="ph-fill ph-map-pin lc"></i> Bandung (Sem 5)</span>
            </div>

            <p style={{ fontSize: '15px', color: 'var(--t)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '600px' }}>
              Web Developer yang fokus pada ekosistem React dan Next.js. Sangat minat pada pembuatan aplikasi yang punya performa tinggi dan UI/UX interaktif. Selalu open untuk join hackathon!
            </p>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--bdr)' }}>
              <button onClick={() => setActiveTab('portfolio')} style={{ padding: '12px 24px', background: 'transparent', border: 'none', borderBottom: activeTab === 'portfolio' ? '3px solid var(--ho)' : '3px solid transparent', color: activeTab === 'portfolio' ? 'var(--t)' : 'var(--t2)', fontWeight: activeTab === 'portfolio' ? 800 : 500, fontSize: '15px', cursor: 'pointer' }}>Portfolio & Lomba</button>
              <button onClick={() => setActiveTab('reviews')} style={{ padding: '12px 24px', background: 'transparent', border: 'none', borderBottom: activeTab === 'reviews' ? '3px solid var(--ho)' : '3px solid transparent', color: activeTab === 'reviews' ? 'var(--t)' : 'var(--t2)', fontWeight: activeTab === 'reviews' ? 800 : 500, fontSize: '15px', cursor: 'pointer' }}>Reviews (6)</button>
            </div>

            {/* Content Area */}
            {activeTab === 'portfolio' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: '24px', padding: '24px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245,166,35,0.1)', color: 'var(--ho)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}><i className="ph-fill ph-trophy"></i></div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--t)', marginBottom: '4px' }}>Juara 1 Gemastik XVI (Web Dev)</h3>
                      <p style={{ fontSize: '14px', color: 'var(--t2)', marginBottom: '12px' }}>Dikeluarkan oleh Kemendikbud · 2025</p>
                      <button className="btn btn-sm" style={{ background: 'var(--bg)', border: '1px solid var(--bdr)', color: 'var(--t)' }}>Lihat Sertifikat</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <p style={{ color: 'var(--t2)' }}>Belum ada review tambahan yang ditampilkan.</p>
            )}

          </div>

          {/* Stats Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: '24px', padding: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Commitment Score</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '48px', fontWeight: 900, color: 'var(--ho)', lineHeight: 1 }}>4.9</span>
                <span style={{ fontSize: '18px', color: 'var(--t2)', paddingBottom: '6px' }}>/ 5.0</span>
              </div>
              <div style={{ display: 'flex', gap: '4px', color: 'var(--ho)', fontSize: '18px', marginBottom: '16px' }}>
                <i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star-half"></i>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: 1.6 }}>Sangat berkomitmen. Tidak pernah walk-out di pertengahan proyek.</p>
            </div>

            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: '24px', padding: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Top Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['React', 'Next.js', 'Typescript', 'Node.js', 'Problem Solving'].map(sk => (
                  <span key={sk} style={{ background: 'var(--bg)', border: '1px solid var(--bdr)', padding: '6px 12px', borderRadius: '100px', fontSize: '13px', color: 'var(--t)', fontWeight: 600 }}>{sk}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
