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
  const [loading, setLoading] = useState(true) 
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])

  const searchParams = useSearchParams()
  const pageParam = searchParams.get("page")
  const searchParam = searchParams.get("search")?.toLowerCase() || ""
  let currentPage = parseInt(pageParam || "1", 10)
  if (isNaN(currentPage) || currentPage < 1) currentPage = 1

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      const res = await fetch(`/api/kegiatan?mode=list`)
      const data = await res.json()
      setArticles(data.articles)
      setLoading(false)
    }
    fetchArticles()
  }, []) 


  useEffect(() => {
    const results = articles.filter(article =>
      article.title.toLowerCase().includes(searchParam)
    )
    setFilteredArticles(results)
  }, [searchParam, articles])

  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  )

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE)

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
            : paginatedArticles.map((article) => (
                <ArticleCard key={article.slug} {...article} />
              ))}
        </div>

        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">
              Tidak ada artikel yang cocok dengan pencarian Anda.
            </p>
          </div>
        )}

        {!loading && filteredArticles.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/kegiatan${searchParam ? `?search=${searchParam}` : ''}`}
          />
        )}
      </div>
    </MainLayout>
  )
}