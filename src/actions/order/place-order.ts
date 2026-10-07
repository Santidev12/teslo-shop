'use server'

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size
}

export const placeOrder = async (
    productIds: ProductToOrder[],
    address: Address
) => {
    const session = await auth();
    if (!session?.user?.id) {
        return { ok: false, message: "No hay sesión de usuario" };
    }
    const userId = session.user.id;

    const products = await prisma.product.findMany({
        where: { id: { in: productIds.map(p => p.productId) } }
    });

    if (products.length === 0) {
        return { ok: false, message: "Productos no encontrados" };
    }

    let total = 0;
    let itemsInOrder = 0;

    for (const p of productIds) {
        const product = products.find(pr => pr.id === p.productId);
        if (!product) {
            return { ok: false, message: `Producto ${p.productId} no existe` };
        }

        if (product.inStock < p.quantity) {
            return { ok: false, message: `Producto ${product.title} sin stock suficiente` };
        }
        total += product.price * p.quantity;
        itemsInOrder += p.quantity;
    }

    try {
        const order = await prisma.$transaction(async (tx) => {

            const newOrder = await tx.order.create({
                data: {
                    userId,
                    itemsInOrder,
                    total,
                    isPaid: false,
                    OrderItem: {
                        createMany: {
                            data: productIds.map(p => ({
                                productId: p.productId,
                                quantity: p.quantity,
                                size: p.size,
                                price: products.find(pr => pr.id === p.productId)?.price || 0,
                            })),
                        },
                    },
                },
            });

            const { country, ...restAddress } = address;

            await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    countryId: country,
                    orderId: newOrder.id,
                },
            });

            return newOrder;
        });

        (await cookies()).set('pendingOrderId', order.id, {
            path: '/',
            httpOnly: false,
        });

        return { ok: true, order };
    } catch (error) {
        return { ok: false, message: `Error creando orden. ${error}` };
    }
};
