import { MessageSquareText as KegiatanIcon, Power as GarduIcon, Users as ManajemenIcon } from "lucide-react"; // Import icon Users untuk Manajemen
import DashboardLayout from "@/src/components/dashboard/dashboard-layout"; // Pastikan path ini benar sesuai struktur proyek Anda

// Fungsi fetch data kegiatan dari API
async function getKegiatanCount() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/kegiatan?limit=10000`, {
      cache: "no-store", // agar data selalu fresh saat reload
    });

    if (!res.ok) {
      throw new Error("Failed to fetch kegiatan");
    }

    const data = await res.json();
    // Asumsi API kegiatan mengembalikan objek dengan properti 'articles' yang merupakan array
    if (data && Array.isArray(data.articles)) {
      return data.articles.length;
    } else {
      console.warn("Unexpected data structure for kegiatan API:", data);
      return 0;
    }
  } catch (error) {
    console.error("Error fetching kegiatan:", error);
    return 0;
  }
}

// --- FUNGSI UNTUK MENGAMBIL JUMLAH TOTAL GARDU INDUK (ULTG) DARI SEMUA TIPE ---
async function getUltgCount() {
  const ultgTypes = ["tarahan", "tegineneng", "pagelaran", "kotabumi"];
  let totalUltgCount = 0;

  for (const type of ultgTypes) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ultg?type=${type}&limit=10000`, {
        cache: "no-store", // agar data selalu fresh saat reload
      });

      if (!res.ok) {
        console.error(`Failed to fetch ULTG data for type ${type}:`, await res.text());
        continue;
      }

      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        totalUltgCount += data.data.length;
      } else {
        console.warn(`Unexpected data structure for ultg type ${type}:`, data);
      }
    } catch (error) {
      console.error(`Error fetching ultg data for type ${type}:`, error);
    }
  }
  return totalUltgCount;
}
// --- AKHIR FUNGSI ULTG ---

// --- FUNGSI BARU: Mengambil jumlah total Struktur Manajemen ---
async function getManajemenCount() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/manajemen?limit=10000`, {
      cache: "no-store", // agar data selalu fresh saat reload
    });

    if (!res.ok) {
      throw new Error("Failed to fetch manajemen data");
    }

    const data = await res.json(); // 'data' sekarang adalah array langsung

    // **PERBAIKAN DI SINI:** Periksa jika 'data' adalah array langsung dan ambil panjangnya
    if (Array.isArray(data)) {
      return data.length; // Langsung mengembalikan panjang array yang diterima
    } else {
      // Ini akan tertangkap jika API mengembalikan sesuatu yang bukan array
      console.warn("Unexpected data structure for manajemen API: Expected an array, but received:", data);
      return 0;
    }
  } catch (error) {
    console.error("Error fetching manajemen data:", error);
    return 0;
  }
}
// --- AKHIR FUNGSI MANAJEMEN ---

// Komponen Dashboard
export default async function DashboardPage() {
  // Panggil semua fungsi untuk mendapatkan jumlah data dari backend
  const kegiatanCount = await getKegiatanCount();
  const ultgCount = await getUltgCount();
  const manajemenCount = await getManajemenCount(); // Panggil fungsi baru untuk manajemen

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card untuk Total Kegiatan */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Total Kegiatan</h2>
            <KegiatanIcon className="w-6 h-6 text-blue-500" /> {/* Icon untuk Kegiatan */}
          </div>
          <p className="text-3xl font-bold text-gray-900">{kegiatanCount}</p>
          <p className="text-sm text-gray-500 mt-1">
            Kegiatan yang telah dipublikasikan
          </p>
        </div>

        {/* Card untuk Total Gardu Induk */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Total Gardu Induk (ULTG)</h2>
            <GarduIcon className="w-6 h-6 text-green-500" /> {/* Icon untuk Gardu Induk */}
          </div>
          <p className="text-3xl font-bold text-gray-900">{ultgCount}</p>
          <p className="text-sm text-gray-500 mt-1">
            Gardu Induk yang terdaftar
          </p>
        </div>

        {/* Card untuk Total Struktur Manajemen */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Total Struktur Manajemen</h2>
            <ManajemenIcon className="w-6 h-6 text-purple-500" /> {/* Icon untuk Manajemen */}
          </div>
          <p className="text-3xl font-bold text-gray-900">{manajemenCount}</p>
          <p className="text-sm text-gray-500 mt-1">
            Struktur manajemen yang terdaftar
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
