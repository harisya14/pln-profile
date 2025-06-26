"use client";

import Image from "next/image";
import MainLayout from "@/src/components/layout";

const manajemenList = [
  {
    title: "Manager UPT",
    name: "Ir. Budi Santoso, M.T",
    image: "/images/manajemen/manager.jpg",
  },
  {
    title: "Deputi Operasi",
    name: "Andi Prasetya, S.T",
    image: "/images/manajemen/andi.jpg",
  },
  {
    title: "Deputi Administrasi",
    name: "Dewi Lestari, S.E",
    image: "/images/manajemen/dewi.jpg",
  },
  {
    title: "Supervisor Teknik",
    name: "Rudi Hartono",
    image: "/images/manajemen/rudi.jpg",
  },
  {
    title: "Manager UPT",
    name: "Ir. Budi Santoso, M.T",
    image: "/images/manajemen/manager.jpg",
  },
  {
    title: "Deputi Operasi",
    name: "Andi Prasetya, S.T",
    image: "/images/manajemen/andi.jpg",
  },
  {
    title: "Deputi Administrasi",
    name: "Dewi Lestari, S.E",
    image: "/images/manajemen/dewi.jpg",
  },
  {
    title: "Supervisor Teknik",
    name: "Rudi Hartono",
    image: "/images/manajemen/rudi.jpg",
  },
  {
    title: "Manager UPT",
    name: "Ir. Budi Santoso, M.T",
    image: "/images/manajemen/manager.jpg",
  },
  {
    title: "Deputi Operasi",
    name: "Andi Prasetya, S.T",
    image: "/images/manajemen/andi.jpg",
  },
  {
    title: "Deputi Administrasi",
    name: "Dewi Lestari, S.E",
    image: "/images/manajemen/dewi.jpg",
  },
];

export default function ManajemenPage() {
  return (
    <MainLayout>
      <section className="px-4 md:px-8 py-20 bg-white min-h-screen">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">Jajaran Manajemen</h2>
          <p className="text-gray-600 text-lg mb-12">
            Jelajahi profil lengkap para pemimpin unggulan kami dalam menghadirkan energi untuk negeri.
          </p>

          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 items-start">
            {manajemenList.map((person, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4 shadow-lg">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{person.name}</h3>
                <p className="text-sm text-gray-500">{person.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
