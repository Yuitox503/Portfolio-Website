import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
});
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

// The public portfolio is served from public/index.html and does not use this layout.
export const metadata: Metadata = {
  title: "Ferdinand Taslim",
  icons: { icon: "/assets/images/logo.png", apple: "/assets/images/logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#13110f",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrument.variable} ${dmSans.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
