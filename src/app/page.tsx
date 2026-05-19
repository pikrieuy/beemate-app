"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Typewriter } from "@/components/ui/typewriter";
import { TestimonialsColumn } from "@/components/ui/TestimonialsColumn";


const allTestimonials = [
  { text: "Berkat BeeMate, aku ketemu anak DKV dari Alam Sutera yang skill-nya persis yang aku butuhkan. Alhamdulillah juara 1 Gemastik!", name: "Raka Kusuma", role: "Computer Science · Bandung", av: "RK", color: "#f5a623" },
  { text: "Dulu cari tim lewat grup WA sering ghosting. Sekarang pakai BeeMate lebih terstruktur dan orang-orangnya lebih serius.", name: "Nadia Salsabila", role: "VCD · Bandung", av: "NS", color: "#5b9cf6" },
  { text: "Commitment score-nya game changer. Bisa lihat track record orang sebelum diajak tim — tidak takut dapat partner ghosting lagi.", name: "Marco Rivaldi", role: "Business · Kemanggisan", av: "MR", color: "#22d17a" },
  { text: "Aku dari jurusan Psikologi bisa kolaborasi sama anak CS untuk PKM-KC. Sesuatu yang nggak akan terjadi tanpa BeeMate.", name: "Anisa Kartika", role: "Psychology · Kemanggisan", av: "AK", color: "#fb923c" },
  { text: "Fitur Smart Matching-nya luar biasa. Langsung dapat rekomendasi yang relevan tanpa perlu scroll panjang-panjang.", name: "Dimas Pratama", role: "Informatics · Kemanggisan", av: "DP", color: "#a78bfa" },
  { text: "Tim saya terbentuk dalam 3 hari! BeeMate benar-benar mempercepat proses cari anggota yang biasanya makan berminggu-minggu.", name: "Bagas Ardhian", role: "Industrial Engineering · Bandung", av: "BA", color: "#f96b6b" },
  { text: "Verified portfolio-nya bikin saya lebih percaya diri pas nge-approach orang. Prestasi saya langsung keliatan kredibel.", name: "Zahra Amalia", role: "Design · ALS", av: "ZA", color: "#22d4d4" },
  { text: "Dari Bandung bisa connect sama anak Kemanggisan, dan proyek kita malah menang Best Startup di BINUS Hackathon.", name: "Kevin Santoso", role: "CS · Bandung", av: "KS", color: "#f5a623" },
  { text: "BeeMate ubah cara saya membangun network kampus. Sekarang punya 8 koneksi serius dari berbagai jurusan!", name: "Silvia Ratnasari", role: "Marketing · Kemanggisan", av: "SR", color: "#5b9cf6" },
];

const col1 = allTestimonials.slice(0, 3);
const col2 = allTestimonials.slice(3, 6);
const col3 = allTestimonials.slice(6, 9);

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="page on" style={{ paddingTop: 0, position: "relative", minHeight: "100vh" }}>

      {/* ══════════════════════════════════════════════
          SECTION 1 — CENTERED HERO SECTION
      ══════════════════════════════════════════════ */}

        <section style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px 60px",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
        width: "100%",
        gap: 0,
      }}>

        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bc-hero-eyebrow" 
          style={{ marginBottom: 36 }}
        >
          <i className="ph-fill ph-sparkle" style={{ fontSize: 11 }}></i>
          Eksklusif untuk Binusian
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "clamp(42px, 6vw, 76px)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-2.5px",
            marginBottom: 0,
            maxWidth: 1000,
          }}
        >
          <span style={{ display: "block", color: "var(--t)" }}>
            Temukan partner
          </span>
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
          <span style={{ display: "block", height: "1.2em", overflow: "hidden", color: "var(--t)" }}>
            <Typewriter
              text={["commit penuh.", "begadang bareng.", "juara bersama.", "nggak ghosting.", "lintas jurusan.", "bikin startup."]}
              speed={65} deleteSpeed={35} waitTime={2200}
              cursorChar="_" cursorClassName="" className=""
              cursorAnimationVariants={{
                initial: { opacity: 0 },
                animate: { opacity: 1, transition: { duration: 0.01, repeat: Infinity, repeatDelay: 0.4, repeatType: "reverse" as const } },
              }}
            />
          </span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ width: 64, height: 3, background: "linear-gradient(90deg, var(--ho), transparent 50%, var(--ho))", borderRadius: 4, margin: "36px auto 28px" }}
        />

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{ fontSize: 17, color: "var(--t2)", lineHeight: 1.8, maxWidth: 600, marginBottom: 44, fontWeight: 400 }}
        >
          Platform matchmaking untuk Binusian. Temukan rekan lomba,
          lintas jurusan, & co-founder yang terverifikasi —
          bebas dari drama & ghosting.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 52 }}
        >
          <button className="btn btn-honey btn-lg" onClick={() => router.push("/dashboard")}>
            <i className="ph-fill ph-squares-four lc"></i> Get Started
          </button>
          <button className="btn btn-dark btn-lg" onClick={() => router.push("/people")}>
            <i className="ph-fill ph-users lc"></i> Browse People
          </button>
        </motion.div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="bc-proof" 
          style={{ justifyContent: "center", marginBottom: 64 }}
        >
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
        </motion.div>


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
          SECTION 3 — TESTIMONIALS (scrolling columns)
      ══════════════════════════════════════════════ */}
      <section className="testi-col-section">
        {/* Header */}
        <div style={{ padding: "0 28px", maxWidth: 1100, margin: "0 auto 48px", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Label pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--hbg)", border: "1px solid var(--hbd)", color: "var(--ho)",
              fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase",
              padding: "5px 14px", borderRadius: 100, marginBottom: 20,
            }}>
              <i className="ph-fill ph-quotes" style={{ fontSize: 12 }}></i>
              Kata Mereka
            </div>

            <h2 style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 900,
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              marginBottom: 14,
            }}>
              Ribuan Binusian{" "}
              <span style={{
                background: "linear-gradient(90deg, var(--ho), #ffbe4d)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>sudah merasakan</span>
            </h2>
            <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.8, maxWidth: 480, margin: "0 auto" }}>
              Bukan sekedar klaim — ini cerita nyata dari sesama Binusian yang berhasil bangun tim impian lewat BeeMate.
            </p>
          </motion.div>
        </div>

        {/* Scrolling Columns — full width */}
        <div className="testi-col-mask">
          <TestimonialsColumn testimonials={col1} duration={18} />
          <TestimonialsColumn
            testimonials={col2}
            duration={22}
            className="testi-col-mask-col2"
          />
          <TestimonialsColumn
            testimonials={col3}
            duration={20}
            className="testi-col-mask-col3"
          />
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
          <button className="btn btn-honey btn-xl" onClick={() => router.push("/dashboard")}>
            Mulai Sekarang <i className="ph-fill ph-arrow-right lc"></i>
          </button>
        </motion.div>
      </div>

    </div>
  );
}
