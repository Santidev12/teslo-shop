'use client'

import { useCartStore } from '@/store'
import { ProductImage, QuantitySelector } from '@/components'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useShallow } from 'zustand/shallow'
import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const CartItems = () => {

    const [loaded, setLoaded] = useState(false);

    const { cart, updateProductQuantity, deleteProductFromCart } = useCartStore(
        useShallow((state) => ({
            cart: state.cart,
            updateProductQuantity: state.updateProductQuantity,
            deleteProductFromCart: state.deleteProductFromCart,
        }))
    );

    useEffect(() => {
        setLoaded(true)
    }, [])

    if (!loaded) return <p>Cargando...</p>

    return (
        <div className="space-y-8">
            {cart.map((product) => (
                <div key={`${product.slug}-${product.size}`} className="flex gap-6">
                    <ProductImage
                        src={product.image}
                        alt={product.title}
                        width={120}
                        height={120}
                        className="rounded w-[120px] h-[120px] object-cover"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <Link
                                    href={`/product/${product.slug}`}
                                    className="font-semibold text-lg hover:underline"
                                >
                                    {product.title}
                                </Link>
                                <p className="text-muted-foreground text-sm">
                                    Talla: {product.size} | ${product.price}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => deleteProductFromCart(product)}
                                className="text-sm underline text-muted-foreground hover:text-destructive hover:rounded-full"
                            >
                                <XIcon />
                            </Button>
                        </div>

                        <div className="mt-3 w-28">
                            <QuantitySelector
                                quantity={product.quantity}
                                onQuantityChange={(qty) => updateProductQuantity(product, qty)}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
