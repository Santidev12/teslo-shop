import Image from "next/image"

interface Props {
    src?: string;
    alt: string;
    className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
    style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
    width: number;
    height: number;
}

export const ProductImage = ( { src, alt, className, style, width, height }: Props ) => {
    console.log(src)
    const localSrc = ( src ) 
        ? src.startsWith('http') || src.startsWith('/')
            ? src
            : `/products/${ src }`
        : '/imgs/placeholder.jpg';

    return (
        <Image
            src={ localSrc }
            alt={alt}
            width={ width }
            height={ height }
            className={ className }
            style={ style }
        />
    )
}
