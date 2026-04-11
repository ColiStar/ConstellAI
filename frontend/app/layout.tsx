import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SWRProvider from "@/components/SWRProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConstellAI — Constellation Spatial Matrix",
  description:
    "Interactive research-paper starfield. Activate an Insight lens to see hidden constellations emerge from scattered stars.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  );
}
