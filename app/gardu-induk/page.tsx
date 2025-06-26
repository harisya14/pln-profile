"use client";

import Image from "next/image";
import MainLayout from "@/src/components/layout";
import Link from "next/link";

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

export default function GarduIndukPage() {
  return (
    <MainLayout>
      <section className="px-4 md:px-8 py-20 bg-gray-50 min-h-screen">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800">Gardu Induk</h1>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {garduIndukList.map((gardu) => (
            <div
              key={gardu.slug}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
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
      </section>
    </MainLayout>
  );
}
