"use client"

import React, { useEffect, useState } from "react"
import MainLayout from "@/src/components/layout"
import HeroSection from "@/src/components/landing-page/hero"
import MapSection from "@/src/components/landing-page/map"
import TeamSection from "@/src/components/landing-page/team"
import ContentSection from "@/src/components/landing-page/content"
import LatestArticleSection from "@/src/components/landing-page/kegiatan"
import GarduSection from "@/src/components/landing-page/gardu"


type Article = {
  id: string
  title: string
  slug: string
  coverImage: string
  createdAt: string
  content: string
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true)
        const res = await fetch("/api/kegiatan?limit=4&mode=list")
        const data = await res.json()
        setArticles(data.articles)
      } catch (error) {
        console.error("Failed to fetch latest articles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  return (
    <MainLayout>
      <HeroSection
        title="PLN UPT Tanjung Karang"
        subtitle="Energi Untuk Kehidupan. Memberikan layanan listrik terbaik untuk wilayah Lampung."
        ctaText="See More"
        ctaLink="#visi-misi"
      />
      <ContentSection />
      <TeamSection />
      <LatestArticleSection articles={articles} loading={loading} />
      <GarduSection />

      <MapSection />
    </MainLayout>
  )
}
