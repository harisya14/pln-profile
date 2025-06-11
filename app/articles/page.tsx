"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import MainLayout from "@/src/components/layout"
import ArticleCard from "@/src/components/article/card"
import HeroSection from "@/src/components/landing-page/hero"
import Pagination from "@/src/components/ui/pagination"
import SearchInput from "@/src/components/article/search"

const dummyArticles = [
  {
    title: "The Power of Minimalist Design",
    slug: "power-of-minimalist-design",
    coverImage:
      "https://res.cloudinary.com/dvfmpfuhc/image/upload/v1749098287/articles/apkah-berhasil.jpg",
    createdAt: "2024-05-15",
    excerpt:
      "Explore how simplicity and clarity in design can improve user experience and visual aesthetics.",
  },
  {
    title: "5 Tips to Optimize Web Performance",
    slug: "optimize-web-performance",
    coverImage:
      "https://res.cloudinary.com/dvfmpfuhc/image/upload/v1749098287/articles/apkah-berhasil.jpg",
    createdAt: "2024-06-01",
    excerpt:
      "Learn practical techniques to enhance speed and responsiveness for your websites and apps.",
  },
  {
    title: "Understanding Smart Grid Technology",
    slug: "smart-grid-technology",
    coverImage:
      "https://res.cloudinary.com/dvfmpfuhc/image/upload/v1749098287/articles/apkah-berhasil.jpg",
    createdAt: "2024-04-10",
    excerpt:
      "Dive into how smart grid technology is reshaping energy distribution and efficiency in modern cities.",
  },
  {
    title: "PLN's Role in Supporting Renewable Energy",
    slug: "pln-renewable-energy",
    coverImage:
      "https://res.cloudinary.com/dvfmpfuhc/image/upload/v1749098287/articles/apkah-berhasil.jpg",
    createdAt: "2024-05-28",
    excerpt:
      "Discover how PLN contributes to Indonesia’s renewable energy transition with new infrastructure and policies.",
  },
  {
    title: "Improving Electrical Safety at Home",
    slug: "electrical-safety-home",
    coverImage:
      "https://res.cloudinary.com/dvfmpfuhc/image/upload/v1749098287/articles/apkah-berhasil.jpg",
    createdAt: "2024-03-22",
    excerpt:
      "Safety starts at home. Learn tips and tools to prevent electrical hazards in your everyday life.",
  },
  {
    title: "Digital Transformation in the Energy Sector",
    slug: "digital-energy-transformation",
    coverImage:
      "https://res.cloudinary.com/dvfmpfuhc/image/upload/v1749098287/articles/apkah-berhasil.jpg",
    createdAt: "2024-06-05",
    excerpt:
      "Technology is accelerating change in energy. Here's how digitization improves services and monitoring.",
  },
  {
    title: "How to Reduce Electricity Consumption Effectively",
    slug: "reduce-electricity-usage",
    coverImage:
      "https://res.cloudinary.com/dvfmpfuhc/image/upload/v1749098287/articles/apkah-berhasil.jpg",
    createdAt: "2024-04-18",
    excerpt:
      "Practical ways to cut down your electricity bill while promoting sustainability and smart usage.",
  },
  {
    title: "PLN Innovations for Rural Electrification",
    slug: "pln-rural-innovation",
    coverImage:
      "https://res.cloudinary.com/dvfmpfuhc/image/upload/v1749098287/articles/apkah-berhasil.jpg",
    createdAt: "2024-05-05",
    excerpt:
      "Find out how PLN brings reliable electricity to remote communities through innovative solutions.",
  },
]

const ARTICLES_PER_PAGE = 4

export default function ArticlesPage() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  const searchParams = useSearchParams()
  const pageParam = searchParams.get("page")
  const searchParam = searchParams.get("search")?.toLowerCase() || ""

  let currentPage = parseInt(pageParam || "1", 10)
  if (isNaN(currentPage) || currentPage < 1) currentPage = 1

  const filteredArticles = dummyArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchParam) ||
      article.excerpt.toLowerCase().includes(searchParam)
  )

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE))
  if (currentPage > totalPages) currentPage = totalPages

  const start = (currentPage - 1) * ARTICLES_PER_PAGE
  const paginatedArticles = filteredArticles.slice(start, start + ARTICLES_PER_PAGE)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
        }
      },
      { threshold: 0.3 }
    )

    const current = sectionRef.current
    if (current) observer.observe(current)

    return () => {
      if (current) observer.unobserve(current)
    }
  }, [hasAnimated])

  return (
    <MainLayout>
      <HeroSection
        title="PLN UPT Tanjung Karang"
        subtitle="Temukan berita dan wawasan terbaru seputar pelayanan dan inovasi kelistrikan di wilayah Tanjung Karang."
        ctaText="Lihat Semua Kegiatan"
        ctaLink="#latest-articles"
      />

      <div
        id="latest-articles"
        ref={sectionRef}
        className="scroll-mt-18 p-6 lg:px-10 lg:py-6"
      >
        <div className="max-w-3xl mx-auto mb-6">
          <SearchInput />
        </div>

        <div className={`grid gap-10 md:grid-cols-2 lg:grid-cols-4 transition-all duration-700 ${
          hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}>
          {paginatedArticles.map((article) => (
            <ArticleCard key={article.slug} {...article} />
          ))}
        </div>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/articles" />
    </MainLayout>
  )
}