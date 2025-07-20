"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { toast } from "@/src/hooks/useToast";
import DashboardLayout from "@/src/components/dashboard/dashboard-layout";

// Define the type for Person data
interface PersonData {
  name: string;
  jabatan: string | null;
  imageUrl?: string | null;
}

// Define the type for a Management Section
interface ManajemenSectionData {
  id: string; // ID from Prisma
  title: string;
  anchor: string;
  orderIndex: number;
  assistant: {
    name: string;
    jabatan: string;
    image?: string | null;
  } | null;
  containers: PersonData[][]; // Array of arrays of PersonData
}

const ITEMS_PER_PAGE = 5;

export default function ListManajemen() {
  const [manajemenList, setManajemenList] = useState<ManajemenSectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [deletingAnchor, setDeletingAnchor] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch management data from the API
  const fetchManajemenData = () => {
    setLoading(true);
    setError(null);
    fetch("/api/manajemen", {
      cache: "no-store", // Ensure data is always fresh
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Gagal memuat data manajemen.");
        }
        return res.json();
      })
      .then((data: ManajemenSectionData[]) => {
        setManajemenList(data);
      })
      .catch((err) => {
        console.error("Error fetching manajemen data:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Call fetch data when the component mounts
  useEffect(() => {
    fetchManajemenData();
  }, []);

  // Handle the deletion of a management section
  const handleDelete = async (anchor: string) => {
    setDeletingAnchor(anchor);

    try {
      const res = await fetch(`/api/manajemen?anchor=${anchor}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({
          title: "Sukses",
          description: "Anda berhasil menghapus bagian manajemen.",
        });
        // Refresh data to ensure consistency
        fetchManajemenData();
        // Adjust page if the last item on it was deleted
        if (paginated.length === 1 && page > 1) {
            setPage(prev => prev - 1);
        }
      } else {
        const errorData = await res.json();
        toast({
          title: "Gagal Menghapus",
          description: errorData.error || "Silakan coba lagi.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Error deleting manajemen data:", err);
      toast({
        title: "Gagal Menghapus",
        description: err.message || "Terjadi kesalahan tak terduga.",
        variant: "destructive",
      });
    } finally {
      setDeletingAnchor(null); // Reset deleting state
    }
  };

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginated = manajemenList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(manajemenList.length / ITEMS_PER_PAGE);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Manage Struktur Manajemen
          </h1>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/manajemen/create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Tambah Bagian Manajemen
            </Link>
          </Button>
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
                    <TableHead>Judul Bagian</TableHead>
                    <TableHead>Anchor</TableHead>
                    <TableHead className="w-24 text-center">Order</TableHead>
                    <TableHead>Asisten Manager</TableHead>
                    <TableHead>Anggota</TableHead>
                    <TableHead className="text-left">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Tidak ada data struktur manajemen yang ditemukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((item, i) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">{startIndex + i + 1}</TableCell>
                        <TableCell className="w-48 max-w-xs break-words whitespace-normal h-12">{item.title}</TableCell>
                        <TableCell className="w-48 max-w-xs break-words whitespace-normal h-12">{item.anchor}</TableCell>
                        <TableCell className="text-center">{item.orderIndex}</TableCell>
                        <TableCell className="w-64 max-w-xs break-words whitespace-normal h-12">
                          {item.assistant ? (
                            <div className="flex items-center gap-2">
                              {item.assistant.image && (
                                <img
                                  src={item.assistant.image}
                                  alt={item.assistant.name}
                                  className="h-8 w-8 rounded-full object-cover cursor-pointer"
                                  onClick={() => setSelectedImage(item.assistant!.image!)}
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/images/placeholder-person.png";
                                  }}
                                />
                              )}
                              <div>
                                <p className="font-medium">{item.assistant.name}</p>
                                <p className="text-xs text-gray-500">{item.assistant.jabatan}</p>
                              </div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="w-96 max-w-xs break-words whitespace-normal h-12">
                          {item.containers.flat().length > 0 ? (
                            item.containers.map((group, groupIndex) => (
                              <div key={groupIndex} className="mb-2 last:mb-0">
                                <p className="font-semibold text-xs text-gray-700">Grup {groupIndex + 1}:</p>
                                <ul className="list-disc list-inside text-sm text-gray-600">
                                  {group.map((person, personIndex) => (
                                    <li key={personIndex} className="flex items-center gap-1">
                                      {person.imageUrl && (
                                        <img
                                          src={person.imageUrl}
                                          alt={person.name}
                                          className="h-6 w-6 rounded-full object-cover cursor-pointer"
                                          onClick={() => setSelectedImage(person.imageUrl!)}
                                          onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "/images/placeholder-person.png";
                                          }}
                                        />
                                      )}
                                      {person.name} ({person.jabatan || 'Anggota'})
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-center space-x-3">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/dashboard/manajemen/edit/${item.anchor}`}>
                              <Pencil className="w-4 h-4 mr-1" />
                              Edit
                            </Link>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={deletingAnchor === item.anchor}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                {deletingAnchor === item.anchor ? "Menghapus..." : "Hapus"}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bagian manajemen <strong>{item.title}</strong> akan dihapus secara permanen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 text-white hover:bg-red-700"
                                  onClick={() => handleDelete(item.anchor)}
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
                  disabled={page === totalPages || totalPages === 0}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Image Preview Modal */}
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
                width={800}
                height={600}
                className="rounded-lg object-contain max-h-[80vh] w-full h-auto"
                priority
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://placehold.co/800x600/cccccc/333333?text=Gambar+Gagal+Dimuat`;
                }}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}