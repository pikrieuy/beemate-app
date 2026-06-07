"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: "easeOut" as const },
});

export default function PresentasiPage() {
  return (
    <div style={{ minHeight: "100vh", padding: "48px 24px 80px", background: "var(--bg)" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>

        {/* ── HERO ── */}
        <motion.div {...fadeUp(0)} style={{ textAlign: "center", marginBottom: "72px" }}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>🐝</div>
          <h1 style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "clamp(36px, 6vw, 56px)",
            fontWeight: 900, color: "var(--t)", lineHeight: 1.1, marginBottom: "16px",
          }}>
            Selamat datang di{" "}
            <span style={{
              backgroundImage: "linear-gradient(90deg, var(--ho), #ffc04d)",
              WebkitBackgroundClip: "text", backgroundClip: "text",
              color: "transparent", WebkitTextFillColor: "transparent",
            }}>BeeMate</span>
          </h1>
          <p style={{ fontSize: "18px", color: "var(--t2)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
            Platform untuk mahasiswa yang ingin menemukan teman tim yang tepat — untuk kompetisi, hackathon, dan proyek bersama.
          </p>
        </motion.div>

        {/* ── MASALAH ── */}
        <motion.div {...fadeUp(0.1)} style={{ marginBottom: "56px" }}>
          <SectionLabel>Masalah yang Kami Selesaikan</SectionLabel>
          <div style={{
            background: "linear-gradient(135deg, var(--bg2), var(--bg3))",
            border: "1px solid var(--b)", borderRadius: "24px", padding: "32px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "-30px", right: "-30px",
              width: "160px", height: "160px",
              background: "radial-gradient(circle, rgba(249,107,107,0.1) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{ fontSize: "32px", marginBottom: "16px" }}>😩</div>
            <p style={{ fontSize: "16px", color: "var(--t)", lineHeight: 1.8, maxWidth: "680px" }}>
              Bayangkan kamu mahasiswa yang mau ikut lomba bisnis bergengsi bulan depan.
              Kamu butuh tim — satu yang jago coding, satu yang bisa desain, satu yang paham bisnis.
              Tapi kamu tidak tahu siapa yang bisa diajak. Grup WA angkatan ramai tapi tidak ada yang respon.
            </p>
            <div style={{
              marginTop: "20px", padding: "16px 20px",
              background: "rgba(249,107,107,0.08)", border: "1px solid rgba(249,107,107,0.2)",
              borderRadius: "14px", fontSize: "15px", fontWeight: 700, color: "var(--rd)",
            }}>
              Akhirnya ikut seadanya — atau malah tidak ikut sama sekali. 😔
            </div>
          </div>
        </motion.div>

        {/* ── SOLUSI ── */}
        <motion.div {...fadeUp(0.15)} style={{ marginBottom: "56px" }}>
          <SectionLabel>Solusinya</SectionLabel>
          <div style={{
            background: "var(--hbg)", border: "1px solid var(--hbd)",
            borderRadius: "24px", padding: "32px",
          }}>
            <div style={{ fontSize: "32px", marginBottom: "16px" }}>💡</div>
            <p style={{ fontSize: "16px", color: "var(--t)", lineHeight: 1.8 }}>
              <strong>BeeMate</strong> adalah platform web yang mempertemukan mahasiswa berdasarkan keahlian dan minat mereka.
              Analoginya seperti <strong>LinkedIn, tapi khusus untuk cari tim lomba kampus.</strong>
            </p>
            <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a href="https://beemate-app.vercel.app" target="_blank" rel="noopener noreferrer">
                <button className={buttonVariants({ variant: "honey" })}>
                  <i className="ph-fill ph-arrow-square-out" /> Buka Platform
                </button>
              </a>
            </div>
          </div>
        </motion.div>

        {/* ── TIPE PENGGUNA ── */}
        <motion.div {...fadeUp(0.2)} style={{ marginBottom: "56px" }}>
          <SectionLabel>Siapa Penggunanya?</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            {[
              { emoji: "🔧", label: "Hacker", desc: "Developer, programmer, data scientist", color: "var(--bl)", bg: "var(--blb)", border: "var(--bbd)" },
              { emoji: "💼", label: "Hustler", desc: "Business, marketing, product manager", color: "var(--gn)", bg: "var(--gnb)", border: "var(--gbd)" },
              { emoji: "🎨", label: "Hipster", desc: "Desainer, UI/UX, konten kreator", color: "var(--pu)", bg: "var(--pub)", border: "var(--pbd)" },
            ].map((r, i) => (
              <motion.div
                key={r.label}
                {...fadeUp(0.25 + i * 0.07)}
                style={{
                  background: r.bg, border: `1px solid ${r.border}`,
                  borderRadius: "20px", padding: "28px 24px", textAlign: "center",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>{r.emoji}</div>
                <div style={{ fontSize: "20px", fontWeight: 900, color: r.color, marginBottom: "8px" }}>{r.label}</div>
                <div style={{ fontSize: "14px", color: "var(--t2)", lineHeight: 1.6 }}>{r.desc}</div>
              </motion.div>
            ))}
          </div>
          <p style={{ marginTop: "16px", fontSize: "14px", color: "var(--t2)", textAlign: "center" }}>
            Tim yang ideal butuh kombinasi ketiganya. BeeMate membantu mereka saling menemukan.
          </p>
        </motion.div>

        {/* ── FITUR ── */}
        <motion.div {...fadeUp(0.3)} style={{ marginBottom: "56px" }}>
          <SectionLabel>Fitur Utama</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: "ph-user-circle", color: "var(--ho)", bg: "var(--hbg)", title: "Profil Lengkap", desc: "Daftar pakai Google, isi keahlian, foto, dan bio. Profil bisa dilihat semua orang." },
              { icon: "ph-users", color: "var(--bl)", bg: "var(--blb)", title: "Cari Orang", desc: "Browse semua mahasiswa, filter by role, cari by skill. Klik profil untuk lihat detail." },
              { icon: "ph-users-three", color: "var(--gn)", bg: "var(--gnb)", title: "Buat & Kelola Tim", desc: "Buat tim, undang anggota, kelola siapa yang masuk. Anggota bisa terima atau tolak undangan." },
              { icon: "ph-bell", color: "var(--pu)", bg: "var(--pub)", title: "Notifikasi Real-time", desc: "Dapat notifikasi saat diundang ke tim. Badge langsung muncul di navbar." },
              { icon: "ph-trophy", color: "var(--or)", bg: "var(--orb)", title: "Kompetisi & Open Projects", desc: "Lihat lomba aktif beserta deadline. Ada juga proyek mahasiswa yang butuh anggota." },
              { icon: "ph-squares-four", color: "var(--cy)", bg: "var(--cyb)", title: "Dashboard Personal", desc: "Ringkasan semua aktivitas: tim, undangan masuk, dan kompetisi yang akan datang." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp(0.35 + i * 0.05)}
                style={{
                  background: "var(--bg2)", border: "1px solid var(--b)",
                  borderRadius: "16px", padding: "20px 24px",
                  display: "flex", alignItems: "center", gap: "20px",
                }}
              >
                <div style={{
                  width: "48px", height: "48px", borderRadius: "14px",
                  background: f.bg, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "24px", color: f.color,
                }}>
                  <i className={`ph-fill ${f.icon}`} />
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--t)", marginBottom: "4px" }}>{f.title}</div>
                  <div style={{ fontSize: "13px", color: "var(--t2)", lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── STATUS ── */}
        <motion.div {...fadeUp(0.4)} style={{ marginBottom: "56px" }}>
          <SectionLabel>Status Saat Ini</SectionLabel>
          <div style={{
            background: "var(--gnb)", border: "1px solid var(--gbd)",
            borderRadius: "24px", padding: "32px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--gn)", boxShadow: "0 0 8px var(--gn)" }} />
              <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--gn)" }}>Platform sudah live dan bisa diakses sekarang</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
              {[
                { label: "Login Google", done: true },
                { label: "Profil & Upload Foto", done: true },
                { label: "Cari Orang", done: true },
                { label: "Buat & Kelola Tim", done: true },
                { label: "Sistem Undangan", done: true },
                { label: "Halaman Kompetisi", done: true },
                { label: "Dashboard", done: true },
                { label: "Admin Panel", done: true },
                { label: "Chat Tim", done: false },
                { label: "Notifikasi Email", done: false },
                { label: "Mobile App", done: false },
              ].map((item) => (
                <div key={item.label} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  fontSize: "13px", fontWeight: 600,
                  color: item.done ? "var(--t)" : "var(--t3)",
                }}>
                  <i className={`ph-fill ${item.done ? "ph-check-circle" : "ph-clock"}`}
                    style={{ color: item.done ? "var(--gn)" : "var(--t3)", fontSize: "16px", flexShrink: 0 }} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── ROADMAP ── */}
        <motion.div {...fadeUp(0.45)} style={{ marginBottom: "56px" }}>
          <SectionLabel>Rencana Pengembangan</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                phase: "3–6 Bulan",
                color: "var(--ho)", bg: "var(--hbg)", border: "var(--hbd)",
                items: ["Pengguna bisa posting proyek sendiri", "Notifikasi lewat email", "Ruang kerja tim — diskusi & bagi tugas"],
              },
              {
                phase: "6–12 Bulan",
                color: "var(--bl)", bg: "var(--blb)", border: "var(--bbd)",
                items: ["Sistem rekomendasi tim otomatis berbasis AI", "Daftar lomba langsung dari platform", "Aplikasi mobile Android & iOS"],
              },
              {
                phase: "Jangka Panjang",
                color: "var(--pu)", bg: "var(--pub)", border: "var(--pbd)",
                items: ["Kerjasama dengan penyelenggara lomba", "Analytics untuk organizer", "Fitur premium & monetisasi"],
              },
            ].map((r, i) => (
              <motion.div key={r.phase} {...fadeUp(0.5 + i * 0.07)} style={{
                background: r.bg, border: `1px solid ${r.border}`,
                borderRadius: "18px", padding: "24px",
                display: "flex", gap: "20px", alignItems: "flex-start",
              }}>
                <div style={{
                  background: r.color, color: "#fff",
                  padding: "6px 14px", borderRadius: "100px",
                  fontSize: "12px", fontWeight: 800, flexShrink: 0, marginTop: "2px",
                }}>
                  {r.phase}
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {r.items.map((item) => (
                    <li key={item} style={{ fontSize: "14px", color: "var(--t)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <i className="ph-fill ph-arrow-right" style={{ color: r.color, fontSize: "12px", flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── NILAI BISNIS ── */}
        <motion.div {...fadeUp(0.55)} style={{ marginBottom: "56px" }}>
          <SectionLabel>Nilai Bisnis</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            {[
              { icon: "ph-target", color: "var(--ho)", bg: "var(--hbg)", border: "var(--hbd)", title: "Pasar Jelas", desc: "Jutaan mahasiswa aktif di Indonesia. Ribuan lomba digelar setiap tahun." },
              { icon: "ph-warning", color: "var(--rd)", bg: "var(--rdb)", border: "var(--rbd)", title: "Masalah Nyata", desc: "Kesulitan cari tim adalah keluhan umum yang belum ada solusi digitalnya." },
              { icon: "ph-currency-dollar", color: "var(--gn)", bg: "var(--gnb)", border: "var(--gbd)", title: "Potensi Monetisasi", desc: "Featured listing untuk penyelenggara lomba, fitur premium, kerjasama kampus." },
            ].map((v) => (
              <div key={v.title} style={{
                background: v.bg, border: `1px solid ${v.border}`,
                borderRadius: "18px", padding: "24px",
              }}>
                <div style={{ fontSize: "28px", color: v.color, marginBottom: "12px" }}>
                  <i className={`ph-fill ${v.icon}`} />
                </div>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--t)", marginBottom: "8px" }}>{v.title}</div>
                <div style={{ fontSize: "13px", color: "var(--t2)", lineHeight: 1.6 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CLOSING ── */}
        <motion.div {...fadeUp(0.6)}>
          <div style={{
            background: "linear-gradient(135deg, var(--bg2), var(--bg3))",
            border: "1px solid var(--hbd)", borderRadius: "24px",
            padding: "40px", textAlign: "center",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🐝</div>
            <h2 style={{ fontSize: "22px", fontWeight: 900, color: "var(--t)", marginBottom: "12px" }}>
              BeeMate — Find Your Hive
            </h2>
            <p style={{ fontSize: "15px", color: "var(--t2)", maxWidth: "480px", margin: "0 auto 24px", lineHeight: 1.7 }}>
              Platform digital yang membantu mahasiswa menemukan teman tim yang tepat — cepat, mudah, dan tanpa perlu repot tanya satu per satu di grup WA.
            </p>
            <a href="https://beemate-app.vercel.app" target="_blank" rel="noopener noreferrer">
              <button className={buttonVariants({ variant: "honey" })}>
                <i className="ph-fill ph-arrow-square-out" /> Coba Sekarang
              </button>
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: "11px", fontWeight: 700, color: "var(--t3)",
      letterSpacing: "0.08em", textTransform: "uppercase",
      marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px",
    }}>
      <div style={{ width: "20px", height: "2px", background: "var(--ho)", borderRadius: "2px" }} />
      {children}
    </div>
  );
}
