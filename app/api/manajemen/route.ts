import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Tipe data untuk Person (digunakan dalam containers)
interface PersonData {
  name: string;
  jabatan: string;
  imageUrl?: string | null; // Base64 string atau URL gambar
}

// Tipe data untuk bagian Manajemen (sesuai input frontend)
interface ManajemenSectionInput {
  title: string;
  anchor: string;
  orderIndex: number;
  assistant?: {
    name: string;
    jabatan: string;
    image?: string | null; // Base64 string atau URL gambar
  } | null;
  containers: PersonData[][]; // Array of arrays of PersonData
}

// Helper untuk merekonstruksi struktur 'containers' dari data Prisma
function reconstructManajemenSection(section: any): ManajemenSectionInput {
    const containers: PersonData[][] = [];
    section.persons.forEach((person: any) => { // Menggunakan 'any' untuk model Prisma Person
        if (person.containerGroup !== null && person.personIndexInGroup !== null) {
            if (!containers[person.containerGroup]) {
                containers[person.containerGroup] = [];
            }
            containers[person.containerGroup][person.personIndexInGroup] = {
                name: person.name,
                jabatan: person.jabatan,
                imageUrl: person.imageUrl,
            };
        }
    });
    // Filter grup kosong dan person null/undefined di dalam grup
    const cleanedContainers = containers.map(group => group ? group.filter(p => p !== null) : []).filter(group => group.length > 0);

    return {
        title: section.title,
        anchor: section.anchor,
        orderIndex: section.orderIndex,
        assistant: section.assistantName ? {
            name: section.assistantName,
            jabatan: section.assistantJabatan || '',
            image: section.assistantImage,
        } : null,
        containers: cleanedContainers,
    };
}

/**
 * @method GET
 * @description Mengambil seluruh struktur manajemen atau satu bagian berdasarkan anchor.
 * @param req NextRequest
 * @returns NextResponse
 * @example
 * GET /api/manajemen
 * GET /api/manajemen?anchor=manager-upt
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const anchor = searchParams.get("anchor"); // Memeriksa parameter anchor

  try {
    if (anchor) {
      // Jika anchor ada, ambil satu bagian manajemen
      const section = await prisma.manajemenSection.findUnique({
        where: { anchor },
        include: {
          persons: {
            orderBy: [
              { containerGroup: 'asc' },
              { personIndexInGroup: 'asc' },
            ],
          },
        },
      });

      if (!section) {
        return NextResponse.json({ error: `Manajemen section with anchor '${anchor}' not found.` }, { status: 404 });
      }

      // Rekonstruksi data ke format yang diharapkan frontend
      const reconstructedSection = reconstructManajemenSection(section);
      return NextResponse.json(reconstructedSection);

    } else {
      // Jika anchor tidak ada, ambil semua bagian manajemen (logika yang sudah ada)
      const manajemenSections = await prisma.manajemenSection.findMany({
        include: {
          persons: {
            orderBy: [
              { containerGroup: 'asc' },
              { personIndexInGroup: 'asc' },
            ],
          },
        },
        orderBy: {
          orderIndex: 'asc',
        },
      });

      // Rekonstruksi semua data ke format yang diharapkan frontend
      const reconstructedData = manajemenSections.map(section => reconstructManajemenSection(section));
      return NextResponse.json(reconstructedData);
    }
  } catch (error) {
    console.error("Error fetching manajemen structure:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch manajemen structure",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// --- Metode POST, PUT, DELETE tetap sama seperti sebelumnya ---
/**
 * @method POST
 * @description Menambahkan bagian struktur manajemen baru beserta orang-orangnya.
 * @param req NextRequest
 * @returns NextResponse
 * @example
 * POST /api/manajemen
 * Body: {
 * "title": "Manager UPT Tanjung Karang",
 * "anchor": "manager",
 * "orderIndex": 0,
 * "assistant": { "name": "Fathurrahman", "jabatan": "Manager UPT", "image": "base64image" },
 * "containers": [
 * [{"name": "Ade Sri Redjeki", "jabatan": "Senior Officer", "imageUrl": "base64image"}]
 * ]
 * }
 */
export async function POST(req: NextRequest) {
  const body: ManajemenSectionInput = await req.json();
  const { title, anchor, orderIndex, assistant, containers } = body;

  if (!title || !anchor || containers === undefined) {
    return NextResponse.json(
      { error: "Title, anchor, and containers are required." },
      { status: 400 }
    );
  }

  try {
    const existingSection = await prisma.manajemenSection.findUnique({ where: { anchor } });
    if (existingSection) {
      return NextResponse.json(
        { error: `Section with anchor '${anchor}' already exists.` },
        { status: 409 }
      );
    }

    let assistantImageUrl: string | null | undefined;
    if (assistant && assistant.image) {
      if (assistant.image.startsWith('data:image/')) {
        const uploadRes = await cloudinary.uploader.upload(assistant.image, {
          folder: "manajemen/assistants",
          public_id: `${anchor}-assistant`,
        });
        assistantImageUrl = uploadRes.secure_url;
      } else {
        assistantImageUrl = assistant.image;
      }
    } else if (assistant && assistant.image === null) {
        assistantImageUrl = null;
    }


    const personsToCreate = [];
    for (let i = 0; i < containers.length; i++) {
      for (let j = 0; j < containers[i].length; j++) {
        const person = containers[i][j];
        let personImageUrl: string | null | undefined;

        if (person.imageUrl) {
            if (person.imageUrl.startsWith('data:image/')) {
                const uploadRes = await cloudinary.uploader.upload(person.imageUrl, {
                    folder: `manajemen/${anchor}/group-${i}`,
                    public_id: `${person.name.toLowerCase().replace(/\s+/g, '-')}`,
                });
                personImageUrl = uploadRes.secure_url;
            } else {
                personImageUrl = person.imageUrl;
            }
        } else if (person.imageUrl === null) {
            personImageUrl = null;
        }


        personsToCreate.push({
          name: person.name,
          jabatan: person.jabatan,
          imageUrl: personImageUrl,
          containerGroup: i,
          personIndexInGroup: j,
        });
      }
    }

    const newSection = await prisma.manajemenSection.create({
      data: {
        title,
        anchor,
        orderIndex,
        assistantName: assistant?.name,
        assistantJabatan: assistant?.jabatan,
        assistantImage: assistantImageUrl,
        persons: {
          create: personsToCreate,
        },
      },
      include: {
        persons: true,
      },
    });

    const reconstructedNewSection: any = {
      id: newSection.id, // ID ini tidak ada di ManajemenSectionInput, tapi OK untuk respons API
      title: newSection.title,
      anchor: newSection.anchor,
      orderIndex: newSection.orderIndex,
      assistant: newSection.assistantName ? {
        name: newSection.assistantName,
        jabatan: newSection.assistantJabatan || '',
        image: newSection.assistantImage,
      } : null,
      containers: [], // Akan diisi di bawah
    };

    const newContainers: PersonData[][] = [];
    newSection.persons.forEach(person => {
      if (person.containerGroup !== null && person.personIndexInGroup !== null) {
        if (!newContainers[person.containerGroup]) {
          newContainers[person.containerGroup] = [];
        }
        newContainers[person.containerGroup][person.personIndexInGroup] = {
          name: person.name,
          jabatan: person.jabatan,
          imageUrl: person.imageUrl,
        };
      }
    });
    reconstructedNewSection.containers = newContainers.map(group => group.filter(p => p !== null));


    return NextResponse.json(reconstructedNewSection, { status: 201 });
  } catch (error) {
    console.error("Error adding manajemen section:", error);
    return NextResponse.json(
      {
        error: "Failed to add manajemen section",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @description Memperbarui bagian struktur manajemen yang sudah ada.
 * @param req NextRequest
 * @returns NextResponse
 * @example
 * PUT /api/manajemen?anchor=manager
 * Body: {
 * "title": "Manager UPT Tanjung Karang Updated",
 * "orderIndex": 0,
 * "assistant": { "name": "Fathurrahman Baru", "jabatan": "Manager UPT", "image": "base64image" },
 * "containers": [
 * [{"name": "Ade Sri Redjeki Updated", "jabatan": "Senior Officer", "imageUrl": "base64image"}]
 * ]
 * }
 */
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const anchor = searchParams.get("anchor");
  const body: ManajemenSectionInput = await req.json();
  const { title, orderIndex, assistant, containers } = body;

  if (!anchor) {
    return NextResponse.json({ error: "Anchor parameter is required for update." }, { status: 400 });
  }

  try {
    const existingSection = await prisma.manajemenSection.findUnique({
      where: { anchor },
      include: { persons: true },
    });

    if (!existingSection) {
      return NextResponse.json({ error: `Section with anchor '${anchor}' not found.` }, { status: 404 });
    }

    let assistantImageUrl: string | null | undefined = existingSection.assistantImage;
    if (assistant && assistant.image) {
      if (assistant.image.startsWith('data:image/')) {
        const uploadRes = await cloudinary.uploader.upload(assistant.image, {
          folder: "manajemen/assistants",
          public_id: `${anchor}-assistant`,
        });
        assistantImageUrl = uploadRes.secure_url;
      } else {
        assistantImageUrl = assistant.image;
      }
    } else if (assistant && assistant.image === null) {
        assistantImageUrl = null;
    }


    await prisma.person.deleteMany({
      where: { sectionId: existingSection.id },
    });

    const personsToCreate = [];
    for (let i = 0; i < containers.length; i++) {
      for (let j = 0; j < containers[i].length; j++) {
        const person = containers[i][j];
        let personImageUrl: string | null | undefined;

        if (person.imageUrl) {
            if (person.imageUrl.startsWith('data:image/')) {
                const uploadRes = await cloudinary.uploader.upload(person.imageUrl, {
                    folder: `manajemen/${anchor}/group-${i}`,
                    public_id: `${person.name.toLowerCase().replace(/\s+/g, '-')}`,
                });
                personImageUrl = uploadRes.secure_url;
            } else {
                personImageUrl = person.imageUrl;
            }
        } else if (person.imageUrl === null) {
            personImageUrl = null;
        }


        personsToCreate.push({
          name: person.name,
          jabatan: person.jabatan,
          imageUrl: personImageUrl,
          containerGroup: i,
          personIndexInGroup: j,
        });
      }
    }

    const updatedSection = await prisma.manajemenSection.update({
      where: { anchor },
      data: {
        title: title || existingSection.title,
        orderIndex: orderIndex !== undefined ? orderIndex : existingSection.orderIndex,
        assistantName: assistant?.name,
        assistantJabatan: assistant?.jabatan,
        assistantImage: assistantImageUrl,
        persons: {
          create: personsToCreate,
        },
      },
      include: {
        persons: true,
      },
    });

    const reconstructedUpdatedSection: any = {
      id: updatedSection.id, // ID ini tidak ada di ManajemenSectionInput, tapi OK untuk respons API
      title: updatedSection.title,
      anchor: updatedSection.anchor,
      orderIndex: updatedSection.orderIndex,
      assistant: updatedSection.assistantName ? {
        name: updatedSection.assistantName,
        jabatan: updatedSection.assistantJabatan || '',
        image: updatedSection.assistantImage,
      } : null,
      containers: [],
    };

    const updatedContainers: PersonData[][] = [];
    updatedSection.persons.forEach(person => {
      if (person.containerGroup !== null && person.personIndexInGroup !== null) {
        if (!updatedContainers[person.containerGroup]) {
          updatedContainers[person.containerGroup] = [];
        }
        updatedContainers[person.containerGroup][person.personIndexInGroup] = {
          name: person.name,
          jabatan: person.jabatan,
          imageUrl: person.imageUrl,
        };
      }
    });
    reconstructedUpdatedSection.containers = updatedContainers.map(group => group.filter(p => p !== null));

    return NextResponse.json(reconstructedUpdatedSection);
  } catch (error) {
    console.error("Error updating manajemen section:", error);
    return NextResponse.json(
      {
        error: "Failed to update manajemen section",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * @method DELETE
 * @description Menghapus bagian struktur manajemen berdasarkan anchor.
 * @param req NextRequest
 * @returns NextResponse
 * @example
 * DELETE /api/manajemen?anchor=manager
 */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const anchor = searchParams.get("anchor");

  if (!anchor) {
    return NextResponse.json({ error: "Anchor parameter is required for delete." }, { status: 400 });
  }

  try {
    await prisma.manajemenSection.delete({
      where: { anchor },
    });

    return NextResponse.json({ message: `Manajemen section with anchor '${anchor}' deleted successfully.` });
  } catch (error) {
    console.error("Error deleting manajemen section:", error);
    return NextResponse.json(
      {
        error: "Failed to delete manajemen section",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
