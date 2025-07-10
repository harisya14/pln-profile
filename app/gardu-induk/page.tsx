"use client";

import Image from "next/image";
import MainLayout from "@/src/components/layout";
import Link from "next/link";

// Data gardu per kategori ULTG
const groupedGarduInduk = [
  {
    ulgt: "ULTG TARAHAN",
    gardu: [
      { slug: "teluk-betung", title: "Gardu Induk Teluk Betung", address: "Jalan Basuki Rahmat, Teluk Betung Selatan", image: "/images/gardu/teluk.jpg" },
      { slug: "sutami", title: "Gardu Induk Sutami", address: "ULTG Tarahan", image: "/images/gardu/placeholder.jpg" },
      { slug: "tarahan", title: "Gardu Induk Tarahan", address: "ULTG Tarahan", image: "/images/gardu/placeholder.jpg" },
      { slug: "kalianda", title: "Gardu Induk Kalianda", address: "ULTG Tarahan", image: "/images/gardu/placeholder.jpg" },
      { slug: "new-tarahan", title: "Gardu Induk New Tarahan", address: "ULTG Tarahan", image: "/images/gardu/placeholder.jpg" },
      { slug: "sukarame", title: "Gardu Induk Sukarame", address: "ULTG Tarahan", image: "/images/gardu/placeholder.jpg" },
      { slug: "sebalang", title: "Gardu Induk Sebalang", address: "ULTG Tarahan", image: "/images/gardu/placeholder.jpg" },
      { slug: "sidomulyo", title: "Gardu Induk Sidomulyo", address: "ULTG Tarahan", image: "/images/gardu/placeholder.jpg" },
      { slug: "jati-agung", title: "Gardu Induk Jati Agung", address: "ULTG Tarahan", image: "/images/gardu/placeholder.jpg" },
      { slug: "ketapang", title: "Gardu Induk Ketapang", address: "ULTG Tarahan", image: "/images/gardu/placeholder.jpg" },
    ],
  },
  {
    ulgt: "ULTG TEGINENENG",
    gardu: [
      { slug: "natar", title: "Gardu Induk Natar", address: "Jalan Raya Natar, Natar, Lampung Selatan", image: "/images/gardu/natar.jpg" },
      { slug: "adijaya", title: "Gardu Induk Adijaya", address: "ULTG Tegineneng", image: "/images/gardu/placeholder.jpg" },
      { slug: "tegineneng", title: "Gardu Induk Tegineneng", address: "ULTG Tegineneng", image: "/images/gardu/placeholder.jpg" },
      { slug: "sribawono", title: "Gardu Induk Sribawono", address: "ULTG Tegineneng", image: "/images/gardu/placeholder.jpg" },
      { slug: "metro", title: "Gardu Induk Metro", address: "ULTG Tegineneng", image: "/images/gardu/placeholder.jpg" },
      { slug: "seputih-banyak", title: "Gardu Induk Seputih Banyak", address: "ULTG Tegineneng", image: "/images/gardu/placeholder.jpg" },
      { slug: "dente-taladas", title: "Gardu Induk Dente Taladas", address: "ULTG Tegineneng", image: "/images/gardu/placeholder.jpg" },
      { slug: "dipasena", title: "Gardu Induk Dipasena", address: "ULTG Tegineneng", image: "/images/gardu/placeholder.jpg" },
      { slug: "langkapura", title: "Gardu Induk Langkapura", address: "Jl. Wan Abdurrahman No.Road, Sumber Agung, Kec. Kemiling", image: "/images/gardu/l.jpg" },
      { slug: "gitet-lampung-1", title: "GITET Lampung 1", address: "ULTG Tegineneng", image: "/images/gardu/placeholder.jpg" },
    ],
  },
  {
    ulgt: "ULTG PAGELARAN",
    gardu: [
      { slug: "pagelaran", title: "Gardu Induk Pagelaran", address: "ULTG Pagelaran", image: "/images/gardu/placeholder.jpg" },
      { slug: "batutegi", title: "Switchyard Batutegi", address: "ULTG Pagelaran", image: "/images/gardu/placeholder.jpg" },
      { slug: "semangka", title: "Switchyard Semangka", address: "ULTG Pagelaran", image: "/images/gardu/placeholder.jpg" },
      { slug: "ulubelu", title: "Gardu Induk Ulubelu", address: "ULTG Pagelaran", image: "/images/gardu/placeholder.jpg" },
      { slug: "kota-agung", title: "Gardu Induk Kota Agung", address: "ULTG Pagelaran", image: "/images/gardu/placeholder.jpg" },
      { slug: "gedong-tataan", title: "Gardu Induk Gedong Tataan", address: "ULTG Pagelaran", image: "/images/gardu/placeholder.jpg" },
    ],
  },
  {
    ulgt: "ULTG KOTABUMI",
    gardu: [
      { slug: "kotabumi", title: "Gardu Induk Kotabumi", address: "ULTG Kotabumi", image: "/images/gardu/placeholder.jpg" },
      { slug: "menggala", title: "Gardu Induk Menggala", address: "ULTG Kotabumi", image: "/images/gardu/placeholder.jpg" },
      { slug: "gumawang", title: "Gardu Induk Gumawang", address: "ULTG Kotabumi", image: "/images/gardu/placeholder.jpg" },
      { slug: "gitet-gumawang", title: "GITET Gumawang", address: "ULTG Kotabumi", image: "/images/gardu/placeholder.jpg" },
      { slug: "bukit-kemuning", title: "Gardu Induk Bukit Kemuning", address: "ULTG Kotabumi", image: "/images/gardu/placeholder.jpg" },
      { slug: "besai", title: "Switchyard Besai", address: "ULTG Kotabumi", image: "/images/gardu/placeholder.jpg" },
      { slug: "liwa", title: "Gardu Induk Liwa", address: "ULTG Kotabumi", image: "/images/gardu/placeholder.jpg" },
      { slug: "mesuji", title: "Gardu Induk Mesuji", address: "ULTG Kotabumi", image: "/images/gardu/placeholder.jpg" },
      { slug: "pakuan-ratu", title: "Gardu Induk Pakuan Ratu", address: "ULTG Kotabumi", image: "/images/gardu/placeholder.jpg" },
      { slug: "mini-traya", title: "Gardu Induk Mini Traya", address: "ULTG Kotabumi", image: "/images/gardu/placeholder.jpg" },
    ],
  },
];

export default function GarduIndukPage() {
  return (
    <MainLayout>
      <section className="px-4 md:px-8 py-20 bg-gray-50 min-h-screen">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800">Gardu Induk</h1>
        </div>

        {groupedGarduInduk.map((group) => (
          <div key={group.ulgt} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2">{group.ulgt}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.gardu.map((gardu) => (
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
          </div>
        ))}
      </section>
    </MainLayout>
  );
}