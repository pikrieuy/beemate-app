"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { updateUserProfile, deleteAccount } from "@/actions/user.actions";

// ─── Toast helper ────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const show = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
}

// ─── Notification preference row ─────────────────────────────────────────────
function PrefRow({
  icon, label, desc, checked, onChange,
}: {
  icon: string; label: string; desc: string;
  checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 20px", background: "var(--bg)", border: "1px solid var(--b)",
      borderRadius: "var(--r-pill)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <i className={`ph-fill ${icon}`} style={{ fontSize: "22px", color: "var(--ho)" }} />
        <div>
          <div style={{ fontWeight: 700, color: "var(--t)", fontSize: "14px" }}>{label}</div>
          <div style={{ fontSize: "12px", color: "var(--t2)", marginTop: "2px" }}>{desc}</div>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: "44px", height: "24px", borderRadius: "var(--r-pill)", border: "none",
          background: checked ? "var(--ho)" : "var(--b2)",
          cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0,
        }}
      >
        <span style={{
          position: "absolute", top: "3px",
          left: checked ? "23px" : "3px",
          width: "18px", height: "18px", borderRadius: "50%",
          background: "#fff", transition: "left 0.2s",
        }} />
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const { data: session, update: updateSession } = useSession();
  const role = (session?.user as any)?.role as string | undefined;
  const { toast, show } = useToast();
  const [isPending, startTransition] = useTransition();

  // Account form state
  const [name, setName] = useState(session?.user?.name ?? "");

  // Notification prefs — persisted to localStorage
  const NOTIF_KEY = "beemate_notif_prefs";
  const [notifPrefs, setNotifPrefs] = useState(() => {
    if (typeof window === "undefined") return { teamInvite: true, inviteAccepted: true, newCompetition: true, weeklyDigest: false };
    try {
      const saved = localStorage.getItem(NOTIF_KEY);
      return saved ? JSON.parse(saved) : { teamInvite: true, inviteAccepted: true, newCompetition: true, weeklyDigest: false };
    } catch { return { teamInvite: true, inviteAccepted: true, newCompetition: true, weeklyDigest: false }; }
  });
  const [notifSaved, setNotifSaved] = useState(false);

  const updateNotifPref = (key: string, value: boolean) => {
    const next = { ...notifPrefs, [key]: value };
    setNotifPrefs(next);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(next));
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 2000);
  };

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, startDeleteTransition] = useTransition();

  const tabs = [
    { id: "account",       label: "Akun & Profil",     icon: "ph-user" },
    { id: "appearance",    label: "Tampilan",           icon: "ph-palette" },
    { id: "notifications", label: "Notifikasi",         icon: "ph-bell" },
    { id: "privacy",       label: "Privasi & Keamanan", icon: "ph-shield-check" },
  ];

  // ── Save account ────────────────────────────────────────────────────────────
  function handleSaveAccount() {
    if (!name.trim()) { show("Nama tidak boleh kosong", "err"); return; }
    if (name.trim().length < 2) { show("Nama minimal 2 karakter", "err"); return; }
    if (name.trim().length > 50) { show("Nama maksimal 50 karakter", "err"); return; }

    startTransition(async () => {
      const result = await updateUserProfile({ name: name.trim() });
      if (result.success) {
        // Sync nama baru ke session JWT agar navbar ikut update
        await updateSession({ name: name.trim() });
        show("Profil berhasil disimpan ✓");
      } else {
        show(result.error ?? "Gagal menyimpan", "err");
      }
    });
  }

  return (
    <div className="page on" style={{ minHeight: "100vh", padding: "16px 24px 60px" }}>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            style={{
              position: "fixed", top: "72px", left: "50%", transform: "translateX(-50%)",
              zIndex: 9999, padding: "12px 24px", borderRadius: "var(--r-pill)",
              background: toast.type === "ok" ? "var(--gnb)" : "var(--rdb)",
              border: `1px solid ${toast.type === "ok" ? "var(--gbd)" : "var(--rbd)"}`,
              color: toast.type === "ok" ? "var(--gn)" : "var(--rd)",
              fontWeight: 700, fontSize: "13px", whiteSpace: "nowrap",
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "32px", alignItems: "flex-start" }}>

        {/* ── Sidebar ── */}
        <div style={{ width: "260px", flexShrink: 0, position: "sticky", top: "72px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--t)", marginBottom: "20px" }}>Setelan</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "13px 16px", borderRadius: "var(--r-pill)", border: "none",
                  background: activeTab === tab.id ? "var(--hbg)" : "transparent",
                  color: activeTab === tab.id ? "var(--ho)" : "var(--t2)",
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: "14px", cursor: "pointer", textAlign: "left",
                  transition: "all 0.15s",
                  borderLeft: activeTab === tab.id ? "2px solid var(--ho)" : "2px solid transparent",
                }}
              >
                <i className={`ph-fill ${tab.icon}`} style={{ fontSize: "18px" }} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sign Out */}
          <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--b)" }}>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "13px 16px", borderRadius: "var(--r-pill)", border: "none",
                background: "transparent", color: "var(--rd)",
                fontWeight: 600, fontSize: "14px", cursor: "pointer",
                textAlign: "left", width: "100%", transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--rdb)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <i className="ph-fill ph-sign-out" style={{ fontSize: "18px" }} />
              Sign Out
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              style={{
                background: "var(--bg2)", border: "1px solid var(--b)",
                borderRadius: "20px", padding: "36px",
              }}
            >
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--t)", marginBottom: "6px" }}>
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p style={{ color: "var(--t2)", fontSize: "13px", marginBottom: "32px" }}>
                Kelola preferensi dan data personal kamu.
              </p>

              {/* ── Tab: Akun ── */}
              {activeTab === "account" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                  {/* Role badge */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "14px 18px", borderRadius: "var(--r-pill)",
                    background: role === "ADMIN" ? "rgba(239,68,68,0.06)" : "var(--hbg)",
                    border: `1px solid ${role === "ADMIN" ? "rgba(239,68,68,0.2)" : "var(--hbd)"}`,
                  }}>
                    <i
                      className={`ph-fill ${role === "ADMIN" ? "ph-shield-check" : "ph-user"}`}
                      style={{ fontSize: "20px", color: role === "ADMIN" ? "#ef4444" : "var(--ho)" }}
                    />
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--t3)", fontWeight: 600, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Role Akun</div>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: role === "ADMIN" ? "#ef4444" : "var(--ho)" }}>
                        {role === "ADMIN" ? "Administrator" : "Member"}
                      </div>
                    </div>
                    {role === "ADMIN" && (
                      <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--t3)" }}>
                        Akses penuh ke panel admin
                      </span>
                    )}
                  </div>

                  {/* Nama */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Nama kamu..."
                      style={{
                        background: "var(--bg)", border: "1px solid var(--b)",
                        padding: "13px 16px", borderRadius: "var(--r-pill)",
                        color: "var(--t)", fontSize: "14px", outline: "none",
                        transition: "border-color 0.15s",
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = "var(--ho)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "var(--b)")}
                    />
                  </div>

                  {/* Email (read-only) */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                      Email
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="email"
                        value={session?.user?.email ?? ""}
                        disabled
                        style={{
                          flex: 1, background: "var(--bg)", border: "1px solid var(--b)",
                          padding: "13px 16px", borderRadius: "var(--r-pill)",
                          color: "var(--t2)", fontSize: "14px", opacity: 0.6,
                        }}
                      />
                      <span style={{
                        fontSize: "11px", padding: "4px 10px", borderRadius: "var(--r-pill)",
                        background: "var(--gnb)", color: "var(--gn)",
                        border: "1px solid var(--gbd)", fontWeight: 700, whiteSpace: "nowrap",
                      }}>
                        Google OAuth
                      </span>
                    </div>
                    <p style={{ fontSize: "11px", color: "var(--t3)", margin: 0 }}>
                      Email terhubung via Google dan tidak bisa diubah.
                    </p>
                  </div>

                  {/* Tombol simpan */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                    <button
                      onClick={handleSaveAccount}
                      disabled={isPending}
                      className="btn btn-honey btn-md"
                      style={{ opacity: isPending ? 0.7 : 1, cursor: isPending ? "not-allowed" : "pointer" }}
                    >
                      {isPending ? (
                        <>
                          <i className="ph-fill ph-spinner" style={{ animation: "spin 1s linear infinite" }} />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <i className="ph-fill ph-floppy-disk" />
                          Simpan Perubahan
                        </>
                      )}
                    </button>
                    <span style={{ fontSize: "12px", color: "var(--t3)" }}>
                      Untuk edit bio, skills, dan foto — buka halaman{" "}
                      <a href="/profile" style={{ color: "var(--ho)", fontWeight: 600 }}>Profil</a>
                    </span>
                  </div>
                </div>
              )}

              {/* ── Tab: Tampilan ── */}
              {activeTab === "appearance" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "20px", background: "var(--bg)", border: "1px solid var(--b)", borderRadius: "var(--r-pill)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <i className="ph-fill ph-moon" style={{ fontSize: "22px", color: "var(--ho)" }} />
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--t)", fontSize: "14px" }}>Dark Mode</div>
                        <div style={{ fontSize: "12px", color: "var(--t2)", marginTop: "2px" }}>
                          BeeMate menggunakan dark mode secara default.
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: "11px", padding: "4px 10px", borderRadius: "var(--r-pill)",
                      background: "var(--hbg)", color: "var(--ho)",
                      border: "1px solid var(--hbd)", fontWeight: 700,
                    }}>
                      Aktif
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--t3)", margin: 0 }}>
                    Gunakan tombol 🌙 / ☀️ di navbar untuk toggle tema.
                  </p>
                </div>
              )}

              {/* ── Tab: Notifikasi ── */}
              {activeTab === "notifications" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {notifSaved && (
                    <div style={{
                      padding: "10px 16px", borderRadius: "var(--r-pill)",
                      background: "var(--gnb)", border: "1px solid var(--gbd)",
                      color: "var(--gn)", fontWeight: 700, fontSize: "12px",
                    }}>
                      ✓ Preferensi disimpan
                    </div>
                  )}
                  <PrefRow
                    icon="ph-users"
                    label="Undangan Tim"
                    desc="Notifikasi saat kamu diundang ke sebuah tim"
                    checked={notifPrefs.teamInvite}
                    onChange={v => updateNotifPref("teamInvite", v)}
                  />
                  <PrefRow
                    icon="ph-check-circle"
                    label="Undangan Diterima"
                    desc="Notifikasi saat undanganmu diterima anggota"
                    checked={notifPrefs.inviteAccepted}
                    onChange={v => updateNotifPref("inviteAccepted", v)}
                  />
                  <PrefRow
                    icon="ph-trophy"
                    label="Kompetisi Baru"
                    desc="Notifikasi saat ada kompetisi baru ditambahkan"
                    checked={notifPrefs.newCompetition}
                    onChange={v => updateNotifPref("newCompetition", v)}
                  />
                  <PrefRow
                    icon="ph-newspaper"
                    label="Digest Mingguan"
                    desc="Ringkasan aktivitas platform setiap minggu"
                    checked={notifPrefs.weeklyDigest}
                    onChange={v => updateNotifPref("weeklyDigest", v)}
                  />
                  <p style={{ fontSize: "11px", color: "var(--t3)", marginTop: "4px" }}>
                    Preferensi disimpan di perangkat ini. Notifikasi email akan hadir di update berikutnya.
                  </p>
                </div>
              )}

              {/* ── Tab: Privasi ── */}
              {activeTab === "privacy" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                  {/* Info keamanan */}
                  <div style={{
                    padding: "18px 20px", background: "var(--gnb)",
                    border: "1px solid var(--gbd)", borderRadius: "var(--r-pill)",
                    display: "flex", gap: "14px", alignItems: "flex-start",
                  }}>
                    <i className="ph-fill ph-shield-check" style={{ fontSize: "22px", color: "var(--gn)", flexShrink: 0, marginTop: "2px" }} />
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--gn)", fontSize: "14px", marginBottom: "4px" }}>
                        Akun Terlindungi
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--t2)", lineHeight: 1.6 }}>
                        Akunmu terhubung via Google OAuth. Password dikelola oleh Google — BeeMate tidak menyimpan password.
                      </div>
                    </div>
                  </div>

                  {/* Info data */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      { icon: "ph-eye", label: "Profil Publik", desc: "Nama, title, dan skills kamu bisa dilihat pengguna lain di People Directory" },
                      { icon: "ph-lock", label: "Email Privat", desc: "Alamat emailmu tidak ditampilkan ke pengguna lain" },
                      { icon: "ph-database", label: "Data Tersimpan", desc: "Nama, bio, skills, dan foto profil disimpan di database BeeMate" },
                    ].map(item => (
                      <div key={item.label} style={{
                        display: "flex", gap: "14px", alignItems: "flex-start",
                        padding: "16px 18px", background: "var(--bg)",
                        border: "1px solid var(--b)", borderRadius: "var(--r-pill)",
                      }}>
                        <i className={`ph-fill ${item.icon}`} style={{ fontSize: "18px", color: "var(--t3)", flexShrink: 0, marginTop: "2px" }} />
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--t)", fontSize: "13px", marginBottom: "3px" }}>{item.label}</div>
                          <div style={{ fontSize: "12px", color: "var(--t2)", lineHeight: 1.6 }}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Danger zone */}
                  <div style={{
                    padding: "20px", background: "var(--rdb)",
                    border: "1px solid var(--rbd)", borderRadius: "var(--r-pill)",
                  }}>
                    <div style={{ fontWeight: 700, color: "var(--rd)", fontSize: "14px", marginBottom: "6px" }}>
                      Danger Zone
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--t2)", marginBottom: "14px", lineHeight: 1.6 }}>
                      Menghapus akun akan menghapus semua data profilmu secara permanen. Tim yang kamu pimpin akan ikut terhapus.
                    </p>

                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        style={{
                          padding: "9px 18px", borderRadius: "var(--r-pill)", border: "1px solid var(--rbd)",
                          background: "transparent", color: "var(--rd)",
                          fontWeight: 700, fontSize: "13px", cursor: "pointer",
                        }}
                      >
                        <i className="ph-fill ph-trash" style={{ marginRight: "6px" }} />
                        Hapus Akun
                      </button>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <p style={{ fontSize: "12px", color: "var(--rd)", fontWeight: 600 }}>
                          Ketik <strong>HAPUS</strong> untuk konfirmasi:
                        </p>
                        <input
                          type="text"
                          value={deleteInput}
                          onChange={e => setDeleteInput(e.target.value)}
                          placeholder="Ketik HAPUS"
                          style={{
                            background: "var(--bg)", border: "1px solid var(--rbd)",
                            padding: "10px 14px", borderRadius: "var(--r-pill)",
                            color: "var(--t)", fontSize: "13px", outline: "none",
                          }}
                        />
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                            className="btn btn-dark btn-sm"
                          >
                            Batal
                          </button>
                          <button
                            disabled={deleteInput !== "HAPUS" || isDeleting}
                            onClick={() => {
                              if (deleteInput !== "HAPUS") return;
                              startDeleteTransition(async () => {
                                const result = await deleteAccount();
                                if (result.success) {
                                  await signOut({ callbackUrl: "/" });
                                } else {
                                  show(result.error ?? "Gagal menghapus akun", "err");
                                  setShowDeleteConfirm(false);
                                  setDeleteInput("");
                                }
                              });
                            }}
                            style={{
                              padding: "7px 16px", borderRadius: "var(--r-pill)",
                              border: "1px solid var(--rbd)",
                              background: deleteInput === "HAPUS" ? "var(--rd)" : "transparent",
                              color: deleteInput === "HAPUS" ? "#fff" : "var(--rd)",
                              fontWeight: 700, fontSize: "13px",
                              cursor: deleteInput === "HAPUS" ? "pointer" : "not-allowed",
                              opacity: isDeleting ? 0.7 : 1,
                              transition: "all 0.15s",
                            }}
                          >
                            {isDeleting ? "Menghapus..." : "Ya, Hapus Akun"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

