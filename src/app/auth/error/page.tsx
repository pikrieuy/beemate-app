"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const ERROR_MESSAGES: Record<string, { title: string; desc: string }> = {
  Configuration: {
    title: "Konfigurasi Bermasalah",
    desc: "Ada masalah pada konfigurasi server. Hubungi admin jika masalah berlanjut.",
  },
  AccessDenied: {
    title: "Akses Ditolak",
    desc: "Kamu tidak memiliki izin untuk masuk. Pastikan menggunakan akun yang benar.",
  },
  Verification: {
    title: "Link Kadaluarsa",
    desc: "Link verifikasi sudah tidak valid atau sudah digunakan.",
  },
  OAuthSignin: {
    title: "Gagal Memulai Login",
    desc: "Terjadi kesalahan saat memulai proses login dengan Google.",
  },
  OAuthCallback: {
    title: "Gagal Callback OAuth",
    desc: "Terjadi kesalahan saat menerima respons dari Google.",
  },
  OAuthAccountNotLinked: {
    title: "Akun Belum Terhubung",
    desc: "Email ini sudah terdaftar dengan metode login lain.",
  },
  Default: {
    title: "Terjadi Kesalahan",
    desc: "Proses autentikasi gagal. Silakan coba lagi.",
  },
};

function AuthErrorContent() {
  const params = useSearchParams();
  const errorCode = params.get("error") ?? "Default";
  const error = ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.Default;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        background: "var(--bg2)",
        border: "1px solid var(--rbd)",
        borderRadius: "24px",
        padding: "48px 40px",
        maxWidth: "480px",
        width: "100%",
        textAlign: "center",
      }}>
        {/* Icon */}
        <div style={{
          width: "64px", height: "64px", borderRadius: "18px",
          background: "var(--rdb)", border: "1px solid var(--rbd)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "32px", color: "var(--rd)",
          margin: "0 auto 24px",
        }}>
          <i className="ph-fill ph-warning-circle" />
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: "22px", fontWeight: 900,
          color: "var(--t)", marginBottom: "12px",
        }}>
          {error.title}
        </h1>

        {/* Description */}
        <p style={{
          fontSize: "14px", color: "var(--t2)",
          lineHeight: 1.6, marginBottom: "8px",
        }}>
          {error.desc}
        </p>

        {/* Error code */}
        <div style={{
          display: "inline-block",
          background: "var(--bg3)", border: "1px solid var(--b)",
          padding: "4px 12px", borderRadius: "100px",
          fontSize: "11px", color: "var(--t3)", fontWeight: 600,
          marginBottom: "32px",
        }}>
          Error: {errorCode}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/api/auth/signin" style={{ textDecoration: "none" }}>
            <button className="btn btn-honey">
              <i className="ph-fill ph-sign-in" /> Coba Login Lagi
            </button>
          </Link>
          <Link href="/" style={{ textDecoration: "none" }}>
            <button className="btn" style={{ background: "var(--bg3)", border: "1px solid var(--b)", color: "var(--t)" }}>
              <i className="ph-fill ph-house" /> Ke Beranda
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorContent />
    </Suspense>
  );
}
