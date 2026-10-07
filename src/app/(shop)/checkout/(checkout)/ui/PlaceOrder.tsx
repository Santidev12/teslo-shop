'use client'

import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormatter } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useShallow } from "zustand/shallow";

export const PlaceOrder = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const address = useAddressStore(state => state.address);
  const { totalItems, total } = useCartStore( useShallow((state) => state.getSummaryInformation() ));
  const cart = useCartStore(state => state.cart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);
    setErrorMessage('');

    const productsToOrder = cart.map(product => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    const resp = await placeOrder(productsToOrder, address);

    if (!resp.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(resp.message ?? '');
      return;
    }
    router.replace(`/orders/${resp.order?.id}`);
  };

  if (!loaded) return <p>Cargando...</p>;

  return (
    <div className="rounded-2xl bg-white shadow-xl p-6 space-y-6">
      {/* Dirección */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Dirección de entrega</h2>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>{address.firstName} {address.lastName}</li>
          <li>{address.address}</li>
          {address.address2 && <li>{address.address2}</li>}
          <li>{address.postalCode}</li>
          <li>{address.city}, {address.country}</li>
          <li>{address.phone}</li>
        </ul>
      </section>

      <div className="border-t border-gray-200"></div>

      {/* Resumen de la orden */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Resumen de la orden</h2>
        <div className="flex justify-between text-sm text-gray-700">
          <span>Total de productos:</span>
          <span>{totalItems === 1 ? '1 artículo' : `${totalItems} artículos`}</span>
        </div>
        <div className="flex justify-between text-lg font-medium text-gray-900 mt-4">
          <span>Total a pagar:</span>
          <span>{currencyFormatter(total)}</span>
        </div>
      </section>

      {/* Botón de acción */}
      <div>
        <button
          onClick={onPlaceOrder}
          disabled={isPlacingOrder}
          className={clsx(
            "w-full px-4 py-2 text-white rounded-xl transition cursor-pointer",
            isPlacingOrder
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-black hover:bg-gray-900"
          )}
        >
          {isPlacingOrder ? 'Procesando...' : 'Realizar pedido'}
        </button>

        {errorMessage && (
          <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};
