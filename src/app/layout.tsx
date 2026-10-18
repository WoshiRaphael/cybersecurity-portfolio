import type { Metadata, Viewport } from "next";
import { profile } from "@/data/profile";
import "@fontsource/space-grotesk/latin-400.css";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-600.css";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const metadata: Metadata = {
  title: `${profile.name} / ${profile.role} — Offensive Security Portfolio`,
  description:
    "An offensive security portfolio exploring adversary simulation, application security, attack paths, and the defenses that matter. All sample work is clearly identified.",
  icons: { icon: `${basePath}/icon.svg` },
  openGraph: {
    title: `${profile.name} / Offensive Security`,
    description: profile.specialization,
    type: "website",
  },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  themeColor: "#05080d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <noscript>
          <style>{`[data-reveal], .hero-copy, .hero-visual { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
