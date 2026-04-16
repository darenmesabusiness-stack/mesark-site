import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export const metadata: Metadata = {
  metadataBase: new URL("https://mesark.net"),
  title: "MESA — ARK PvP Servers",
  description: "The #1 competitive ARK: Survival Evolved PvP server network. Solo, Duo, 3/6 Man, and 100x clusters.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "MESA — ARK PvP Servers",
    description: "The #1 competitive ARK PvP server network.",
    url: "https://mesark.net",
    siteName: "MESA ARK",
    images: ["/og-banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <AnimatedBackground />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
