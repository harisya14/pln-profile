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

// Tipe data untuk parameter ultg
type UltgParams = {
  namagi: string;
  image: string; // Base64 string for image upload
  alamat: string;
  googleMapsEmbed: string;
  slug?: string; // Slug is generated or used for updates
};

// Helper untuk mendapatkan model Prisma berdasarkan tipe
// --- PERBAIKAN: Mengembalikan tipe 'any' untuk mengatasi masalah "not callable" ---
function getPrismaModel(type: string): any {
  switch (type) {
    case "tarahan":
      return prisma.ultgtarahan;
    case "tegineneng":
      return prisma.ultgtegineneng;
    case "pagelaran":
      return prisma.ultgpagelaran;
    case "kotabumi":
      return prisma.ultgkotabumi;
    default:
      return null;
  }
}
// --- AKHIR PERBAIKAN ---

/**
 * @method GET
 * @description Mengambil data ultg (single atau list) berdasarkan tipe.
 * @param req NextRequest
 * @returns NextResponse
 * @example
 * GET /api/ultg?type=tarahan&mode=single&slug=nama-ultg-tarahan
 * GET /api/ultg?type=tegineneng&limit=5&cursor=someId
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode");
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") || "10");
  const type = searchParams.get("type"); // type bisa berupa string | null

  // Validasi 'type' terlebih dahulu untuk memastikan itu string
  if (!type) {
    return NextResponse.json({ error: "Type parameter is required (e.g., tarahan, tegineneng, pagelaran, kotabumi)" }, { status: 400 });
  }

  console.log("GET Request - Type:", type); // Debugging: Log the type
  const model = getPrismaModel(type); // Sekarang 'type' dijamin string di sini
  console.log("GET Request - Model:", model ? `Prisma model for ${type}` : "Invalid model type"); // Debugging: Log model status

  // Validasi apakah model ditemukan (jika type valid tapi tidak ada di getPrismaModel)
  if (!model) {
    return NextResponse.json({ error: `Invalid ULTG type: ${type}` }, { status: 400 });
  }

  try {
    if (mode === "single") {
      const slug = searchParams.get("slug");
      // Validasi 'slug' terlebih dahulu
      if (!slug) {
        return NextResponse.json({ error: "Slug is required for single mode" }, { status: 400 });
      }

      // Cari data berdasarkan slug
      const ultgData = await model.findUnique({ where: { slug } });
      if (!ultgData) {
        return NextResponse.json({ error: `${type} data not found` }, { status: 404 });
      }

      return NextResponse.json(ultgData);
    } else {
      // Ambil daftar data dengan pagination
      const ultgDataList = await model.findMany({
        take: limit + 1,
        skip: cursor ? 1 : 0,
        ...(cursor && { cursor: { id: cursor } }),
      });

      const hasNextPage = ultgDataList.length > limit;
      const nextCursor = hasNextPage ? ultgDataList[ultgDataList.length - 1].id : null;
      const trimmed = hasNextPage ? ultgDataList.slice(0, -1) : ultgDataList;

      return NextResponse.json({
        data: trimmed,
        next_cursor: nextCursor,
      });
    }
  } catch (error) {
    console.error(`Error during GET for ${type}:`, error);
    return NextResponse.json(
      {
        error: `Failed to fetch ${type} data`,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * @method POST
 * @description Menambahkan data ultg baru.
 * @param req NextRequest
 * @returns NextResponse
 * @example
 * POST /api/ultg
 * Body: { "type": "tarahan", "namagi": "ultg Tarahan 1", "image": "base64image", "alamat": "Jl. Raya", "googleMapsEmbed": "<iframe...>" }
 */
export async function POST(req: NextRequest) {
  const body: UltgParams & { type: string } = await req.json();
  const { namagi, image, alamat, googleMapsEmbed, type } = body;

  // Validasi 'type' terlebih dahulu
  if (!type) {
    return NextResponse.json({ error: "Type parameter is required in body (e.g., tarahan, tegineneng, pagelaran, kotabumi)" }, { status: 400 });
  }

  console.log("POST Request - Type:", type); // Debugging: Log the type
  const model = getPrismaModel(type); // Sekarang 'type' dijamin string di sini
  console.log("POST Request - Model:", model ? `Prisma model for ${type}` : "Invalid model type"); // Debugging: Log model status

  if (!model) {
    return NextResponse.json({ error: `Invalid ULTG type: ${type}` }, { status: 400 });
  }

  try {
    // Validasi field yang wajib
    if (!namagi || !image || !alamat || !googleMapsEmbed) {
      return NextResponse.json(
        { error: "namagi, image, alamat, and googleMapsEmbed are required." },
        { status: 400 }
      );
    }

    // Upload gambar ke Cloudinary
    const imageCloudRes = await cloudinary.uploader.upload(image, {
      folder: `ultg/${type}`, // Folder spesifik untuk setiap tipe ultg
      public_id: namagi.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""), // Public ID dari namagi
    });

    // Generate slug unik
    let slug = namagi.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    let existingSlug = await model.findUnique({ where: { slug } });
    let counter = 1;

    while (existingSlug) {
      slug = `${namagi.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${counter}`;
      existingSlug = await model.findUnique({ where: { slug } });
      counter++;
    }

    // Buat data ultg baru di database
    const newUltgData = await model.create({
      data: {
        namagi,
        slug,
        image: imageCloudRes.secure_url,
        alamat,
        googleMapsEmbed,
      },
    });

    return NextResponse.json(newUltgData, { status: 201 });
  } catch (error) {
    console.error(`Error adding ${type} data:`, error);
    return NextResponse.json(
      {
        error: `Failed to add ${type} data`,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @description Memperbarui data ultg yang sudah ada.
 * @param req NextRequest
 * @returns NextResponse
 * @example
 * PUT /api/ultg?type=tarahan&slug=nama-ultg-tarahan
 * Body: { "namagi": "ultg Tarahan 1 Updated", "image": "newBase64image", "alamat": "Jl. Baru", "googleMapsEmbed": "<iframe new...>" }
 */
export async function PUT(req: NextRequest) {
  const body: UltgParams = await req.json();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const type = searchParams.get("type"); // Ambil tipe model

  // Validasi 'type' terlebih dahulu
  if (!type) {
    return NextResponse.json({ error: "Type parameter is required (e.g., tarahan, tegineneng, pagelaran, kotabumi)" }, { status: 400 });
  }

  console.log("PUT Request - Type:", type); // Debugging: Log the type
  const model = getPrismaModel(type); // Sekarang 'type' dijamin string di sini
  console.log("PUT Request - Model:", model ? `Prisma model for ${type}` : "Invalid model type"); // Debugging: Log model status

  if (!model) {
    return NextResponse.json({ error: `Invalid ULTG type: ${type}` }, { status: 400 });
  }

  try {
    // Validasi 'slug' terlebih dahulu
    if (!slug) {
      return NextResponse.json({ error: "Slug is required for update" }, { status: 400 });
    }

    // Cari data yang sudah ada
    const existingUltgData = await model.findUnique({ where: { slug } });
    if (!existingUltgData) {
      return NextResponse.json({ error: `${type} data not found` }, { status: 404 });
    }

    const { namagi, image, alamat, googleMapsEmbed } = body;

    // Validasi field yang wajib
    if (!namagi || !alamat || !googleMapsEmbed) {
      return NextResponse.json(
        { error: "namagi, alamat, and googleMapsEmbed are required." },
        { status: 400 }
      );
    }

    // Handle update gambar hanya jika gambar baru (Base64) disediakan
    let newImageUrl = existingUltgData.image;
    if (image?.startsWith("data:image/")) {
      const cloudRes = await cloudinary.uploader.upload(image, {
        folder: `ultg/${type}`,
        public_id: namagi.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      });
      newImageUrl = cloudRes.secure_url;
    }

    // Generate slug baru jika namagi berubah dan pastikan unik
    let newSlug = namagi.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    let existingSlugCheck = await model.findUnique({ where: { slug: newSlug } });
    let counter = 1;

    while (existingSlugCheck && existingSlugCheck.id !== existingUltgData.id) {
      newSlug = `${namagi.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${counter}`;
      existingSlugCheck = await model.findUnique({ where: { slug: newSlug } });
      counter++;
    }

    // Perbarui data di database
    const updatedUltgData = await model.update({
      where: { slug },
      data: {
        namagi,
        slug: newSlug,
        image: newImageUrl,
        alamat,
        googleMapsEmbed,
      },
    });

    return NextResponse.json(updatedUltgData);
  } catch (error) {
    console.error(`Error updating ${type} data:`, error);
    return NextResponse.json(
      {
        error: `Failed to update ${type} data`,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * @method DELETE
 * @description Menghapus data ultg.
 * @param req NextRequest
 * @returns NextResponse
 * @example
 * DELETE /api/ultg?type=tarahan&slug=nama-ultg-tarahan
 */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const type = searchParams.get("type"); // Ambil tipe model

  // Validasi 'type' terlebih dahulu
  if (!type) {
    return NextResponse.json({ error: "Type parameter is required (e.g., tarahan, tegineneng, pagelaran, kotabumi)" }, { status: 400 });
  }

  console.log("DELETE Request - Type:", type); // Debugging: Log the type
  const model = getPrismaModel(type); // Sekarang 'type' dijamin string di sini
  console.log("DELETE Request - Model:", model ? `Prisma model for ${type}` : "Invalid model type"); // Debugging: Log model status

  if (!model) {
    return NextResponse.json({ error: `Invalid ULTG type: ${type}` }, { status: 400 });
  }

  try {
    // Validasi 'slug' terlebih dahulu
    if (!slug) {
      return NextResponse.json({ error: "Slug is required for delete" }, { status: 400 });
    }

    // Hapus data dari database
    await model.delete({ where: { slug } });

    return NextResponse.json({ message: `${type} data deleted successfully` });
  } catch (error) {
    console.error(`Error deleting ${type} data:`, error);
    return NextResponse.json(
      {
        error: `Failed to delete ${type} data`,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
