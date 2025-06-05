import React from "react";
import MainLayout from "@/src/components/layout";
import HeroSection from "@/src/components/landing-page/hero";
import MapSection from "@/src/components/landing-page/map";

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection
        title="PLN UPT Tanjung Karang"
        subtitle="Energi Untuk Kehidupan. Memberikan layanan listrik terbaik untuk wilayah X."
        ctaText="Hubungi Kami"
        ctaLink="/"
      />
      {/* Tujuan, Visi, Misi */}
      {/* Manajer */}
      {/* Articles Highlight */}
      <MapSection />
    </MainLayout>
  );
}
