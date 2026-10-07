import { Size } from "@/interfaces"
import clsx from "clsx";

interface Props {
    selectedSize?: Size;
    availableSizes: Size[];

    onSizeChanged: (size: Size) => void;
}

const allSizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export const SizeSelector = ({ selectedSize, availableSizes, onSizeChanged }: Props) => {
  return (
    <div className="my-5">
        <h3 className="font-bold mb-4">Tallas disponibles</h3>

        <div className="flex flex-wrap gap-2">
        {allSizes.map((size) => {
          const isAvailable = availableSizes.includes(size);

          return (
            <button
              key={size}
              onClick={() => onSizeChanged(size)}
              disabled={!isAvailable}
              className={clsx(
                "px-3 py-1 rounded text-sm transition",
                {
                  "text-gray-800 hover:underline border-gray-400 cursor-pointer": isAvailable,
                  "text-gray-400 border-gray-300": !isAvailable,
                  "underline": selectedSize === size && isAvailable,
                }
              )}
            >
              {size}
            </button>
          );
        })}
        </div>
    </div>
  )
}
