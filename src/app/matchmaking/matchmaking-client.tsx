"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getDeveloperRecommendationsForTeam, 
  getTeamRecommendationsForUser, 
  inviteUserToTeam, 
  requestToJoinTeam 
} from "@/actions";

interface UserTeams {
  id: string;
  name: string;
}

interface MatchmakingClientProps {
  currentUser: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    title: string | null;
    skills: string[];
  };
  userTeams: UserTeams[];
}

export function MatchmakingClient({ currentUser, userTeams }: MatchmakingClientProps) {
  // Tabs: "find-members" (Cari Rekan) atau "find-teams" (Cari Tim)
  const [activeTab, setActiveTab] = useState(() => {
    return userTeams.length > 0 ? "find-members" : "find-teams";
  });

  // States untuk Cari Rekan
  const [selectedTeamId, setSelectedTeamId] = useState(userTeams[0]?.id || "");
  const [devRecs, setDevRecs] = useState<any[]>([]);
  const [missingRoles, setMissingRoles] = useState<string[]>([]);
  const [currentRoles, setCurrentRoles] = useState<string[]>([]);
  const [loadingDevs, setLoadingDevs] = useState(false);

  // States untuk Cari Tim
  const [teamRecs, setTeamRecs] = useState<any[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  // General States
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch Rekomendasi Developer
  const fetchDevRecommendations = async (teamId: string) => {
    if (!teamId) return;
    try {
      setLoadingDevs(true);
      const res = await getDeveloperRecommendationsForTeam(teamId);
      if (res.success && res.data) {
        setDevRecs(res.data.recommendations);
        setMissingRoles(res.data.missingRoles);
        setCurrentRoles(res.data.currentRoles);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDevs(false);
    }
  };

  // Fetch Rekomendasi Tim
  const fetchTeamRecommendations = async () => {
    try {
      setLoadingTeams(true);
      const res = await getTeamRecommendationsForUser();
      if (res.success && res.data) {
        setTeamRecs(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTeams(false);
    }
  };

  useEffect(() => {
    if (activeTab === "find-members" && selectedTeamId) {
      fetchDevRecommendations(selectedTeamId);
    } else if (activeTab === "find-teams") {
      fetchTeamRecommendations();
    }
  }, [activeTab, selectedTeamId]);

  // Handle Undang Instan
  const handleInvite = async (userId: string) => {
    if (!selectedTeamId) return;
    try {
      setActionLoading(`invite-${userId}`);
      const res = await inviteUserToTeam(selectedTeamId, userId);
      if (res.success) {
        setSuccessMessage("Undangan instan berhasil dikirim!");
        setTimeout(() => setSuccessMessage(null), 3000);
        // Update local state
        setDevRecs(prev => 
          prev.map(item => 
            item.user.id === userId 
              ? { ...item, isAlreadyInvited: true } 
              : item
          )
        );
      } else {
        alert(res.error || "Gagal mengundang developer");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Minta Bergabung
  const handleJoinRequest = async (teamId: string) => {
    try {
      setActionLoading(`join-${teamId}`);
      const res = await requestToJoinTeam(teamId);
      if (res.success) {
        setSuccessMessage("Permintaan bergabung berhasil dikirim ke leader!");
        setTimeout(() => setSuccessMessage(null), 3000);
        // Remove or update the local recommended team list on success
        setTeamRecs(prev => prev.filter(item => item.team.id !== teamId));
      } else {
        alert(res.error || "Gagal mengirim permintaan bergabung");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Helper untuk rendering badge role dengan warna khas BeeMate
  const renderRoleBadge = (role: string) => {
    const r = role.toUpperCase();
    let bg = "rgba(148, 163, 184, 0.1)";
    let color = "var(--t2)";
    let border = "1px solid rgba(148, 163, 184, 0.2)";

    if (r === "HACKER") {
      bg = "rgba(245, 166, 35, 0.1)";
      color = "var(--ho)";
      border = "1px solid rgba(245, 166, 35, 0.3)";
    } else if (r === "HUSTLER") {
      bg = "rgba(45, 214, 122, 0.1)";
      color = "#2dd67a";
      border = "1px solid rgba(45, 214, 122, 0.3)";
    } else if (r === "HIPSTER") {
      bg = "rgba(167, 139, 250, 0.1)";
      color = "#a78bfa";
      border = "1px solid rgba(167, 139, 250, 0.3)";
    }

    return (
      <span
        style={{
          background: bg,
          color,
          border,
          fontSize: "11px",
          fontWeight: 800,
          padding: "3px 8px",
          borderRadius: "6px",
          textTransform: "uppercase",
          letterSpacing: "0.03em",
        }}
      >
        {role}
      </span>
    );
  };

  return (
    <div className="page on">
      <div className="main" style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 20px" }}>
        
        {/* Banner Alert Sukses */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                color: "#10b981",
                padding: "16px 20px",
                borderRadius: "16px",
                marginBottom: "24px",
                fontWeight: 700,
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <i className="ph-fill ph-check-circle" style={{ fontSize: "20px" }}></i>
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "clamp(32px, 5vw, 44px)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--t)",
              margin: "0 0 12px 0",
            }}
          >
            💡 Portal <span style={{ background: "linear-gradient(90deg, var(--ho), #ffbe4d)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Matchmaking</span>
          </h1>
          <p style={{ color: "var(--t2)", fontSize: "16px", maxWidth: "600px", lineHeight: 1.6, margin: 0 }}>
            Temukan kolaborator dengan role pelengkap (Hacker, Hustler, Hipster) secara instan berdasarkan algoritma BeeMate.
          </p>
        </div>

        {/* TABS SWITCHER */}
        <div 
          style={{ 
            display: "flex", 
            gap: "8px", 
            background: "var(--bg2)", 
            padding: "6px", 
            borderRadius: "14px", 
            border: "1px solid var(--bdr)",
            marginBottom: "36px",
            width: "max-content",
            maxWidth: "100%"
          }}
        >
          <button
            onClick={() => userTeams.length > 0 && setActiveTab("find-members")}
            disabled={userTeams.length === 0}
            style={{
              background: activeTab === "find-members" ? "var(--bg)" : "transparent",
              border: "none",
              color: activeTab === "find-members" ? "var(--t)" : "var(--t3)",
              fontWeight: activeTab === "find-members" ? 800 : 500,
              padding: "10px 20px",
              borderRadius: "10px",
              cursor: userTeams.length > 0 ? "pointer" : "not-allowed",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s",
              opacity: userTeams.length === 0 ? 0.5 : 1
            }}
          >
            <i className="ph-fill ph-users-three"></i>
            Cari Rekan untuk Tim
          </button>
          <button
            onClick={() => setActiveTab("find-teams")}
            style={{
              background: activeTab === "find-teams" ? "var(--bg)" : "transparent",
              border: "none",
              color: activeTab === "find-teams" ? "var(--t)" : "var(--t3)",
              fontWeight: activeTab === "find-teams" ? 800 : 500,
              padding: "10px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
          >
            <i className="ph-fill ph-shield-star"></i>
            Cari Tim untuk Saya
          </button>
        </div>

        {/* CONTENT PANELS */}
        <AnimatePresence mode="wait">
          {activeTab === "find-members" ? (
            <motion.div
              key="find-members"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* Dropdown Pemilih Tim */}
              <div 
                style={{ 
                  background: "var(--bg2)", 
                  border: "1px solid var(--bdr)", 
                  borderRadius: "24px", 
                  padding: "24px",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px",
                  marginBottom: "32px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                  <label style={{ fontSize: "14px", fontWeight: 700, color: "var(--t2)" }}>Pilih Tim Anda:</label>
                  <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "12px",
                      border: "1px solid var(--bdr)",
                      background: "var(--bg)",
                      color: "var(--t)",
                      fontSize: "14px",
                      fontWeight: 600,
                      outline: "none",
                      minWidth: "220px",
                    }}
                  >
                    {userTeams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Status Ringkasan Tim */}
                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ fontSize: "13px", color: "var(--t3)" }}>Role Terisi:</div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {currentRoles.map(r => (
                      <span key={r} style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--bdr)", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", color: "var(--t2)" }}>
                        {r}
                      </span>
                    ))}
                  </div>
                  {missingRoles.length > 0 && (
                    <>
                      <div style={{ fontSize: "13px", color: "var(--t3)", marginLeft: "12px" }}>Mencari:</div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {missingRoles.map(r => renderRoleBadge(r))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Grid Rekomendasi Developers */}
              {loadingDevs ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                  <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : devRecs.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
                  {devRecs.map(({ user: u, score, isAlreadyInvited }) => (
                    <motion.div
                      key={u.id}
                      style={{
                        background: "var(--bg2)",
                        border: "1px solid var(--bdr)",
                        borderRadius: "24px",
                        padding: "24px",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        overflow: "hidden",
                      }}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Score Glow Badge */}
                      <div
                        style={{
                          position: "absolute",
                          top: "24px",
                          right: "24px",
                          background: "linear-gradient(135deg, rgba(245, 166, 35, 0.15) 0%, rgba(255, 192, 77, 0.15) 100%)",
                          color: "var(--ho)",
                          fontSize: "12px",
                          fontWeight: 800,
                          padding: "4px 10px",
                          borderRadius: "100px",
                          border: "1px solid rgba(245, 166, 35, 0.25)",
                        }}
                      >
                        Match Score: {score}
                      </div>

                      {/* User Info */}
                      <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px" }}>
                        <div
                          style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "1px solid var(--bdr)",
                          }}
                        >
                          {u.image ? (
                            <img src={u.image} alt={u.name || "User"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", background: "var(--ho)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "18px" }}>
                              {u.name?.[0].toUpperCase() || "U"}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--t)", margin: "0 0 6px 0" }}>
                            {u.name}
                          </h3>
                          {u.title ? renderRoleBadge(u.title) : (
                            <span style={{ fontSize: "11px", color: "var(--t3)", fontStyle: "italic" }}>Belum menentukan role</span>
                          )}
                        </div>
                      </div>

                      {/* Bio */}
                      <p 
                        style={{ 
                          fontSize: "13px", 
                          color: "var(--t2)", 
                          lineHeight: 1.6, 
                          margin: "0 0 20px 0",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          flex: 1
                        }}
                      >
                        {u.bio || "Tidak ada biodata dibagikan."}
                      </p>

                      {/* Skills */}
                      <div style={{ marginBottom: "24px" }}>
                        <div style={{ fontSize: "11px", color: "var(--t3)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.03em", marginBottom: "8px" }}>Skills:</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {u.skills.length > 0 ? (
                            u.skills.map((skill: string) => {
                              return (
                                <span
                                  key={skill}
                                  style={{
                                    background: "rgba(255, 255, 255, 0.04)",
                                    border: "1px solid var(--bdr)",
                                    borderRadius: "8px",
                                    padding: "4px 8px",
                                    fontSize: "11px",
                                    color: "var(--t2)",
                                  }}
                                >
                                  {skill}
                                </span>
                              );
                            })
                          ) : (
                            <span style={{ fontSize: "12px", color: "var(--t3)", fontStyle: "italic" }}>Tidak ada keahlian dicantumkan</span>
                          )}
                        </div>
                      </div>

                      {/* Invite Button */}
                      <button
                        onClick={() => handleInvite(u.id)}
                        disabled={isAlreadyInvited || actionLoading === `invite-${u.id}`}
                        className={`btn ${isAlreadyInvited ? "btn-dark" : "btn-honey"}`}
                        style={{ width: "100%", justifyContent: "center" }}
                      >
                        {actionLoading === `invite-${u.id}` ? (
                          "Mengundang..."
                        ) : isAlreadyInvited ? (
                          <>
                            <i className="ph-fill ph-check-circle" style={{ marginRight: "6px" }}></i>
                            Sudah Diundang
                          </>
                        ) : (
                          <>
                            <i className="ph-fill ph-paper-plane-tilt" style={{ marginRight: "6px" }}></i>
                            Undang Instan
                          </>
                        )}
                      </button>

                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ background: "var(--bg2)", border: "1px solid var(--bdr)", borderRadius: "24px", padding: "60px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: "64px", marginBottom: "20px" }}>🐝</div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--t)", marginBottom: "8px" }}>Belum ada rekomendasi</h3>
                  <p style={{ color: "var(--t2)", fontSize: "14px" }}>Semua developer aktif telah terdaftar dalam tim Anda.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="find-teams"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {loadingTeams ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                  <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : teamRecs.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
                  {teamRecs.map(({ team: t, score, matchingSkills }) => {
                    // Cek role yang sudah ada di tim
                    const teamRoles: string[] = [];
                    if (t.leader.title) teamRoles.push(t.leader.title.toUpperCase());
                    t.members.forEach((m: any) => {
                      if (m.user.title) teamRoles.push(m.user.title.toUpperCase());
                    });

                    // Cari role yang masih kosong
                    const missing = ["HACKER", "HUSTLER", "HIPSTER"].filter(r => !teamRoles.includes(r));

                    return (
                      <motion.div
                        key={t.id}
                        style={{
                          background: "var(--bg2)",
                          border: "1px solid var(--bdr)",
                          borderRadius: "24px",
                          padding: "24px",
                          display: "flex",
                          flexDirection: "column",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Match Score */}
                        <div
                          style={{
                            position: "absolute",
                            top: "24px",
                            right: "24px",
                            background: "linear-gradient(135deg, rgba(245, 166, 35, 0.15) 0%, rgba(255, 192, 77, 0.15) 100%)",
                            color: "var(--ho)",
                            fontSize: "12px",
                            fontWeight: 800,
                            padding: "4px 10px",
                            borderRadius: "100px",
                            border: "1px solid rgba(245, 166, 35, 0.25)",
                          }}
                        >
                          Match: {score}
                        </div>

                        {/* Team Name & Leader */}
                        <div style={{ marginBottom: "20px" }}>
                          <h3 style={{ fontSize: "18px", fontWeight: 900, color: "var(--t)", margin: "0 0 6px 0" }}>
                            {t.name}
                          </h3>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--t3)" }}>
                            <span>Leader: <strong>{t.leader.name}</strong></span>
                          </div>
                        </div>

                        {/* Description */}
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--t2)",
                            lineHeight: 1.6,
                            margin: "0 0 20px 0",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            flex: 1
                          }}
                        >
                          {t.description || "Tidak ada deskripsi tim dibagikan."}
                        </p>

                        {/* Role Needs */}
                        <div style={{ marginBottom: "20px" }}>
                          <div style={{ fontSize: "11px", color: "var(--t3)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.03em", marginBottom: "8px" }}>Membutuhkan Peran:</div>
                          <div style={{ display: "flex", gap: "6px" }}>
                            {missing.length > 0 ? (
                              missing.map(r => renderRoleBadge(r))
                            ) : (
                              <span style={{ fontSize: "12px", color: "var(--t3)", fontStyle: "italic" }}>Tim sudah terisi lengkap</span>
                            )}
                          </div>
                        </div>

                        {/* Matching Skills */}
                        {matchingSkills.length > 0 && (
                          <div style={{ marginBottom: "24px" }}>
                            <div style={{ fontSize: "11px", color: "var(--t3)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.03em", marginBottom: "8px" }}>Keahlian Anda yang Cocok:</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                              {matchingSkills.map((skill: string) => (
                                <span
                                  key={skill}
                                  style={{
                                    background: "rgba(245, 166, 35, 0.12)",
                                    border: "1px solid var(--ho)",
                                    color: "var(--ho)",
                                    borderRadius: "8px",
                                    padding: "4px 8px",
                                    fontSize: "11px",
                                    fontWeight: 700
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Request Join */}
                        <button
                          onClick={() => handleJoinRequest(t.id)}
                          disabled={actionLoading === `join-${t.id}`}
                          className="btn btn-honey"
                          style={{ width: "100%", justifyContent: "center" }}
                        >
                          {actionLoading === `join-${t.id}` ? (
                            "Mengirim..."
                          ) : (
                            <>
                              <i className="ph-bold ph-plus-circle" style={{ marginRight: "6px" }}></i>
                              Minta Bergabung
                            </>
                          )}
                        </button>

                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ background: "var(--bg2)", border: "1px solid var(--bdr)", borderRadius: "24px", padding: "60px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: "64px", marginBottom: "20px" }}>🛡️</div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--t)", marginBottom: "8px" }}>Belum ada rekomendasi tim</h3>
                  <p style={{ color: "var(--t2)", fontSize: "14px" }}>Coba lengkapi role dan skills di profil Anda agar algoritma dapat bekerja maksimal.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
