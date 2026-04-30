import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { BottomNav } from "@/components/bottom-nav";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "ADL PWA",
  description: "Activity Daily Living Progressive Web App",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ADL PWA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <main className="flex-1 pb-16">{children}</main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
