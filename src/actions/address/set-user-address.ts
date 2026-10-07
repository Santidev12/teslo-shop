'use server';

import type { Address } from "@/interfaces";
import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";

interface ActionResult<T> {
    ok: boolean;
    data?: T;
    message?: string;
}

export const setUserAddress = async (
    address: Address,
    userId: string
): Promise<ActionResult<Address>> => {
    try {
        const newAddress = await createOrReplaceAddress(address, userId);

        return {
            ok: true,
            data: newAddress,
        };
    } catch (error) {
        logger.error("Error en setUserAddress", { error, userId, address });
        return {
            ok: false,
            message: "No se pudo grabar la dirección.",
        };
    }
};

const createOrReplaceAddress = async (
    address: Address,
    userId: string
): Promise<Address> => {
    try {
        const storedAddress = await prisma.userAddress.findUnique({
            where: { userId },
        });

        const addressToSave = {
            userId,
            address: address.address,
            address2: address.address2,
            countryId: address.country,
            firstName: address.firstName,
            lastName: address.lastName,
            phone: address.phone,
            postalCode: address.postalCode,
            city: address.city,
        };


        const dbResponse = storedAddress
            ? await prisma.userAddress.update({
                where: { userId },
                data: addressToSave,
            })
            : await prisma.userAddress.create({
                data: addressToSave,
            });

        const {
            countryId,
            address2,
            ...rest
        } = dbResponse;

        return {
            ...rest,
            address2: address2 ?? '',
            country: countryId,
        };

    } catch (error) {
        logger.error("Error en createOrReplaceAddress", { error, userId, address });
        throw new Error("No se pudo grabar la dirección.");
    }
};
