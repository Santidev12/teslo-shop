import { titleFont } from '@/config/fonts'
import Link from 'next/link'
import React from 'react'

export const Footer = () => {
    return (
        <div className='flex w-full justify-center text-xs mb-10'>

            <Link
                href={"/"}
            >
                <span className={` ${titleFont.className} antialiased font-bold`}>Teslo </span>
                <span>| shop</span>
                <span> © {new Date().getFullYear()}</span>
            </Link>

            <Link
                href={"/privacy"}
                className='mx-3'
            >
                Privacidad & Legal
            </Link>

            <a href="#" target="_blank" rel="noopener noreferrer">
                Ubicaciones
            </a>
        </div>
    )
}
