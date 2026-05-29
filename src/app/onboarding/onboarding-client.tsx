"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { updateUserProfile } from "@/actions/user.actions";
import { extractSkillsFromText } from "@/actions/matchmaking.actions";

interface Props {
  userName: string | null;
}

const ROLES = [
  {
    key: "Hacker",
    icon: "ph-code",
    color: "#5b9cf6",
    bg: "rgba(91,156,246,0.12)",
    border: "rgba(91,156,246,0.3)",
    title: "Hacker",
    desc: "Developer, programmer, data scientist — yang jago teknis",
    skills: ["React", "Python", "Node.js", "TypeScript", "Flutter", "AI/ML", "PostgreSQL", "Docker"],
  },
  {
    key: "Hustler",
    icon: "ph-briefcase",
    color: "#2dd67a",
    bg: "rgba(45,214,122,0.12)",
    border: "rgba(45,214,122,0.3)",
    title: "Hustler",
    desc: "Business, marketing, pitching — yang jago bisnis",
    skills: ["Marketing", "Pitching", "Business Model", "Sales", "Leadership", "Agile", "Product Management", "Communication"],
  },
  {
    key: "Hipster",
    icon: "ph-paint-brush",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.3)",
    title: "Hipster",
    desc: "Designer, UI/UX, content creator — yang jago kreatif",
    skills: ["Figma", "UI Design", "Illustration", "Branding", "Motion Graphics", "Copywriting", "UX Research", "Prototyping"],
  },
];

export function OnboardingClient({ userName }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: welcome, 1: AI extract OR pick role, 2: pick skills, 3: done
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [bio, setBio] = useState("");

  // AI Skill Extractor state
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ skills: string[]; title: string; bio: string } | null>(null);

  const roleConfig = ROLES.find((r) => r.key === selectedRole);

  async function handleAiExtract() {
    if (!aiText.trim() || aiText.trim().length < 10) return;
    setAiLoading(true);
    const result = await extractSkillsFromText(aiText);
    if (result.success && result.data) {
      setAiResult(result.data);
      setSelectedRole(result.data.title);
      setSelectedSkills(result.data.skills);
      setBio(result.data.bio);
    }
    setAiLoading(false);
  }

  const handleFinish = () => {
    startTransition(async () => {
      await updateUserProfile({
        title: selectedRole ?? undefined,
        skills: selectedSkills.length > 0 ? selectedSkills : undefined,
        bio: bio || undefined,
      });
      router.push("/dashboard");
    });
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", background: "var(--bg)",
    }}>
      <div style={{ maxWidth: "600px", width: "100%", textAlign: "center" }}>
        <AnimatePresence mode="wait">

          {/* Step 0: Welcome */}
          {step === 0 && (
            <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ fontSize: "56px", marginBottom: "20px" }}>🐝</div>
              <h1 style={{ fontSize: "32px", fontWeight: 900, color: "var(--t)", marginBottom: "12px" }}>
                Selamat datang, {userName || "Bee"}!
              </h1>
              <p style={{ fontSize: "15px", color: "var(--t2)", lineHeight: 1.7, marginBottom: "36px" }}>
                Sebelum mulai, bantu kami mengenal kamu lebih baik agar bisa merekomendasikan tim yang cocok.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
                <button className="btn btn-honey btn-lg" onClick={() => setStep(1)}>
                  <i className="ph-fill ph-sparkle" style={{ marginRight: "6px" }} />
                  Auto-Fill dengan AI
                </button>
                <button
                  onClick={() => setStep(2)}
                  style={{ background: "none", border: "none", color: "var(--t3)", fontSize: "13px", cursor: "pointer", padding: "8px" }}
                >
                  Atau isi manual →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 1: AI Skill Extractor */}
          {step === 1 && (
            <motion.div key="ai-extract" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>✨</div>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--t)", marginBottom: "8px" }}>
                AI Skill Extractor
              </h2>
              <p style={{ fontSize: "13px", color: "var(--t2)", marginBottom: "24px", lineHeight: 1.6 }}>
                Paste bio LinkedIn, deskripsi diri, atau CV kamu. AI akan otomatis mendeteksi skills, role, dan membuat bio singkat.
              </p>

              <textarea
                value={aiText}
                onChange={(e) => setAiText(e.target.value)}
                placeholder={"Contoh: Saya mahasiswa Informatika semester 5, berpengalaman di React, Node.js, dan PostgreSQL. Pernah ikut hackathon Gemastik dan menang juara 3. Tertarik dengan AI dan machine learning..."}
                rows={6}
                style={{
                  width: "100%", padding: "16px", borderRadius: "14px",
                  border: "1px solid var(--b)", background: "var(--bg2)",
                  color: "var(--t)", fontSize: "14px", resize: "vertical",
                  fontFamily: "inherit", lineHeight: 1.6,
                }}
              />
              <div style={{ fontSize: "11px", color: "var(--t3)", marginTop: "8px", textAlign: "right" }}>
                {aiText.length}/3000 karakter
              </div>

              {/* AI Result */}
              {aiResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: "20px", padding: "20px", borderRadius: "16px",
                    background: "rgba(245,166,35,0.05)", border: "1px solid rgba(245,166,35,0.2)",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ho)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    <i className="ph-fill ph-sparkle" style={{ marginRight: "4px" }} /> AI Detected
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <span style={{ fontSize: "12px", color: "var(--t3)" }}>Role: </span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--t)" }}>{aiResult.title}</span>
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <span style={{ fontSize: "12px", color: "var(--t3)" }}>Bio: </span>
                    <span style={{ fontSize: "13px", color: "var(--t2)" }}>{aiResult.bio}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "var(--t3)", display: "block", marginBottom: "6px" }}>Skills:</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {aiResult.skills.map((s) => (
                        <span key={s} style={{
                          padding: "4px 10px", borderRadius: "100px", fontSize: "12px",
                          background: "rgba(245,166,35,0.1)", color: "var(--ho)",
                          border: "1px solid rgba(245,166,35,0.2)", fontWeight: 600,
                        }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "24px" }}>
                {!aiResult ? (
                  <button
                    className="btn btn-honey btn-lg"
                    onClick={handleAiExtract}
                    disabled={aiLoading || aiText.trim().length < 10}
                    style={{ opacity: aiText.trim().length < 10 ? 0.5 : 1 }}
                  >
                    {aiLoading ? (
                      <><span style={{ display: "inline-block", animation: "spin 1s linear infinite", marginRight: "6px" }}>⚙️</span> Menganalisis...</>
                    ) : (
                      <><i className="ph-fill ph-magic-wand" style={{ marginRight: "6px" }} /> Ekstrak Skills</>
                    )}
                  </button>
                ) : (
                  <button className="btn btn-honey btn-lg" onClick={handleFinish} disabled={isPending}>
                    {isPending ? "Menyimpan..." : "Pakai Hasil AI & Selesai 🎉"}
                  </button>
                )}
              </div>
              <button
                onClick={() => { setAiResult(null); setStep(2); }}
                style={{ display: "block", margin: "12px auto 0", background: "none", border: "none", color: "var(--t3)", fontSize: "12px", cursor: "pointer" }}
              >
                Isi manual saja →
              </button>
            </motion.div>
          )}

          {/* Step 2: Pick Role (Manual) */}
          {step === 2 && (
            <motion.div key="role" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--t)", marginBottom: "8px" }}>
                Kamu tipe yang mana?
              </h2>
              <p style={{ fontSize: "13px", color: "var(--t2)", marginBottom: "28px" }}>
                Pilih satu yang paling menggambarkan kamu
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
                {ROLES.map((role) => (
                  <div
                    key={role.key}
                    onClick={() => setSelectedRole(role.key)}
                    style={{
                      display: "flex", alignItems: "center", gap: "16px",
                      padding: "20px", borderRadius: "16px", cursor: "pointer",
                      background: selectedRole === role.key ? role.bg : "var(--bg2)",
                      border: `2px solid ${selectedRole === role.key ? role.border : "var(--b)"}`,
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "14px",
                      background: role.bg, color: role.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "24px", flexShrink: 0,
                    }}>
                      <i className={`ph-fill ${role.icon}`} />
                    </div>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--t)", marginBottom: "3px" }}>
                        {role.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--t2)" }}>{role.desc}</div>
                    </div>
                    {selectedRole === role.key && (
                      <i className="ph-fill ph-check-circle" style={{ marginLeft: "auto", fontSize: "22px", color: role.color }} />
                    )}
                  </div>
                ))}
              </div>
              <button
                className="btn btn-honey btn-lg"
                disabled={!selectedRole}
                onClick={() => setStep(3)}
                style={{ marginTop: "24px", opacity: selectedRole ? 1 : 0.5 }}
              >
                Lanjut <i className="ph-fill ph-arrow-right" style={{ marginLeft: "6px" }} />
              </button>
              <button
                onClick={() => setStep(1)}
                style={{ display: "block", margin: "12px auto 0", background: "none", border: "none", color: "var(--t3)", fontSize: "12px", cursor: "pointer" }}
              >
                ← Pakai AI Extractor
              </button>
            </motion.div>
          )}

          {/* Step 3: Pick Skills (Manual) */}
          {step === 3 && roleConfig && (
            <motion.div key="skills" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--t)", marginBottom: "8px" }}>
                Pilih skill kamu
              </h2>
              <p style={{ fontSize: "13px", color: "var(--t2)", marginBottom: "28px" }}>
                Pilih yang kamu kuasai (bisa lebih dari satu)
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginBottom: "28px" }}>
                {roleConfig.skills.map((skill) => {
                  const active = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => {
                        setSelectedSkills((prev) =>
                          active ? prev.filter((s) => s !== skill) : [...prev, skill]
                        );
                      }}
                      style={{
                        padding: "10px 18px", borderRadius: "100px", border: "none",
                        background: active ? roleConfig.bg : "var(--bg2)",
                        color: active ? roleConfig.color : "var(--t2)",
                        fontWeight: active ? 700 : 500, fontSize: "13px",
                        cursor: "pointer", transition: "all 0.15s",
                        outline: active ? `2px solid ${roleConfig.border}` : "2px solid transparent",
                      }}
                    >
                      {active && <i className="ph-fill ph-check" style={{ marginRight: "5px", fontSize: "11px" }} />}
                      {skill}
                    </button>
                  );
                })}
              </div>
              <button
                className="btn btn-honey btn-lg"
                onClick={handleFinish}
                disabled={isPending}
              >
                {isPending ? "Menyimpan..." : "Selesai! 🎉"}
              </button>
              <button
                onClick={() => setStep(2)}
                style={{ display: "block", margin: "12px auto 0", background: "none", border: "none", color: "var(--t3)", fontSize: "12px", cursor: "pointer" }}
              >
                ← Kembali
              </button>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Progress dots */}
        {step > 0 && (
          <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "32px" }}>
            {[1, 2, 3].map((s) => (
              <div key={s} style={{
                width: step >= s ? "24px" : "8px", height: "8px",
                borderRadius: "4px", transition: "all 0.2s",
                background: step >= s ? "var(--ho)" : "var(--b2)",
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
