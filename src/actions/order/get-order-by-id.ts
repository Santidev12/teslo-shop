'use server'

import { auth } from "@/auth.config";
import { prisma } from "@/lib/prisma"

export const getOrderById = async (id: string) => {

    const session = await auth()
    if (!session) {
        return {
            ok: false,
            message: 'Debe de estar autenticado'
        }
    }

    try {
        const order = await prisma.order.findFirst({
            where: { id },
            include: {
                OrderAddress: true,
                OrderItem: {
                    select: {
                        price: true,
                        quantity: true,
                        size: true,

                        product: {
                            select: {
                                title: true,
                                slug: true,
                                
                                ProductImage: {
                                    select: {
                                        url: true
                                    },
                                    take: 1
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!order) throw `${id} no existe`;

        if(session.user.role === 'user'){
            if(session.user.id !== order.userId){
                throw `${id} no pertenece a este usuario`
            }
        }

        return { 
            ok: true,
            order, 
        };

    } catch {

        return { 
            ok: false,
            message: 'Orden no existe'
        }
    }

}