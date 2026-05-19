"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getUnreadNotificationCount } from "@/actions";
import { useSession } from "next-auth/react";

export function NotificationBell() {
  const router = useRouter();
  const { data: session } = useSession();
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    if (!session?.user) return;
    const result = await getUnreadNotificationCount();
    if (result.success && typeof result.data === "number") {
      setCount(result.data);
    }
  }, [session]);

  useEffect(() => {
    fetchCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  return (
    <button
      className="nav-icon hide-on-mobile"
      onClick={() => router.push("/notifications")}
      style={{ position: "relative" }}
      aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ""}`}
    >
      <i className="ph-fill ph-bell lc"></i>
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
          }}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
