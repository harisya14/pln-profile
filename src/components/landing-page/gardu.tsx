"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const garduIndukList = [
  {
    slug: "teluk-betung",
    title: "Gardu Induk Teluk Betung",
    address: "Jalan Basuki Rahmat, Teluk Betung Selatan",
    image: "/images/gardu/teluk.jpg",
  },
  {
    slug: "natar",
    title: "Gardu Induk Natar",
    address: "Jalan Raya Natar, Natar, Lampung Selatan",
    image: "/images/gardu/natar.jpg",
  },
  {
    slug: "langkapura",
    title: "Gardu Induk Langkapura",
    address: "Jl. Wan Abdurrahman No.Road, Sumber Agung, Kec. Kemiling",
    image: "/images/gardu/l.jpg",
  },
];

export default function GarduSection() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const [titleInView, setTitleInView] = useState(false);
  const [cardsInView, setCardsInView] = useState(false);

  useEffect(() => {
    const titleObserver = new IntersectionObserver(
      ([entry]) => setTitleInView(entry.isIntersecting),
      { threshold: 0.7 }
    );
    const cardsObserver = new IntersectionObserver(
      ([entry]) => setCardsInView(entry.isIntersecting),
      { threshold: 0.4 }
    );

    if (titleRef.current) titleObserver.observe(titleRef.current);
    if (cardsRef.current) cardsObserver.observe(cardsRef.current);

    return () => {
      if (titleRef.current) titleObserver.unobserve(titleRef.current);
      if (cardsRef.current) cardsObserver.unobserve(cardsRef.current);
    };
  }, []);

  return (
    <section className="bg-primary px-6 py-16 lg:px-10 lg:py-20 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Judul */}
        <h2
          ref={titleRef}
          className={`mb-10 text-3xl lg:text-4xl font-extrabold text-center transition-all duration-700 transform ${
            titleInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-90"
          }`}
        >
          Gardu Induk
        </h2>

        {/* Grid Card */}
        <div
          ref={cardsRef}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {garduIndukList.map((gardu, index) => (
            <div
              key={gardu.slug}
              className={`bg-white text-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all transform duration-700 ${
                cardsInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="h-60 w-full relative">
                <Image
                  src={gardu.image}
                  alt={gardu.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{gardu.title}</h3>
                <p className="text-sm text-blue-600 mt-1">{gardu.address}</p>
                <Link
                  href={`/gardu-induk/${gardu.slug}`}
                  className="inline-block mt-4 px-4 py-2 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-600 hover:text-white transition"
                >
                  More Detail
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Lihat Semua */}
        <div className="mt-8 text-center">
          <Link
            href="/gardu-induk"
            className="inline-block px-6 py-2 text-sm sm:text-base text-white font-medium border border-white hover:bg-white hover:text-primary rounded-lg transition-colors duration-300"
          >
            Lihat Semua Gardu
          </Link>
        </div>
      </div>
    </section>
  );
}
