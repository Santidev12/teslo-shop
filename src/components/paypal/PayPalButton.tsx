'use client'

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import type { CreateOrderData, CreateOrderActions, OnApproveActions, OnApproveData } from "@paypal/paypal-js";
import { paypalCheckPayment } from "@/actions/payments/paypal-check-payment";
import { useCartStore } from "@/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { cancelOrder } from "@/actions/order/cancelOrder";

interface Props {
    orderId: string;
    amount: number;
}

export const PayPalButton = ({ orderId, amount }: Props) => {
    const [{ isPending }] = usePayPalScriptReducer();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);
    const clearCart = useCartStore(state => state.clearCart);
    const clearPendingOrderId = useCartStore(state => state.clearPendingOrderId);

    const roundedAmount = (Math.round(amount * 100) / 100).toFixed(2);

    if (isPending) {
        return (
            <div className="animate-pulse mb-16">
                <div className="h-11 bg-gray-400 rounded " />
                <div className="h-11 bg-gray-400 rounded mt-3" />
            </div>
        );
    }

    const createOrder = async (data: CreateOrderData, actions: CreateOrderActions) => {
        // Usamos el orderId recibido por props para enlazar la orden local con PayPal
        const transactionId = await actions.order.create({
            purchase_units: [
                {
                    invoice_id: orderId,
                    amount: {
                        currency_code: 'USD',
                        value: roundedAmount,
                    },
                },
            ],
            intent: "CAPTURE",
        });

        return transactionId;
    };

    const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
        setIsPlacingOrder(true);
        setErrorMessage('');
        try {
            const details = await actions.order?.capture();
            if (!details?.id) throw new Error("No se pudo capturar el pago");

            // Verifica el pago en el backend y actualiza la orden
            const resp = await paypalCheckPayment(details.id);

            if (!resp.ok) {
                throw new Error(resp.message || "Error al verificar el pago");
            }

            clearCart();
            router.replace(`/orders/${orderId}`);
        } catch (error) {
            console.error(error);
            setErrorMessage(`Error procesando el pago. ${error}`);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const handleCancelOrder = async () => {
        setLoadingCancel(true);
        setErrorMessage('');
        const canceledOrder = await cancelOrder(orderId)
        if (!canceledOrder.ok) {
            setErrorMessage('Error al cancelar la orden')
        }

        clearPendingOrderId();
        router.replace('/cart');
    };

    return (
        <>
            <div className="relative z-0">
                <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    disabled={isPlacingOrder}
                />
            </div>

            <div className="flex justify-center mt-5">
                <Button
                    variant="ghost"
                    onClick={handleCancelOrder}
                    disabled={loadingCancel}
                    className="rounded px-4 py-2 mt-4 underline cursor-pointer font-light"
                >
                    {loadingCancel ? "Cancelando..." : "Cancelar orden"}
                </Button>

                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            </div>
        </>
    );
};
