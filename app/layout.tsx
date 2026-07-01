import type { Metadata, Viewport } from "next";
import { Lexend, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

// Corps de texte & UI — Lexend (police appliquée sur le body du site de référence)
const lexend = Lexend({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Titres — Plus Jakarta Sans (caractère éditorial de la DA)
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Chiffres / monospace ponctuel
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simulateur Crypto-monnaie | S'investir",
  description:
    "Simulez la performance d'un investissement en cryptomonnaie (one-shot ou DCA) à partir de données historiques.",
};

export const viewport: Viewport = {
  themeColor: "#080C16",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`dark ${lexend.variable} ${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
