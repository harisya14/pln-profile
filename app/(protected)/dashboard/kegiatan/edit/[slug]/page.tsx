"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/text-area";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { toast } from "@/src/hooks/useToast";
import DashboardLayout from "@/src/components/dashboard/dashboard-layout";

export default function EditKegiatanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [form, setForm] = useState({
    title: "",
    coverImage: "", // Base64 or URL
    content: "",
    image: [] as string[], // Additional images
  });

  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch article data on mount
  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;

      try {
        const res = await fetch(`/api/kegiatan?mode=single&slug=${slug}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to load article");

        // Set initial form values
        setForm({
          title: data.title,
          coverImage: data.coverImage,
          content: data.content,
          image: data.image || [],
        });

        // Set previews for existing images
        setPreviews([data.coverImage, ...(data.image || [])]);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        toast({
          title: "Error",
          description: `Failed to load article: ${message}`,
          variant: "destructive",
        });
        router.push("/dashboard/kegiatan");
      }
    };

    fetchArticle();
  }, [slug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const newFiles: File[] = [];

    Array.from(files).forEach((file) => {
      if (!validImageTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported image format.`,
          variant: "destructive",
        });
        return;
      }
      newFiles.push(file);
    });

    if (newFiles.length === 0) return;

    const newPreviews: string[] = [];
    const readerPromises = newFiles.map((file) => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          const base64String = event.target?.result as string;
          newPreviews.push(base64String);
          resolve();
        };

        reader.readAsDataURL(file);
      });
    });

    Promise.all(readerPromises).then(() => {
      setPreviews((prev) => [...prev, ...newPreviews]);

      setForm((prev) => ({
        ...prev,
        coverImage: prev.coverImage || newPreviews[0],
        image: [...prev.image, ...newPreviews.slice(1)],
      }));
    });
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      setForm((formState) => {
        if (index === 0) {
          // Removed cover image
          const newCover = updated[0] || "";
          return {
            ...formState,
            coverImage: newCover,
            image: updated.slice(1),
          };
        } else {
          // Removed from additional images
          const newImages = formState.image.filter((_, i) => i !== index - 1);
          return {
            ...formState,
            image: newImages,
          };
        }
      });
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/kegiatan?slug=${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update kegiatan");
      }

      toast({
        title: "Success",
        description: "Kegiatan updated successfully!",
      });

      router.push("/dashboard/kegiatan");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
      toast({
        title: "Error",
        description: `Failed to update kegiatan: ${message}`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Kegiatan</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
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

          {/* Upload Section */}
          <div className="grid gap-2">
            <Label
              htmlFor="File"
              className="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6 cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-center gap-4">
                <span className="font-medium">Upload new file(s)</span>
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
                id="File"
                className="sr-only"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              First image will be used as cover image.
            </p>
          </div>

          {/* Image Previews */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => removePreview(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Write your kegiatan details here..."
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={submitting} className="w-full mt-4">
            {submitting ? "Submitting..." : "Update Kegiatan"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}