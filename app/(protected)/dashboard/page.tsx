import { MessageSquareText as KegiatanIcon, Power as GarduIcon } from "lucide-react"; // Import icon Power untuk Gardu Induk
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
    return data.articles.length;
  } catch (error) {
    console.error("Error fetching kegiatan:", error);
    return 0;
  }
}

// --- FUNGSI BARU: Mengambil jumlah total Gardu Induk (ULTG) dari semua tipe ---
async function getUltgCount() {
  const ultgTypes = ["tarahan", "tegineneng", "pagelaran", "kotabumi"];
  let totalUltgCount = 0;

  for (const type of ultgTypes) {
    try {
      // Menggunakan limit yang besar untuk mencoba mengambil semua data dalam satu panggilan
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ultg?type=${type}&limit=10000`, {
        cache: "no-store", // agar data selalu fresh saat reload
      });

      if (!res.ok) {
        // Log error spesifik untuk tipe ULTG ini tetapi lanjutkan ke tipe berikutnya
        console.error(`Failed to fetch ULTG data for type ${type}:`, await res.text());
        continue; // Lanjutkan ke tipe berikutnya jika ada error pada satu tipe
      }

      const data = await res.json();
      // Pastikan struktur respons adalah { data: [], next_cursor: null }
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
// --- AKHIR FUNGSI BARU ---

// Komponen Dashboard
export default async function DashboardPage() {
  const kegiatanCount = await getKegiatanCount();
  const ultgCount = await getUltgCount(); // Panggil fungsi baru

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card untuk Total Kegiatan */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Total Kegiatan</h2>
            <KegiatanIcon className="w-6 h-6 text-blue-500" /> {/* Ganti warna icon jika perlu */}
          </div>
          <p className="text-3xl font-bold text-gray-900">{kegiatanCount}</p>
          <p className="text-sm text-gray-500 mt-1">
            Kegiatan yang telah dipublikasikan
          </p>
        </div>

        {/* --- CARD BARU: Untuk Total Gardu Induk --- */}
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
        {/* --- AKHIR CARD BARU --- */}

      </div>
    </DashboardLayout>
  );
}
