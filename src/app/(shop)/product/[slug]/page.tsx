export const revalidate = 604800;

import { notFound } from "next/navigation";

import { titleFont } from "@/config/fonts";
import { ProductMobileSlideshow, ProductSlideshow, StockLabel } from "@/components";
import { getProductBySlug } from "@/actions/product/get-product-by-slug";
import { Metadata } from "next";
import { AddToCart } from "./ui/AddToCart";

type Params = Promise<{ slug: string }>;

interface Props {
  params: Params
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  // read route params
  const { slug } = await params

  // fetch data
  const product = await getProductBySlug(slug);

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  return {
    title: product?.title ?? 'Producto no encontrado',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? '',
      images: [`/products/${product?.images[1]}`],
    }
  }
}


export default async function ProductPage({ params }: Props) {

  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  console.log(product.images)

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['/imgs/placeholder.jpg'];

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">


      <div className="col-span-1 md:col-span-2">
        {/* Mobile slideshow */}
        <ProductMobileSlideshow
          title={product.title}
          images={images}
          className="block md:hidden"
        />
        {/* SlideShow */}
        <ProductSlideshow
          title={product.title}
          images={images}
          className="hidden md:block"
        />
      </div>

      {/* Detalles */}
      <div className="col-span-1 px-5">
        <StockLabel slug={product.slug} />
        <h1 className={` ${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>
        <p className="text-lg mb-5">{product.price}</p>

       <AddToCart product={product} />

        {/* Descripcion */}
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">{product.description}</p>
      </div>


    </div>
  );
}