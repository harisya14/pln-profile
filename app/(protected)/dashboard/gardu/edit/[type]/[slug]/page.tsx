"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation"; // Hanya butuh useParams
import { ChevronLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/text-area";
import { Label } from "@/src/components/ui/label";
import { toast } from "@/src/hooks/useToast";
import DashboardLayout from "@/src/components/dashboard/dashboard-layout";

type UltgParams = {
  namagi: string;
  image: string;
  alamat: string;
  googleMapsEmbed: string;
};

export default function EditGarduPage() {
  const router = useRouter();
  const params = useParams(); // params sekarang berisi { type: '...', slug: '...' }

  // --- PERUBAHAN: Mengambil type dan slug dari params ---
  const slug = params.slug as string;
  const type = params.type as string;

  const [namagi, setNamagi] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [alamat, setAlamat] = useState<string>('');
  const [googleMapsEmbed, setGoogleMapsEmbed] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>(type || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || !type) {
        setFormError("Parameter 'slug' atau 'type' tidak ditemukan di URL.");
        setInitialLoading(false);
        return;
    };

    const fetchGarduData = async () => {
      setInitialLoading(true);
      try {
        const res = await fetch(`/api/ultg?type=${type}&slug=${slug}&mode=single`);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Gagal mengambil data gardu.");
        }
        
        const data = await res.json();
        
        setNamagi(data.namagi);
        setAlamat(data.alamat);
        setGoogleMapsEmbed(data.googleMapsEmbed);
        setImage(data.image);
        setSelectedType(type);

      } catch (error: any) {
        setFormError(error.message);
        toast({
          title: "Error",
          description: "Tidak dapat memuat data gardu untuk diedit.",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchGarduData();
  }, [slug, type]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    if (!namagi || !alamat || !googleMapsEmbed) {
      setFormError("Semua bidang kecuali gambar wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      const payload: UltgParams = {
        namagi,
        image,
        alamat,
        googleMapsEmbed,
      };

      const res = await fetch(`/api/ultg?type=${selectedType}&slug=${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast({
          title: "Sukses",
          description: `Data Gardu Induk ${namagi} berhasil diperbarui.`,
        });
        router.push(`/dashboard/gardu/`);
        router.refresh();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal memperbarui data gardu induk.");
      }
    } catch (error: any) {
      console.error("Error updating ultg data:", error);
      setFormError(error.message);
      toast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat memperbarui data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (initialLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">Memuat data gardu...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Ubah Data Gardu Induk ({selectedType.toUpperCase()})
          </h1>
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/gardu?type=${selectedType}`} className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Kembali ke Daftar
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="ultgType" className="block text-sm font-medium text-gray-700 mb-1">Tipe Gardu Induk</Label>
              <select
                id="ultgType"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-gray-50 cursor-not-allowed"
                value={selectedType}
                disabled
              >
                <option value="tarahan">ultg Tarahan</option>
                <option value="tegineneng">ultg Tegineneng</option>
                <option value="pagelaran">ultg Pagelaran</option>
                <option value="kotabumi">ultg Kotabumi</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">Tipe gardu induk tidak dapat diubah.</p>
            </div>

            <div>
              <Label htmlFor="namagi" className="block text-sm font-medium text-gray-700 mb-1">Nama Gardu Induk (GI)</Label>
              <Input
                id="namagi"
                type="text"
                value={namagi}
                onChange={(e) => setNamagi(e.target.value)}
                placeholder="Contoh: GI Tarahan Utama"
                required
              />
            </div>

            <div>
              <Label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Ganti Gambar Gardu (Opsional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {image && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Pratinjau Gambar:</p>
                  <img src={image} alt="Pratinjau" className="max-w-xs h-auto rounded-md shadow" />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</Label>
              <Textarea
                id="alamat"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Contoh: Jl. Raya Lintas Sumatera KM 10, Tarahan"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="googleMapsEmbed" className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed (Kode iframe HTML)</Label>
              <Textarea
                id="googleMapsEmbed"
                value={googleMapsEmbed}
                onChange={(e) => setGoogleMapsEmbed(e.target.value)}
                placeholder='Salin seluruh kode iframe dari Google Maps'
                rows={5}
                required
              />
            </div>

            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {formError}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md disabled:opacity-50"
              disabled={loading || initialLoading}
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}