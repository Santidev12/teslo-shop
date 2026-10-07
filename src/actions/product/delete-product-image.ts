'use server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';
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


export const deleteProductImage = async (imageId: number, imageUrl: string) => {

    const session = await auth();
    if (session?.user?.role !== 'admin') {
        return { ok: false, message: 'No autorizado' }
    }

    if (!imageUrl.startsWith('http')) {
        return {
            ok: false,
            message: 'No se pudo eliminar la imagen de cloudinary'
        }
    }

    const parts = imageUrl.split('/upload/');
    if (parts.length < 2) return '';

    let pathAndFile = parts[1];

    pathAndFile = pathAndFile.replace(/^v\d+\//, '');

    const publicId = pathAndFile.replace(/\.[^/.]+$/, '');

    try {
        await cloudinary.uploader.destroy(publicId);

        const deletedImage = await prisma.productImage.delete({
            where: {
                id: imageId
            },
            select: {
                product: {
                    select: {
                        slug: true
                    }
                }
            }
        });

        // Revalidar los path
        revalidatePath(`/admin/products`)
        revalidatePath(`/admin/product/${deletedImage.product.slug}`);
        revalidatePath(`/products/${deletedImage.product.slug}`);

    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: 'No se pudo eliminar la imagen'
        }
    }

}