'use client'

import { logout } from '@/actions'
import { useAddressStore, useCartStore, useUIStore } from '@/store'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import {
    IoLogInOutline,
    IoLogOutOutline,
    IoPeopleOutline,
    IoPersonOutline,
    IoShirtOutline,
    IoTicketOutline
} from 'react-icons/io5'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'

export const Sidebar = () => {
    const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen)
    const closeMenu = useUIStore(state => state.closeSideMenu)
    const clearAddress = useAddressStore(state => state.clearAddress)
    const clearCart = useCartStore(state => state.clearCart)

    const onLogout = async () => {
        await logout()
        clearAddress()
        clearCart()
    }

    const { data: session } = useSession()
    const isAuthenticated = !!session?.user
    const isAdmin = session?.user.role === 'admin'

    return (
        <Sheet open={isSideMenuOpen} onOpenChange={(open) => !open && closeMenu()}>
            <SheetContent side="right" className="w-[500px] p-6">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-semibold text-primary">Menú</SheetTitle>
                </SheetHeader>

                <nav className="mt-8 flex flex-col gap-6">

                    {/* Sección cuenta */}
                    {isAuthenticated && (
                        <div>
                            <p className="text-muted-foreground text-sm font-medium mb-2">Cuenta</p>
                            <div className="flex flex-col gap-2">
                                <Link
                                    onClick={closeMenu}
                                    href="/profile"
                                    className="flex items-center p-2 hover:bg-muted rounded-md transition"
                                >
                                    <IoPersonOutline size={20} />
                                    <span className="ml-3">Perfil</span>
                                </Link>

                                <Link
                                    onClick={closeMenu}
                                    href="/orders"
                                    className="flex items-center p-2 hover:bg-muted rounded-md transition"
                                >
                                    <IoTicketOutline size={20} />
                                    <span className="ml-3">Órdenes</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Admin */}
                    {isAuthenticated && isAdmin && (
                        <div>
                            <p className="text-sm font-medium text-blue-600 mb-2">Admin</p>
                            <div className="flex flex-col gap-2">
                                <Link
                                    onClick={closeMenu}
                                    href="/admin/products"
                                    className="flex items-center p-2 hover:bg-muted rounded-md transition"
                                >
                                    <IoShirtOutline size={20} />
                                    <span className="ml-3">Productos</span>
                                </Link>
                                <Link
                                    onClick={closeMenu}
                                    href="/admin/orders"
                                    className="flex items-center p-2 hover:bg-muted rounded-md transition"
                                >
                                    <IoTicketOutline size={20} />
                                    <span className="ml-3">Órdenes</span>
                                </Link>
                                <Link
                                    onClick={closeMenu}
                                    href="/admin/users"
                                    className="flex items-center p-2 hover:bg-muted rounded-md transition"
                                >
                                    <IoPeopleOutline size={20} />
                                    <span className="ml-3">Usuarios</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Sesión */}
                    <div>
                        <p className="text-muted-foreground text-sm font-medium mb-2">Sesión</p>
                        <div className="flex flex-col gap-2">
                            {isAuthenticated ? (
                                <Link
                                    onClick={async () => {
                                        await onLogout()
                                        closeMenu()
                                        window.location.replace('/')
                                    }}
                                    href="/"
                                    className="flex items-center p-2 hover:bg-muted rounded-md transition text-red-600"
                                >
                                    <IoLogOutOutline size={20} />
                                    <span className="ml-3">Salir</span>
                                </Link>
                            ) : (
                                <Link
                                    onClick={closeMenu}
                                    href="/auth/login"
                                    className="flex items-center p-2 hover:bg-muted rounded-md transition"
                                >
                                    <IoLogInOutline size={20} />
                                    <span className="ml-3">Ingresar</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    )
}
