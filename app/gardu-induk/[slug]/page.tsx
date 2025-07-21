"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import MainLayout from "@/src/components/layout";
import Image from "next/image";
import Link from "next/link";

interface UltgDataItem {
  id: string;
  namagi: string;
  image: string;
  slug: string;
  alamat: string;
  googleMapsEmbed: string;
}

export default function GarduIndukDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = params.slug as string;
  const typeParam = searchParams.get("type") ?? undefined;

  const [gardu, setGardu] = useState<UltgDataItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const validTypes = ["tarahan", "tegineneng", "pagelaran", "kotabumi"];
      const typesToCheck =
        typeParam && validTypes.includes(typeParam) ? [typeParam] : validTypes;

      for (const t of typesToCheck) {
        try {
          const res = await fetch(
            `/api/ultg?mode=single&type=${t}&slug=${encodeURIComponent(slug)}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              cache: "no-store",
            }
          );

          if (res.ok) {
            const data = await res.json();
            setGardu(data);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error(`❌ Error fetching type=${t}, slug=${slug}`, error);
        }
      }

      setLoading(false);
    };

    if (slug) {
      fetchData();
    }
  }, [slug, typeParam]);

  if (loading) {
    return (
      <MainLayout>
        <section className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 text-xl">Memuat data Gardu Induk...</p>
        </section>
      </MainLayout>
    );
  }

  if (!gardu) {
    router.push("/not-found"); // ✅ client-side fallback if gardu not found
    return null;
  }

  return (
    <MainLayout>
      <section className="px-4 md:px-8 py-12 md:py-20 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Tombol Kembali */}
          <div className="mb-6">
            <Link
              href="/gardu-induk"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali ke Daftar Gardu Induk
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">
            {gardu.namagi}
            <span className="block text-xl text-gray-500 font-normal mt-2">
              {gardu.alamat}
            </span>
          </h1>

          <div className="relative w-full h-80 md:h-[400px] mb-6 rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <Image
              src={gardu.image}
              alt={gardu.namagi}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              className="object-cover"
            />
          </div>

          <div className="mt-10">
            <h2 className="text-3xl font-semibold text-blue-800 mb-6">
              Temukan Kami
            </h2>
            <div className="aspect-video w-full rounded-lg shadow-lg overflow-hidden border border-gray-200">
              <div
                dangerouslySetInnerHTML={{ __html: gardu.googleMapsEmbed }}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
