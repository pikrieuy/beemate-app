"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  acceptTeamInvitation,
  rejectTeamInvitation,
} from "@/actions";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  sender: { id: string; name: string | null; image: string | null } | null;
}

interface Invitation {
  id: string;
  teamId: string;
  userId: string;
  joinStatus: string;
  createdAt: Date;
  team: {
    id: string;
    name: string;
    description: string | null;
    leader: { id: string; name: string | null; image: string | null };
  };
}

interface Props {
  notifications: Notification[];
  invitations: Invitation[];
}

function getTimeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "Baru saja";
  if (m < 60) return `${m} menit lalu`;
  if (h < 24) return `${h} jam lalu`;
  if (d < 7) return `${d} hari lalu`;
  return new Date(date).toLocaleDateString("id-ID");
}

function getNotifStyle(type: string) {
  switch (type) {
    case "INVITE": return { icon: "ph-handshake", color: "var(--bl)" };
    case "ACCEPT": return { icon: "ph-check-circle", color: "var(--gn)" };
    case "ALERT":  return { icon: "ph-bell", color: "var(--ho)" };
    default:       return { icon: "ph-info", color: "var(--t2)" };
  }
}

function getNotifTitle(type: string) {
  if (type === "INVITE") return "Undangan Tim";
  if (type === "ACCEPT") return "Undangan Diterima";
  if (type === "ALERT")  return "Pemberitahuan";
  return "Notifikasi";
}

export function NotificationsClient({ notifications: initial, invitations }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>(initial);
  const [processing, setProcessing] = useState<string | null>(null);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  const userId = (session?.user as any)?.id as string | undefined;

  // ── Realtime: notifikasi baru langsung muncul ──────────────────────────────
  useEffect(() => {
    if (!userId) return;

    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel(`notif-page:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Notification",
          filter: `recipientId=eq.${userId}`,
        },
        (payload) => {
          const raw = payload.new as any;
          const newNotif: Notification = {
            id: raw.id,
            type: raw.type,
            message: raw.message,
            isRead: raw.isRead ?? false,
            createdAt: new Date(raw.createdAt),
            sender: null, // sender detail tidak ada di payload, refresh untuk detail
          };
          setNotifications((prev) => [newNotif, ...prev]);
          setNewIds((prev) => new Set(prev).add(raw.id));
          // Hapus highlight setelah 4 detik
          setTimeout(() => {
            setNewIds((prev) => {
              const next = new Set(prev);
              next.delete(raw.id);
              return next;
            });
          }, 4000);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Notification",
          filter: `recipientId=eq.${userId}`,
        },
        (payload) => {
          const updated = payload.new as any;
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === updated.id ? { ...n, isRead: updated.isRead } : n
            )
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = async (id: string, isRead: boolean) => {
    if (!isRead) {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    }
  };

  const handleAccept = async (teamId: string) => {
    setProcessing(teamId);
    const result = await acceptTeamInvitation(teamId);
    if (result.success) router.refresh();
    else alert(result.error);
    setProcessing(null);
  };

  const handleReject = async (teamId: string) => {
    setProcessing(teamId);
    const result = await rejectTeamInvitation(teamId);
    if (result.success) router.refresh();
    else alert(result.error);
    setProcessing(null);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="page on" style={{ minHeight: "100vh", padding: "16px 24px 60px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "0 0 6px", color: "var(--t)" }}>
              Notifikasi
            </h1>
            <p style={{ fontSize: "13px", color: "var(--t2)", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
              {unreadCount > 0 ? (
                <>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
                  {unreadCount} belum dibaca
                </>
              ) : (
                "Semua sudah dibaca ✓"
              )}
              <span style={{ color: "var(--t3)", fontSize: "11px", marginLeft: "4px" }}>
                · Live via Realtime
              </span>
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              style={{ background: "transparent", border: "none", color: "var(--bl)", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}
            >
              Tandai semua dibaca
            </button>
          )}
        </div>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
              Undangan Tim ({invitations.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {invitations.map((inv, i) => (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: "var(--bg2)", border: "1px solid var(--hbd)",
                    borderRadius: "var(--r-pill)", padding: "20px",
                    position: "relative", overflow: "hidden",
                  }}
                >
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: "var(--ho)" }} />
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "42px", height: "42px", borderRadius: "50%",
                      background: "var(--hbg)", color: "var(--ho)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "20px", flexShrink: 0,
                    }}>
                      <i className="ph-fill ph-handshake" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: "14px", color: "var(--t)", marginBottom: "3px" }}>
                        {inv.team.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--t2)", marginBottom: "12px" }}>
                        Diundang oleh <strong>{inv.team.leader.name}</strong>
                        {inv.team.description && ` · "${inv.team.description}"`}
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="btn btn-honey btn-sm"
                          onClick={() => handleAccept(inv.teamId)}
                          disabled={processing === inv.teamId}
                        >
                          {processing === inv.teamId ? "Memproses..." : "Terima"}
                        </button>
                        <button
                          className="btn btn-dark btn-sm"
                          onClick={() => handleReject(inv.teamId)}
                          disabled={processing === inv.teamId}
                        >
                          Tolak
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
              Semua Notifikasi
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <AnimatePresence initial={false}>
                {notifications.map((notif, i) => {
                  const { icon, color } = getNotifStyle(notif.type);
                  const isNew = newIds.has(notif.id);
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: -12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: isNew ? 0 : i * 0.03 }}
                      onClick={() => handleNotificationClick(notif.id, notif.isRead)}
                      style={{
                        background: isNew
                          ? "rgba(245,166,35,0.06)"
                          : notif.isRead
                          ? "var(--bg)"
                          : "var(--bg2)",
                        border: `1px solid ${isNew ? "var(--hbd)" : "var(--b)"}`,
                        borderRadius: "var(--r-pill)",
                        padding: "16px 18px",
                        display: "flex",
                        gap: "14px",
                        alignItems: "flex-start",
                        cursor: notif.isRead ? "default" : "pointer",
                        position: "relative",
                        overflow: "hidden",
                        transition: "background 0.2s, border-color 0.2s",
                      }}
                    >
                      {/* Unread indicator */}
                      {!notif.isRead && (
                        <div style={{
                          position: "absolute", left: 0, top: 0, bottom: 0,
                          width: "3px", background: "var(--bl)",
                        }} />
                      )}
                      {/* New badge */}
                      {isNew && (
                        <span style={{
                          position: "absolute", top: "10px", right: "12px",
                          fontSize: "9px", fontWeight: 800, padding: "2px 7px",
                          borderRadius: "6px", background: "var(--hbg)",
                          color: "var(--ho)", border: "1px solid var(--hbd)",
                          textTransform: "uppercase", letterSpacing: "0.5px",
                        }}>
                          Baru
                        </span>
                      )}

                      <div style={{
                        width: "38px", height: "38px", borderRadius: "50%",
                        background: `${color}18`, color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "18px", flexShrink: 0,
                      }}>
                        <i className={`ph-fill ${icon}`} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px", gap: "8px" }}>
                          <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--t)" }}>
                            {getNotifTitle(notif.type)}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--t3)", flexShrink: 0 }}>
                            {getTimeAgo(notif.createdAt)}
                          </div>
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--t2)", lineHeight: 1.6 }}>
                          {notif.message}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        ) : invitations.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--t2)" }}>
            <i className="ph-fill ph-bell-slash" style={{ fontSize: "56px", marginBottom: "14px", display: "block", opacity: 0.4 }} />
            <p style={{ fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>Belum ada notifikasi</p>
            <p style={{ fontSize: "13px", color: "var(--t3)" }}>
              Notifikasi akan muncul otomatis saat ada undangan tim atau update baru.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

