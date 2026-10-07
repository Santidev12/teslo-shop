'use client'

import Image from 'next/image'
import { useCartStore } from '@/store'
import { useEffect, useState } from 'react'
import { currencyFormatter } from '@/utils'

export const ProductsInCart = () => {

    const [loaded, setLoaded] = useState(false);
    const productsInCart = useCartStore(state => state.cart)

    useEffect(() => {
        setLoaded(true);
    }, [])

    if (!loaded) {
        return "Cargando..."
    }

    return (
        <>
            {
                productsInCart.map(product => (

                    <div key={`${product.slug}-${product.size}`} className="flex mb-5">
                        <Image
                            src={`/products/${product.image}`}
                            alt={product.title}
                            width={100}
                            height={100}
                            style={{
                                width: '100px',
                                height: '100px'
                            }}
                            className="mr-5 rounded"
                        />

                        <div>
                            <span className="text-sm text-gray-700">
                                {product.title} ({product.size}) — {product.quantity === 1 ? '1 ud' : `${product.quantity} uds`}
                            </span>

                            <p className='font-bold'>{currencyFormatter(product.price * product.quantity)}</p>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
