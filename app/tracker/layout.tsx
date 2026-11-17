import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tracker",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function TrackerRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
