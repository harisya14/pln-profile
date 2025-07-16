"use client"; // Menandakan ini sebagai Client Component

import React, { useState, useEffect } from "react";
import Image from "next/image";
import MainLayout from "@/src/components/layout"; // Pastikan path ini benar
import Link from "next/link";

// Definisikan tipe data untuk satu Gardu Induk dari API
interface UltgDataItem {
  id: string;
  namagi: string;
  image: string; // URL gambar dari Cloudinary
  slug: string;
  alamat: string;
  googleMapsEmbed: string;
}

// Definisikan tipe data untuk grup Gardu Induk (ULTG)
interface GroupedUltgData {
  ultg: string; // Nama ULTG, contoh: "ULTG TARAHAN"
  type: string; // Tipe yang digunakan di API, contoh: "tarahan"
  gardu: UltgDataItem[];
}

export default function GarduIndukPage() {
  const [groupedGarduInduk, setGroupedGarduInduk] = useState<GroupedUltgData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllUltgData = async () => {
      setLoading(true);
      setError(null);
      const ultgTypes = [
        { name: "ULTG TARAHAN", apiType: "tarahan" },
        { name: "ULTG TEGINENENG", apiType: "tegineneng" },
        { name: "ULTG PAGELARAN", apiType: "pagelaran" },
        { name: "ULTG KOTABUMI", apiType: "kotabumi" },
      ];
  
      const fetchedData: GroupedUltgData[] = [];
  
      for (const ultgType of ultgTypes) {
        try {
          // The `baseUrl` constant has been removed.
          // We now use a relative path for the API call. ✅
          const response = await fetch(`/api/ultg?type=${ultgType.apiType}&limit=10000`, {
            cache: "no-store", // Make sure data is always fresh
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gagal mengambil data untuk ${ultgType.name}: ${errorText}`);
          }
  
          const data = await response.json();
          if (data && Array.isArray(data.data)) {
            fetchedData.push({
              ultg: ultgType.name,
              type: ultgType.apiType,
              gardu: data.data,
            });
          } else {
            console.warn(`Struktur data tidak terduga untuk ${ultgType.name}:`, data);
            fetchedData.push({
              ultg: ultgType.name,
              type: ultgType.apiType,
              gardu: [], 
            });
          }
        } catch (err: any) {
          console.error(`Error fetching data for ${ultgType.name}:`, err);
          setError((prev) => (prev ? `${prev}; ${err.message}` : err.message));
          fetchedData.push({
            ultg: ultgType.name,
            type: ultgType.apiType,
            gardu: [], 
          });
        }
      }
      setGroupedGarduInduk(fetchedData);
      setLoading(false);
    };
  
    fetchAllUltgData();
  }, []); 

  if (loading) {
    return (
      <MainLayout>
        <section className="px-4 md:px-8 py-20 bg-gray-50 min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-700">Memuat data Gardu Induk...</p>
        </section>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <section className="px-4 md:px-8 py-20 bg-gray-50 min-h-screen flex items-center justify-center">
          <p className="text-xl text-red-600">Error memuat data: {error}</p>
          <p className="text-md text-red-500 mt-2">Pastikan server API berjalan dan terhubung ke database.</p>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="px-4 md:px-8 py-20 bg-gray-50 min-h-screen">
        <div className="text-center mt-15 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800">Gardu Induk</h1>
          <p className="text-lg text-gray-600 mt-2">Informasi Gardu Induk per ULTG</p>
        </div>

        {groupedGarduInduk.length === 0 && !loading && !error ? (
          <p className="text-center text-gray-600 text-lg">Tidak ada data Gardu Induk yang ditemukan.</p>
        ) : (
          groupedGarduInduk.map((group) => (
            <div key={group.ultg} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2">{group.ultg}</h2>
              {group.gardu.length === 0 ? (
                <p className="text-gray-600">Tidak ada gardu induk yang terdaftar untuk {group.ultg}.</p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.gardu.map((gardu) => (
                    <div
                      key={gardu.id} // Menggunakan item.id sebagai key
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                    >
                      <div className="h-60 w-full relative">
                        <Image
                          src={gardu.image}
                          alt={gardu.namagi} // Menggunakan namagi sebagai alt text
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null; // Mencegah loop error
                            e.currentTarget.src = `/images/gardu/placeholder.jpg`; // Fallback ke gambar placeholder lokal
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800">{gardu.namagi}</h3> {/* Menggunakan namagi */}
                        <p className="text-sm text-blue-600 mt-1">{gardu.alamat}</p> {/* Menggunakan alamat */}
                        <Link
                          href={`/gardu-induk/${gardu.slug}`}
                          className="inline-block mt-4 px-4 py-2 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-600 hover:text-white transition"
                        >
                          More Detail
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </MainLayout>
  );
}
