"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUnreadNotificationCount } from "@/actions";
import { useSession } from "next-auth/react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function NotificationBell() {
  const router = useRouter();
  const { data: session } = useSession();
  const [count, setCount] = useState(0);
  const [pulse, setPulse] = useState(false);
  const channelRef = useRef<ReturnType<ReturnType<typeof getSupabaseBrowserClient>["channel"]> | null>(null);

  const fetchCount = useCallback(async () => {
    if (!session?.user) return;
    const result = await getUnreadNotificationCount();
    if (result.success && typeof result.data === "number") {
      setCount(result.data);
    }
  }, [session]);

  // Ambil userId dari session untuk filter realtime hanya notif milik user ini
  const userId = (session?.user as any)?.id as string | undefined;

  useEffect(() => {
    if (!session?.user || !userId) return;

    // Fetch awal
    fetchCount();

    // Setup Supabase Realtime subscription
    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Notification",
          filter: `recipientId=eq.${userId}`,
        },
        () => {
          // Notifikasi baru masuk — update count + animasi pulse
          setCount((prev) => prev + 1);
          setPulse(true);
          setTimeout(() => setPulse(false), 2000);
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
        () => {
          // Notifikasi di-mark read — re-fetch count
          fetchCount();
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, userId, fetchCount]);

  return (
    <button
      className="nav-icon hide-on-mobile"
      onClick={() => router.push("/notifications")}
      style={{ position: "relative" }}
      aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ""}`}
    >
      <i
        className="ph-fill ph-bell lc"
        style={{
          transition: "transform 0.2s",
          transform: pulse ? "rotate(20deg)" : "rotate(0deg)",
        }}
      />
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            minWidth: "16px",
            height: "16px",
            borderRadius: "100px",
            background: "#ef4444",
            color: "#fff",
            fontSize: "10px",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
            lineHeight: 1,
            animation: pulse ? "notif-pop 0.3s ease" : "none",
          }}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
      <style>{`
        @keyframes notif-pop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
      `}</style>
    </button>
  );
}
