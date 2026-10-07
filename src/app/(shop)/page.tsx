export const revalidate = 60; // 60 segundos

import { getPaginatedProductsWithImage } from "@/actions";
import { ProductGrid, Title, Pagination } from "@/components";
import { redirect } from "next/navigation";

// const products = initialData.products;

type SearchParams = Promise<{ page?: string }>;

interface Props {
  searchParams: SearchParams
}

export default async function Home({ searchParams }: Props) {
  const page = (await searchParams)?.page ? parseInt((await searchParams)?.page ?? '1') : 1;
  const { products, totalPages } = await getPaginatedProductsWithImage({ page });

  if (products.length === 0) {
    redirect("/");
  }

  return (
    <div className="px-5">
      <Title
        title="Tienda"
        subTitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </div>
  );
}
