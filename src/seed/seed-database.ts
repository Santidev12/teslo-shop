import { prisma } from '../lib/prisma';
import { initialData } from './seed';
import { countries } from './seed-countries';

async function main() {
    // 1. Borrar registros previos (en orden de dependencias)
    await prisma.orderAddress.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();

    await prisma.userAddress.deleteMany();
    await prisma.user.deleteMany();
    await prisma.country.deleteMany();

    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    // 2. Crear registros
    const { categories, products, users } = initialData;

    await prisma.user.createMany({ data: users });
    await prisma.country.createMany({ data: countries });

    // Categorías
    await prisma.category.createMany({
        data: categories.map(name => ({ name })),
    });

    const categoriesDB = await prisma.category.findMany();
    const categoriesMap = categoriesDB.reduce((map, category) => {
        map[category.name.toLowerCase()] = category.id;
        return map;
    }, {} as Record<string, string>);

    // Productos + imágenes (en secuencia y esperando cada operación)
    for (const product of products) {
        const { type, images, ...rest } = product;

        const dbProduct = await prisma.product.create({
            data: { ...rest, categoryId: categoriesMap[type] },
        });

        await prisma.productImage.createMany({
            data: images.map(url => ({ url, productId: dbProduct.id })),
        });
    }

    console.log(`Seed ejecutado: ${users.length} usuarios, ${countries.length} países, ${products.length} productos`);
}

// El seed BORRA todos los datos. En una base de producción hay que confirmarlo
// de forma explícita: ALLOW_SEED=true npm run seed
if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED !== 'true') {
    console.error('Seed bloqueado en producción. Usa ALLOW_SEED=true si es lo que quieres.');
    process.exit(1);
}

main()
    .catch(err => {
        console.error(err);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
