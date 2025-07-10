import React, { forwardRef } from "react";
import { cn } from "@/src/lib/utils"; // Pastikan path ke utility 'cn' Anda benar

// --- PERBAIKAN: Menambahkan tipe generik ke forwardRef ---
const Textarea = forwardRef<
  HTMLTextAreaElement, // Tipe untuk elemen HTML yang di-render (textarea)
  React.ComponentPropsWithoutRef<"textarea"> // Tipe untuk semua properti standar HTML textarea
>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...rest} // Meneruskan semua properti yang tersisa
    />
  );
});
// --- AKHIR PERBAIKAN ---

Textarea.displayName = "Textarea";

export { Textarea };
