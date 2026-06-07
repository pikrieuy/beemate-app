"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { deleteCompetition } from "@/actions";
import { BackButton } from "@/components/ui/back-button";

interface Competition {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  registrationLink: string | null;
  deadline: Date | null;
  organizer: string | null;
  sourceLink: string | null;
  targetAudience: string | null;
  entryFee: string | null;
  competitionLevel: string | null;
  location: string | null;
  authorId: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface CompetitionDetailClientProps {
  competition: Competition;
  canEdit: boolean;
}

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 99999, padding: "20px",
      }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg2)", border: "1px solid var(--b)",
          borderRadius: "20px", padding: "28px", maxWidth: "400px", width: "100%",
        }}
      >
        <div style={{ fontSize: "14px", color: "var(--t)", lineHeight: 1.6, marginBottom: "20px" }}>{message}</div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button className="btn btn-dark btn-sm" onClick={onCancel}>Batal</button>
          <button
            className={buttonVariants({ size: "sm" })}
            style={{ background: "var(--rdb)", color: "var(--rd)", border: "1px solid var(--rbd)" }}
            onClick={onConfirm}
          >
            Ya, hapus
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CompetitionDetailClient({ competition, canEdit }: CompetitionDetailClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteCompetition(competition.id);
    if (result.success) {
      router.push("/competitions");
    } else {
      setErrorMsg(result.error ?? "Gagal menghapus kompetisi");
      setLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "No deadline";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (deadline: Date | null) => {
    if (!deadline) return null;
    const now = new Date();
    const date = new Date(deadline);
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Registration closed", color: "#ef4444" };
    if (diffDays === 0) return { text: "Closes today!", color: "#f59e0b" };
    if (diffDays === 1) return { text: "Closes tomorrow", color: "#f59e0b" };
    if (diffDays <= 7) return { text: `${diffDays} days remaining`, color: "#f5a623" };
    return { text: `${diffDays} days remaining`, color: "#10b981" };
  };

  const timeRemaining = getTimeRemaining(competition.deadline);

  return (
    <>
      <AnimatePresence>
        {showConfirm && (
          <ConfirmDialog
            message={`Hapus kompetisi "${competition.title}"? Tindakan ini tidak bisa dibatalkan.`}
            onConfirm={() => { setShowConfirm(false); handleDelete(); }}
            onCancel={() => setShowConfirm(false)}
          />
        )}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", top: "72px", left: "50%", transform: "translateX(-50%)",
              zIndex: 9999, padding: "12px 24px", borderRadius: "12px",
              background: "var(--rdb)", border: "1px solid var(--rbd)",
              color: "var(--rd)", fontWeight: 700, fontSize: "13px",
            }}
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="page on" style={{ minHeight: '100vh', padding: '24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Back Button */}
          <Link href="/competitions" style={{ display: 'inline-block' }}>
            <BackButton />
          </Link>

          {/* Main Layout Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 450px) 1fr', gap: '32px', alignItems: 'start' }}>
            
            {/* Left Column: Image & Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '3/4',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'var(--bg2)',
                border: '1px solid var(--bdr)'
              }}>
                {competition.imageUrl ? (
                  <div 
                    style={{ width: "100%", height: "100%", background: `url(${competition.imageUrl}) top center / cover no-repeat`, cursor: "zoom-in" }} 
                    onClick={() => setPreviewImage(competition.imageUrl)}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, var(--hbg) 0%, var(--bg3) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '80px', color: 'var(--ho)',
                  }}>
                    <i className="ph-fill ph-trophy"></i>
                  </div>
                )}
              </div>

              {/* Stats Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--t2)', fontSize: '13px', padding: '0 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ph-fill ph-heart" style={{ color: 'var(--rd)' }}></i> 3 suka
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ph-fill ph-eye"></i> 266x dilihat
                </div>
              </div>

              {/* Description Block */}
              <div style={{
                background: 'var(--bg2)',
                border: '1px solid var(--bdr)',
                borderRadius: '16px',
                padding: '24px',
                marginTop: '8px'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--t)',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}>
                  {competition.description}
                </div>
              </div>

              {/* Action Links Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginTop: '8px', fontSize: '13px', fontWeight: 600 }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--bl)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: 0 }}>
                  <i className="ph-fill ph-warning-circle"></i> <span style={{ textDecoration: 'underline' }}>Laporkan Lomba</span>
                </button>
                <div style={{ flex: 1 }} />
                <button className={buttonVariants({ size: "sm" })} style={{ background: 'var(--bg2)', border: '1px solid var(--b)', color: 'var(--t)' }}>
                  <i className="ph-fill ph-question"></i> Panduan Lomba
                </button>
                <button className={buttonVariants({ size: "sm" })} style={{ background: 'var(--bg2)', border: '1px solid var(--b)', color: 'var(--t)' }}>
                  <i className="ph-fill ph-bookmark-simple"></i> Simpan
                </button>
                <button className={buttonVariants({ size: "sm" })} style={{ background: 'var(--bg2)', border: '1px solid var(--b)', color: 'var(--t)' }}>
                  <i className="ph-fill ph-share-network"></i> Bagikan
                </button>
              </div>

              {/* Organizer Profile Details */}
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--t)', marginBottom: '16px' }}>Profile Penyelenggara</h3>
                <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--bl)', marginBottom: '16px' }}>
                    {competition.organizer || competition.author.name || "Penyelenggara"}
                  </div>
                  {/* Dummy detail for now */}
                  <div style={{ fontSize: '13px', color: 'var(--t)', lineHeight: 1.6 }}>
                    <p style={{ marginBottom: '16px' }}>Penyelenggara ini merupakan entitas yang aktif mengadakan kompetisi di berbagai bidang untuk mengembangkan potensi mahasiswa.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div><strong>Alamat:</strong> Jl. Dummy No. 123, Kota Dummy, Indonesia</div>
                      <div><strong>Media Sosial Instagram:</strong> @dummy_ig</div>
                      <div><strong>Kunjungi Kami:</strong> https://dummy.com/</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Details */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'var(--t)',
                  lineHeight: 1.3,
                  margin: 0
                }}>
                  {competition.title}
                </h1>
                {canEdit && (
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '16px' }}>
                    <Link href={`/competitions/${competition.id}/edit`}>
                      <button className={buttonVariants({ size: "sm" })} style={{ background: 'var(--bg2)', border: '1px solid var(--b)', color: 'var(--t)' }}>
                        <i className="ph-fill ph-pencil"></i>
                      </button>
                    </Link>
                    <button
                      className={buttonVariants({ size: "sm" })}
                      style={{ background: 'var(--rdb)', border: '1px solid var(--rbd)', color: 'var(--rd)' }}
                      onClick={() => setShowConfirm(true)}
                      disabled={loading}
                    >
                      <i className="ph-fill ph-trash"></i>
                    </button>
                  </div>
                )}
              </div>

              {/* Tags */}
              {competition.competitionLevel && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                  <span style={{ border: '1px solid var(--b)', borderRadius: '100px', padding: '6px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--t)' }}>
                    {competition.competitionLevel}
                  </span>
                </div>
              )}

              {/* Meta Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--t)', fontWeight: 500 }}>
                  <i className="ph-fill ph-graduation-cap" style={{ fontSize: '18px', color: 'var(--bl)', width: '24px', textAlign: 'center' }}></i>
                  {competition.targetAudience || "SMA / Sederajat, Gapyear, Mahasiswa, Umum"}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--t)', fontWeight: 500 }}>
                  <i className="ph-fill ph-coins" style={{ fontSize: '18px', color: 'var(--or)', width: '24px', textAlign: 'center' }}></i>
                  {competition.entryFee || "Gratis"}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--t)', fontWeight: 500 }}>
                  <i className="ph-fill ph-map-pin" style={{ fontSize: '18px', color: 'var(--rd)', width: '24px', textAlign: 'center' }}></i>
                  {competition.location || "Online"}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--t)', fontWeight: 500 }}>
                  <i className="ph-fill ph-calendar-blank" style={{ fontSize: '18px', color: 'var(--gn)', width: '24px', textAlign: 'center' }}></i>
                  {formatDate(competition.deadline)}
                </div>
              </div>

              <div style={{ height: '1px', background: 'var(--bdr)', width: '100%', marginBottom: '24px' }} />

              {/* Organizer Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                {competition.author.image ? (
                  <img
                    src={competition.author.image}
                    alt={competition.author.name || "Author"}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--hbg), var(--bg3))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', fontWeight: 800, color: 'var(--ho)'
                  }}>
                    {competition.author.name?.[0] || "?"}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', color: 'var(--t2)', fontWeight: 600 }}>Diselenggarakan oleh</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t)' }}>{competition.organizer || competition.author.name || "Unknown"}</span>
                </div>
              </div>

              {/* Action Button */}
              {competition.registrationLink && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <a
                    href={competition.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <button
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: 'var(--bl)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        boxShadow: '0 8px 16px rgba(59, 130, 246, 0.25)'
                      }}
                    >
                      Daftar Sekarang <i className="ph-bold ph-caret-right" style={{ fontSize: '14px' }}></i>
                    </button>
                  </a>
                  
                  {/* Additional Action Links */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--bdr)' }}>
                    <div style={{ fontSize: '13px', color: 'var(--t)', display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' }}>
                      <i className="ph-fill ph-link" style={{ color: 'var(--t2)', flexShrink: 0 }}></i>
                      <strong style={{ flexShrink: 0 }}>Form pendaftaran:</strong> 
                      <a href={competition.registrationLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--bl)', textDecoration: 'none' }}>
                        {competition.registrationLink}
                      </a>
                    </div>
                    {competition.sourceLink && (
                      <div style={{ fontSize: '13px', color: 'var(--t)', display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' }}>
                        <i className="ph-fill ph-instagram-logo" style={{ color: 'var(--t2)', flexShrink: 0 }}></i>
                        <strong style={{ flexShrink: 0 }}>Sumber (Instagram):</strong> 
                        <a href={competition.sourceLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--bl)', textDecoration: 'none' }}>
                          {competition.sourceLink}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {/* Contact/DM Info */}
                  <div style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: 1.6, marginTop: '8px', padding: '0 8px' }}>
                    Kalau kalian punya pertanyaan boleh langsung DM aja ke penyelenggara <strong>{(competition.organizer || "penyelenggara").replace(/\s+/g, '').toLowerCase()}</strong>. Kita tunggu keseruan momen kalian yaa! Good luck! 🎉
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Fullscreen Image Preview */}
      {mounted && createPortal(
        <AnimatePresence>
          {previewImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewImage(null)}
              style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: "rgba(0,0,0,0.85)", zIndex: 999999,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "20px", cursor: "zoom-out"
              }}
            >
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={previewImage}
                alt="Preview"
                style={{
                  maxWidth: "100%", maxHeight: "100%",
                  objectFit: "contain", borderRadius: "8px",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
                }}
                onClick={(e) => e.stopPropagation()} // Prevent click through to close
              />
              
              <button 
                onClick={() => setPreviewImage(null)}
                style={{
                  position: "absolute", top: "20px", right: "20px",
                  background: "rgba(0,0,0,0.5)", border: "none",
                  color: "white", width: "40px", height: "40px",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", fontSize: "20px"
                }}
              >
                <i className="ph-bold ph-x" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
