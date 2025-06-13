"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import MainLayout from "@/src/components/layout"
import ArticleCard from "@/src/components/ui/card"
import HeroSection from "@/src/components/landing-page/hero"
import Pagination from "@/src/components/ui/pagination"
import SearchInput from "@/src/components/kegiatan/search"
import ArticleCardSkeleton from "@/src/components/ui/skeleton"

type Article = {
  id: string
  title: string
  slug: string
  coverImage: string
  createdAt: string
  content: string
}

const ARTICLES_PER_PAGE = 12

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)

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
      setLoading(false)
    }
    fetchArticles()
  }, [currentPage, searchParam])

  return (
    <MainLayout>
      <HeroSection
        title="PLN UPT Tanjung Karang"
        subtitle="Temukan berita dan kegiatan terbaru..."
        ctaText="Lihat Semua Kegiatan"
        ctaLink="#latest-articles"
      />

      <div id="latest-articles" className="p-6 lg:px-10 lg:py-6">
        <div className="max-w-3xl mx-auto mb-6">
          <SearchInput />
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {loading
            ? [...Array(ARTICLES_PER_PAGE)].map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))
            : articles.map((article) => (
                <ArticleCard key={article.slug} {...article} />
              ))}
        </div>

        {!loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(articles.length / ARTICLES_PER_PAGE)}
            basePath="/kegiatan"
          />
        )}
      </div>
    </MainLayout>
  )
}
