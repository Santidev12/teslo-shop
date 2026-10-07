'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCartStore } from '@/store'
import { currencyFormatter } from '@/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'

export const OrderSummary = () => {

  const [loaded, setLoaded] = useState(false)
  const { total, totalItems } = useCartStore(
    useShallow((state) => state.getSummaryInformation())
  )

  useEffect(() => {
    setLoaded(true)
  }, [])

  if (!loaded) return <p>Cargando resumen...</p>

  return (
    <Card className="rounded-2xl shadow-lg p-6 max-h-60">
      <CardContent className="p-0 flex flex-col h-full">
        <h2 className="text-xl font-bold mb-4">Resumen de orden</h2>

        <div className="flex justify-between text-sm mb-2">
          <span>Número de productos:</span>
          <span>{totalItems == 1 ? `${totalItems} artículo` : `${totalItems} artículos`}</span>
        </div>

        <div className="flex-grow" />
        <div className="flex justify-between text-base font-semibold border-t pt-4 mt-4">
          <span>Total:</span>
          <span>{currencyFormatter(total)}</span>
        </div>

        <Button asChild className="w-full mt-6">
          <Link href="/checkout/address">Proceder al pago</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
