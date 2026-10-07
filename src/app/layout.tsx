import { inter } from "@/config/fonts";

import "./globals.css";
import { Providers } from "@/components";

export const metadata = {
  title: {
    template: '%s - Teslo | Shop',
    default: 'Home - Teslo | Shop',
  },
  description: 'Teslo Shop tienda virtual',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.className}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
