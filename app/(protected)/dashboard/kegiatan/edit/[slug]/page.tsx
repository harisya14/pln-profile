"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/text-area";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import DashboardLayout from "@/src/components/dashboard/dashboard-layout";
import { toast } from "@/src/hooks/useToast";

// Dynamically import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

type EditArticleForm = {
  title: string;
  coverImage: string; // Base64 or URL
  content: string;
  image: string[]; // Array of Base64 strings
};

export default function EditKegiatanPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [form, setForm] = useState<EditArticleForm>({
    title: "",
    coverImage: "",
    content: "",
    image: [],
  });

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/kegiatan?mode=single&slug=${slug}`);
        if (!res.ok) throw new Error("Failed to fetch article");
        const data = await res.json();

        setForm({
          title: data.title,
          coverImage: data.coverImage,
          content: data.content,
          image: data.image || [],
        });

        setCoverPreview(data.coverImage);
        setImagePreviews(data.image || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load article data.",
          variant: "destructive",
        });
        router.push("/dashboard/kegiatan");
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast({ title: "Invalid file type", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large (max 5MB)", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      setCoverPreview(base64String);
      setForm((prev) => ({
        ...prev,
        coverImage: base64String,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAdditionalImagesUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not supported.`,
          variant: "destructive",
        });
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 5MB limit.`,
          variant: "destructive",
        });
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length + imagePreviews.length > 12) {
      toast({
        title: "Too many images",
        description: "You can only upload up to 12 images.",
        variant: "destructive",
      });
      return;
    }

    const previews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        previews.push(result);
        if (previews.length === validFiles.length) {
          setImagePreviews((prev) => [...prev, ...previews]);
          setForm((prev) => ({
            ...prev,
            image: [...prev.image, ...previews],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeCover = () => {
    setCoverPreview(null);
    setForm((prev) => ({ ...prev, coverImage: "" }));
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      setForm((f) => ({ ...f, image: updated }));
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null); // ⬅️ Reset error sebelum submit

    try {
      const res = await fetch(`/api/kegiatan?slug=${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update kegiatan");
      }

      toast({
        title: "Success",
        description: "Kegiatan updated successfully!",
      });

      router.push("/dashboard/kegiatan");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message); // ⬅️ Set error state
      toast({
        title: "Update Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return <DashboardLayout>Loading...</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Kegiatan</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Example: Event Pembukaan"
            />
          </div>

          {/* Cover Image Upload */}
          <div className="grid gap-2">
            <Label
              htmlFor="coverImage"
              className="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6 cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-center gap-4">
                <span className="font-medium">Upload Cover Image</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                  />
                </svg>
              </div>
              <input
                type="file"
                id="coverImage"
                accept="image/*"
                className="sr-only"
                onChange={handleCoverUpload}
              />
            </Label>
            {coverPreview && (
              <div className="relative mt-2 inline-block">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-32 h-24 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={removeCover}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            )}
          </div>

          {/* Rich Text Content */}
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={(content) =>
                setForm((prev) => ({ ...prev, content }))
              }
              placeholder="Write your kegiatan details here..."
              className="bg-white mb-18 lg:mb-11"
              style={{ height: "250px" }}
            />
          </div>

          {/* Additional Images Upload */}
          <div className="grid gap-2">
            <Label
              htmlFor="images"
              className="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6 cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-center gap-4">
                <span className="font-medium">Upload Kegiatan Images (Max 12)</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                  />
                </svg>
              </div>
              <input
                multiple
                type="file"
                id="images"
                accept="image/*"
                className="sr-only"
                onChange={handleAdditionalImagesUpload}
              />
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              Maximum 12 images, each no more than 5MB.
            </p>
          </div>

          {/* Image Previews */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Updating..." : "Update Kegiatan"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}