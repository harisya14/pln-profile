"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx"; // Import clsx untuk menggabungkan kelas

type NavItem = {
  label: string;
  path: string;
};

const navItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Kegiatan", path: "/kegiatan" },
  { label: "Manajemen", path: "/manajemen" },
  { label: "Gardu Induk", path: "/gardu-induk" }
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Tentukan apakah ini halaman yang seharusnya memiliki header transparan di awal
  const isPageWithTransparentHeader = pathname === "/" || pathname.startsWith("/kegiatan");

  // Tentukan apakah header saat ini harus transparan
  const isTransparentHeader = isPageWithTransparentHeader && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    // Jalankan sekali saat mount untuk mengatur warna awal jika sudah di-scroll
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string): boolean =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  // Kelas untuk link navigasi
  const getLinkClass = (path: string): string =>
    clsx(
      "px-4 py-2 rounded-md transition-colors duration-300",
      {
        // Teks aktif (tanpa underline)
        "font-semibold": isActive(path),

        // Kondisi warna teks
        "text-white": isTransparentHeader && isActive(path), // Transparan, aktif -> Putih
        "text-white/80 hover:text-white hover:scale-105": isTransparentHeader && !isActive(path), // Transparan, tidak aktif -> Putih/80

        "text-blue-700": !isTransparentHeader && isActive(path), // Tidak transparan, aktif -> Biru gelap
        "text-gray-700 hover:text-blue-700 hover:scale-105": !isTransparentHeader && !isActive(path), // Tidak transparan, tidak aktif -> Abu-abu gelap
      }
    );

  // Kelas untuk logo dan teks branding
  const getBrandTextClass = (): string =>
    clsx(
      "flex flex-col",
      {
        "text-white": isTransparentHeader, // Putih saat transparan
        "text-blue-900": !isTransparentHeader, // Biru gelap saat tidak transparan
      }
    );

  // Kelas untuk ikon mobile menu
  const getMenuIconClass = (): string =>
    clsx(
      "h-6 w-6",
      {
        "text-white": isTransparentHeader, // Putih saat transparan
        "text-blue-700": !isTransparentHeader, // Biru gelap saat tidak transparan
      }
    );

  return (
    <header
      className={clsx(
        "fixed z-50 left-0 right-0 w-full px-4 md:px-6 transition-all duration-300 ease-in-out",
        {
          "bg-white shadow-lg": !isTransparentHeader, // Putih solid saat tidak transparan
          "bg-transparent": isTransparentHeader, // Sepenuhnya transparan saat transparan
        }
      )}
    >
      <div className="flex justify-between items-center py-3">
        <Link href="/" className="text-lg flex items-center gap-1 font-bold">
          <img
            src="/images/Logo.png" // Pastikan logo ini terlihat baik di latar belakang transparan dan putih
            alt="PLN Logo"
            className="w-10 h-auto mr-2"
          />
          <div className={getBrandTextClass()}>
            <h3 className="text-lg font-semibold leading-none">UPT</h3>
            <h3 className="text-xl font-bold leading-none">Tanjung Karang</h3>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex">
          {navItems.map(({ label, path }) => (
            <Link key={path} href={path} className={getLinkClass(path)}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
        >
          <svg className={getMenuIconClass()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden -mt-2 bg-white rounded-lg px-4 py-4"> {/* Mobile menu juga putih */}
          <ul className="flex flex-col gap-2">
            {navItems.map(({ label, path }) => (
              <li key={path}>
                <Link
                  href={path}
                  className={clsx(
                    "px-4 py-2 rounded-md transition-colors duration-300",
                    {
                      // Teks aktif (tanpa underline)
                      "font-semibold text-blue-700": isActive(path),
                      "text-gray-700 hover:text-blue-700": !isActive(path),
                    }
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
