import React from "react";
import MainLayout from "@/src/components/layout";
import HeroSection from "@/src/components/landing-page/hero";
import MapSection from "@/src/components/landing-page/map";
import TeamSection from "@/src/components/landing-page/team";
import ContentSection from "@/src/components/landing-page/content";

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection
        title="PLN UPT Tanjung Karang"
        subtitle="Energi Untuk Kehidupan. Memberikan layanan listrik terbaik untuk wilayah X."
        ctaText="Hubungi Kami"
        ctaLink="/"
      />
      {/* Deskripsi/Tujuan/Visi & Misi */} <ContentSection/>
      {/* Manajer */} <TeamSection/>
      {/* Articles Highlight */}
      <MapSection />
    </MainLayout>
  );
}
