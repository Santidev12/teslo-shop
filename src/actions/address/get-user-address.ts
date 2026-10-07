'use server'

import { ActionResult, Address } from "@/interfaces";
import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export const getUserAddress = async (userId: string): Promise<ActionResult<Address | null>> => {

    try {

        const address = await prisma.userAddress.findUnique({
            where: { userId }
        });

        if (!address){
            logger.info(`No se encontró dirección para el usuario ${userId}`);
            return {
                ok: true,
                data: null
            };
        } 

        const { countryId, address2, ...rest } = address;

        const userAddress: Address = {
            ...rest,
            address2: address2 ?? '',
            country: countryId,
        };

        return {
            ok: true,
            data: userAddress,
        };

    } catch (error) {
        logger.error(`Error obteniendo dirección del usuario ${userId}: ${error}`);
        return {
            ok: false,
            message: 'Error al obtener la dirección del usuario.',
        };
    }
}