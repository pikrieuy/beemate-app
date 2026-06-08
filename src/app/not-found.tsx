"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

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
        {/* Big 404 */}
        <div
          style={{
            fontSize: "120px",
            fontWeight: 900,
            lineHeight: 1,
            background: "linear-gradient(135deg, var(--ho), #ffc04d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "16px",
            fontFamily: "'Sora', sans-serif",
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "var(--t)",
            marginBottom: "12px",
          }}
        >
          Page not found
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "var(--t2)",
            lineHeight: 1.7,
            marginBottom: "32px",
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            className={buttonVariants({ variant: "honey" })}
            onClick={() => router.push("/dashboard")}
          >
            <i className="ph-fill ph-house"></i> Go to Dashboard
          </button>
          <button
            className={buttonVariants({ variant: "default" })}
            style={{ background: "var(--bg2)", border: "1px solid var(--bdr)", color: "var(--t)" }}
            onClick={() => router.back()}
          >
            <i className="ph-fill ph-arrow-left"></i> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
