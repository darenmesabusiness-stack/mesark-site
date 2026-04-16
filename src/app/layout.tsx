import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "MESA — ARK PvP Servers",
  description: "The #1 competitive ARK: Survival Evolved PvP server network. Solo, Duo, 3/6 Man, and 100x clusters.",
  icons: {
    icon: "https://cdn.discordapp.com/icons/1072737953895415858/44f5c6b6775e45774484da23a2b918c6.png?size=64",
  },
  openGraph: {
    title: "MESA — ARK PvP Servers",
    description: "The #1 competitive ARK PvP server network.",
    images: ["https://cdn.discordapp.com/banners/1072737953895415858/f0ef10aba925b9ff55b0ecf668411250.png?size=1024"],
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
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
