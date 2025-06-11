import Script from "next/script";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/src/components/ui/toaster";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PLN UPT Tanjung Karang",
  description:
    "Situs resmi PLN Unit Pelaksana Transmisi (UPT) Tanjung Karang. Menyediakan informasi tentang layanan transmisi listrik, profil unit, berita terkini, serta inovasi teknologi kelistrikan di wilayah Lampung dan sekitarnya.",
  keywords: [
    // Identitas & Nama Resmi
    "PLN UPT Tanjung Karang",
    "PLN Lampung",
    "PLN Tanjung Karang",
    "PLN UPT",
    "Unit Pelaksana Transmisi",

    // Tujuan Pengunjung
    "Profil PLN Tanjung Karang",
    "Informasi Layanan Listrik",
    "Situs Resmi PLN Lampung",
    "Situs Resmi PLN UPT Tanjung Karang",
    "Layanan Transmisi PLN",
    "Berita Terkini PLN",

    // Wilayah Operasi
    "Tanjung Karang",
    "Lampung",

    // Umum & SEO Friendly
    "PLN Indonesia",
    "Transmisi Listrik",
    "Listrik Nasional",
    "Energi dan Infrastruktur",
    "Informasi Kelistrikan Publik"
  ],
  authors: [{ name: "PLN UPT Tanjung Karang" }],
  robots: "index, follow",
  other: {
    // "google-site-verification": "jJLF3H0UohOmp6uVZN-FzT21xRk0K0qAN561Xeqy1BA"
  },
  openGraph: {
    title: "PLN UPT Tanjung Karang – Layanan Transmisi Andal & Profesional",
    description:
      "Pelajari lebih lanjut tentang PLN UPT Tanjung Karang, unit strategis PLN dalam penyediaan dan pengelolaan transmisi listrik di Lampung.",
    // url: "https://pln-upt-tanjungkarang.co.id",
    siteName: "PLN UPT Tanjung Karang",
    images: [
      {
        url: "https://pln-upt-tanjungkarang.co.id/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PLN UPT Tanjung Karang"
      }
    ],
    locale: "id_ID",
    type: "website"
  },
  alternates: {
    // canonical: "https://pln-upt-tanjungkarang.co.id",
    media: {
      instagram: "https://www.instagram.com/upt_tanjung_karang/"
    }
  },
  // metadataBase: new URL("https://pln-upt-tanjungkarang.co.id")
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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

        {/* Main Layout Content */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
