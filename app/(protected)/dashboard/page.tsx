import { MessageSquareText as KegiatanIcon } from "lucide-react"
import DashboardLayout from "@/src/components/dashboard/dashboard-layout"

// Fungsi fetch data kegiatan dari API
async function getKegiatanCount() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/kegiatan?limit=10000`, {
      cache: "no-store", // agar data selalu fresh saat reload
    })

    if (!res.ok) {
      throw new Error("Failed to fetch kegiatan")
    }

    const data = await res.json()
    return data.articles.length
  } catch (error) {
    console.error("Error fetching kegiatan:", error)
    return 0
  }
}

// Komponen Dashboard
export default async function DashboardPage() {
  const kegiatanCount = await getKegiatanCount()

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Total Kegiatan</h2>
            <KegiatanIcon className="w-6 h-6 text-primary" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{kegiatanCount}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Kegiatan yang telah dipublikasikan
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
