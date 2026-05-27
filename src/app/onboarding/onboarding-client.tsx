"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { updateUserProfile } from "@/actions/user.actions";

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
    skills: ["React", "Python", "Node.js", "TypeScript", "Flutter", "AI/ML"],
  },
  {
    key: "Hustler",
    icon: "ph-briefcase",
    color: "#2dd67a",
    bg: "rgba(45,214,122,0.12)",
    border: "rgba(45,214,122,0.3)",
    title: "Hustler",
    desc: "Business, marketing, pitching — yang jago bisnis",
    skills: ["Marketing", "Pitching", "Business Model", "Sales", "Leadership", "Agile"],
  },
  {
    key: "Hipster",
    icon: "ph-paint-brush",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.3)",
    title: "Hipster",
    desc: "Designer, UI/UX, content creator — yang jago kreatif",
    skills: ["Figma", "UI Design", "Illustration", "Branding", "Motion Graphics", "Copywriting"],
  },
];

export function OnboardingClient({ userName }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: welcome, 1: pick role, 2: pick skills, 3: done
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const roleConfig = ROLES.find((r) => r.key === selectedRole);

  const handleFinish = () => {
    startTransition(async () => {
      await updateUserProfile({
        title: selectedRole ?? undefined,
        skills: selectedSkills.length > 0 ? selectedSkills : undefined,
      });
      router.push("/dashboard");
    });
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", background: "var(--bg)",
    }}>
      <div style={{ maxWidth: "560px", width: "100%", textAlign: "center" }}>
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
              <button className="btn btn-honey btn-lg" onClick={() => setStep(1)}>
                Mulai Setup <i className="ph-fill ph-arrow-right" style={{ marginLeft: "6px" }} />
              </button>
              <p style={{ fontSize: "12px", color: "var(--t3)", marginTop: "16px" }}>
                Hanya butuh 30 detik
              </p>
            </motion.div>
          )}

          {/* Step 1: Pick Role */}
          {step === 1 && (
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
                onClick={() => setStep(2)}
                style={{ marginTop: "24px", opacity: selectedRole ? 1 : 0.5 }}
              >
                Lanjut <i className="ph-fill ph-arrow-right" style={{ marginLeft: "6px" }} />
              </button>
            </motion.div>
          )}

          {/* Step 2: Pick Skills */}
          {step === 2 && roleConfig && (
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
                onClick={() => setStep(1)}
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
            {[1, 2].map((s) => (
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
