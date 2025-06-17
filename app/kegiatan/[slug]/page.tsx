'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import MainLayout from '@/src/components/layout'
import ImageGallery from '@/src/components/kegiatan/image-gallery'

type Article = {
  id: string
  title: string
  slug: string
  coverImage: string
  image: string[] | null
  content: string
  createdAt: string
}

export default function ArticleDetailPage() {
  const { slug } = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/kegiatan?mode=single&slug=${slug}`)
        if (!res.ok) throw new Error('Gagal mengambil artikel.')
        const data: Article = await res.json()
        setArticle(data)
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan')
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchArticle()
  }, [slug])

  return (
    <MainLayout className='bg-secondary'>
      <div className="max-w-3xl mx-auto p-4 pt-25">
        {loading && <p className="text-center">Memuat artikel...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && article && (
          <>
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <p className="text-sm text-gray-500 mb-4">
              Dipublikasikan pada {new Date(article.createdAt).toLocaleDateString()}
            </p>

            {article.coverImage && (
              <Image
                src={article.coverImage}
                alt={article.title}
                width={800}
                height={400}
                className="rounded mb-6 w-full object-cover h-auto"
              />
            )}

            <div
              className="prose prose-lg max-w-none [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-medium"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {article.image && article.image.length > 0 && (
              <ImageGallery images={article.image} />
            )}
          </>
        )}
      </div>
    </MainLayout>
  )
}
