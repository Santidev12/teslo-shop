import { Title } from '@/components'
import Link from 'next/link'
import React from 'react'
import { ProductsInCart } from './ui/ProductsInCart'
import { PlaceOrder } from './ui/PlaceOrder'
import { EditIcon } from 'lucide-react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function CheckoutPage() {

  const cookieStore = cookies();
  const pendingOrderId = (await cookieStore).get('pendingOrderId')?.value;

  if (pendingOrderId) {
    redirect(`/orders/${pendingOrderId}`);
  }
  return (
    <div className="flex justify-center items-center h-screen px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">

        <Title title="Verificar orden" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <Link href={"/cart"} className=" underline mb-5 flex items-center">Modificar<EditIcon className='pl-2 w-5 h-5 text-gray-400' /> </Link>

            {/* Items */}

            <ProductsInCart />
          </div>

          {/* CheckOut - resumen orden */}
          <PlaceOrder />


        </div>
      </div>
    </div>
  )
}
