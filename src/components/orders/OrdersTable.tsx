"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, XCircle, Eye, User, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Order } from "@/interfaces/order.interface"
import { currencyFormatter } from '../../utils/currencyFormatter';

interface Props {
    orders: Order[]
}

const ITEMS_PER_PAGE = 10

const OrdersTable = ({ orders }: Props) => {
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentOrders = orders.slice(startIndex, endIndex)

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    }

    const OrderCard = ({ order, index }: { order: Order; index: number }) => (
        <Card className=" mb-4 hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                            {startIndex + index + 1}
                        </div>
                        <div>
                            <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">#{order.id.split("-").at(-1)}</p>
                            <p className="text-xs text-gray-500 dark:text-white">ID de Orden</p>
                        </div>
                    </div>
                    <Badge
                        variant={order.isPaid ? "default" : "destructive"}
                        className={`flex items-center gap-1 ${order.isPaid
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-200 text-red-800 dark:text-white hover:bg-red-100"
                            }`}
                    >
                        {order.isPaid ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {order.isPaid ? "Pagada" : "Pendiente"}
                    </Badge>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">
                            {order.OrderAddress?.firstName} {order.OrderAddress?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">Cliente</p>
                    </div>
                </div>

                <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors duration-200"
                >
                    <Link href={`/orders/${order.id}`} className="flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        Ver Orden
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )

    const PaginationControls = () => (
        <div className="flex items-center justify-center mt-6 pb-5">
            {/* <div className="text-sm text-gray-600">
                Mostrando {startIndex + 1}-{Math.min(endIndex, orders.length)} de {orders.length} órdenes
            </div> */}

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Anterior</span>
                </Button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(page)}
                            className="w-8 h-8 p-0"
                        >
                            {page}
                        </Button>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )

    return (
        <div className="w-full ">
            <div className="rounded-xl border border-gray-200 bg-white dark:bg-black shadow-sm overflow-hidden">


                {/* Vista de escritorio - Tabla */}
                <div className="hidden md:block overflow-x-auto">
                    <Table className="min-w-[600px]">
                        <TableHeader>
                            <TableRow className="border-gray-100 hover:bg-transparent">
                                <TableHead className="font-semibold text-gray-700 dark:text-white py-4 px-6">ID de Orden</TableHead>
                                <TableHead className="font-semibold text-gray-700 dark:text-white py-4 px-6">Total</TableHead>
                                <TableHead className="font-semibold text-gray-700 dark:text-white py-4 px-6">Estado de Pago</TableHead>
                                <TableHead className="font-semibold text-gray-700 dark:text-white py-4 px-6 text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentOrders.map((order, index) => (
                                <TableRow key={order.id} className="border-gray-100 hover:bg-gray-50/50 dark:hover:bg-stone-900 transition-colors duration-200">
                                    <TableCell className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:text-black font-medium text-sm">
                                                {startIndex + index + 1}
                                            </div>
                                            <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">#{order.id.split("-").at(-1)}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <p className="font-medium text-gray-900 dark:text-white flex ">
                                                {currencyFormatter(order.total)}
                                            </p>
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-4 px-6">
                                        <Badge
                                            variant={order.isPaid ? "default" : "destructive"}
                                            className={`flex items-center gap-2 w-fit ${order.isPaid
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-white hover:bg-green-100"
                                                : "bg-red-100 text-red-800 dark:text-white hover:bg-red-100"
                                                }`}
                                        >
                                            {order.isPaid ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            {order.isPaid ? "Pagada" : "Pendiente"}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="py-4 px-6 text-right">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="dark:bg-white dark:text-black hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors duration-200"
                                        >
                                            <Link href={`/orders/${order.id}`} className="flex items-center gap-2">
                                                <Eye className="w-4 h-4" />
                                                Ver Orden
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Vista móvil - Cards */}
                <div className="md:hidden p-4">
                    {currentOrders.map((order, index) => (
                        <OrderCard key={order.id} order={order} index={index} />
                    ))}
                </div>

                {/* Estado vacío */}
                {orders.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay órdenes</h3>
                        <p className="text-gray-500">Cuando tengas órdenes, aparecerán aquí.</p>
                    </div>
                )}

                {/* Controles de paginación */}
                {orders.length > 0 && <PaginationControls />}
            </div>
        </div>
    )
}

export default OrdersTable
