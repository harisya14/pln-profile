"use client"

import React, { useEffect, useRef, useState } from "react"
import ArticleCard from "../ui/card"
import ArticleCardSkeleton from "../ui/skeleton"

type Article = {
  title: string
  slug: string
  coverImage: string
  createdAt: string
  content: string
}

type LatestArticleSectionProps = {
  articles: Article[]
  loading?: boolean
  limit?: number
}

export default function LatestArticleSection({
  articles,
  loading = false,
  limit = 4,
}: LatestArticleSectionProps) {
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const cardsRef = useRef<HTMLDivElement | null>(null)
  const [titleInView, setTitleInView] = useState(false)
  const [cardsInView, setCardsInView] = useState(false)

  useEffect(() => {
    const titleObserver = new IntersectionObserver(
      ([entry]) => setTitleInView(entry.isIntersecting),
      { threshold: 0.7 }
    )
    const cardsObserver = new IntersectionObserver(
      ([entry]) => setCardsInView(entry.isIntersecting),
      { threshold: 0.4 }
    )

    if (titleRef.current) titleObserver.observe(titleRef.current)
    if (cardsRef.current) cardsObserver.observe(cardsRef.current)

    return () => {
      if (titleRef.current) titleObserver.unobserve(titleRef.current)
      if (cardsRef.current) cardsObserver.unobserve(cardsRef.current)
    }
  }, [])

  const displayedArticles = articles.slice(0, limit)

  return (
    <section className="bg-primary px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="max-w-7xl mx-auto">
        {/* Judul */}
        <h2
          ref={titleRef}
          className={`mb-6 text-3xl lg:text-4xl font-extrabold text-secondary text-center transform transition-all duration-700 ease-in-out ${
            titleInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-90"
          }`}
        >
          Kegiatan Terbaru
        </h2>

        {/* Card / Skeleton */}
        <div
          ref={cardsRef}
          className="grid gap-10 md:grid-cols-2 lg:grid-cols-4"
        >
          {(loading ? [...Array(limit)] : displayedArticles).map(
            (article, index) => (
              <div
                key={loading ? index : article.slug}
                className={`transform transition-all duration-700 ease-in-out ${
                  cardsInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {loading ? (
                  <ArticleCardSkeleton />
                ) : (
                  <ArticleCard {...article} />
                )}
              </div>
            )
          )}
        </div>

        {/* Tombol Lihat Semua */}
        <div className="mt-6 text-center">
          <a
            href="/kegiatan#latest-articles"
            className="inline-block px-6 py-2 text-sm sm:text-base text-white font-medium bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors duration-300"
          >
            Lihat Semua Kegiatan
          </a>
        </div>
      </div>
    </section>
  )
}
