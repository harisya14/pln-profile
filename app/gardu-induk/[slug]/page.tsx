import { notFound } from "next/navigation";
import MainLayout from "@/src/components/layout";
import Image from 'next/image';
import Link from "next/link";

// Definisikan tipe data untuk satu Gardu Induk dari API
interface UltgDataItem {
  id: string;
  namagi: string;
  image: string; // URL gambar dari Cloudinary
  slug: string;
  alamat: string;
  googleMapsEmbed: string; // String HTML untuk iframe Google Maps
}

// Definisikan props untuk halaman ini
interface PageProps {
  params: {
    slug: string;
  };
}

/**
 * Helper function untuk mendapatkan base URL yang benar untuk pengambilan data di sisi server.
 * Ini penting agar fetch dapat bekerja baik di local development maupun di production (Vercel, dll).
 */
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000"; // Fallback untuk local development
};

/**
 * Mengambil detail Gardu Induk berdasarkan slug-nya.
 * Fungsi ini akan mencoba mencari data di setiap tipe ULTG sampai data ditemukan.
 * @param slug - Slug dari Gardu Induk yang akan dicari.
 * @returns {Promise<UltgDataItem | null>} - Data Gardu Induk atau null jika tidak ditemukan.
 */
async function getUltgDetailBySlug(slug: string): Promise<UltgDataItem | null> {
  const ultgTypes = ["tarahan", "tegineneng", "pagelaran", "kotabumi"];
  const baseUrl = getBaseUrl();

  for (const type of ultgTypes) {
    try {
      const apiUrl = `${baseUrl}/api/ultg?mode=single&type=${type}&slug=${slug}`;
      console.log(`Mencoba mengambil data dari: ${apiUrl}`);
      
      const res = await fetch(apiUrl, {
        cache: "no-store", // Selalu ambil data terbaru
      });

      // Jika respons berhasil (status 2xx)
      if (res.ok) {
        const data: UltgDataItem = await res.json();
        console.log(`Data ditemukan untuk tipe ${type}:`, data.namagi);
        return data; // Kembalikan data dan hentikan loop
      }
    } catch (error) {
      console.error(`Error saat mengambil data untuk tipe ${type}, slug ${slug}:`, error);
    }
  }

  // Jika loop selesai dan data tidak ditemukan
  console.log(`Gardu Induk dengan slug '${slug}' tidak ditemukan di semua tipe.`);
  return null;
}

/**
 * Komponen Halaman Detail Gardu Induk (Server Component)
 */
export default async function GarduIndukDetailPage({ params }: PageProps) {
  const { slug } = params;
  const gardu = await getUltgDetailBySlug(slug);

  // Jika data gardu tidak ditemukan setelah mencari di semua tipe, tampilkan halaman 404.
  if (!gardu) {
    notFound();
  }

  return (
    <MainLayout>
      <section className="px-4 md:px-8 py-12 md:py-20 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
          
          {/* Tombol Kembali */}
          <div className="mb-8">
            <Link href="/gardu-induk" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Kembali ke Daftar Gardu Induk
            </Link>
          </div>

          {/* Judul dan Alamat */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {gardu.namagi}
          </h1>
          <p className="text-lg text-gray-500 mb-6">{gardu.alamat}</p>

          {/* Gambar Utama */}
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden border border-gray-200">
            <Image 
              src={gardu.image}
              alt={`Gambar ${gardu.namagi}`}
              fill
              priority // Prioritaskan pemuatan gambar ini
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
          
          {/* Peta Lokasi */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Lokasi di Peta</h2>
            <div className="aspect-video w-full rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div dangerouslySetInnerHTML={{ __html: gardu.googleMapsEmbed }} className="w-full h-full" />
            </div>
          </div>

        </div>
      </section>
    </MainLayout>
  );
}
