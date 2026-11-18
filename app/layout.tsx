import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken" });

// The public portfolio is served from public/index.html and does not use this layout.
export const metadata: Metadata = {
  title: "Ferdinand Taslim",
  icons: { icon: "/assets/images/favicon-48.png", apple: "/assets/images/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#0b1f1d",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={hanken.variable}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
