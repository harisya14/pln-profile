import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { v2 as cloudinary } from "cloudinary"

const prisma = new PrismaClient()

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

type ArticleParams = {
  title: string
  coverImage: string // Base64 encoded string
  content: string
  author: string
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get("mode")
  const cursor = searchParams.get("cursor")
  const limit = parseInt(searchParams.get("limit") || "10")

  try {
    if (mode === "single") {
      const slug = searchParams.get("slug")
      if (!slug) {
        return NextResponse.json({ error: "Slug is required" }, { status: 400 })
      }

      const article = await prisma.article.findUnique({ where: { slug } })
      if (!article) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 })
      }

      return NextResponse.json(article)
    } else {
      const articles = await prisma.article.findMany({
        take: limit + 1,
        skip: cursor ? 1 : 0,
        ...(cursor && { cursor: { id: cursor } }),
        orderBy: { createdAt: "desc" },
      })

      const hasNextPage = articles.length > limit
      const nextCursor = hasNextPage ? articles[articles.length - 1].id : null
      const trimmed = hasNextPage ? articles.slice(0, -1) : articles

      return NextResponse.json({
        articles: trimmed,
        next_cursor: nextCursor,
      })
    }
  } catch (error) {
    console.error("Error during GET:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch articles",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const body: ArticleParams = await req.json()

  try {
    const { title, coverImage, content, author } = body

    if (!title || !coverImage || !content || !author) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(coverImage, {
      folder: "articles",
      public_id: title.toLowerCase().replace(/\s+/g, "-"),
    })

    const imageUrl = cloudinaryResponse.secure_url

    let slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    let existingSlug = await prisma.article.findUnique({ where: { slug } })
    let counter = 1

    while (existingSlug) {
      slug = `${slug}-${counter}`
      existingSlug = await prisma.article.findUnique({ where: { slug } })
      counter++
    }

    const newArticle = await prisma.article.create({
      data: {
        title,
        slug,
        coverImage: imageUrl,
        content,
        author,
      },
    })

    return NextResponse.json(newArticle, { status: 201 })
  } catch (error) {
    console.error("Error adding article:", error)
    return NextResponse.json(
      {
        error: "Failed to add article",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  const body: ArticleParams = await req.json()
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("slug")

  try {
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const existingArticle = await prisma.article.findUnique({ where: { slug } })
    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const { title, coverImage, content, author } = body

    if (!title || !coverImage || !content || !author) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }

    let imageUrl = existingArticle.coverImage

    const isBase64 = coverImage.startsWith("data:image/")
    if (isBase64) {
      const cloudinaryResponse = await cloudinary.uploader.upload(coverImage, {
        folder: "articles",
        public_id: title.toLowerCase().replace(/\s+/g, "-"),
      })
      imageUrl = cloudinaryResponse.secure_url
    }

    let newSlug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    let existingSlug = await prisma.article.findUnique({ where: { slug: newSlug } })
    let counter = 1

    while (existingSlug && existingSlug.id !== existingArticle.id) {
      newSlug = `${newSlug}-${counter}`
      existingSlug = await prisma.article.findUnique({ where: { slug: newSlug } })
      counter++
    }

    const updatedArticle = await prisma.article.update({
      where: { slug },
      data: {
        title,
        slug: newSlug,
        coverImage: imageUrl,
        content,
        author,
      },
    })

    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json(
      {
        error: "Failed to update article",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("slug")

  try {
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    await prisma.article.delete({ where: { slug } })

    return NextResponse.json({ message: "Article deleted successfully" })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json(
      {
        error: "Failed to delete article",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
