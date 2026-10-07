import { Title } from "@/components";
import Link from "next/link";
import { CartItems } from "./ui/CartItems";
import { OrderSummary } from "./ui/OrderSummary";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CartPage() {

  const cookieStore = cookies();
  const pendingOrderId = (await cookieStore).get('pendingOrderId')?.value;

  if (pendingOrderId) {
    redirect(`/orders/${pendingOrderId}`);
  }

  return (
    <div className="min-h-screen w-full py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-10">
          <Title title="Carrito" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CartItems />

            <div className="text-sm">
              <span className="text-muted-foreground">¿Deseas seguir comprando?</span>{' '}
              <Link href="/" className="underline">Volver a la tienda</Link>
            </div>
          </div>

          <OrderSummary />
        </div>
      </div>
    </div>
  )
}