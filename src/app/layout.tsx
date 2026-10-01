import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Barlow, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { serverTotal } from "@/data/servers";

const display = Big_Shoulders({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  variable: "--font-big-shoulders",
  display: "swap",
  // No metric overrides exist for this family; use an explicit narrow fallback.
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "sans-serif"],
});

const body = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mesark.net"),
  title: "MESA — ARK PvP Servers",
  description: "The #1 competitive ARK: Survival Evolved PvP server network. Solo, Duo, 3/4 Man, and 100x clusters. Weekly wipes, real cash prizes.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "MESA — Every wipe is a war.",
    description: `The #1 competitive ARK PvP server network. ${serverTotal} servers, weekly wipes, Hall of Fame cash prizes.`,
    url: "https://mesark.net",
    siteName: "MESA ARK",
    images: [{ url: "/og-ark.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-ark.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#07080b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <div className="grain" aria-hidden />
        <Analytics />
      </body>
    </html>
  );
}
