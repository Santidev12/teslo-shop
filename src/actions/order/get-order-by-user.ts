'use server'

import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

interface Options {
  page?: number
  take?: number
}

export const getPaginatedOrdersByUser = async ({ page = 1, take = 10 }: Options) => {
  const session = await auth()

  if (!session?.user) {
    return {
      ok: false,
      message: 'Debe de estar autenticado',
      orders: [],
      totalPages: 0
    }
  }

  const skip = (page - 1) * take

  const [orders, totalOrders] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        OrderAddress: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.order.count({
      where: { userId: session.user.id }
    })
  ])

  const totalPages = Math.ceil(totalOrders / take)

  return {
    ok: true,
    orders,
    totalPages
  }
}
