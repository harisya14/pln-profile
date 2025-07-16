import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface PersonData {
  id?: string; 
  name: string;
  jabatan: string;
  imageUrl?: string | null;
}

interface ManajemenSectionInput {
  id?: string;
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

/**
 * @param url The full Cloudinary URL.
 * @returns The public ID used for deletion.
 */
function getPublicIdFromUrl(url: string): string | null {
    try {
        const regex = /\/v\d+\/([^\/]+\/[^\/]+\/[^\.]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}


/**
 * Reconstructs the flat database structure into the nested array format for the frontend.
 * @param section - The section data from Prisma, including its related persons.
 * @returns A formatted object that matches the frontend's data structure.
 */
function reconstructManajemenSection(section: any): ManajemenSectionInput {
  const containers: PersonData[][] = [];
  const maxGroup = section.persons.reduce((max: number, p: any) => Math.max(max, p.containerGroup), -1);
  for (let i = 0; i <= maxGroup; i++) {
    containers.push([]);
  }

  section.persons.forEach((person: any) => {
    if (person.containerGroup !== null && person.personIndexInGroup !== null) {
      containers[person.containerGroup][person.personIndexInGroup] = {
        id: person.id,
        name: person.name,
        jabatan: person.jabatan,
        imageUrl: person.imageUrl,
      };
    }
  });
  
  const cleanedContainers = containers.map(group => group ? group.filter(p => p != null) : []);

  return {
    id: section.id,
    title: section.title,
    anchor: section.anchor,
    orderIndex: section.orderIndex,
    assistant: section.assistantName
      ? {
          name: section.assistantName,
          jabatan: section.assistantJabatan || "",
          image: section.assistantImage,
        }
      : null,
    containers: cleanedContainers,
  };
}

// --- API Methods ---

/**
 * GET: Fetches all management sections or a single one by its anchor.
 * This function is well-structured and remains largely unchanged.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const anchor = searchParams.get("anchor");

  try {
    if (anchor) {
      const section = await prisma.manajemenSection.findUnique({
        where: { anchor },
        include: { persons: { orderBy: [{ containerGroup: "asc" }, { personIndexInGroup: "asc" }] } },
      });

      if (!section) {
        return NextResponse.json({ error: `Manajemen section with anchor '${anchor}' not found.` }, { status: 404 });
      }
      return NextResponse.json(reconstructManajemenSection(section));
    } else {
      const manajemenSections = await prisma.manajemenSection.findMany({
        include: { persons: { orderBy: [{ containerGroup: "asc" }, { personIndexInGroup: "asc" }] } },
        orderBy: { orderIndex: "asc" },
      });
      const reconstructedData = manajemenSections.map(reconstructManajemenSection);
      return NextResponse.json(reconstructedData);
    }
  } catch (error) {
    console.error("GET Error /api/manajemen:", error);
    // This will now return a proper JSON error, preventing the "Unexpected token '<'" error on the client.
    return NextResponse.json({ error: "Failed to fetch manajemen structure. See server logs for details." }, { status: 500 });
  }
}

/**
 * POST: Creates a new management section.
 * This logic is sound and remains mostly unchanged.
 */
export async function POST(req: NextRequest) {
  try {
    const body: ManajemenSectionInput = await req.json();
    const { title, anchor, orderIndex, assistant, containers } = body;

    if (!title || !anchor || containers === undefined) {
      return NextResponse.json({ error: "Title, anchor, and containers are required." }, { status: 400 });
    }

    const existingSection = await prisma.manajemenSection.findUnique({ where: { anchor } });
    if (existingSection) {
      return NextResponse.json({ error: `Section with anchor '${anchor}' already exists.` }, { status: 409 });
    }

    // Upload assistant image if provided as base64
    let assistantImageUrl: string | null | undefined = assistant?.image;
    if (assistant?.image?.startsWith("data:image/")) {
      const uploadRes = await cloudinary.uploader.upload(assistant.image, {
        folder: "manajemen/assistants",
        public_id: `${anchor}-assistant-${Date.now()}`
      });
      assistantImageUrl = uploadRes.secure_url;
    }

    // Prepare person data and upload images
    const personsToCreate = [];
    for (let i = 0; i < containers.length; i++) {
      for (let j = 0; j < containers[i].length; j++) {
        const person = containers[i][j];
        let personImageUrl: string | null | undefined = person.imageUrl;
        if (person.imageUrl?.startsWith("data:image/")) {
          const uploadRes = await cloudinary.uploader.upload(person.imageUrl, {
            folder: `manajemen/${anchor}`,
            public_id: `${person.name.toLowerCase().replace(/\s+/g, "-")}-${i}-${j}-${Date.now()}`
          });
          personImageUrl = uploadRes.secure_url;
        }
        personsToCreate.push({
          name: person.name,
          jabatan: person.jabatan || '',
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
        persons: { create: personsToCreate },
      },
      include: { persons: true },
    });

    return NextResponse.json(reconstructManajemenSection(newSection), { status: 201 });
  } catch (error) {
    console.error("POST Error /api/manajemen:", error);
    return NextResponse.json({ error: "Failed to create manajemen section." }, { status: 500 });
  }
}

/**
 * PUT: Updates an existing management section.
 * REFACTORED: This now uses an efficient update-or-create strategy instead of delete-and-replace.
 * It also handles image cleanup correctly.
 */
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const anchor = searchParams.get("anchor");

  if (!anchor) {
    return NextResponse.json({ error: "Anchor parameter is required for update." }, { status: 400 });
  }

  try {
    const body: ManajemenSectionInput = await req.json();
    const { title, orderIndex, assistant, containers } = body;

    const existingSection = await prisma.manajemenSection.findUnique({
      where: { anchor },
      include: { persons: true },
    });

    if (!existingSection) {
      return NextResponse.json({ error: `Section with anchor '${anchor}' not found.` }, { status: 404 });
    }

    // --- Transaction for atomic update ---
    const updatedSectionData = await prisma.$transaction(async (tx) => {
      // 1. Handle Assistant Image Update
      let assistantImageUrl: string | null | undefined = existingSection.assistantImage;
      if (assistant?.image && assistant.image.startsWith("data:image/")) {
        // If there's an old image, delete it from Cloudinary
        if (existingSection.assistantImage) {
            const publicId = getPublicIdFromUrl(existingSection.assistantImage);
            if (publicId) await cloudinary.uploader.destroy(publicId);
        }
        // Upload the new one
        const uploadRes = await cloudinary.uploader.upload(assistant.image, {
          folder: "manajemen/assistants",
          public_id: `${anchor}-assistant-${Date.now()}`
        });
        assistantImageUrl = uploadRes.secure_url;
      } else if (assistant && assistant.image === null && existingSection.assistantImage) {
         // If image is explicitly set to null, delete the old one
         const publicId = getPublicIdFromUrl(existingSection.assistantImage);
         if (publicId) await cloudinary.uploader.destroy(publicId);
         assistantImageUrl = null;
      } else {
        assistantImageUrl = assistant?.image; // Keep existing URL if not a new upload
      }

      // 2. Handle Persons (Update, Create, Delete)
      const incomingPersonsData = containers.flat();
      const existingPersonIds = new Set(existingSection.persons.map(p => p.id));
      const incomingPersonIds = new Set(incomingPersonsData.map(p => p.id).filter(id => id));

      // 2a. Find persons to delete
      const personIdsToDelete = [...existingPersonIds].filter(id => !incomingPersonIds.has(id));
      if (personIdsToDelete.length > 0) {
        const personsToDelete = existingSection.persons.filter(p => personIdsToDelete.includes(p.id));
        // Delete images from Cloudinary
        for (const person of personsToDelete) {
            if (person.imageUrl) {
                const publicId = getPublicIdFromUrl(person.imageUrl);
                if (publicId) await cloudinary.uploader.destroy(publicId);
            }
        }
        // Delete from database
        await tx.person.deleteMany({ where: { id: { in: personIdsToDelete } } });
      }

      // 2b. Update existing persons and create new ones
      for (let i = 0; i < containers.length; i++) {
        for (let j = 0; j < containers[i].length; j++) {
          const personData = containers[i][j];
          let personImageUrl = personData.imageUrl;

          // If it's a new image upload
          if (personData.imageUrl?.startsWith("data:image/")) {
            // If it's an update to an existing person, delete their old image first
            if(personData.id) {
                const oldPerson = existingSection.persons.find(p => p.id === personData.id);
                if (oldPerson?.imageUrl) {
                    const publicId = getPublicIdFromUrl(oldPerson.imageUrl);
                    if (publicId) await cloudinary.uploader.destroy(publicId);
                }
            }
            // Upload the new image
            const uploadRes = await cloudinary.uploader.upload(personData.imageUrl, {
              folder: `manajemen/${anchor}`,
              public_id: `${personData.name.toLowerCase().replace(/\s+/g, '-')}-${i}-${j}-${Date.now()}`
            });
            personImageUrl = uploadRes.secure_url;
          }

          const dataPayload = {
            name: personData.name,
            jabatan: personData.jabatan || '',
            imageUrl: personImageUrl,
            containerGroup: i,
            personIndexInGroup: j,
            sectionId: existingSection.id,
          };

          if (personData.id && existingPersonIds.has(personData.id)) {
            // Update existing person
            await tx.person.update({ where: { id: personData.id }, data: dataPayload });
          } else {
            // Create new person
            await tx.person.create({ data: dataPayload });
          }
        }
      }

      // 3. Update the main section data
      const finalUpdatedSection = await tx.manajemenSection.update({
        where: { id: existingSection.id },
        data: {
          title: title ?? existingSection.title,
          orderIndex: orderIndex ?? existingSection.orderIndex,
          assistantName: assistant?.name,
          assistantJabatan: assistant?.jabatan,
          assistantImage: assistantImageUrl,
        },
        include: { persons: { orderBy: [{ containerGroup: "asc" }, { personIndexInGroup: "asc" }] } },
      });

      return finalUpdatedSection;
    });

    return NextResponse.json(reconstructManajemenSection(updatedSectionData));

  } catch (error) {
    console.error("PUT Error /api/manajemen:", error);
    return NextResponse.json({ error: "Failed to update manajemen section." }, { status: 500 });
  }
}

/**
 * DELETE: Deletes a management section.
 * REFACTORED: Now cleans up all associated images from Cloudinary before deleting from the database.
 */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const anchor = searchParams.get("anchor");

  if (!anchor) {
    return NextResponse.json({ error: "Anchor parameter is required for delete." }, { status: 400 });
  }

  try {
    // Use a transaction to ensure both Cloudinary and DB operations succeed or fail together.
    await prisma.$transaction(async (tx) => {
      // 1. Find the section and all its persons to get image URLs
      const sectionToDelete = await tx.manajemenSection.findUnique({
        where: { anchor },
        include: { persons: true },
      });

      if (!sectionToDelete) {
        // We throw an error here to abort the transaction.
        throw new Error(`Section with anchor '${anchor}' not found.`);
      }

      // 2. Collect all public_ids for deletion from Cloudinary
      const publicIdsToDelete: string[] = [];
      if (sectionToDelete.assistantImage) {
        const publicId = getPublicIdFromUrl(sectionToDelete.assistantImage);
        if (publicId) publicIdsToDelete.push(publicId);
      }
      sectionToDelete.persons.forEach(person => {
        if (person.imageUrl) {
            const publicId = getPublicIdFromUrl(person.imageUrl);
            if (publicId) publicIdsToDelete.push(publicId);
        }
      });
      
      // 3. Delete images from Cloudinary
      // Note: `delete_resources` is more efficient for bulk deletion.
      if (publicIdsToDelete.length > 0) {
        await cloudinary.api.delete_resources(publicIdsToDelete);
      }

      // 4. Delete the section from the database.
      // Prisma's cascading delete (if configured in schema.prisma) will handle deleting the persons.
      await tx.manajemenSection.delete({ where: { anchor } });
    });

    return NextResponse.json({ message: `Manajemen section with anchor '${anchor}' deleted successfully.` });
  } catch (error: any) {
    console.error("DELETE Error /api/manajemen:", error);
    // Handle the case where the section was not found inside the transaction
    if (error.message.includes("not found")) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete manajemen section." }, { status: 500 });
  }
}
