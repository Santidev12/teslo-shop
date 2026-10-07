'use server'

import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

interface Options {
  page?: number
  take?: number
}

export const getPaginatedOrders = async ({ page = 1, take = 10 }: Options) => {
  const session = await auth()

  if (!session?.user || session.user.role !== 'admin') {
    return {
      ok: false,
      message: 'Debe de estar autenticado como administrador',
      orders: [],
      totalPages: 0
    }
  }

  const skip = (page - 1) * take

  const [orders, totalOrders] = await Promise.all([
    prisma.order.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take,
      include: {
        OrderAddress: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    }),
    prisma.order.count()
  ])

  const totalPages = Math.ceil(totalOrders / take)

  return {
    ok: true,
    orders,
    totalPages
  }
}
