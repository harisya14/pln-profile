'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3)
      } else {
        setItemsPerView(1)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const goToNext = () => {
    if (currentIndex + itemsPerView < images.length) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const visibleImages = images.slice(currentIndex, currentIndex + itemsPerView)

  if (!images || images.length === 0) return null

  return (
    <div className="mb-6 mt-10 relative">
      <h2 className="text-center text-3xl font-semibold mb-4">Foto Kegiatan</h2>

      {/* Carousel wrapper */}
      <div className="relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-4 transition-transform duration-500 ease-in-out">
          {visibleImages.map((img, index) => (
            <div
              key={index}
              className="relative w-full h-64 overflow-hidden rounded cursor-pointer flex justify-center items-center"
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={img}
                alt={`Gambar ${currentIndex + index + 1}`}
                fill
                className="object-cover rounded transition-transform hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {images.length > itemsPerView && (
          <>
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-20 ${
                currentIndex === 0 ? 'opacity-0 cursor-not-allowed' : ''
              }`}
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex + itemsPerView >= images.length}
              className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-20 ${
                currentIndex + itemsPerView >= images.length
                  ? 'opacity-0 cursor-not-allowed'
                  : ''
              }`}
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-[80vw] max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/60 text-white hover:text-red-500 rounded-full p-1 shadow"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <Image
              src={selectedImage}
              alt="Preview"
              width={800}
              height={600}
              className="rounded object-contain max-h-[80vh] w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGallery
