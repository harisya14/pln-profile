import "./globals.css";
import Script from "next/script";
import type { Metadata } from "next";
import { Toaster } from "@/src/components/ui/toaster";
import { Poppins, Geist_Mono } from "next/font/google";

// Inisialisasi font
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PLN UPT Tanjung Karang",
  description:
    "Situs resmi PLN Unit Pelaksana Transmisi (UPT) Tanjung Karang. Menyediakan informasi tentang layanan transmisi listrik, profil unit, berita terkini, serta inovasi teknologi kelistrikan di wilayah Lampung dan sekitarnya.",
  keywords: [
    "PLN UPT Tanjung Karang",
    "PLN Lampung",
    "PLN Tanjung Karang",
    "PLN UPT",
    "Unit Pelaksana Transmisi",
    "Profil PLN Tanjung Karang",
    "Informasi Layanan Listrik",
    "Situs Resmi PLN Lampung",
    "Situs Resmi PLN UPT Tanjung Karang",
    "Layanan Transmisi PLN",
    "Berita Terkini PLN",
    "Tanjung Karang",
    "Lampung",
    "PLN Indonesia",
    "Transmisi Listrik",
    "Listrik Nasional",
    "Energi dan Infrastruktur",
    "Informasi Kelistrikan Publik",
  ],
  authors: [{ name: "PLN UPT Tanjung Karang" }],
  robots: "index, follow",
  openGraph: {
    title: "PLN UPT Tanjung Karang – Layanan Transmisi Andal & Profesional",
    description:
      "Pelajari lebih lanjut tentang PLN UPT Tanjung Karang, unit strategis PLN dalam penyediaan dan pengelolaan transmisi listrik di Lampung.",
    siteName: "PLN UPT Tanjung Karang",
    images: [
      {
        url: "https://pln-upt-tanjungkarang.co.id/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PLN UPT Tanjung Karang",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  alternates: {
    media: {
      instagram: "https://www.instagram.com/upt_tanjung_karang/",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${poppins.variable} ${geistMono.variable}`}>
      <head />
      <body className="antialiased font-sans">
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>

        {children}
        <Toaster />
      </body>
    </html>
  );
}
