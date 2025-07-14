import { MessageSquareText as KegiatanIcon, Power as GarduIcon, Users as ManajemenIcon } from "lucide-react";
import Link from "next/link"; // Import Link for navigation
import DashboardLayout from "@/src/components/dashboard/dashboard-layout"; // Pastikan path ini benar

// Komponen Dashboard telah diubah menjadi statis dengan shortcut
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Input Data Cepat</h1>
      <p className="text-gray-600 mb-8">Pilih salah satu menu di bawah untuk menambahkan data baru.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tombol Shortcut untuk Input Kegiatan */}
        <Link href="/dashboard/kegiatan/create" className="block group">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 group-hover:shadow-lg group-hover:border-blue-500 transition-all duration-300 h-full flex flex-col items-start">
            <div className="flex items-center justify-between w-full mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Input Kegiatan</h2>
              <div className="bg-blue-100 p-3 rounded-full">
                <KegiatanIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Klik untuk menambahkan data kegiatan baru yang telah dipublikasikan.
            </p>
            <div className="mt-auto pt-4 text-blue-600 font-semibold group-hover:underline">
              Tambah Data &rarr;
            </div>
          </div>
        </Link>

        {/* Tombol Shortcut untuk Input Gardu Induk */}
        <Link href="/dashboard/gardu" className="block group">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 group-hover:shadow-lg group-hover:border-green-500 transition-all duration-300 h-full flex flex-col items-start">
            <div className="flex items-center justify-between w-full mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Input Gardu Induk</h2>
              <div className="bg-green-100 p-3 rounded-full">
                <GarduIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Klik untuk menambahkan data Gardu Induk (ULTG) yang baru.
            </p>
            <div className="mt-auto pt-4 text-green-600 font-semibold group-hover:underline">
              Tambah Data &rarr;
            </div>
          </div>
        </Link>

        {/* Tombol Shortcut untuk Input Struktur Manajemen */}
        <Link href="/dashboard/manajemen/create" className="block group">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 group-hover:shadow-lg group-hover:border-purple-500 transition-all duration-300 h-full flex flex-col items-start">
            <div className="flex items-center justify-between w-full mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Input Manajemen</h2>
              <div className="bg-purple-100 p-3 rounded-full">
                <ManajemenIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Klik untuk menambahkan data struktur manajemen yang baru.
            </p>
            <div className="mt-auto pt-4 text-purple-600 font-semibold group-hover:underline">
              Tambah Data &rarr;
            </div>
          </div>
        </Link>
      </div>
    </DashboardLayout>
  );
}
