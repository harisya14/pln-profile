// manajemen/route.ts

import { NextRequest, NextResponse } from "next/server";
// UPDATE: Gunakan instance prisma singleton untuk efisiensi koneksi database
import prisma from "@/src/lib/prisma"; 
import { v2 as cloudinary } from "cloudinary";

// Konfigurasi Cloudinary (tetap sama)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Definisi Tipe Data (tetap sama)
interface PersonData {
  id?: string; // Tambahkan ID opsional untuk kemudahan di frontend
  name: string;
  jabatan: string;
  imageUrl?: string | null;
}

interface ManajemenSectionInput {
  id?: string; // Tambahkan ID opsional
  title: string;
  anchor: string;
  orderIndex: number;
  assistant?: {
    name: string;
    jabatan: string;
    image?: string | null;
  } | null;
  containers: PersonData[][];
}

// Fungsi Helper (sedikit disempurnakan untuk menyertakan ID)
function reconstructManajemenSection(section: any): ManajemenSectionInput {
    const containers: PersonData[][] = [];
    section.persons.forEach((person: any) => {
        if (person.containerGroup !== null && person.personIndexInGroup !== null) {
            if (!containers[person.containerGroup]) {
                containers[person.containerGroup] = [];
            }
            containers[person.containerGroup][person.personIndexInGroup] = {
                id: person.id, // Sertakan ID person
                name: person.name,
                jabatan: person.jabatan,
                imageUrl: person.imageUrl,
            };
        }
    });
    
    const cleanedContainers = containers
      .map(group => (group ? group.filter(p => p != null) : []))
      .filter(group => group.length > 0 || containers.length === 0);

    return {
        id: section.id, // Sertakan ID section
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

// Metode GET (tetap sama, sudah bagus)
export async function GET(req: NextRequest) {
    // ... logika GET Anda sudah baik, tidak perlu diubah ...
    const { searchParams } = new URL(req.url);
    const anchor = searchParams.get("anchor");
  
    try {
      if (anchor) {
        const section = await prisma.manajemenSection.findUnique({
          where: { anchor },
          include: { persons: { orderBy: [{ containerGroup: 'asc' }, { personIndexInGroup: 'asc' }]}},
        });
  
        if (!section) {
          return NextResponse.json({ error: `Manajemen section with anchor '${anchor}' not found.` }, { status: 404 });
        }
  
        const reconstructedSection = reconstructManajemenSection(section);
        return NextResponse.json(reconstructedSection);
  
      } else {
        const manajemenSections = await prisma.manajemenSection.findMany({
          include: { persons: { orderBy: [{ containerGroup: 'asc' }, { personIndexInGroup: 'asc' }]}},
          orderBy: { orderIndex: 'asc' },
        });
  
        const reconstructedData = manajemenSections.map(section => reconstructManajemenSection(section));
        return NextResponse.json(reconstructedData);
      }
    } catch (error) {
      console.error("Error fetching manajemen structure:", error);
      return NextResponse.json({ error: "Failed to fetch manajemen structure" }, { status: 500 });
    }
}

// Metode POST
export async function POST(req: NextRequest) {
  const body: ManajemenSectionInput = await req.json();
  const { title, anchor, orderIndex, assistant, containers } = body;

  if (!title || !anchor || containers === undefined) {
    return NextResponse.json({ error: "Title, anchor, and containers are required." }, { status: 400 });
  }

  try {
    const existingSection = await prisma.manajemenSection.findUnique({ where: { anchor } });
    if (existingSection) {
      return NextResponse.json({ error: `Section with anchor '${anchor}' already exists.` }, { status: 409 });
    }
    
    // ... Logika upload gambar tetap sama ...
    let assistantImageUrl: string | null | undefined;
    if (assistant?.image?.startsWith('data:image/')) {
        const uploadRes = await cloudinary.uploader.upload(assistant.image, { folder: "manajemen/assistants", public_id: `${anchor}-assistant` });
        assistantImageUrl = uploadRes.secure_url;
    } else {
        assistantImageUrl = assistant?.image;
    }

    const personsToCreate = [];
    for (let i = 0; i < containers.length; i++) {
        for (let j = 0; j < containers[i].length; j++) {
            const person = containers[i][j];
            let personImageUrl: string | null | undefined;
            if (person.imageUrl?.startsWith('data:image/')) {
                const uploadRes = await cloudinary.uploader.upload(person.imageUrl, { folder: `manajemen/${anchor}/group-${i}`, public_id: `${person.name.toLowerCase().replace(/\s+/g, '-')}` });
                personImageUrl = uploadRes.secure_url;
            } else {
                personImageUrl = person.imageUrl;
            }
            personsToCreate.push({ name: person.name, jabatan: person.jabatan, imageUrl: personImageUrl, containerGroup: i, personIndexInGroup: j });
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
        persons: { create: personsToCreate },
      },
      include: { persons: true },
    });

    // UPDATE: Gunakan kembali helper function untuk konsistensi
    const finalResponse = reconstructManajemenSection(newSection);
    return NextResponse.json(finalResponse, { status: 201 });

  } catch (error) {
    console.error("Error adding manajemen section:", error);
    return NextResponse.json({ error: "Failed to add manajemen section" }, { status: 500 });
  }
}

// Metode PUT
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const anchor = searchParams.get("anchor");
  const body: ManajemenSectionInput = await req.json();
  const { title, orderIndex, assistant, containers } = body;

  if (!anchor) {
    return NextResponse.json({ error: "Anchor parameter is required for update." }, { status: 400 });
  }

  try {
    const existingSection = await prisma.manajemenSection.findUnique({ where: { anchor } });

    if (!existingSection) {
      return NextResponse.json({ error: `Section with anchor '${anchor}' not found.` }, { status: 404 });
    }

    // ... Logika upload gambar tetap sama ...
    let assistantImageUrl: string | null | undefined = existingSection.assistantImage;
    if (assistant?.image) {
      if (assistant.image.startsWith('data:image/')) {
        const uploadRes = await cloudinary.uploader.upload(assistant.image, { folder: "manajemen/assistants", public_id: `${anchor}-assistant` });
        assistantImageUrl = uploadRes.secure_url;
      } else {
        assistantImageUrl = assistant.image;
      }
    } else if (assistant && assistant.image === null) {
      assistantImageUrl = null;
    }

    // Hapus person lama
    await prisma.person.deleteMany({ where: { sectionId: existingSection.id } });

    // Buat person baru
    const personsToCreate = [];
    for (let i = 0; i < containers.length; i++) {
        for (let j = 0; j < containers[i].length; j++) {
            const person = containers[i][j];
            let personImageUrl: string | null | undefined;
            if (person.imageUrl?.startsWith('data:image/')) {
                const uploadRes = await cloudinary.uploader.upload(person.imageUrl, { folder: `manajemen/${anchor}/group-${i}`, public_id: `${person.name.toLowerCase().replace(/\s+/g, '-')}` });
                personImageUrl = uploadRes.secure_url;
            } else {
                personImageUrl = person.imageUrl;
            }
            personsToCreate.push({ name: person.name, jabatan: person.jabatan, imageUrl: personImageUrl, containerGroup: i, personIndexInGroup: j });
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
        persons: { create: personsToCreate },
      },
      include: { persons: true },
    });

    // UPDATE: Gunakan kembali helper function untuk konsistensi
    const finalResponse = reconstructManajemenSection(updatedSection);
    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error("Error updating manajemen section:", error);
    return NextResponse.json({ error: "Failed to update manajemen section" }, { status: 500 });
  }
}

// Metode DELETE (tetap sama, sudah bagus)
export async function DELETE(req: NextRequest) {
    // ... logika DELETE Anda sudah baik, tidak perlu diubah ...
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
      return NextResponse.json({ error: "Failed to delete manajemen section" }, { status: 500 });
    }
}