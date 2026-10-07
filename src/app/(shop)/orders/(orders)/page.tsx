import { getPaginatedOrdersByUser } from '@/actions';
import { Pagination, Title } from '@/components';

import { redirect } from 'next/navigation';
import OrdersTable from '../../../../components/orders/OrdersTable';

interface Props {
  searchParams?: Promise<{ page?: string }>
}

export default async function OrdersPage({ searchParams }: Props) {
  const { page: pageParam } = (await searchParams) ?? {}
  const page = pageParam ? parseInt(pageParam) : 1

  const { ok, orders = [], totalPages } = await getPaginatedOrdersByUser({ page });

  if (!ok) {
    redirect("/auth/login");
  }

  return (
    <div className='flex flex-col mb-10'>
      <Title title="Mis órdenes" />

      <OrdersTable orders={orders} />

    <Pagination totalPages={totalPages} />
    </div>
  );
}