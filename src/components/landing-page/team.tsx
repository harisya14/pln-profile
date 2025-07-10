"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  Building2,
  LineChart,
  Plug,
  Zap,
  Hammer,
  Leaf,
  ShieldCheck,
  User2,
} from "lucide-react"; // Lucide icons

const divisions = [
  { title: "Senior Officer", icon: Briefcase },
  { title: "Keuangan dan Umum", icon: Building2 },
  { title: "Rencana dan Evaluasi", icon: LineChart },
  { title: "Konstruksi dan Penyaluran", icon: Plug },
  { title: "PDKB", icon: Zap },
  { title: "Pelaksana Pengendalian", icon: Hammer },
  { title: "Lingkungan", icon: Leaf },
  { title: "K3 dan Keamanan", icon: ShieldCheck },
];

const DivisionSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 }
    );
    const current = sectionRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <section
      className="bg-gray-50 py-20 px-6 md:px-8 transition-all"
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Title */}
        <h2
          className={`text-3xl md:text-4xl font-bold text-blue-800 mb-12 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Meet Our Team
        </h2>

        {/* Manager Card */}
        <div className="mb-16">
          <a
            href="/manajemen#manager"
            className="inline-block bg-white shadow-md hover:shadow-lg rounded-xl px-8 py-8 text-center transition-transform hover:scale-105 duration-500"
          >
            <User2 className="mx-auto mb-3 text-blue-600" size={40} />
            <h3 className="text-xl font-semibold text-blue-800">
              Fathurrahman
            </h3>
            <p className="text-gray-600 text-sm">Manager UPT Tanjung Karang</p>
          </a>
        </div>

        {/* Divisions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {divisions.map((division, index) => {
            const Icon = division.icon;
            return (
              <a
                key={index}
                href={`/manajemen#${division.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className={`bg-white shadow-md hover:shadow-lg rounded-xl p-6 text-center transition-transform transform hover:scale-105 duration-500 ${
                  inView ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Icon className="mx-auto mb-3 text-blue-600" size={32} />
                <h3 className="text-lg font-semibold text-blue-800">
                  {division.title}
                </h3>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DivisionSection;
