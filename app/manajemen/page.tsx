"use client"; // Menandakan ini sebagai Client Component

import React, { useState, useEffect } from "react";
import MainLayout from "@/src/components/layout"; // Pastikan path ini benar
import Image from "next/image"; // Digunakan untuk gambar person jika ada

// Definisikan tipe data untuk Person
interface Person {
  name: string;
  jabatan: string | null;
  imageUrl?: string | null; // URL gambar dari Cloudinary
}

// Definisikan tipe data untuk satu bagian Manajemen (sesuai respons API)
interface ManajemenSectionData {
  id: string; // ID dari Prisma
  title: string;
  anchor: string;
  orderIndex: number;
  assistant: {
    name: string;
    jabatan: string;
    image?: string | null; // URL gambar asisten
  } | null;
  containers: Person[][]; // Array of arrays of Person
}

export default function ManajemenPage() {
  const [strukturManajemen, setStrukturManajemen] = useState<ManajemenSectionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManajemenData = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/manajemen`, {
          cache: "no-store", // Pastikan data selalu fresh
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Gagal mengambil data struktur manajemen: ${errorText}`);
        }

        const data: ManajemenSectionData[] = await response.json();
        setStrukturManajemen(data);
      } catch (err: any) {
        console.error("Error fetching manajemen structure:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchManajemenData();
  }, []); // Dependency array kosong agar hanya dijalankan sekali saat mount

  if (loading) {
    return (
      <MainLayout>
        <section className="px-4 md:px-8 py-20 bg-gray-50 min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-700">Memuat struktur manajemen...</p>
        </section>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <section className="px-4 md:px-8 py-20 bg-gray-50 min-h-screen flex items-center justify-center">
          <p className="text-xl text-red-600">Error memuat struktur manajemen: {error}</p>
          <p className="text-md text-red-500 mt-2">Pastikan server API berjalan dan terhubung ke database.</p>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="px-4 md:px-8 py-20 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Judul Halaman */}
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-16">
            Struktur Manajemen
          </h2>

          {strukturManajemen.length === 0 && !loading && !error ? (
            <p className="text-center text-gray-600 text-lg">Tidak ada data struktur manajemen yang ditemukan.</p>
          ) : (
            /* Loop Setiap Divisi */
            <div className="space-y-24">
              {strukturManajemen.map((divisi) => ( // Menggunakan divisi.id sebagai key jika ada, atau divisi.anchor
                <div key={divisi.id || divisi.anchor} id={divisi.anchor} className="scroll-mt-28">
                  {/* Judul Divisi */}
                  <h3 className="text-2xl font-semibold text-center text-blue-700 mb-10 uppercase tracking-wide">
                    {divisi.title}
                  </h3>

                  {/* Asisten Manager */}
                  {divisi.assistant && (
                    <div className="flex justify-center mb-8">
                      <div className="rounded-xl px-6 py-4 w-full max-w-xs bg-white shadow-md ring-1 ring-gray-200 hover:shadow-lg transition duration-300">
                        {divisi.assistant.image && (
                          <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-blue-300">
                            <Image
                              src={divisi.assistant.image}
                              alt={divisi.assistant.name}
                              fill
                              className="object-cover"
                              sizes="96px" // Ukuran gambar untuk optimasi
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `/images/placeholder-person.png`; // Fallback gambar default
                              }}
                            />
                          </div>
                        )}
                        <p className="font-semibold text-gray-900 text-center">
                          {divisi.assistant.name}
                        </p>
                        <p className="text-sm text-gray-600 text-center">
                          {divisi.assistant.jabatan}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Daftar Anggota */}
                  <div className="flex flex-wrap justify-center gap-6">
                    {divisi.containers.map((group, colIndex) => (
                      <div key={colIndex} className="flex flex-col gap-6 w-full sm:w-auto">
                        {group.map((person, personIndex) => (
                          <div
                            key={personIndex} // Menggunakan personIndex karena tidak ada ID unik untuk setiap person di frontend
                            className="rounded-xl px-6 py-4 w-full sm:w-64 bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition duration-300"
                          >
                            {person.imageUrl && (
                              <div className="relative w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden border-2 border-gray-300">
                                <Image
                                  src={person.imageUrl}
                                  alt={person.name}
                                  fill
                                  className="object-cover"
                                  sizes="80px" // Ukuran gambar untuk optimasi
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = `/images/placeholder-person.png`; // Fallback gambar default
                                  }}
                                />
                              </div>
                            )}
                            <p className="font-semibold text-gray-900 text-center">
                              {person.name || "-"}
                            </p>
                            {person.jabatan && (
                              <p className="text-sm text-gray-600 text-center">
                                {person.jabatan}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
