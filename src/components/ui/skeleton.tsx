import * as React from "react"

const ArticleCardSkeleton: React.FC = () => {
  return (
    <div className="block">
      <article className="overflow-hidden rounded-lg shadow-sm bg-white">
        <div className="relative h-56 w-full bg-gray-200" />

        <div className="p-4 sm:p-6">
          <div className="h-3 w-24 bg-gray-300 rounded mb-1" />

          <div className="h-5 w-3/4 bg-gray-300 rounded mb-2" />

          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-11/12 bg-gray-200 rounded" />
            <div className="h-3 w-10/12 bg-gray-200 rounded" />
          </div>
        </div>
      </article>
    </div>
  )
}

export default ArticleCardSkeleton
