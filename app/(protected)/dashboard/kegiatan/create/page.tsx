"use client";

import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/text-area";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "@/src/hooks/useToast";
import DashboardLayout from "@/src/components/dashboard/dashboard-layout";

export default function CreateKegiatan() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    coverImage: "", // Base64 string
    content: "",
    image: [] as string[], // Array of Base64 strings
  });

  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // Set first image as coverImage
      setForm((prev) => ({
        ...prev,
        coverImage: newPreviews[0],
        image: [...prev.image, ...newPreviews.slice(1)],
      }));
    });
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Update form data accordingly
      setForm((formState) => {
        if (index === 0) {
          // Removed cover image, set new one or empty
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
      const res = await fetch("/api/kegiatan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create kegiatan");
      }

      toast({
        title: "Success",
        description: "Kegiatan created successfully!",
      });

      router.push("/dashboard/kegiatan");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
      toast({
        title: "Error",
        description: `Failed to create kegiatan: ${message}`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Kegiatan</h1>
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

          {/* File Upload Section */}
          <div className="grid gap-2">
            <Label
              htmlFor="File"
              className="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6 cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-center gap-4">
                <span className="font-medium">Upload your file(s)</span>
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
            <p className="text-xs text-gray-500 mt-1">First image will be used as cover image.</p>
          </div>

          {/* File Previews */}
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
              placeholder="Write your kegiatan details here..."
              rows={6}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={submitting} className="w-full mt-4">
            {submitting ? "Submitting..." : "Submit Kegiatan"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}