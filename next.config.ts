import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "wtegmqkajcdajbjdmvcu.supabase.co" },
      { protocol: "https", hostname: "vifjovdfiowpiqldphxn.supabase.co" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "X-DNS-Prefetch-Control", value: "on" },
        { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https://wtegmqkajcdajbjdmvcu.supabase.co https://vifjovdfiowpiqldphxn.supabase.co https://lh3.googleusercontent.com https://api.dicebear.com; font-src 'self' data:; connect-src 'self' https://wtegmqkajcdajbjdmvcu.supabase.co https://vifjovdfiowpiqldphxn.supabase.co wss://vifjovdfiowpiqldphxn.supabase.co https://va.vercel-scripts.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
      ],
    },
  ],
};

export default nextConfig;
