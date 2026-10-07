"use client";

import { deleteProductImage } from "@/actions";
import { ProductImage } from "@/components";
import { Category, Product, ProductImage as ProductWithImage } from "@/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  product: Partial<Product> & { ProductImage?: ProductWithImage[] };
  categories: Category[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const formSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().min(0),
  inStock: z.coerce.number().min(0),
  sizes: z.array(z.string()),
  tags: z.string().min(1),
  gender: z.enum(["men", "women", "kid", "unisex"]),
  categoryId: z.string().min(1),
  images: z.any().optional()
});

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();

  const {
    getValues,
    setValue,
    register,
    handleSubmit
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...product,
      tags: product.tags?.join(", ") ?? "",
      sizes: product.sizes ?? [],
      images: undefined,
    },
  });

  const onSizeChanged = (size: string) => {
    const currentSizes = new Set(getValues("sizes"));
    if (currentSizes.has(size)) currentSizes.delete(size);
    else currentSizes.add(size);
    setValue("sizes", Array.from(currentSizes));
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    const { images, ...productToSave } = data;

    if (product?.id) formData.append("id", product.id);

    Object.entries(productToSave).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, value.join(","));
      } else {
        formData.append(key, String(value));
      }
    });

    if (images && images.length) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    const res = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (!result.ok) {
      alert("Producto no se pudo actualizar");
      return;
    }

    router.replace(`/admin/product/${result.product.slug}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="grid px-5 mb-16 grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-4">
          <div>
            <Label className="mb-1">Título</Label>
            <Input {...register("title")} />
          </div>

          <div>
            <Label className="mb-1">Slug</Label>
            <Input {...register("slug")} />
          </div>

          <div>
            <Label className="mb-1">Descripción</Label>
            <Textarea rows={4} {...register("description")} />
          </div>

          <div>
            <Label className="mb-1">Precio</Label>
            <Input type="number" {...register("price", { valueAsNumber: true })} />
          </div>

          <div>
            <Label className="mb-1">Tags</Label>
            <Input {...register("tags")} />
          </div>

          <div>
            <Label className="mb-1">Género</Label>
            <Select {...register("gender")}
              onValueChange={(val) => setValue("gender", val as "men" | "women" | "kid" | "unisex")}
              value={getValues("gender")}
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Seleccione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value="men">Hombre</SelectItem>
                <SelectItem className="cursor-pointer" value="women">Mujer</SelectItem>
                <SelectItem className="cursor-pointer" value="kid">Niño</SelectItem>
                <SelectItem className="cursor-pointer" value="unisex">Unisex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1">Categoría</Label>
            <Select
              onValueChange={(val) => setValue("categoryId", val)}
              defaultValue={getValues("categoryId")}
            >
              <SelectTrigger className="cursor-pointer" id="categoryId">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem className="cursor-pointer" key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <div>
            <Label className="mb-1">Inventario</Label>
            <Input
              type="number"
              {...register('inStock', { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label className="mb-1">Tallas</Label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <Button
                  type="button"
                  key={size}
                  variant={getValues("sizes").includes(size) ? "default" : "outline"}
                  onClick={() => onSizeChanged(size)}
                  className="w-12 justify-center cursor-pointer"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-1">Fotos</Label>
            <Input type="file" multiple {...register("images")} accept="image/png, image/jpeg, image/avif" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.ProductImage?.map((image) => (
              <div key={image.id} className="w-full">
                <ProductImage
                  alt={product.title ?? ''}
                  src={image.url}
                  width={300}
                  height={300}
                  className="w-full h-auto rounded-t-md shadow-md"
                />
                <Button
                  type="button"
                  onClick={() => deleteProductImage(image.id, image.url)}
                  variant="destructive"
                  className="w-full rounded-t-none rounded-b-md cursor-pointer dark:bg-red-900"
                >
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2">
          <Button type="submit" className="w-full cursor-pointer">
            Guardar
          </Button>
        </div>
      </form>

    </>
  );
};
