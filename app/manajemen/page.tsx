"use client";

import MainLayout from "@/src/components/layout";

const strukturManajemen = [
  {
    title: "Manager UPT Tanjung Karang",
    anchor: "manager",
    assistant: null,
    containers: [[{ name: "Fathurrahman", jabatan: null }]],
  },
  {
    title: "Senior Officer",
    anchor: "senior-officer",
    assistant: null,
    containers: [
      [
        { name: "Ade Sri Redjeki", jabatan: "Senior Officer" },
        { name: "Dani Putut Marfianto", jabatan: "Senior Officer" },
        { name: "Adi Yuliadi", jabatan: "Senior Officer" }
      ],
      [
        { name: "Selamad Riyadi", jabatan: "Senior Officer" },
        { name: "Eva Oktaviani", jabatan: "Senior Officer" }
      ],
      [
        { name: "Ilmi Retna Palupi", jabatan: "Senior Officer" },
        { name: "Heru", jabatan: "Senior Officer" }
      ]
    ]
  },
  {
    title: "Divisi Keuangan dan Umum",
    anchor: "keuangan-dan-umum",
    assistant: { name: "Erwinsyah Putra", jabatan: "Asisten Manager Keuangan dan Umum" },
    containers: [
      [
        { name: "Aprina Zulkarnia Natasha Putri", jabatan: "Team Leader Administrasi dan Umum" },
        { name: "Ardiyan Prasetyo", jabatan: "Officer Administrasi dan Umum" },
        { name: "Amelia Lestari", jabatan: "Officer Administrasi dan Umum" }
      ],
      [
        { name: "Ridho Yuda Pratama", jabatan: "Team Leader Keuangan dan Akuntansi" },
        { name: "Kartika Nuraisyah", jabatan: "Officer Keuangan dan Akuntansi" }
      ]
    ]
  },
  {
    title: "Divisi Rencana dan Evaluasi",
    anchor: "rencana-dan-evaluasi",
    assistant: { name: "Toni Sudaryanto", jabatan: "Asisten Manager Rencana dan Evaluasi" },
    containers: [
      [
        { name: "Rahmad Budiyanto", jabatan: "Officer Kinerja" },
        { name: "Putri Widya Apsari", jabatan: "Officer Kinerja" },
        { name: "Ines Triwanda Ganessy Purba", jabatan: "Officer Kinerja" }
      ],
      [
        { name: "Putri Nurul Wijayanti", jabatan: "Team Leader Enjinering" },
        { name: "Febriana Christina", jabatan: "Officer Enjinering Gardu Induk" }
      ],
      [
        { name: "Andry Asmara", jabatan: "Team Leader Asdig" },
        { name: "Dwi Riska Sari", jabatan: "Officer Peng Data" },
        { name: "Annisa Almira", jabatan: "Officer Peng Data" },
        { name: "Mia Olivia", jabatan: "Officer Peng Data" }
      ]
    ]
  },
  {
    title: "Divisi Konstruksi dan Penyaluran",
    anchor: "konstruksi-dan-penyaluran",
    assistant: { name: "Edison Batavia Segala", jabatan: "Asisten Manager Konstruksi dan Penyaluran" },
    containers: [
      [
        { name: "Yovadli Yazid", jabatan: "Officer Kinerja" },
        { name: "M. Yuhyi Ari", jabatan: "Officer Kinerja" },
        { name: "Jafar Wahyudi", jabatan: "Officer Kinerja" }
      ],
      [
        { name: "Awalludin", jabatan: "Team Leader Dalhar" },
        { name: "Verika Tamara", jabatan: "Officer Dalhar" }
      ],
      [
        { name: "Zakiyah Pratiwi", jabatan: "Team Leader Dalkon" },
        { name: "Bobby Kurnia", jabatan: "Officer Dalkon" }
      ],
      [
        { name: "Hari Prasetiawan", jabatan: "Team Leader Logistik" }
      ]
    ]
  },
  {
    title: "Divisi Pelayanan Dalam Keadaan Bertegangan",
    anchor: "pdkb",
    assistant: { name: "Yodi Agista Diwanda", jabatan: "Asisten Manager PDKB" },
    containers: [
      [
        { name: "Puguh Tantowi", jabatan: "Team Leader PDKB RING" },
        { name: "Rian Pratama", jabatan: "Technician PDKB Ring" },
        { name: "Fadil M. Ayub", jabatan: "Technician PDKB Ring" },
        { name: "Apriatna Widi Prabowo", jabatan: "Technician PDKB Ring" },
        { name: "M. Teni Kristianto", jabatan: "Technician PDKB Ring" },
        { name: "M. Choirullah", jabatan: "Technician PDKB Ring" },
        { name: "Hardiansyah", jabatan: "Technician PDKB Ring" },
        { name: "Akhmad Iqram", jabatan: "Technician PDKB Ring" }
      ],
      [
        { name: "Fredy Indra Kumala", jabatan: "Team Leader PDKB GI/GITET" },
        { name: "Yudo Prasetyo", jabatan: "Technician PDKB GI/GITET" },
        { name: "Ali Imron", jabatan: "Technician PDKB GI/GITET" },
        { name: "Muhammad Yani", jabatan: "Technician PDKB GI/GITET" },
        { name: "Wahyu Setiawan", jabatan: "Technician PDKB GI/GITET" }
      ]
    ]
  },
  {
    title: "Divisi Pelaksana Pengendalian",
    anchor: "pelaksana-pengendalian",
    assistant: null,
    containers: [
      [
        { name: "Siti Malahayati Sari", jabatan: "Team Leader Pelaksana Pengendalian" },
        { name: "Rizky Martadinata", jabatan: "Officer Pelaksana Pengendalian" }
      ]
    ]
  },
  {
    title: "Divisi Lingkungan",
    anchor: "lingkungan",
    assistant: null,
    containers: [
      [
        { name: "Akhmad Ridoan Nasution", jabatan: "Team Leader Lingkungan" },
        { name: "Aulia Dwi Putri Maharani", jabatan: "Officer Lingkungan" }
      ]
    ]
  },
  {
    title: "Divisi K3 dan Keamanan",
    anchor: "k3-dan-keamanan",
    assistant: null,
    containers: [
      [
        { name: "M. Aminullah Kurniawan", jabatan: "Team Leader K3 dan Kam" },
        { name: "", jabatan: "Officer K3 dan Kam" }
      ]
    ]
  }
];

export default function ManajemenPage() {
  return (
    <MainLayout>
      <section className="px-4 md:px-8 py-20 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Judul Halaman */}
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-16">
            Struktur Manajemen
          </h2>

          {/* Loop Setiap Divisi */}
          <div className="space-y-24">
            {strukturManajemen.map((divisi, index) => (
              <div key={index} id={divisi.anchor} className="scroll-mt-28">
                {/* Judul Divisi */}
                <h3 className="text-2xl font-semibold text-center text-blue-700 mb-10 uppercase tracking-wide">
                  {divisi.title}
                </h3>

                {/* Asisten Manager */}
                {divisi.assistant && (
                  <div className="flex justify-center mb-8">
                    <div className="rounded-xl px-6 py-4 w-full max-w-xs bg-white shadow-md ring-1 ring-gray-200 hover:shadow-lg transition duration-300">
                      <p className="font-semibold text-gray-900 text-center">
                        {divisi.assistant.name}
                      </p>
                      <p className="text-sm text-gray-600 text-center">
                        {divisi.assistant.jabatan}
                      </p>
                    </div>
                  </div>
                )}

                {/* Daftar Anggota */}
                <div className="flex flex-wrap justify-center gap-6">
                  {divisi.containers.map((group, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-6 w-full sm:w-auto">
                      {group.map((person, personIndex) => (
                        <div
                          key={personIndex}
                          className="rounded-xl px-6 py-4 w-full sm:w-64 bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition duration-300"
                        >
                          <p className="font-semibold text-gray-900 text-center">
                            {person.name || "-"}
                          </p>
                          {person.jabatan && (
                            <p className="text-sm text-gray-600 text-center">
                              {person.jabatan}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}