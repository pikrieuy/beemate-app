"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export function PostModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)"
            }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: "relative",
              background: "var(--bg)",
              border: "1px solid var(--bdr)",
              boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
              borderRadius: "24px",
              padding: "32px",
              width: "100%",
              maxWidth: "600px",
              overflow: "hidden"
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--bg2)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--t2)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--t)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--t2)"}
            >
              <i className="ph-bold ph-x"></i>
            </button>

            <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "8px", color: "var(--t)" }}>Buat Postingan Baru</h2>
            <p style={{ color: "var(--t2)", marginBottom: "32px", fontSize: "14px" }}>
              Pilih jenis postingan yang ingin kamu buat di platform BeeMate.
            </p>

            <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
              {/* Option 1 */}
              <div 
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1px solid var(--bdr)",
                  background: "var(--bg2)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  gap: "20px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--ho)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--bdr)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onClick={() => {
                  alert("Membuka form Post Project...");
                  onClose();
                }}
              >
                <div style={{ 
                  width: "48px", height: "48px", borderRadius: "12px", 
                  background: "rgba(245,166,35,0.15)", color: "var(--ho)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px"
                }}>
                  <i className="ph-fill ph-rocket-launch"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--t)", marginBottom: "4px" }}>Cari Anggota Tim Baru</div>
                  <div style={{ fontSize: "13px", color: "var(--t2)", lineHeight: 1.5 }}>Buat proyek baru atau lomba dan cari partner spesifik yang sesuai dengan kebutuhan analisismu.</div>
                </div>
                <i className="ph-bold ph-caret-right" style={{ color: "var(--t3)", fontSize: "20px" }}></i>
              </div>

              {/* Option 2 */}
              <div 
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1px solid var(--bdr)",
                  background: "var(--bg2)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  gap: "20px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--bl)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--bdr)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onClick={() => {
                  alert("Membuka form Request Team...");
                  onClose();
                }}
              >
                <div style={{ 
                  width: "48px", height: "48px", borderRadius: "12px", 
                  background: "rgba(91,156,246,0.15)", color: "var(--bl)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px"
                }}>
                  <i className="ph-fill ph-hand-waving"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--t)", marginBottom: "4px" }}>Tawarkan Diri (LFG)</div>
                  <div style={{ fontSize: "13px", color: "var(--t2)", lineHeight: 1.5 }}>Post keahlianmu dan biarkan tim yang sedang mencari anggota menemukan dan merekrutmu.</div>
                </div>
                <i className="ph-bold ph-caret-right" style={{ color: "var(--t3)", fontSize: "20px" }}></i>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
