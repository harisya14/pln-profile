"use client";

import { useEffect, useState } from "react";
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

const ITEMS_PER_PAGE = 5;

export default function ListArticle() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/kegiatan?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat data artikel.");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (slug: string) => {
    const res = await fetch(`/api/kegiatan?slug=${slug}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast({
        title: "Success",
        description: "You have successfully deleted kegiatan.",
      });
      setArticles((prev) => prev.filter((item) => item.slug !== slug));
    } else {
      toast({
        title: "Delete Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }

    setDeletingId(null);
  };

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginated = articles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Manage Kegiatan
          </h1>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/kegiatan/create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Tambah Artikel
            </Link>
          </Button>
        </div>

        {loading && <p className="text-gray-600">Memuat data...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto rounded-lg shadow bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">No</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Cover</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead className="text-left">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((item, i) => (
                    <TableRow key={item.slug}>
                      <TableCell className="text-center">{startIndex + i + 1}</TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>
                        <img
                          src={item.coverImage}
                          alt="cover"
                          className="h-10 rounded cursor-pointer"
                          onClick={() => setSelectedImage(item.coverImage)}
                        />
                      </TableCell>
                      <TableCell className="w-64 max-w-xs break-words whitespace-normal">
                        {item.content}
                      </TableCell>
                      <TableCell>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("id-ID")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/kegiatan/edit/${item.slug}`}>
                            <Pencil className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={deletingId === item.slug}
                              className="bg-red-700 hover:bg-red-900"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              {deletingId === item.slug ? "Menghapus..." : "Hapus"}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Kegiatan <strong>{item.title}</strong> akan dihapus secara
                                permanen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                              className="bg-red-700 text-white hover:bg-red-900"
                                onClick={() => {
                                  setDeletingId(item.slug);
                                  handleDelete(item.slug);
                                }}
                              >
                                Ya, hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
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

        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative w-[90vw] max-w-2xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/60 text-white hover:text-red-500 rounded-full p-1 shadow"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <Image
                src={selectedImage}
                alt="Preview"
                width={800}
                height={600}
                className="rounded object-contain max-h-[80vh] w-full h-auto"
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}