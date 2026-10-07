'use server'

import { PayPalOrderStatusResponse } from "@/interfaces";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { auth } from "@/auth.config";

export const paypalCheckPayment = async (paypalTransactionId: string) => {

    const session = await auth();
    if (!session?.user?.id) {
        return { ok: false, message: 'No autorizado' }
    }

    const authToken = await getPayPalBearerToken();

    if (!authToken) {
        return {
            ok: false,
            message: 'No se pudo obtener el token de autorización.'
        }
    }

    const resp = await verifyPayPalPayment( paypalTransactionId, authToken );

    if(!resp){
        return {
            ok: false,
            message: 'Error al verificar el pago'
        }
    }


    const { purchase_units, status } = resp;
    const { invoice_id: orderId } = purchase_units[0];

    if( status !== 'COMPLETED'){
        return {
            ok: false,
            message: 'No se ha pagado en paypal'
        }
    }

    // La orden debe pertenecer al usuario autenticado
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== session.user.id) {
        return {
            ok: false,
            message: 'La orden no pertenece al usuario'
        }
    }

    // actualizacion en bbdd
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: {
                isPaid: true,
                paidAt: new Date(),
            }
        });

        (await cookies()).delete('pendingOrderId');
        revalidatePath(`/orders/${ orderId }`);

        return {
            ok: true,
        }
        
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: '500 - el pago no se pudo realizar'
        }
    }
}

const getPayPalBearerToken = async (): Promise<string | null> => {

    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
    const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? '';
    const base64Token = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
        'utf-8',
    ).toString('base64');

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Basic ${base64Token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
    };

    try {
        const result = await fetch(oauth2Url, requestOptions).then(r => r.json());
        return result.access_token;

    } catch (error) {
        console.log(error);
        return null;
    };

}

const verifyPayPalPayment = async ( 
    paypalTransactionId: string, 
    bearerToken: string
 ): Promise<PayPalOrderStatusResponse | null> => {

    const paypalOrderUrl = `${ process.env.PAYPAL_ORDERS_URL}/${ paypalTransactionId }`;

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${ bearerToken }`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    try {
        const response = await fetch(paypalOrderUrl, {
            ...requestOptions,
            cache: 'no-store'
        }).then( r => r.json() );
        return response;
    } catch (error) {
        console.log(error);
        return null;
    };
}