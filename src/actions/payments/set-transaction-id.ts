'use server';
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth.config";


export const setTransactionId = async( orderId: string, transactionId: string ) => {

    const session = await auth();
    if (!session?.user?.id) {
        return { ok: false, message: 'No autorizado' }
    }

    try {
        // Solo el propietario de la orden puede asociarle una transacción
        const { count } = await prisma.order.updateMany({
            where: { id: orderId, userId: session.user.id },
            data: {
                transactionId,
            }
        });

        if(count === 0){
            return {
                ok: false,
                message: `No se encontró una orden con el ${ orderId }`
            }
        }

        return { ok: true }
        
    } catch (error) {
        console.log(error);

        return {
            ok: false,
            message: 'No se puedo actualizar el id de la transacción.'
        }
    }

}