import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

export default function EmptyPage() {
  return (
    <div className="flex justify-center items-center h-screen sm:px-4 px-12">
      <Card className="p-10 flex flex-col items-center max-w-md text-center shadow-2xl">
        <IoCartOutline size={80} className="text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="text-muted-foreground mb-6">Parece que aún no has añadido productos.</p>

        <Link href="/">
          <Button size="lg" className="cursor-pointer">Seguir comprando</Button>
        </Link>
      </Card>
    </div>
  );
}