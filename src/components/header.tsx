"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string): boolean =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const getLinkClass = (path: string): string =>
    `px-4 py-2 rounded-md transition-colors duration-300 ${
      isActive(path)
        ? "text-primary font-semibold underline"
        : "text-primary/80 hover:text-blue-700 hover:scale-105"
    }`;

  return (
    <header
      className={`fixed z-50 left-0 right-0 w-full px-4 md:px-6 transition-all duration-300 ease-in-out ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center py-3">
        <Link href="/" className="text-lg flex items-center gap-1 font-bold text-primary">
          <img
            src="/images/Logo.png"
            alt="PLN Logo"
            className="w-10 h-auto mr-2"
          />
          <div className="flex flex-col">
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
          <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <nav className="md:hidden -mt-2 bg-white rounded-lg px-4 py-4">
          <ul className="flex flex-col gap-2">
            {navItems.map(({ label, path }) => (
              <li key={path}>
                <Link
                  href={path}
                  className={getLinkClass(path)}
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
