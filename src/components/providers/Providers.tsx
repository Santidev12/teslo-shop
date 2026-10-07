'use client'

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "../ui/theme/theme-provider"

interface Props {
    children: React.ReactNode
}

export const Providers = ({ children }: Props) => {

    return (

        <PayPalScriptProvider options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
            intent: 'capture',
            currency: 'USD'
        }}>
            <PayPalButtons style={{ layout: "horizontal" }} />
            <SessionProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </SessionProvider>
        </PayPalScriptProvider>
    )
}