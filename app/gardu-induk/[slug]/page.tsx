import { notFound } from "next/navigation";
import MainLayout from "@/src/components/layout";
import Image from 'next/image'
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

// Define the page props interface with async params
interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Fungsi untuk mengambil data gardu induk tunggal dari API
async function getUltgDetailBySlug(slug: string): Promise<UltgDataItem | null> {
  const ultgTypes = ["tarahan", "tegineneng", "pagelaran", "kotabumi"];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  for (const type of ultgTypes) {
    try {
      console.log(`Attempting to fetch for type: ${type}, slug: ${slug}`); // Log untuk debugging
      const res = await fetch(`${baseUrl}/api/ultg?mode=single&type=${type}&slug=${slug}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data: UltgDataItem = await res.json();
          console.log(`Data found for type ${type}:`, data); // Log data yang ditemukan
          return data; // Mengembalikan data pertama yang ditemukan
        } else {
          const errorBody = await res.text();
          console.error(`API returned non-JSON response for type ${type}, slug ${slug}. Status: ${res.status}. Body:`, errorBody);
        }
      } else {
        const errorText = await res.text();
        console.warn(`Gardu Induk dengan slug '${slug}' tidak ditemukan di tipe ${type} (Status: ${res.status}). Response:`, errorText);
      }
    } catch (error) {
      console.error(`Error fetching ULGT detail for type ${type}, slug ${slug}:`, error);
    }
  }
  console.log(`Gardu Induk with slug '${slug}' not found across all types.`); // Log jika tidak ditemukan sama sekali
  return null;
}

// Komponen halaman detail Gardu Induk
export default async function GarduIndukDetailPage({ params }: PageProps) {
  // Await the params since they're now async
  const { slug } = await params;

  const gardu = await getUltgDetailBySlug(slug);

  if (!gardu) {
    console.error(`Gardu Induk with slug '${slug}' not found, rendering 404.`);
    notFound(); // Ini akan memicu halaman 404 Next.js
  }

  const ultgTypeFromData = gardu.slug.split('-')[0];

  return (
    <MainLayout>
      <section className="px-4 md:px-8 py-12 md:py-20 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Tombol Kembali */}
          <div className="mb-6">
            <Link href="/gardu-induk" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Kembali ke Daftar Gardu Induk
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">
            {gardu.namagi}
            <span className="block text-xl text-gray-500 font-normal mt-2">{gardu.alamat}</span>
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
            <h2 className="text-3xl font-semibold text-blue-800 mb-6">Temukan Kami</h2>
            <div className="aspect-video w-full rounded-lg shadow-lg overflow-hidden border border-gray-200">
              <div dangerouslySetInnerHTML={{ __html: gardu.googleMapsEmbed }} className="w-full h-full"></div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}