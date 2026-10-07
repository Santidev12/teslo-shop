'use client'

import { authenticate } from '@/actions';
import clsx from 'clsx';
import Link from 'next/link'
import React, { useActionState, useEffect } from 'react'
import { IoAlertCircle } from 'react-icons/io5';

export const LoginForm = () => {

    const [state, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    useEffect(() => {
        if (state === 'success') {
            window.location.replace("/")
        }
    }, [state])


    return (
        <form action={formAction} className="flex flex-col">

            <label htmlFor="email">Correo electrónico</label>
            <input
                id="email"
                className="px-5 py-2 border bg-gray-200 text-gray-900 placeholder:text-gray-500 rounded mb-5"
                type="email"
                name='email'
                autoComplete="email"
            />


            <label htmlFor="password">Contraseña</label>
            <input
                id="password"
                className="px-5 py-2 border bg-gray-200 text-gray-900 placeholder:text-gray-500 rounded mb-5"
                type="password"
                name='password'
                autoComplete="current-password"
            />

            <button
                type='submit'
                disabled={isPending}
                className={clsx({
                    "btn-primary": !isPending,
                    "btn-disabled": isPending
                })}>
                Ingresar
            </button>


            {/* divisor line */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/new-account"
                className="btn-secondary text-center">
                Crear una nueva cuenta
            </Link>

            <div
                className="flex justify-center items-center mt-5"
            >
                {state && state !== 'success' && (
                    <>
                        <IoAlertCircle className="h-5 w-5 text-red-500 pr-2" />
                        <p className="text-sm text-red-500">{state}</p>
                    </>
                )}
            </div>
        </form>
    )
}
