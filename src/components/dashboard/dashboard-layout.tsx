"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Menu,
  X,
  LogOut,
  Zap,
  User,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "@/src/components/ui/button";
import { signOutAction } from "@/src/lib/actions"; // Asumsi ini adalah action signOut Anda
import { toast } from "@/src/hooks/useToast"; // Asumsi ini adalah hook toast Anda

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Kegiatan",
    path: "/dashboard/kegiatan",
    icon: BookOpen,
  },
  // --- ITEM NAVIGASI BARU UNTUK GARDU INDUK ---
  {
    label: "Gardu Induk",
    path: "/dashboard/gardu", // Sesuaikan dengan path halaman daftar gardu induk Anda
    icon: Zap, // Menggunakan ikon Zap
  },

  {
    label: "Manajemen",
    path: "/dashboard/manajemen", // Sesuaikan dengan path halaman daftar gardu induk Anda
    icon: User, // Menggunakan ikon Zap
  },
  // --- AKHIR ITEM NAVIGASI BARU ---
];

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      const result = await signOutAction();
      if (result.success) {
        toast({
          title: "Success",
          description: "You have successfully logged out.",
        });
        router.replace("/login");
        router.refresh();
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed md:top-4 md:left-4 top-0 left-0 z-50 w-64 h-full md:h-[calc(100vh-2rem)] bg-white shadow-xl rounded-none md:rounded-2xl p-6 transition-transform duration-300 ease-in-out overflow-y-auto",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col justify-between h-full space-y-6">
          {/* Branding */}
          <div className="flex flex-col gap-1 mb-6">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                {/* Pastikan path gambar logo ini benar */}
                <img
                  src="/images/Logo.png"
                  alt="PLN Logo"
                  className="w-10 h-auto mr-2"
                />
                <div className="flex flex-col leading-tight">
                  <h3 className="text-base font-bold text-blue-900">UPT</h3>
                  <h3 className="text-base font-bold text-blue-900">Tanjung Karang</h3>
                </div>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground pl-1">
              Welcome, Admin
            </p>
          </div>

          {/* Navigasi */}
          <nav className="space-y-2">
            {navItems.map(({ label, path, icon: Icon }) => {
              let isActive = false;

              // Logika untuk menentukan item navigasi aktif
              if (label === "Dashboard") {
                isActive = pathname === path;
              } else {
                // Untuk item lain, aktif jika path persis sama atau dimulai dengan path tersebut
                isActive = pathname === path || pathname.startsWith(`${path}/`);
              }

              return (
                <Link
                  key={path}
                  href={path}
                  onClick={() => setOpen(false)} // Tutup sidebar mobile saat item diklik
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    isActive
                      ? "bg-blue-700 text-white"
                      : "text-gray-700 hover:bg-blue-100"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Tombol Logout */}
          <Button
            variant="destructive"
            className="w-full flex items-center gap-2 mt-auto bg-red-600 hover:bg-red-700"
            onClick={handleLogout}
            disabled={isPending}
          >
            <LogOut className="w-4 h-4" />
            {isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>

      {/* Header Mobile (untuk toggle sidebar) */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          {/* Pastikan path gambar logo ini benar */}
          <img
            src="/images/Logo.png"
            alt="PLN Logo"
            className="w-10 h-auto mr-2"
          />
          <div className="flex flex-col leading-tight">
            <h3 className="text-base font-bold text-blue-900">UPT</h3>
            <h3 className="text-base font-bold text-blue-900">Tanjung Karang</h3>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Konten Utama Dashboard */}
      <main className="p-6 pt-4 md:ml-[272px] min-h-screen">{children}</main>
    </div>
  );
};

export default DashboardLayout;
