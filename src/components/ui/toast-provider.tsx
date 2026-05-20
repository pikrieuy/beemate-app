"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface Toast {
  id: string;
  message: string;
  type?: "info" | "success" | "error" | "warning";
}

interface ToastContextType {
  showToast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id as string | undefined;

  const showToast = (message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  useEffect(() => {
    if (!session?.user || !userId) return;

    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel(`global_notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Notification",
          filter: `recipientId=eq.${userId}`,
        },
        (payload: any) => {
          if (payload.new && payload.new.message) {
            showToast(payload.new.message, "success");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, userId]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast container floating on screen */}
      <div
        style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: 999999,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          pointerEvents: "none",
          width: "360px",
          maxWidth: "calc(100vw - 48px)",
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            let bg = "var(--bg2)";
            let border = "1px solid var(--bdr)";
            let icon = "ph-fill ph-info";
            let iconColor = "var(--ho)";

            if (toast.type === "success") {
              bg = "rgba(16, 185, 129, 0.1)";
              border = "1px solid rgba(16, 185, 129, 0.3)";
              icon = "ph-fill ph-check-circle";
              iconColor = "#10b981";
            } else if (toast.type === "error") {
              bg = "rgba(239, 68, 68, 0.1)";
              border = "1px solid rgba(239, 68, 68, 0.3)";
              icon = "ph-fill ph-warning-circle";
              iconColor = "#ef4444";
            } else if (toast.type === "warning") {
              bg = "rgba(245, 158, 11, 0.1)";
              border = "1px solid rgba(245, 158, 11, 0.3)";
              icon = "ph-fill ph-warning";
              iconColor = "#f59e0b";
            }

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{
                  background: bg,
                  backdropFilter: "blur(12px)",
                  border,
                  borderRadius: "16px",
                  padding: "16px 20px",
                  color: "var(--t)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
                  pointerEvents: "auto",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id));
                }}
              >
                <i className={icon} style={{ fontSize: "22px", color: iconColor, flexShrink: 0 }}></i>
                <div style={{ fontSize: "14px", fontWeight: 600, lineHeight: 1.4, flex: 1 }}>
                  {toast.message}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
