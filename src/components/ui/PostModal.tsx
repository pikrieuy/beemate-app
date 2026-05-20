"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function PostModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleCariAnggota = () => {
    onClose();
    router.push("/teams/create");
  };

  const handleTawarkanDiri = () => {
    onClose();
    router.push("/people");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
        }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: "relative", background: "var(--bg)",
              border: "1px solid var(--b)", boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
              borderRadius: "24px", padding: "32px", width: "100%", maxWidth: "560px",
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              style={{
                position: "absolute", top: "20px", right: "20px",
                width: "32px", height: "32px", borderRadius: "50%",
                background: "var(--bg2)", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--t2)", cursor: "pointer", transition: "color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--t)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--t2)")}
            >
              <i className="ph-bold ph-x" />
            </button>

            <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "6px", color: "var(--t)" }}>
              Buat Postingan Baru
            </h2>
            <p style={{ color: "var(--t2)", marginBottom: "28px", fontSize: "13px" }}>
              Pilih jenis postingan yang ingin kamu buat di BeeMate.
            </p>

            <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
              {/* Option 1 — Cari Anggota */}
              <div
                onClick={handleCariAnggota}
                style={{
                  display: "flex", alignItems: "center", padding: "20px",
                  borderRadius: "16px", border: "1px solid var(--b)",
                  background: "var(--bg2)", cursor: "pointer",
                  transition: "all 0.2s ease", gap: "18px",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "var(--ho)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(245,166,35,0.12)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--b)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px",
                  background: "rgba(245,166,35,0.15)", color: "var(--ho)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "24px", flexShrink: 0,
                }}>
                  <i className="ph-fill ph-rocket-launch" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--t)", marginBottom: "4px" }}>
                    Cari Anggota Tim
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--t2)", lineHeight: 1.5 }}>
                    Buat tim baru dan undang orang yang sesuai kebutuhan proyekmu.
                  </div>
                </div>
                <i className="ph-bold ph-caret-right" style={{ color: "var(--t3)", fontSize: "18px", flexShrink: 0 }} />
              </div>

              {/* Option 2 — Tawarkan Diri */}
              <div
                onClick={handleTawarkanDiri}
                style={{
                  display: "flex", alignItems: "center", padding: "20px",
                  borderRadius: "16px", border: "1px solid var(--b)",
                  background: "var(--bg2)", cursor: "pointer",
                  transition: "all 0.2s ease", gap: "18px",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "var(--bl)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(91,156,246,0.12)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--b)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px",
                  background: "rgba(91,156,246,0.15)", color: "var(--bl)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "24px", flexShrink: 0,
                }}>
                  <i className="ph-fill ph-hand-waving" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--t)", marginBottom: "4px" }}>
                    Tawarkan Diri (LFG)
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--t2)", lineHeight: 1.5 }}>
                    Perbarui profilmu dan biarkan tim yang sedang mencari anggota menemukanmu.
                  </div>
                </div>
                <i className="ph-bold ph-caret-right" style={{ color: "var(--t3)", fontSize: "18px", flexShrink: 0 }} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
