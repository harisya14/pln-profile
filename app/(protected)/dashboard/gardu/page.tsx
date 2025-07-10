"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Menggunakan next/image untuk optimasi
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/src/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { toast } from "@/src/hooks/useToast"; // Asumsi ini adalah hook toast Anda
import DashboardLayout from "@/src/components/dashboard/dashboard-layout"; // Pastikan path ini benar

// Definisikan tipe data untuk ultg
interface UltgData {
  id: string;
  namagi: string;
  image: string;
  slug: string;
  alamat: string;
  googleMapsEmbed: string;
  // createdAt?: string; // Tidak ada di skema ultg Anda, jadi dihapus
  // updatedAt?: string; // Tidak ada di skema ultg Anda, jadi dihapus
}

const ITEMS_PER_PAGE = 5;

export default function ListGardu() {
  const [ultgList, setUltgList] = useState<UltgData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [deletingItem, setDeletingItem] = useState<{ slug: string; type: string } | null>(null); // Menyimpan slug dan type untuk dihapus
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("tarahan"); // State untuk memilih tipe ultg

  // Fungsi untuk mengambil data ultg berdasarkan tipe yang dipilih
  const fetchUltgData = async (type: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ultg?type=${type}&limit=100`); // Sesuaikan limit jika perlu
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal memuat data gardu induk.");
      }
      const data = await res.json();
      setUltgList(data.data || []); // API /api/ultg mengembalikan data dalam properti 'data'
    } catch (err: any) {
      console.error("Error fetching ultg data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Panggil fetch data saat komponen dimuat atau saat selectedType berubah
  useEffect(() => {
    setPage(1); // Reset halaman ke 1 setiap kali tipe berubah
    fetchUltgData(selectedType);
  }, [selectedType]);

  // Fungsi untuk menangani penghapusan data ultg
  const handleDelete = async () => {
    if (!deletingItem) return;

    const { slug, type } = deletingItem;
    setLoading(true); // Set loading saat operasi delete berlangsung

    try {
      const res = await fetch(`/api/ultg?type=${type}&slug=${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({
          title: "Sukses",
          description: "Anda berhasil menghapus data gardu induk.",
        });
        // Perbarui state secara lokal setelah penghapusan berhasil
        setUltgList((prev) => prev.filter((item) => item.slug !== slug || selectedType !== type));
        // Jika halaman saat ini kosong setelah penghapusan, kembali ke halaman sebelumnya
        if (paginated.length === 1 && page > 1) {
            setPage(prev => prev - 1);
        }
        fetchUltgData(selectedType); // Refresh data untuk memastikan konsistensi
      } else {
        const errorData = await res.json();
        toast({
          title: "Gagal Menghapus",
          description: errorData.error || "Silakan coba lagi.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Error deleting ultg data:", err);
      toast({
        title: "Gagal Menghapus",
        description: err.message || "Terjadi kesalahan tak terduga.",
        variant: "destructive",
      });
    } finally {
      setDeletingItem(null); // Reset state deletingItem
      setLoading(false); // Matikan loading
    }
  };

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginated = ultgList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(ultgList.length / ITEMS_PER_PAGE);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Manage Gardu Induk
          </h1>
          <div className="flex items-center gap-4">
            {/* Dropdown untuk memilih tipe ultg */}
            <label htmlFor="ultgType" className="sr-only">Pilih Tipe Gardu Induk</label>
            <select
              id="ultgType"
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="tarahan">ultg Tarahan</option>
              <option value="tegineneng">ultg Tegineneng</option>
              <option value="pagelaran">ultg Pagelaran</option>
              <option value="kotabumi">ultg Kotabumi</option>
            </select>

            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/gardu/create?type=${selectedType}`} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Tambah Gardu Induk
              </Link>
            </Button>
          </div>
        </div>

        {loading && <p className="text-gray-600">Memuat data...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto rounded-lg shadow bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">No</TableHead>
                    <TableHead>Nama GI</TableHead>
                    <TableHead>Gambar</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Google Maps</TableHead>
                    <TableHead className="text-left">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Tidak ada data gardu induk untuk tipe {selectedType}.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((item, i) => (
                      <TableRow key={item.id}> {/* Menggunakan item.id sebagai key */}
                        <TableCell className="text-center">{startIndex + i + 1}</TableCell>
                        <TableCell className="w-48 max-w-xs break-words whitespace-normal h-12">{item.namagi}</TableCell>
                        <TableCell>
                          <img
                            src={item.image}
                            alt={item.namagi}
                            className="h-10 w-auto rounded cursor-pointer object-cover"
                            onClick={() => setSelectedImage(item.image)}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = `https://placehold.co/40x40/cccccc/333333?text=N/A`;
                            }}
                          />
                        </TableCell>
                        <TableCell
                          className="w-64 max-w-xs break-words whitespace-normal line-clamp-2 h-12"
                        >
                          {item.alamat}
                        </TableCell>
                        <TableCell className="w-64 max-w-xs break-words whitespace-normal line-clamp-2 h-12">
                          {/* Menampilkan embed maps dengan aman */}
                          <div
                            dangerouslySetInnerHTML={{ __html: item.googleMapsEmbed }}
                            className="w-24 h-16 overflow-hidden rounded-md border border-gray-200"
                          />
                        </TableCell>
                        <TableCell className="text-center space-x-3">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/dashboard/gardu/edit/${selectedType}/${item.slug}`}>
                              <Pencil className="w-4 h-4 mr-1" />
                              Edit
                            </Link>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                // Menggunakan deletingItem untuk membandingkan
                                disabled={deletingItem?.slug === item.slug && deletingItem?.type === selectedType}
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => setDeletingItem({ slug: item.slug, type: selectedType })} // Set item yang akan dihapus
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                {deletingItem?.slug === item.slug && deletingItem?.type === selectedType ? "Menghapus..." : "Hapus"}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Gardu Induk <strong>{item.namagi}</strong> dari tipe <strong>{selectedType}</strong> akan dihapus secara permanen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeletingItem(null)}>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 text-white hover:bg-red-700"
                                  onClick={handleDelete} // Panggil handleDelete tanpa argumen karena state sudah diset
                                >
                                  Ya, hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <p className="text-sm text-muted-foreground">
                Halaman {page} dari {totalPages}
              </p>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Modal Pratinjau Gambar */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative bg-white rounded-lg shadow-xl p-4 max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 z-10 bg-gray-800/60 hover:bg-gray-800/80 text-white rounded-full p-1 transition-colors"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>
              <Image
                src={selectedImage}
                alt="Pratinjau Gambar"
                width={800} // Sesuaikan dengan ukuran yang wajar
                height={600} // Sesuaikan dengan ukuran yang wajar
                className="rounded-lg object-contain max-h-[80vh] w-full h-auto"
                priority // Memuat gambar lebih awal
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://placehold.co/800x600/cccccc/333333?text=Gambar+Tidak+Dapat+Dimuat`;
                }}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
