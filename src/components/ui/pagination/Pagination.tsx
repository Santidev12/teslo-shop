'use client'

import { generatePaginationNumbers } from "@/utils"
import { usePathname, useSearchParams, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import clsx from "clsx"

interface Props {
    totalPages: number
}

export const Pagination = ({ totalPages }: Props) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const pageString = searchParams.get('page') ?? "1"
    const currentPage = isNaN(+pageString) ? 1 : +pageString

    if (currentPage < 1 || isNaN(+pageString)) {
        redirect(pathname)
    }

    const allPages = generatePaginationNumbers(currentPage, totalPages)

    const createPageUrl = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams)

        if (pageNumber === '...') {
            return `${pathname}?${params.toString()}`
        }

        if (+pageNumber <= 0) return pathname
        if (+pageNumber > totalPages) return `${pathname}?${params.toString()}`

        params.set('page', pageNumber.toString())
        return `${pathname}?${params.toString()}`
    }

    return (
        <div className="flex items-center justify-center mt-6 pb-5">
            <div className="flex items-center gap-2">
                {/* Anterior */}
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    disabled={currentPage === 1}
                >
                    <Link href={createPageUrl(currentPage - 1)}>
                        <ChevronLeft className="w-4 h-4" />
                    </Link>
                </Button>

                {/* Paginación */}
                <div className="flex items-center gap-1">
                    {allPages.map((page) => (
                        <Button
                            asChild
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            className={clsx("w-8 h-8 p-0", { "pointer-events-none": page === "..." })}
                        >
                            <Link href={createPageUrl(page)}>{page}</Link>
                        </Button>
                    ))}
                </div>

                {/* Siguiente */}
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    disabled={currentPage === totalPages}
                >
                    <Link href={createPageUrl(currentPage + 1)}>
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}
