"use client"

import { useRouter } from "next/navigation"

type PaginationProps = {
  currentPage: number
  totalPages: number
  basePath: string // e.g. "/articles",x
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  const router = useRouter()

  const goToPage = (page: number) => {
    const url = `${basePath}?page=${page}#latest-articles`
    router.push(url) // Navigasi tanpa reload

    // Scroll halus ke anchor (jika dibutuhkan manual)
    const target = document.getElementById("latest-articles")
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <ul className="flex justify-center gap-3 text-gray-900 mb-6">
      <li>
        {currentPage > 1 && (
          <button
            onClick={() => goToPage(currentPage - 1)}
            aria-label="Previous page"
            className="grid size-8 place-content-center rounded border border-gray-200 transition-colors hover:bg-gray-50 rtl:rotate-180"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </li>

      <li className="text-sm/8 font-medium tracking-widest">
        {currentPage} / {totalPages}
      </li>

      <li>
        {currentPage < totalPages && (
          <button
            onClick={() => goToPage(currentPage + 1)}
            aria-label="Next page"
            className="grid size-8 place-content-center rounded border border-gray-200 transition-colors hover:bg-gray-50 rtl:rotate-180"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </li>
    </ul>
  )
}
