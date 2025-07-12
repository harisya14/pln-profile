"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image"; // Menggunakan next/image untuk optimasi

const ContentSection: React.FC = () => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  const [textInView, setTextInView] = useState(false);
  const [imageInView, setImageInView] = useState(false);

  // Path ke gambar Anda di folder public/images
  const imageUrl1 = "/images/vm1.jpeg"; // GANTI DENGAN NAMA FILE GAMBAR ANDA
  const imageUrl2 = "/images/vm2.jpg"; // GANTI DENGAN NAMA FILE GAMBAR ANDA
  const placeholderImage = "/images/placeholder.jpg"; // Opsional: gambar placeholder jika gambar utama tidak ditemukan

  useEffect(() => {
    const textObserver = new IntersectionObserver(
      ([entry]) => setTextInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    const currentText = textRef.current;
    if (currentText) textObserver.observe(currentText);
    return () => {
      if (currentText) textObserver.unobserve(currentText);
    };
  }, []);

  useEffect(() => {
    const imageObserver = new IntersectionObserver(
      ([entry]) => setImageInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    const currentImage = imageRef.current;
    if (currentImage) imageObserver.observe(currentImage);
    return () => {
      if (currentImage) imageObserver.unobserve(currentImage);
    };
  }, []);

  return (
    <section className="bg-secondary dark:bg-gray-900">
      <div className="gap-16 items-center py-12 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-20 lg:px-6">
        {/* Visi Misi Text */}
        <div
          ref={textRef}
          className={`font-light text-gray-700 sm:text-lg dark:text-gray-300 transform transition duration-700 ease-in-out ${
            textInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          }`}
        >
          <h2 className="mb-6 text-4xl tracking-tight font-extrabold text-blue-800 dark:text-white">
            Visi dan Misi Perusahaan
          </h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-300">Visi</h3>
            <p>
            Menjadi Perusahaan Global Top 500 dan #1 Pilihan Pelanggan untuk Solusi Energi.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-300">Misi</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Menjalankan bisnis kelistrikan dan bidang lain yang terkait, berorientasi pada kepuasan pelanggan, anggota perusahaan dan pemegang saham.</li>
              <li>Menjadikan tenaga listrik sebagai media untuk meningkatkan kualitas kehidupan masyarakat.</li>
              <li>Mengupayakan agar tenaga listrik menjadi pendorong kegiatan ekonomi.</li>
              <li>Menjalankan kegiatan usaha yang berwawasan lingkungan.</li>
            </ul>
          </div>
        </div>

        {/* Gambar */}
        <div
          ref={imageRef}
          className={`grid grid-cols-2 gap-4 mt-10 lg:mt-0 transform transition duration-700 ease-in-out ${
            imageInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative w-full h-100 rounded-lg overflow-hidden shadow-md">
            <Image
              src={imageUrl1}
              alt="Visi Misi 1"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = placeholderImage; // Fallback ke gambar placeholder
              }}
            />
          </div>
          <div className="relative w-full h-100 mt-4 lg:mt-10 rounded-lg overflow-hidden shadow-md">
            <Image
              src={imageUrl2}
              alt="Visi Misi 2"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = placeholderImage; // Fallback ke gambar placeholder
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
