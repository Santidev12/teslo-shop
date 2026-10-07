'use client'

import { getStockBySlug } from "@/actions/product/get-stock-by-slug";
import { titleFont } from "@/config/fonts"
import { useEffect, useState } from "react";

interface Props {
    slug: string;
}

export const StockLabel = ({ slug }: Props) => {
    const [stock, setStock] = useState(0);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getStock = async () => {
            const inStock = await getStockBySlug(slug);
            setStock(inStock);
            setLoading(false)
        }

        getStock();
    }, [slug])

    return (
        <>
            {loading ? (
                <h1 className={` ${titleFont.className} antialiased font-bold text-xl bg-gray-200 animate-pulse rounded`}>
                    &nbsp;
                </h1>
            ) : (
                <h1 className={` ${titleFont.className} antialiased font-bold text-xl`}>
                    Stock: {stock}
                </h1>
            )}

        </>
    )
}
