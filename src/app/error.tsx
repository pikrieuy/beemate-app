"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="page on"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", maxWidth: "480px" }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
            color: "#ef4444",
            margin: "0 auto 24px",
          }}
        >
          <i className="ph-fill ph-warning-circle"></i>
        </div>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "var(--t)",
            marginBottom: "12px",
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "var(--t2)",
            lineHeight: 1.7,
            marginBottom: "32px",
          }}
        >
          An unexpected error occurred. Please try again or go back to the dashboard.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button className={buttonVariants({ variant: "honey" })} onClick={reset}>
            <i className="ph-fill ph-arrow-clockwise"></i> Try Again
          </button>
          <button
            className={buttonVariants({ variant: "default" })}
            style={{ background: "var(--bg2)", border: "1px solid var(--bdr)", color: "var(--t)" }}
            onClick={() => router.push("/dashboard")}
          >
            <i className="ph-fill ph-house"></i> Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
