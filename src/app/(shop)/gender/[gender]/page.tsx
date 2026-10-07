export const revalidate = 60; // 60 segundos

import { getPaginatedProductsWithImage } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';
import { Gender } from '@/generated/prisma';

import { redirect } from 'next/navigation';

type Params = Promise<{ gender: string }>;
type SearchParams = Promise<{ page?: string }>

interface Props {
  params: Params
  searchParams: SearchParams
}


export default async function GenderByPage({ params, searchParams }: Props) {
  const { gender } = await params;
  
  const page = (await searchParams).page ? parseInt( (await searchParams).page ?? '1' ) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImage({ 
    page, 
    gender: gender as Gender,
  });


  if ( products.length === 0 ) {
    redirect(`/gender/${ gender }`);
  }
  

  const labels: Record<string, string>  = {
    'men': 'para hombres',
    'women': 'para mujeres',
    'kid': 'para niños',
    'unisex': 'para todos'
  }

  // if ( id === 'kids' ) {
  //   notFound();
  // }


  return (
    <>
      <Title
        title={`Artículos de ${ labels[gender] }`}
        subTitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid 
        products={ products }
      />

      <Pagination totalPages={ totalPages }  />
      
    </>
  );
}