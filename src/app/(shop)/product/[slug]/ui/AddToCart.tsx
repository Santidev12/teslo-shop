'use client'
import { QuantitySelector, SizeSelector } from "@/components"
import { CartProduct, Product, Size } from "@/interfaces"
import { useCartStore } from "@/store/cart/cart-store"
import { useState } from "react"

interface Props {
    product: Product
}

export const AddToCart = ({ product }: Props) => {

    const addProductToCart = useCartStore( state => state.addProductToCart)

    const [size, setSize] = useState<Size | undefined>();
    const [quantity, setQuantity] = useState<number>(1);
    const [posted, setPosted] = useState(false);

    const addToCart = () => {
        setPosted(true);
        if (!size) return;

        const cartProduct: CartProduct = {
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            quantity: quantity,
            size: size,
            image: product.images[0]
        }
        
        addProductToCart(cartProduct);
        setPosted(false);
        setQuantity(1);
        setSize(undefined);
    }

    return (
        <>
            {
                (posted && !size) && (
                    <span className="text-red-400 text-sm">
                        Debe de seleccionar una talla*
                    </span>
                )
            }
            {/* Selector de Talla */}
            <SizeSelector
                selectedSize={size}
                availableSizes={product.sizes}
                onSizeChanged={setSize} // => size => setSize(size) 
            />

            {/* Selector de Cantidad */}
            <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
            />

            {/* Button */}
            <button
                onClick={() => addToCart()}
                className="btn-primary my-5 cursor-pointer">
                Agregar al carrito
            </button>
        </>
    )
}
