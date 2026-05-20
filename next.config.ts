import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Only ignore errors in seed.ts (local-only script, not part of app build)
    // ignoreBuildErrors was removed — TS errors are now surfaced properly
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
};

export default nextConfig;
