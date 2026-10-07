// https://tailwindcomponents.com/component/hoverable-table
import { getPaginatedProductsWithImage } from '@/actions';
import { Pagination, ProductImage, Title } from '@/components';
import { currencyFormatter } from '@/utils';

import Link from 'next/link';

type SearchParams = Promise<{ page?: string }>;

interface Props {
  searchParams: SearchParams
}
//implementar PAGINACION como en productos page
export default async function OrdersPage({ searchParams }: Props) {

  const page = (await searchParams)?.page ? parseInt((await searchParams)?.page ?? '1') : 1;
  const { products, totalPages } = await getPaginatedProductsWithImage({ page });

  return (
    <>
      <Title title="Mantenimiento de productos" />

      <div className='flex justify-end mb-5'>
        <Link href={"/admin/product/new"} className='btn-primary'>
          Nuevo Producto
        </Link>
      </div>

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Imagen
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Titulo
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Precio
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Género
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Inventario
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Tallas
              </th>
            </tr>
          </thead>
          <tbody>
            {
              products.map(product => (
                <tr key={product.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link href={`/product/${product.slug}`}>
                      <ProductImage 
                        src={product.ProductImage[0]?.url} 
                        alt={product.title} 
                        className="w-20 h-20 object-cover rounded" 
                        width={80} 
                        height={80}                      />
                    </Link>
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/product/${product.slug}`}
                      className=' hover:underline'
                    >
                      {product.title}
                    </Link>
                  </td>
                  <td className="text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {currencyFormatter(product.price)}
                  </td>
                  <td className="text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {product.gender}
                  </td>
                  <td className="text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {product.inStock}
                  </td>
                  <td className="text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {product.sizes.join(', ')}
                  </td>
                </tr>
              ))
            }

          </tbody>
        </table>
      </div>

      <Pagination totalPages={totalPages} />
    </>
  );
}