"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "@/src/components/layout"; // Pastikan path ini benar
import Image from "next/image";

// Tipe data untuk satu orang dalam struktur
interface Person {
  name: string;
  jabatan: string | null;
  imageUrl?: string | null;
}

// Tipe data untuk satu seksi/divisi manajemen
interface ManajemenSectionData {
  id: string;
  title: string;
  anchor: string; // Kunci untuk anchor link (contoh: "keuangan-dan-umum")
  orderIndex: number;
  assistant: {
    name: string;
    jabatan: string;
    image?: string | null;
  } | null;
  containers: Person[][];
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
        // The baseUrl constant is no longer needed.
        // Use a relative path, and the browser will handle the rest.
        const response = await fetch(`/api/manajemen`, {
          cache: "no-store", 
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Gagal mengambil data: ${errorText}`);
        }
  
        const data: ManajemenSectionData[] = await response.json();
        setStrukturManajemen(data);
  
        // --- The rest of your code remains the same ---
        const hash = window.location.hash.substring(1);
        if (hash) {
          setTimeout(() => {
            const element = document.getElementById(hash);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 100);
        }
        
      } catch (err: any) {
        console.error("Error fetching manajemen structure:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchManajemenData();
  }, []); // Dependency array remains empty

  if (loading) {
    return (
      <MainLayout>
        <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-20 md:px-8">
          <p className="text-xl text-gray-700">Memuat struktur manajemen...</p>
        </section>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-20 md:px-8">
          <p className="text-xl text-red-600">Error: {error}</p>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="min-h-screen bg-gray-50 px-4 py-20 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mt-16 mb-16 text-center text-3xl font-bold text-blue-800 md:text-4xl">
            Struktur Manajemen
          </h2>

          {strukturManajemen.length === 0 ? (
            <p className="text-center text-lg text-gray-600">
              Tidak ada data struktur manajemen yang ditemukan.
            </p>
          ) : (
            <div className="space-y-24">
              {strukturManajemen.map((divisi) => (
                <div key={divisi.id} id={divisi.anchor} className="scroll-mt-28">
                  <h3 className="mb-10 text-center text-2xl font-semibold uppercase tracking-wide text-blue-700">
                    {divisi.title}
                  </h3>

                  {/* Asisten Manager */}
                  {divisi.assistant && (
                    <div className="mb-8 flex justify-center">
                      <div className="w-full max-w-xs rounded-xl bg-white px-6 py-4 shadow-md ring-1 ring-gray-200 transition duration-300 hover:shadow-lg">
                        <div className="relative mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full border-2 border-blue-300">
                          <Image
                            src={divisi.assistant.image || '/images/placeholder-person.png'}
                            alt={divisi.assistant.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                        <p className="text-center font-semibold text-gray-900">
                          {divisi.assistant.name}
                        </p>
                        <p className="text-center text-sm text-gray-600">
                          {divisi.assistant.jabatan}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Daftar Anggota */}
                  <div className="flex flex-wrap justify-center gap-6">
                    {divisi.containers.map((group, colIndex) => (
                      <div key={colIndex} className="flex w-full flex-col gap-6 sm:w-auto">
                        {group.map((person, personIndex) => (
                          <div
                            key={personIndex}
                            className="w-full rounded-xl bg-white px-6 py-4 shadow-sm ring-1 ring-gray-200 transition duration-300 hover:shadow-md sm:w-64"
                          >
                            <div className="relative mx-auto mb-2 h-20 w-20 overflow-hidden rounded-full border-2 border-gray-300">
                              <Image
                                src={person.imageUrl || '/images/placeholder-person.png'}
                                alt={person.name}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                            <p className="text-center font-semibold text-gray-900">
                              {person.name || "-"}
                            </p>
                            {person.jabatan && (
                              <p className="text-center text-sm text-gray-600">
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