"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    { id: 'account', label: 'Akun & Profil', icon: 'ph-user' },
    { id: 'appearance', label: 'Tampilan', icon: 'ph-palette' },
    { id: 'notifications', label: 'Notifikasi', icon: 'ph-bell' },
    { id: 'privacy', label: 'Privasi & Keamanan', icon: 'ph-shield-check' }
  ];

  return (
    <div className="page on" style={{ minHeight: '100vh', padding: '16px 24px 60px' }}>
      <div className="shell" style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* Settings Sidebar */}
        <div className="sidebar" style={{ width: '300px', flexShrink: 0 }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--t)', marginBottom: '24px' }}>Setelan</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '16px 20px', borderRadius: '16px', border: 'none',
                  background: activeTab === tab.id ? 'var(--bg)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--t)' : 'var(--t2)',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: '15px', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s',
                  boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                <i className={`ph-fill ${tab.icon}`} style={{ fontSize: '20px', color: activeTab === tab.id ? 'var(--ho)' : 'inherit' }}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sign Out */}
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--b)' }}>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '16px 20px', borderRadius: '16px', border: 'none',
                background: 'transparent',
                color: 'var(--rd)',
                fontWeight: 600, fontSize: '15px', cursor: 'pointer',
                textAlign: 'left', width: '100%',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--rdb)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <i className="ph-fill ph-sign-out" style={{ fontSize: '20px' }}></i>
              Sign Out
            </button>
          </div>
        </div>

        {/* Content Pane */}
        <div className="main" style={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: '24px', padding: '40px' }}
            >
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--t)', marginBottom: '8px' }}>
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p style={{ color: 'var(--t2)', fontSize: '14px', marginBottom: '40px' }}>Kelola preferensi sistem dan data personal kamu di panel ini.</p>

              {activeTab === 'account' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t)' }}>Nama Lengkap</label>
                    <input type="text" defaultValue="Raka Kusuma" style={{ background: 'var(--bg)', border: '1px solid var(--bdr)', padding: '16px', borderRadius: '12px', color: 'var(--t)', fontSize: '15px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--t)' }}>Email Binus</label>
                    <input type="email" defaultValue="raka.kusuma@binus.ac.id" disabled style={{ background: 'var(--bg)', border: '1px solid var(--bdr)', padding: '16px', borderRadius: '12px', color: 'var(--t2)', fontSize: '15px', opacity: 0.7 }} />
                  </div>
                  <button className="btn btn-honey btn-md" style={{ alignSelf: 'flex-start', marginTop: '16px' }}>Simpan Perubahan</button>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', background: 'var(--bg)', border: '1px solid var(--bdr)', borderRadius: '16px' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--t)', marginBottom: '4px' }}>Tema Gelap (Dark Mode)</div>
                      <div style={{ fontSize: '13px', color: 'var(--t2)' }}>Ubah seluruh tampilan web ke warna gelap.</div>
                    </div>
                     <span style={{ fontSize: '24px', color: 'var(--ho)' }}><i className="ph-fill ph-moon"></i></span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--t3)' }}>Untuk mengubah tema langsung, gunakan tombol Matahari/Bulan di Navbar atas layar.</p>
                </div>
              )}
              
              {(activeTab === 'notifications' || activeTab === 'privacy') && (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--t3)', border: '1px dashed var(--bdr)', borderRadius: '16px' }}>
                  <i className="ph-fill ph-wrench" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
                  <div>Panel ini sedang dalam tahap pengembangan.</div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
