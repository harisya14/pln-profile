"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/text-area"; // Pastikan path ini benar
import { Label } from "@/src/components/ui/label";
import { toast } from "@/src/hooks/useToast";
import DashboardLayout from "@/src/components/dashboard/dashboard-layout";

type UltgParams = {
  namagi: string;
  image: string; // Base64 string for image upload
  alamat: string;
  googleMapsEmbed: string;
};

export default function CreateGarduPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'tarahan';

  const [namagi, setNamagi] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [alamat, setAlamat] = useState<string>('');
  const [googleMapsEmbed, setGoogleMapsEmbed] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl && typeFromUrl !== selectedType) {
      setSelectedType(typeFromUrl);
    }
  }, [searchParams, selectedType]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    if (!namagi || !image || !alamat || !googleMapsEmbed) {
      setFormError("Semua bidang wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      const payload: UltgParams & { type: string } = {
        type: selectedType,
        namagi,
        image,
        alamat,
        googleMapsEmbed,
      };

      const res = await fetch("/api/ultg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast({
          title: "Sukses",
          description: `Data Gardu Induk ${namagi} (${selectedType}) berhasil ditambahkan.`,
        });
        router.push(`/dashboard/gardu/`);
        router.refresh();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menambahkan data gardu induk.");
      }
    } catch (error: any) {
      console.error("Error creating ultg data:", error);
      setFormError(error.message);
      toast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat menambahkan data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Tambah Gardu Induk Baru ({selectedType.toUpperCase()})
          </h1>
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/gardu`} className="flex items-center gap-2">
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
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 cursor-not-allowed"
                value={selectedType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)} // Tipe eksplisit
                disabled
              >
                <option value="tarahan">ultg Tarahan</option>
                <option value="tegineneng">ultg Tegineneng</option>
                <option value="pagelaran">ultg Pagelaran</option>
                <option value="kotabumi">ultg Kotabumi</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">Tipe gardu induk diambil dari URL.</p>
            </div>

            <div>
              <Label htmlFor="namagi" className="block text-sm font-medium text-gray-700 mb-1">Nama Gardu Induk (GI)</Label>
              <Input
                id="namagi"
                type="text"
                value={namagi}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNamagi(e.target.value)} // Tipe eksplisit
                placeholder="Contoh: GI Tarahan Utama"
                required
              />
            </div>

            <div>
              <Label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Gambar Gardu</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
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
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAlamat(e.target.value)} // Tipe eksplisit
                placeholder="Contoh: Jl. Raya Lintas Sumatera KM 10, Tarahan"
                rows={3}
                required
                // Kelas-kelas ini sudah ada di komponen Textarea Shadcn UI
                // Jika Anda tidak menggunakan Shadcn UI, Anda perlu memastikan kelas ini ada di komponen Textarea kustom Anda
                className="flex h-auto w-full rounded-md border border-input bg-background px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>

            <div>
              <Label htmlFor="googleMapsEmbed" className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed (Kode iframe HTML)</Label>
              <Textarea
                id="googleMapsEmbed"
                value={googleMapsEmbed}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGoogleMapsEmbed(e.target.value)} // Tipe eksplisit
                placeholder='Salin seluruh kode iframe dari Google Maps, contoh: <iframe src="..." width="600" height="450"></iframe>'
                rows={5}
                required
                // Kelas-kelas ini sudah ada di komponen Textarea Shadcn UI
                className="flex h-auto w-full rounded-md border border-input bg-background px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">Pastikan Anda menyalin seluruh kode `iframe` dari Google Maps.</p>
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
              disabled={loading}
            >
              {loading ? "Menambahkan..." : "Tambah Gardu Induk"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
