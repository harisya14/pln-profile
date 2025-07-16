"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Definisikan tipe data untuk satu Gardu Induk dari API
interface UltgDataItem {
  id: string;
  namagi: string;
  image: string; // URL gambar dari Cloudinary
  slug: string;
  alamat: string;
  googleMapsEmbed: string; // Mungkin tidak digunakan di sini, tapi ada di model
}

export default function GarduSection() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const [titleInView, setTitleInView] = useState(false);
  // PERBAIKAN: Set cardsInView menjadi true secara default untuk debugging
  const [cardsInView, setCardsInView] = useState(true); // Mengubah initial state menjadi true

  const [garduIndukList, setGarduIndukList] = useState<UltgDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const titleObserver = new IntersectionObserver(
      ([entry]) => setTitleInView(entry.isIntersecting),
      { threshold: 0.7 }
    );
    // PERBAIKAN: IntersectionObserver untuk cardsRef mungkin tidak perlu jika cardsInView default true,
    // tapi biarkan saja untuk saat ini jika ingin mengembalikan animasi nanti.
    const cardsObserver = new IntersectionObserver(
      ([entry]) => setCardsInView(entry.isIntersecting),
      { threshold: 0.4 }
    );

    if (titleRef.current) titleObserver.observe(titleRef.current);
    if (cardsRef.current) cardsObserver.observe(cardsRef.current);

    return () => {
      if (titleRef.current) titleObserver.unobserve(titleRef.current);
      if (cardsRef.current) cardsObserver.unobserve(cardsRef.current);
    };
  }, []);

  // --- useEffect untuk mengambil data Gardu Induk dari API ---
  useEffect(() => {
    const fetchGarduIndukData = async () => {
      setLoading(true);
      setError(null);
      const ultgTypes = ["tarahan", "tegineneng", "pagelaran", "kotabumi"];
      const fetchedGardu: UltgDataItem[] = [];
      const MAX_DISPLAY_ITEMS = 6; // Batasi jumlah gardu yang ditampilkan di landing page

      for (const type of ultgTypes) {
        if (fetchedGardu.length >= MAX_DISPLAY_ITEMS) {
          console.log("Max display items reached. Stopping fetch.");
          break; // Berhenti jika sudah cukup
        }

        try {
          console.log(`Attempting to fetch for type: ${type}`); // Log tipe yang sedang diambil
          const response = await fetch(`/api/ultg?type=${type}&limit=${MAX_DISPLAY_ITEMS}`, {
            cache: "no-store",
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Gagal mengambil data Gardu Induk untuk tipe ${type}. Status: ${response.status}. Response:`, errorText);
            continue; // Lanjutkan ke tipe berikutnya
          }

          const data = await response.json();
          console.log(`Received data for type ${type}:`, data); // Log data yang diterima

          if (data && Array.isArray(data.data)) {
            for (const item of data.data) {
              if (fetchedGardu.length < MAX_DISPLAY_ITEMS) {
                fetchedGardu.push(item);
              } else {
                break;
              }
            }
          } else {
            console.warn(`Struktur data tidak terduga untuk tipe ${type}:`, data);
          }
        } catch (err: any) {
          console.error(`Error fetching Gardu Induk data for type ${type}:`, err);
          setError((prev) => (prev ? `${prev}; ${err.message}` : err.message));
        }
      }
      console.log("Final fetched Gardu Induk list:", fetchedGardu); // Log daftar akhir
      setGarduIndukList(fetchedGardu);
      setLoading(false);
    };

    fetchGarduIndukData();
  }, []);
  // --- Akhir useEffect ---

  return (
    <section className="bg-primary px-6 py-16 lg:px-10 lg:py-20 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Judul */}
        <h2
          ref={titleRef}
          className={`mb-10 text-3xl lg:text-4xl font-extrabold text-center transition-all duration-700 transform ${
            titleInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-90"
          }`}
        >
          Gardu Induk
        </h2>

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Skeleton Loader */}
            {[...Array(3)].map((_, i) => ( // Tampilkan 3 skeleton loader
              <div key={i} className="bg-white text-gray-900 rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-60 w-full relative bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded-md w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">Error memuat data Gardu Induk: {error}</p>
        ) : garduIndukList.length === 0 ? (
          <p className="text-center text-gray-200 text-lg">Tidak ada data Gardu Induk yang ditemukan.</p>
        ) : (
          <div
            ref={cardsRef}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {garduIndukList.map((gardu, index) => (
              <div
                key={gardu.id} // Menggunakan gardu.id sebagai key
                // PERBAIKAN: Menghapus kelas animasi kondisional untuk debugging
                className={`bg-white text-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all transform duration-700`}
                // style={{ transitionDelay: `${index * 150}ms` }} // Biarkan delay jika ingin mengembalikan animasi
              >
                <div className="h-60 w-full relative">
                  <Image
                    src={gardu.image}
                    alt={gardu.namagi} // Menggunakan namagi dari database
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `/images/gardu/placeholder.jpg`; // Fallback gambar placeholder
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{gardu.namagi}</h3> {/* Menggunakan namagi */}
                  <p className="text-sm text-blue-600 mt-1">{gardu.alamat}</p> {/* Menggunakan alamat */}
                  <Link
                    href={`/gardu-induk/${gardu.slug}`} // Link ke halaman detail Gardu Induk
                    className="inline-block mt-4 px-4 py-2 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-600 hover:text-white transition"
                  >
                    More Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tombol Lihat Semua */}
        <div className="mt-8 text-center">
          <Link
            href="/gardu-induk"
            className="inline-block px-6 py-2 text-sm sm:text-base text-white font-medium border border-white hover:bg-white hover:text-primary rounded-lg transition-colors duration-300"
          >
            Lihat Semua Gardu
          </Link>
        </div>
      </div>
    </section>
  );
}
