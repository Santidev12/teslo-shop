'use server'
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { auth } from "@/auth.config";

export async function cancelOrder(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "No autorizado." };
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return { ok: false, message: "La orden no existe." };

    const isOwner = order.userId === session.user.id;
    if (!isOwner && session.user.role !== "admin") {
      return { ok: false, message: "No autorizado." };
    }
    if (order.isPaid) {
      return { ok: false, message: "No se puede cancelar una orden ya pagada." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({
        where: { orderId },
      });

      await tx.orderAddress.deleteMany({
        where: { orderId },
      });

      await tx.order.delete({
        where: { id: orderId },
      });
    });

    (await cookies()).delete('pendingOrderId');

    return { ok: true };
  } catch (error) {
    console.error("Error cancelando orden:", error);
    return { ok: false, message: "Error cancelando la orden." };
  }
}
