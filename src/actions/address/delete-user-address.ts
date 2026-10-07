'use server'

import { prisma } from '@/lib/prisma';
import { ActionResult } from '@/interfaces';
import logger from '@/lib/logger';

export const deleteUserAddress = async (userId: string): Promise<ActionResult> => {
  try {
    const existingAddress = await prisma.userAddress.findUnique({ where: { userId } });

    if (!existingAddress) {
      logger.info(`Intento de eliminar dirección inexistente para usuario ${userId}`);
      return { ok: true, message: 'No existe dirección para eliminar.' };
    }

    await prisma.userAddress.delete({ where: { userId } });
    logger.info(`Dirección eliminada para usuario ${userId}`);

    return { ok: true, message: 'Dirección eliminada correctamente.' };

  } catch (error) {
    logger.error(`Error eliminando dirección del usuario ${userId}: ${error}`);
    return { ok: false, message: 'No se pudo eliminar la dirección del usuario.' };
  }
};