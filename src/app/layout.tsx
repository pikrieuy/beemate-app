import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { GlobalGrid } from "@/components/ui/GlobalGrid";

const sora = Sora({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"], variable: "--font-sora" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-jakarta" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "BeeMate — Find Your Hive",
  description: "Platform matchmaking mutakhir kampus.",
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
        </Providers>
      </body>
    </html>
  );
}
