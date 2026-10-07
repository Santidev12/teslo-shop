import { auth } from "@/auth.config";
import { redirect } from "next/navigation";


export const metadata = {
    title: 'Teslo | Shop',
    description: 'Tienda Virtual',
};

export default async function ShopLayout({
    children
}: {
    children: React.ReactNode;
}) {

    const session = await auth();

    if(session?.user ){
        redirect("/")
    }    

    return (
        <main className="flex justify-center">
            <div className="w-full sm:w-[400px] px-10">
                {children}
            </div>
        </main>
    );
}