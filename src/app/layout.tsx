import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { GlobalGrid } from "@/components/ui/GlobalGrid";
import { Analytics } from "@vercel/analytics/next";

const sora = Sora({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"], variable: "--font-sora" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-jakarta" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-jetbrains" });

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://beemate.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "BeeMate — Find Your Hive",
    template: "%s | BeeMate",
  },
  description:
    "Platform untuk mempertemukan Hacker, Hustler, dan Hipster — bentuk tim, ikuti kompetisi, dan temukan rekan kerja kampus.",
  keywords: ["hackathon", "startup team", "kampus", "kompetisi", "tim", "BeeMate"],
  authors: [{ name: "BeeMate" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: appUrl,
    siteName: "BeeMate",
    title: "BeeMate — Find Your Hive",
    description:
      "Platform matchmaking untuk Hacker, Hustler, dan Hipster di kampus.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeeMate — Find Your Hive",
    description:
      "Platform matchmaking untuk Hacker, Hustler, dan Hipster di kampus.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { Providers } from "@/components/layout/providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-theme="dark" suppressHydrationWarning>
      <head>
        <script src="https://unpkg.com/@phosphor-icons/web@2.1.1" async></script>
      </head>
      <body className={`${sora.variable} ${jakarta.variable} ${jetbrains.variable}`}>
        <Providers>
          <GlobalGrid />
          <Navbar />
          <BottomNav />
          <div id="app">
            {children}
          </div>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
