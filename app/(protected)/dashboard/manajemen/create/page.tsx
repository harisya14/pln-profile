"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/text-area"; // Pastikan path ini benar
import { Label } from "@/src/components/ui/label";
import { toast } from "@/src/hooks/useToast";
import DashboardLayout from "@/src/components/dashboard/dashboard-layout";
// import ImageWithFallback from "@/src/components/ImageWithFallback"; // DIHAPUS: Tidak digunakan lagi

// Definisikan tipe data untuk Person (sesuai input frontend)
interface PersonFormData {
  name: string;
  jabatan: string;
  imageUrl?: string | null; // Base64 string atau URL gambar
}

// Definisikan tipe data untuk bagian Manajemen (sesuai input frontend)
interface ManajemenSectionFormInput {
  title: string;
  anchor: string;
  orderIndex: number;
  assistant: {
    name: string;
    jabatan: string;
    image?: string | null; // Base64 string atau URL gambar
  } | null;
  containers: PersonFormData[][]; // Array of arrays of PersonFormData
}

export default function CreateManajemenPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ManajemenSectionFormInput>({
    title: "",
    anchor: "",
    orderIndex: 0,
    assistant: null,
    containers: [[]], // Mulai dengan satu grup kosong
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Handler untuk input teks dasar (title, anchor)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler untuk input angka (orderIndex)
  const handleOrderIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFormData((prev) => ({ ...prev, orderIndex: isNaN(value) ? 0 : value }));
  };

  // Handler untuk input gambar (konversi ke Base64)
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "assistant" | "person",
    groupIndex?: number,
    personIndex?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;

      setFormData((prev) => {
        if (target === "assistant") {
          // PERBAIKAN: Pastikan callback mengembalikan objek prev lengkap
          return {
            ...prev,
            assistant: prev.assistant ? { ...prev.assistant, image: base64String } : { name: "", jabatan: "", image: base64String },
          };
        } else if (target === "person" && groupIndex !== undefined && personIndex !== undefined) {
          const newContainers = [...prev.containers];
          if (newContainers[groupIndex] && newContainers[groupIndex][personIndex]) {
            newContainers[groupIndex][personIndex] = {
              ...newContainers[groupIndex][personIndex],
              imageUrl: base64String,
            };
          }
          return { ...prev, containers: newContainers };
        }
        return prev;
      });
    };
    reader.readAsDataURL(file);
  };

  // Handler untuk menghapus gambar
  const handleRemoveImage = (target: "assistant" | "person", groupIndex?: number, personIndex?: number) => {
    setFormData((prev) => {
      if (target === "assistant") {
        // PERBAIKAN: Pastikan callback mengembalikan objek prev lengkap
        return {
          ...prev,
          assistant: prev.assistant ? { ...prev.assistant, image: null } : null,
        };
      } else if (target === "person" && groupIndex !== undefined && personIndex !== undefined) {
        const newContainers = [...prev.containers];
        if (newContainers[groupIndex] && newContainers[groupIndex][personIndex]) {
          newContainers[groupIndex][personIndex] = {
            ...newContainers[groupIndex][personIndex],
            imageUrl: null,
          };
        }
        return { ...prev, containers: newContainers };
      }
      return prev;
    });
  };

  // Handler untuk input person (nama, jabatan)
  const handlePersonInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    groupIndex: number,
    personIndex: number,
    field: "name" | "jabatan"
  ) => {
    const { value } = e.target;
    setFormData((prev) => {
      const newContainers = [...prev.containers];
      if (!newContainers[groupIndex]) newContainers[groupIndex] = [];
      if (!newContainers[groupIndex][personIndex]) {
        newContainers[groupIndex][personIndex] = { name: "", jabatan: "" };
      }
      newContainers[groupIndex][personIndex] = {
        ...newContainers[groupIndex][personIndex],
        [field]: value,
      };
      return { ...prev, containers: newContainers };
    });
  };

  // Menambah grup baru (array kosong di containers)
  const handleAddGroup = () => {
    setFormData((prev) => ({
      ...prev,
      containers: [...prev.containers, []],
    }));
  };

  // Menghapus grup
  const handleRemoveGroup = (groupIndex: number) => {
    setFormData((prev) => {
      const newContainers = prev.containers.filter((_, i) => i !== groupIndex);
      return { ...prev, containers: newContainers };
    });
  };

  // Menambah person ke grup tertentu
  const handleAddPerson = (groupIndex: number) => {
    setFormData((prev) => {
      const newContainers = [...prev.containers];
      if (!newContainers[groupIndex]) newContainers[groupIndex] = [];
      newContainers[groupIndex] = [...newContainers[groupIndex], { name: "", jabatan: "" }];
      return { ...prev, containers: newContainers };
    });
  };

  // Menghapus person dari grup tertentu
  const handleRemovePerson = (groupIndex: number, personIndex: number) => {
    setFormData((prev) => {
      const newContainers = [...prev.containers];
      if (newContainers[groupIndex]) {
        newContainers[groupIndex] = newContainers[groupIndex].filter((_, i) => i !== personIndex);
      }
      return { ...prev, containers: newContainers };
    });
  };

  // Handler submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    // Validasi dasar
    if (!formData.title || !formData.anchor || formData.orderIndex === undefined) {
      setFormError("Judul, Anchor, dan Order Index wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/manajemen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast({
          title: "Sukses",
          description: `Struktur manajemen "${formData.title}" berhasil ditambahkan.`,
        });
        router.push("/dashboard/manajemen"); // Redirect ke halaman daftar manajemen
        router.refresh();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menambahkan struktur manajemen.");
      }
    } catch (error: any) {
      console.error("Error creating manajemen structure:", error);
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
            Tambah Struktur Manajemen Baru
          </h1>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/manajemen" className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Kembali ke Daftar
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Bagian Informasi Dasar */}
            <div className="space-y-4 border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-700">Informasi Bagian</h2>
              <div>
                <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul Bagian (Contoh: Divisi Keuangan dan Umum)</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Judul Bagian"
                  required
                />
              </div>
              <div>
                <Label htmlFor="anchor" className="block text-sm font-medium text-gray-700 mb-1">Anchor (Slug unik, Contoh: keuangan-dan-umum)</Label>
                <Input
                  id="anchor"
                  name="anchor"
                  type="text"
                  value={formData.anchor}
                  onChange={handleInputChange}
                  placeholder="anchor-unik"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Digunakan untuk navigasi cepat dan harus unik.</p>
              </div>
              <div>
                <Label htmlFor="orderIndex" className="block text-sm font-medium text-gray-700 mb-1">Order Index (Urutan Tampilan)</Label>
                <Input
                  id="orderIndex"
                  name="orderIndex"
                  type="number"
                  value={formData.orderIndex}
                  onChange={handleOrderIndexChange}
                  placeholder="0"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Angka untuk menentukan urutan tampilan bagian ini (dimulai dari 0).</p>
              </div>
            </div>

            {/* Bagian Asisten Manager (Opsional) */}
            <div className="space-y-4 border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center justify-between">
                Asisten Manager (Opsional)
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, assistant: prev.assistant ? null : { name: "", jabatan: "", image: null } }))}
                >
                  {formData.assistant ? "Hapus Asisten" : "Tambah Asisten"}
                </Button>
              </h2>
              {formData.assistant && (
                <div className="bg-gray-50 p-4 rounded-md space-y-3">
                  <div>
                    <Label htmlFor="assistantName" className="block text-sm font-medium text-gray-700 mb-1">Nama Asisten</Label>
                    <Input
                      id="assistantName"
                      name="name"
                      type="text"
                      value={formData.assistant.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, assistant: { ...prev.assistant!, name: e.target.value } }))}
                      placeholder="Nama Asisten"
                    />
                  </div>
                  <div>
                    <Label htmlFor="assistantJabatan" className="block text-sm font-medium text-gray-700 mb-1">Jabatan Asisten</Label>
                    <Input
                      id="assistantJabatan"
                      name="jabatan"
                      type="text"
                      value={formData.assistant.jabatan}
                      onChange={(e) => setFormData(prev => ({ ...prev, assistant: { ...prev.assistant!, jabatan: e.target.value } }))}
                      placeholder="Jabatan Asisten"
                    />
                  </div>
                  <div>
                    <Label htmlFor="assistantImage" className="block text-sm font-medium text-gray-700 mb-1">Gambar Asisten</Label>
                    <Input
                      id="assistantImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "assistant")}
                    />
                    {formData.assistant.image && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                           {/* Menggunakan <img> tag biasa */}
                           <img
                              src={formData.assistant.image}
                              alt="Asisten"
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/images/placeholder-person.png"; // Fallback gambar default
                              }}
                            />
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveImage("assistant")}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bagian Daftar Anggota (Containers) */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-700">Daftar Anggota</h2>
              <Button type="button" onClick={handleAddGroup} className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Tambah Grup Anggota
              </Button>

              {formData.containers.map((group, groupIndex) => (
                <div key={groupIndex} className="border p-4 rounded-md bg-gray-50 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-medium text-gray-800">Grup Anggota {groupIndex + 1}</h3>
                    <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveGroup(groupIndex)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Hapus Grup
                    </Button>
                  </div>

                  {group.map((person, personIndex) => (
                    <div key={personIndex} className="bg-white p-3 rounded-md shadow-sm space-y-2 border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-semibold text-gray-700">Anggota {personIndex + 1}</h4>
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemovePerson(groupIndex, personIndex)}>
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                      <div>
                        <Label htmlFor={`personName-${groupIndex}-${personIndex}`} className="block text-xs font-medium text-gray-600 mb-1">Nama</Label>
                        <Input
                          id={`personName-${groupIndex}-${personIndex}`}
                          type="text"
                          value={person.name}
                          onChange={(e) => handlePersonInputChange(e, groupIndex, personIndex, "name")}
                          placeholder="Nama Anggota"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`personJabatan-${groupIndex}-${personIndex}`} className="block text-xs font-medium text-gray-600 mb-1">Jabatan</Label>
                        <Input
                          id={`personJabatan-${groupIndex}-${personIndex}`}
                          type="text"
                          value={person.jabatan}
                          onChange={(e) => handlePersonInputChange(e, groupIndex, personIndex, "jabatan")}
                          placeholder="Jabatan Anggota"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`personImage-${groupIndex}-${personIndex}`} className="block text-xs font-medium text-gray-600 mb-1">Gambar Anggota</Label>
                        <Input
                          id={`personImage-${groupIndex}-${personIndex}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "person", groupIndex, personIndex)}
                        />
                        {person.imageUrl && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                              {/* Menggunakan <img> tag biasa */}
                              <img
                                src={person.imageUrl}
                                alt="Anggota"
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "/images/placeholder-person.png"; // Fallback gambar default
                                }}
                              />
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveImage("person", groupIndex, personIndex)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddPerson(groupIndex)} className="w-full flex items-center gap-2 mt-4">
                    <Plus className="w-4 h-4" /> Tambah Anggota ke Grup Ini
                  </Button>
                </div>
              ))}
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
              {loading ? "Menyimpan Struktur..." : "Simpan Struktur Manajemen"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
