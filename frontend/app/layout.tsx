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
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css"
          integrity="sha384-zh0CI7EZf9yIDtoIn8zOxqZIWoANf77ksmG6M3B0bS3m1h4T1yK/U4Z07XhByf00"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  );
}
