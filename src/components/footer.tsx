"use client"

import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  Instagram,
  Linkedin,
  Github,
} from "lucide-react";
import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white pt-12 px-6 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-12 pb-12 border-b border-white/20">
        {/* Brand Info */}
        <div className="flex-1">
          <div className="flex items-center mb-4">
            <img
              src="/images/Logo.png"
              alt="PLN Logo"
              className="w-10 h-auto mr-2"
            />
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold">UPT</h3>
              <h3 className="text-xl font-bold">Tanjung Karang</h3>
            </div>
          </div>
          <p className="text-sm text-white/80 max-w-xs">
            Energi Untuk Kehidupan. Memberikan layanan listrik terbaik untuk wilayah Lampung.
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex-1">
          <h4 className="text-md font-semibold mb-4 text-white/90">Kontak Kami</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2">
              <Mail className="w-4 h-4 mt-0.5 shrink-0" />
              info@plnupttkr.co.id
            </li>
            <li className="flex items-start gap-2">
              <Phone className="w-4 h-4 mt-0.5 shrink-0" />
              (0721) 486288
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              Jl. Basuki Rahmat No.19, Gedong Pakuon, Telukbetung Selatan, Bandar Lampung
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="flex-1">
          <h4 className="text-md font-semibold mb-4 text-white/90">Link Cepat</h4>
          <div className="flex space-x-4 text-white/80 text-lg">
            <Link href="https://github.com/caseinn" target="_blank" aria-label="GitHub">
              <Github className="w-5 h-5 hover:text-white transition-colors duration-200" />
            </Link>
            <Link href="https://instagram.com/ditorifkii" target="_blank" aria-label="Instagram">
              <Instagram className="w-5 h-5 hover:text-white transition-colors duration-200" />
            </Link>
            <Link href="https://linkedin.com/in/ditorifkiirawan" target="_blank" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5 hover:text-white transition-colors duration-200" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 py-6 text-center text-sm text-white/60">
        © {currentYear} PLN UPT Tanjung Karang. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
