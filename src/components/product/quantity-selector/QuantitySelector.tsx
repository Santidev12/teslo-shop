'use client'

import { IoAdd, IoRemove } from "react-icons/io5"

interface Props {
    quantity: number
    onQuantityChange: (quantity: number) => void;
}

export const QuantitySelector = ({ quantity, onQuantityChange }: Props) => {


    const onValueChanged = (value: number) => {

        if (quantity + value < 1) return

        onQuantityChange(quantity + value);

    }

    return (
        <div className="flex items-center space-x-2 bg-muted p-1 rounded-md w-fit">
            <button
                onClick={() => onValueChanged(-1)}
                className="p-2 rounded hover:bg-stone-200 transition cursor-pointer"
                aria-label="Disminuir cantidad"
            >
                <IoRemove size={20} />
            </button>

            <span className="w-10 text-center font-medium">{quantity}</span>

            <button
                onClick={() => onValueChanged(+1)}
                className="p-2 rounded hover:bg-stone-200 transition cursor-pointer"
                aria-label="Aumentar cantidad"
            >
                <IoAdd size={20} />
            </button>
        </div>
    )
}
