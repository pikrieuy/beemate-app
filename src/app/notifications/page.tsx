"use client";

import { motion } from "framer-motion";

export default function NotificationsPage() {
  const notifs = [
    { id: 1, type: 'invite', icon: 'ph-handshake', color: 'var(--bl)', title: 'Undangan Tim Baru', desc: 'Team Nexus mengundangmu sebagai Frontend Developer.', time: '10 menit yang lalu', unread: true },
    { id: 2, type: 'accept', icon: 'ph-check-circle', color: 'var(--gn)', title: 'Aplikasi Diterima!', desc: 'Maya B. menerima aplikasimu untuk tim BNCC Business Case.', time: '2 jam yang lalu', unread: true },
    { id: 3, type: 'system', icon: 'ph-trend-up', color: 'var(--ho)', title: 'Commitment Score Naik', desc: 'Skor komitmenmu naik menjadi 4.9 setelah menyelesaikan proyek Hackathon.', time: 'Kemarin', unread: false },
    { id: 4, type: 'system', icon: 'ph-warning-circle', color: 'var(--t3)', title: 'Deadline Mendekat', desc: 'Lomba COMPFEST 16 akan ditutup pendaftarannya dalam 3 hari.', time: '2 hari yang lalu', unread: false },
  ];

  return (
    <div className="page on" style={{ minHeight: '100vh', padding: '16px 24px 60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '36px', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--t)' }}>Notifikasi</h1>
            <p style={{ fontSize: '15px', color: 'var(--t2)', margin: 0 }}>Pantau semua undangan tim dan update terbarumu di sini.</p>
          </div>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--bl)', fontWeight: 700, cursor: 'pointer' }}>Tandai semua dibaca</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notifs.map((n, i) => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: n.unread ? 'var(--bg2)' : 'var(--bg)',
                border: '1px solid var(--bdr)',
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {n.unread && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--bl)' }} />}
              
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${n.color}15`, color: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                <i className={`ph-fill ${n.icon}`}></i>
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--t)' }}>{n.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--t3)', fontWeight: 600 }}>{n.time}</div>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--t2)', lineHeight: 1.5, marginBottom: n.type === 'invite' ? '16px' : 0 }}>
                  {n.desc}
                </div>
                
                {n.type === 'invite' && (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-honey btn-sm">Terima</button>
                    <button className="btn btn-dark btn-sm">Tolak</button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
