import { getOrderById } from "@/actions/order/get-order-by-id";
import { PayPalButton, Title } from "@/components";
import { SuccessAnimation } from "@/components/ui/animations/SuccessAnimation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currencyFormatter } from "@/utils";
import Image from "next/image";
import { redirect } from "next/navigation";

type Params = Promise<{ id: string }>;


interface Props {
  params: Params
}

export default async function OrderPage({ params }: Props) {

  const { id } = await params

  // Todo: llamar server action
  const { ok, order } = await getOrderById(id);

  if (!ok) redirect("/");

  const address = order!.OrderAddress;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">

        <Title title={`Orden #${id.split('-').at(-1)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* CheckOut - resumen orden */}
          <Card className="rounded-xl shadow-xl p-6 order-1 sm:order-2">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold my-2">Dirección de entrega</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="mb-8 space-y-1 text-lg">
                <p>{address!.firstName} {address!.lastName}</p>
                <p>{address!.address}</p>
                {address!.address2 && <p>{address!.address2}</p>}
                <p>{address!.postalCode}</p>
                <p>{address!.city}, {address!.countryId}</p>
                <p>{address!.phone}</p>
              </div>

              <Separator className="my-6" />

              <div className="mb-4">
                <h3 className="text-2xl font-semibold mb-2">Resumen de orden</h3>
                <div className="grid grid-cols-2 text-base">
                  <span>Nro. Productos</span>
                  <span className="text-right">
                    {order?.itemsInOrder === 1 ? `1 artículo` : `${order?.itemsInOrder} artículos`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 items-center mb-6">
                <span className="text-2xl font-semibold">Total:</span>
                <span className="text-2xl font-semibold text-right">{currencyFormatter(order!.total)}</span>
              </div>

              {order!.isPaid ? (
                <SuccessAnimation />
              ) : (
                <PayPalButton amount={order!.total} orderId={order!.id} />
              )}
            </CardContent>
          </Card>

          {/* Carrito */}
          <div className="flex flex-col mt-5 order-2 sm:order-1">

            {/* Items */}
            {order?.OrderItem.map(item => (
              <div key={`${item.product.slug} - ${item.size}`} className="flex mb-5">
                <Image
                  src={`/products/${item.product.ProductImage[0].url}`}
                  alt={item.product.title}
                  width={100}
                  height={100}
                  style={{ width: '100px', height: '100px' }}
                  className="mr-5 rounded"
                />

                <div>
                  <p>{item.product.title} - {item.size}</p>
                  <p>${item.price} x {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div >
  );
}