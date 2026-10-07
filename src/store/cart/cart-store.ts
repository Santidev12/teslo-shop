import { CartProduct } from "@/interfaces";
import { redirect } from "next/navigation";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface State {
    cart: CartProduct[];

    pendingOrderId: string | null;

    getTotalItems: () => number;
    getSummaryInformation: () => {
        total: number;
        totalItems: number;
    };

    addProductToCart: (product: CartProduct) => void;
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    deleteProductFromCart: (product: CartProduct) => void;

    clearCart: () => void;

    setPendingOrderId: (orderId: string) => void;
    clearPendingOrderId: () => void;
}

export const useCartStore = create<State>()(

    persist(
        (set, get) => ({
            cart: [],
            pendingOrderId: null,


            // methods

            getTotalItems: () => {
                const { cart } = get()

                return cart.reduce((total, item) => total + item.quantity, 0)
            },

            getSummaryInformation: () => {
                const { cart } = get();

                // if (!cart.length) redirect("/empty");

                const total = cart.reduce((total, item) => (item.quantity * item.price) + total, 0);
                const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

                return { total, totalItems }
            },

            addProductToCart: (product: CartProduct) => {
                const { cart } = get()

                // 1. Revisar si el producto existe en el carrito con la talla seleccionada
                const productInCart = cart.some(
                    (item) => item.id === product.id && item.size === product.size
                );

                if (!productInCart) {
                    set({ cart: [...cart, product] })
                    return;
                }

                // 2. Se que el producto existe por talla... tengo que incrementar
                const updatedCartProducts = cart.map((item) => {
                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity: item.quantity + product.quantity }
                    }

                    return item;
                });

                set({ cart: updatedCartProducts })
            },

            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get();

                const updatedProduct = cart.map(item => {

                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity: quantity };
                    }

                    return item;
                })

                set({ cart: updatedProduct });
            },

            deleteProductFromCart: (product: CartProduct) => {
                const { cart } = get();

                const updatedCart = cart.filter(item => item.id !== product.id || item.size !== product.size)

                set({ cart: updatedCart });
                if (updatedCart.length === 0) redirect("/empty");
            },

            clearCart: () => {
                set({ cart: [] })
            },

            setPendingOrderId: (orderId: string) => set({ pendingOrderId: orderId }),
            clearPendingOrderId: () => set({ pendingOrderId: null }),

        }),

        {
            name: 'shopping-cart',
        }
    )
)