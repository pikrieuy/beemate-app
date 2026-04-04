"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TheInfiniteGrid } from "@/components/ui/the-infinite-grid";
import { Typewriter } from "@/components/ui/typewriter";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="page on" style={{ paddingTop: 0, position: "relative", minHeight: "100vh" }}>

      {/* ── INFINITE GRID LAYER ── */}
      <TheInfiniteGrid />

      {/* ══════════════════════════════════════════════
          SECTION 1 — FULL SCREEN HERO
      ══════════════════════════════════════════════ */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "100px 60px 60px",
        maxWidth: 1100,
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
        width: "100%",
      }}>

        {/* Eyebrow pill */}
        <div className="bc-hero-eyebrow" style={{ marginBottom: 36 }}>
          <i className="ph-fill ph-sparkle" style={{ fontSize: 11 }}></i>
          Eksklusif untuk Binusian
        </div>

        {/* Main headline — 3 stacked lines, fully static */}
        <h1 style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "clamp(48px, 5.5vw, 76px)",
          fontWeight: 900,
          lineHeight: 1.08,
          letterSpacing: "-2.5px",
          marginBottom: 0,
          maxWidth: 820,
        }}>
          {/* Line 1 - static */}
          <span style={{ display: "block", color: "var(--t)" }}>
            Temukan partner
          </span>

          {/* Line 2 - static gradient */}
          <span style={{
            display: "block",
            background: "linear-gradient(90deg, var(--ho), #ffbe4d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 8,
          }}>
            yang siap
          </span>

          {/* Line 3 - typewriter only, fixed height so nothing shifts */}
          <span style={{
            display: "block",
            height: "1.1em",
            overflow: "hidden",
            color: "var(--t)",
          }}>
            <Typewriter
              text={[
                "commit penuh.",
                "begadang bareng.",
                "juara bersama.",
                "nggak ghosting.",
                "lintas jurusan.",
                "bikin startup.",
              ]}
              speed={65}
              deleteSpeed={35}
              waitTime={2200}
              cursorChar="_"
              cursorClassName=""
              className=""
              cursorAnimationVariants={{
                initial: { opacity: 0 },
                animate: {
                  opacity: 1,
                  transition: {
                    duration: 0.01,
                    repeat: Infinity,
                    repeatDelay: 0.4,
                    repeatType: "reverse" as const,
                  },
                },
              }}
            />
          </span>
        </h1>

        {/* Divider line */}
        <div style={{
          width: 64, height: 3,
          background: "linear-gradient(90deg, var(--ho), transparent)",
          borderRadius: 4,
          margin: "36px 0 28px",
        }} />

        {/* Subtext */}
        <p style={{
          fontSize: 16,
          color: "var(--t2)",
          lineHeight: 1.9,
          maxWidth: 480,
          marginBottom: 44,
          fontWeight: 400,
        }}>
          Platform matchmaking untuk Binusian. Temukan rekan lomba,
          lintas jurusan, & co-founder yang terverifikasi —
          bebas dari drama & ghosting.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 52 }}>
          <button className="btn btn-honey btn-lg" onClick={() => router.push("/explore")}>
            <i className="ph-fill ph-squares-four lc"></i> Explore Projects
          </button>
          <button className="btn btn-dark btn-lg" onClick={() => router.push("/people")}>
            <i className="ph-fill ph-users lc"></i> Browse People
          </button>
        </div>

        {/* Social proof bar */}
        <div className="bc-proof" style={{ justifyContent: "flex-start" }}>
          <div className="av-stack">
            <div className="av av-32" style={{ background: "linear-gradient(135deg,#f5a623,#ffc04d)" }}>RK</div>
            <div className="av av-32" style={{ background: "linear-gradient(135deg,#5b9cf6,#93c5fd)" }}>NS</div>
            <div className="av av-32" style={{ background: "linear-gradient(135deg,#22d17a,#6ee7b7)" }}>MR</div>
            <div className="av av-32" style={{ background: "linear-gradient(135deg,#f96b6b,#fca5a5)" }}>DP</div>
            <div className="av av-32" style={{ background: "linear-gradient(135deg,#a78bfa,#c4b5fd)" }}>BA</div>
          </div>
          <div className="bc-proof-text">
            <strong>1,240+ Bergabung</strong> · 320+ Tim Aktif · 42 Juara Lomba
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            color: "var(--t3)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <i className="ph-fill ph-caret-double-down" style={{ fontSize: 18, color: "var(--t3)" }}></i>
          </motion.div>
        </motion.div>
      </section>


      {/* ══════════════════════════════════════════════
          MARQUEE TICKER
      ══════════════════════════════════════════════ */}
      <div className="marquee-wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className="marquee">
          <span className="mq-item"><i className="ph-fill ph-trophy lc mq-icon"></i><b>Team Nexus</b> juara 1 Gemastik XVI</span><span className="mq-sep">·</span>
          <span className="mq-item"><i className="ph-fill ph-medal lc mq-icon"></i><b>Visual Crew</b> runner-up COMPFEST UI/UX</span><span className="mq-sep">·</span>
          <span className="mq-item"><i className="ph-fill ph-rocket-launch lc mq-icon"></i><b>EduTrack</b> startup live 2K+ users</span><span className="mq-sep">·</span>
          <span className="mq-item"><i className="ph-fill ph-check-circle lc mq-icon"></i><b>PKM-KC EcoSmart</b> didanai Dikti 2024</span><span className="mq-sep">·</span>
          <span className="mq-item"><i className="ph-fill ph-trophy lc mq-icon"></i><b>BizForce</b> juara 1 BNCC Business Case</span><span className="mq-sep">·</span>
          <span className="mq-item"><i className="ph-fill ph-users lc mq-icon"></i><b>320+ tim</b> terbentuk sejak 2024</span><span className="mq-sep">·</span>
          <span className="mq-item"><i className="ph-fill ph-trophy lc mq-icon"></i><b>Team Nexus</b> juara 1 Gemastik XVI</span><span className="mq-sep">·</span>
          <span className="mq-item"><i className="ph-fill ph-medal lc mq-icon"></i><b>Visual Crew</b> runner-up COMPFEST UI/UX</span><span className="mq-sep">·</span>
          <span className="mq-item"><i className="ph-fill ph-rocket-launch lc mq-icon"></i><b>EduTrack</b> startup live 2K+ users</span><span className="mq-sep">·</span>
          <span className="mq-item"><i className="ph-fill ph-check-circle lc mq-icon"></i><b>PKM-KC EcoSmart</b> didanai Dikti 2024</span><span className="mq-sep">·</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 2 — WHY BEEMATE (Teks besar + ikon)
      ══════════════════════════════════════════════ */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 28px", maxWidth: 1100, margin: "0 auto" }}>
        <p className="section-label" style={{ marginBottom: 24 }}>
          <i className="ph-fill ph-lightning lc" style={{ marginRight: 6 }}></i>
          Mengapa BeeMate?
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "60px 48px" }}>
          {[
            { icon: "ph-crosshair-simple", color: "var(--ho)", title: "Smart Matching", desc: "Filter presisi berdasarkan keahlian, jurusan, kampus, dan gaya kerja. AI membantu menemukan yang paling cocok untukmu.", badge: "AI-Powered ✦" },
            { icon: "ph-shield-check", color: "var(--bl)", title: "Commitment Score", desc: "Rating berbasis track record tim sebelumnya. Lihat siapa yang serius sebelum diajak kolaborasi.", badge: null },
            { icon: "ph-list-bullets", color: "var(--gn)", title: "Project Board", desc: "Post & cari proyek secara realtime. Dari hackathon, startup, PKM, hingga sekedar side project kreatif.", badge: null },
            { icon: "ph-seal-check", color: "var(--pu)", title: "Verified Portfolio", desc: "Tampilkan jejak kemenangan yang valid dan diakui platform, bukan sekedar klaim sendiri.", badge: null },
            { icon: "ph-bell-ringing", color: "var(--rd)", title: "Smart Alerts", desc: "Notifikasi instan setiap ada lowongan proyek yang sesuai keahlian dan preferensimu.", badge: null },
            { icon: "ph-map-pin", color: "var(--or)", title: "Lintas Kampus", desc: "Kemanggisan · ALS · Bandung · Malang · Semarang · Bekasi. Satu ekosistem, ribuan peluang kolaborasi.", badge: null },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: "easeOut" }}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: `${f.color}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: f.color, fontSize: 22,
              }}>
                <i className={`ph-fill ${f.icon}`}></i>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.3px", marginBottom: 6 }}>
                  {f.title}
                  {f.badge && (
                    <span style={{
                      marginLeft: 8, fontSize: 9, fontWeight: 700, letterSpacing: "0.8px",
                      textTransform: "uppercase", background: "rgba(245,166,35,.1)",
                      color: "var(--ho)", border: "1px solid rgba(245,166,35,.2)",
                      padding: "2px 8px", borderRadius: 100, verticalAlign: "middle",
                    }}>{f.badge}</span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.75, fontWeight: 400 }}>
                  {f.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 3 — TESTIMONIALS (horizontal scroll)
      ══════════════════════════════════════════════ */}
      <section style={{ position: "relative", zIndex: 1, padding: "0 0 80px" }}>
        <div style={{ padding: "0 28px", maxWidth: 1100, margin: "0 auto 32px" }}>
          <p className="section-label">
            <i className="ph-fill ph-quotes lc" style={{ marginRight: 6 }}></i>
            Kata Mereka
          </p>
        </div>

        <div style={{
          display: "flex",
          gap: 20,
          overflowX: "auto",
          padding: "8px 28px 24px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}>
          {[
            { stars: "★★★★★", text: "Berkat BeeMate, aku ketemu anak DKV dari Alam Sutera yang skill-nya persis yang aku butuhkan. Alhamdulillah juara 1 Gemastik!", name: "Raka Kusuma", role: "Computer Science · Bandung", av: "RK", color: "#f5a623" },
            { stars: "★★★★★", text: "Dulu cari tim lewat grup WA sering ghosting. Sekarang pakai BeeMate lebih terstruktur dan orang-orangnya lebih serius.", name: "Nadia Salsabila", role: "VCD · Bandung", av: "NS", color: "#5b9cf6" },
            { stars: "★★★★★", text: "Commitment score-nya game changer. Bisa lihat track record orang sebelum diajak tim — tidak takut dapat partner ghosting lagi.", name: "Marco Rivaldi", role: "Business · Kemanggisan", av: "MR", color: "#22d17a" },
            { stars: "★★★★★", text: "Aku dari jurusan Psikologi bisa kolaborasi sama anak CS untuk PKM-KC. Sesuatu yang nggak akan terjadi tanpa BeeMate.", name: "Anisa Kartika", role: "Psychology · Kemanggisan", av: "AK", color: "#fb923c" },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="testi-card"
              style={{
                minWidth: 320, maxWidth: 360,
                flexShrink: 0,
                padding: 28,
                borderRadius: 20,
              }}
            >
              <div className="testi-stars" style={{ marginBottom: 12 }}>{t.stars}</div>
              <p className="testi-text" style={{ marginBottom: 20, lineHeight: 1.75, fontSize: 13 }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="testi-author">
                <div className="av av-36" style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)` }}>{t.av}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA BAR
      ══════════════════════════════════════════════ */}
      <div style={{ position: "relative", zIndex: 1, padding: "0 28px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          className="cta-bar"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ flex: 1 }}>
            <div className="cta-title">Siap bangun tim impianmu?</div>
            <div className="cta-sub">Bergabung dengan 1,240+ Binusians yang sudah menemukan partner terbaik mereka di BeeMate.</div>
          </div>
          <button className="btn btn-honey btn-xl" onClick={() => router.push("/explore")}>
            Mulai Sekarang <i className="ph-fill ph-arrow-right lc"></i>
          </button>
        </motion.div>
      </div>

    </div>
  );
}
