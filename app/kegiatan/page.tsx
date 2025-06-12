"use client"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import MainLayout from "@/src/components/layout"
import ArticleCard from "@/src/components/kegiatan/card"
import HeroSection from "@/src/components/landing-page/hero"
import Pagination from "@/src/components/ui/pagination"
import SearchInput from "@/src/components/kegiatan/search"

type Article = {
  id: string
  title: string
  slug: string
  coverImage: string
  createdAt: string
  content: string
}

const ARTICLES_PER_PAGE = 4

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  const searchParams = useSearchParams()
  const pageParam = searchParams.get("page")
  const searchParam = searchParams.get("search")?.toLowerCase() || ""
  let currentPage = parseInt(pageParam || "1", 10)
  if (isNaN(currentPage) || currentPage < 1) currentPage = 1

  // Fetch data
  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      const res = await fetch(`/api/kegiatan?limit=${ARTICLES_PER_PAGE}&mode=list`)
      const data = await res.json()
      setArticles(data.articles)
      setNextCursor(data.next_cursor)
      setLoading(false)
    }
    fetchArticles()
  }, [currentPage, searchParam])

  // animasi intersection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) setHasAnimated(true)
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [hasAnimated])

  return (
    <MainLayout>
      <HeroSection
        title="PLN UPT Tanjung Karang"
        subtitle="Temukan berita dan kegiatan terbaru..."
        ctaText="Lihat Semua Kegiatan"
        ctaLink="#latest-articles"
      />

      <div id="latest-articles" ref={sectionRef} className="p-6 lg:px-10 lg:py-6">
        <div className="max-w-3xl mx-auto mb-6">
          <SearchInput />
        </div>

        {loading && <p>Memuat data kegiatan...</p>}
        <div className={`grid gap-10 md:grid-cols-2 lg:grid-cols-4 transition-all duration-700 ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {articles.map((article) => (
            <ArticleCard key={article.slug} {...article} />
          ))}
        </div>

        <Pagination currentPage={currentPage} totalPages={Math.ceil(articles.length / ARTICLES_PER_PAGE)} basePath="/kegiatan" />
      </div>
    </MainLayout>
  )
}
