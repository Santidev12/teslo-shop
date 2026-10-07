import { Gender } from '@/generated/prisma';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { z } from 'zod'
import { Size } from '@/interfaces';
import { auth } from '@/auth.config';

if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
) {
    throw new Error('Faltan variables de entorno para configurar Cloudinary');
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce
        .number()
        .min(0)
        .transform(val => Number(val.toFixed(2))),
    inStock: z.coerce
        .number()
        .min(0)
        .transform(val => Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    sizes: z.coerce.string().transform(val => val.split(',')),
    tags: z.string(),
    gender: z.nativeEnum(Gender)
})

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ ok: false, message: 'No autorizado' }, { status: 403 });
  }

  try {
    const formData = await request.formData();

    // Extraer campos menos imágenes para validación
    const data: Record<string, FormDataEntryValue> = {};
    formData.forEach((value, key) => {
      if (key !== "images") data[key] = value;
    });

    // Validar con zod
    const parsed = productSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const product = parsed.data;
    product.slug = product.slug.toLowerCase().replace(/ /g, "_").trim();
    const { id, ...rest } = product;
    const tagArray = rest.tags.split(",").map((t) => t.trim().toLowerCase());

    // Procesar imágenes
    const images = formData.getAll("images") as File[]; // puede venir vacío

    const uploadImages = async (images: File[]) => {
      return Promise.all(
        images.map(async (file) => {
          const buffer = await file.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          const result = await cloudinary.uploader.upload(
            `data:${file.type};base64,${base64}`,
            { folder: "teslo_shop" }
          );
          return result.secure_url;
        })
      );
    };

    let uploadedUrls: string[] = [];
    if (images.length > 0) {
      uploadedUrls = await uploadImages(images);
    }

    const savedProduct = await prisma.$transaction(async (tx) => {
      let productSaved;
      if (id) {
        productSaved = await tx.product.update({
          where: { id },
          data: {
            ...rest,
            sizes: { set: rest.sizes as Size[] },
            tags: { set: tagArray },
          },
        });
      } else {
        productSaved = await tx.product.create({
          data: {
            ...rest,
            sizes: { set: rest.sizes as Size[] },
            tags: { set: tagArray },
          },
        });
      }

      if (uploadedUrls.length > 0) {
        await tx.productImage.createMany({
          data: uploadedUrls.map((url) => ({
            url,
            productId: productSaved.id,
          })),
        });
      }

      return productSaved;
    });

    return NextResponse.json({ ok: true, product: savedProduct });
  } catch (error) {
    console.error("Error in POST /api/products:", error);
    return NextResponse.json({ ok: false, message: "Error interno del servidor" }, { status: 500 });
  }
}
