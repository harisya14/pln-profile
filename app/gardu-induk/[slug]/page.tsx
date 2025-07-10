import { notFound } from "next/navigation";
import Image from "next/image";
import MainLayout from "@/src/components/layout";

// Gabungan semua gardu dari seluruh ULTG
const garduIndukList = [
  // Teluk Betung, Natar, Langkapura (yang sudah lengkap datanya)
  {
    slug: "teluk-betung",
    title: "Gardu Induk Teluk Betung",
    address: "Jalan Basuki Rahmat, Teluk Betung Selatan",
    image: "/images/gardu/teluk.jpg",
    description:
      "Gardu Induk Teluk Betung melayani wilayah selatan Kota Bandar Lampung dan sekitarnya. Gardu ini merupakan titik penting dalam sistem transmisi kelistrikan wilayah pesisir.",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15933.13514396129!2d105.2783423!3d-5.4570811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40c2c773fae7bb%3A0xa0d84be755720d3!2sTeluk%20Betung%20Selatan%2C%20Bandar%20Lampung!5e0!3m2!1sid!2sid!4v1719406600000",
  },
  {
    slug: "natar",
    title: "Gardu Induk Natar",
    address: "Jalan Raya Natar, Natar, Lampung Selatan",
    image: "/images/gardu/natar.jpg",
    description:
      "Terletak di jalur utama penghubung Lampung Selatan, Gardu Induk Natar memegang peranan vital dalam mendistribusikan listrik ke kawasan industri dan pemukiman.",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.626711832534!2d105.25560701441766!3d-5.289617896162274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40c38fcfb021a5%3A0xd679a7ebc607b9de!2sNatar%2C%20Lampung%20Selatan!5e0!3m2!1sid!2sid!4v1719406720000",
  },
  {
    slug: "langkapura",
    title: "Gardu Induk Langkapura",
    address: "Jl. Wan Abdurrahman No.Road, Sumber Agung, Kec. Kemiling",
    image: "/images/gardu/l.jpg",
    description:
      "Gardu Induk Langkapura berfungsi sebagai penghubung utama untuk wilayah barat Kota Bandar Lampung, serta mendukung kestabilan suplai listrik daerah perbukitan.",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.4710614490784!2d105.23310261441823!3d-5.3170163961453965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40db12b99d30a9%3A0x42965b2b8b98b8b1!2sSumber%20Agung%2C%20Kemiling%2C%20Bandar%20Lampung%20City!5e0!3m2!1sid!2sid!4v1719406790000",
  },

  // GI lainnya dari ULTG TEGINENENG, TARAHAN, KOTABUMI, dll (tanpa detail)
  ...[
    "sutami", "tarahan", "kalianda", "new-tarahan", "sukarame", "sebalang",
    "sidomulyo", "jati-agung", "ketapang", "adijaya", "tegineneng", "sribawono",
    "metro", "seputih-banyak", "dente-taladas", "dipasena", "gitet-lampung-1",
    "pagelaran", "batutegi", "semangka", "ulubelu", "kota-agung", "gedong-tataan",
    "kotabumi", "menggala", "gumawang", "gitet-gumawang", "bukit-kemuning",
    "besai", "liwa", "mesuji", "pakuan-ratu", "mini-traya",
  ].map((slug) => ({
    slug,
    title: `Gardu Induk ${slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}`,
    address: "-",
    image: "/images/gardu/placeholder.jpg",
    description: "Informasi deskripsi belum tersedia untuk gardu ini.",
    mapEmbedUrl: "https://maps.google.com",
  })),
];

export default function GarduIndukDetail({ params }: { params: { slug: string } }) {
  const gardu = garduIndukList.find((g) => g.slug === params.slug);

  if (!gardu) {
    return notFound();
  }

  return (
    <MainLayout>
      <section className="px-4 md:px-8 py-20 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">
            {gardu.title}
          </h1>

          <div className="relative w-full h-80 md:h-[400px] mb-6 rounded overflow-hidden shadow">
            <Image
              src={gardu.image}
              alt={gardu.title}
              fill
              className="object-cover"
            />
          </div>

          <p className="text-lg text-gray-700 mb-2">
            <strong>Alamat:</strong> {gardu.address}
          </p>

          <p className="text-base text-gray-600 mt-4">{gardu.description}</p>

          <div className="mt-10">
            <h2 className="text-3xl font-semibold text-blue-800 mb-6">Temukan Kami</h2>
            <div className="aspect-video w-full rounded shadow overflow-hidden">
              <iframe
                src={gardu.mapEmbedUrl}
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                className="border-0 w-full h-full"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}