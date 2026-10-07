'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

import { setUserAddress, deleteUserAddress } from '@/actions'
import { useAddressStore } from '@/store'
import { Address, Country } from '@/interfaces'

// 🧩 Schema Zod
const addressFormSchema = z.object({
  firstName: z.string().min(3, "El nombre es obligatorio"),
  lastName: z.string().min(3, "El apellido es obligatorio"),
  address: z.string().min(3, "La dirección es obligatoria"),
  address2: z.string().optional(),
  postalCode: z.string().min(2, "El código postal es obligatorio"),
  city: z.string().min(3, "La ciudad es obligatoria"),
  country: z.string().min(2, "El país es obligatorio"),
  phone: z.string().min(3, "El teléfono es obligatorio"),
  rememberAddress: z.boolean().optional().default(false),
})

type AddressFormInputs = z.infer<typeof addressFormSchema>

interface Props {
  countries: Country[];
  userStoreAddress?: Partial<Address>;
}

export const AddressForm = ({ countries, userStoreAddress = {} }: Props) => {
  const router = useRouter()
  const { data: session } = useSession({ required: true })

  const setAddress = useAddressStore(state => state.setAddress)
  const address = useAddressStore(state => state.address)

  const form = useForm({
  resolver: zodResolver(addressFormSchema),
  defaultValues: {
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    postalCode: "",
    city: "",
    country: "",
    phone: "",
    rememberAddress: false,
    ...userStoreAddress,
  },
  mode: "onChange",
});

  const { reset } = form

  useEffect(() => {
    if (address.firstName) {
      reset(address)
    }
  }, [address, reset])

  const onSubmit = (data: AddressFormInputs) => {
    const { rememberAddress, ...rest } = data
    setAddress(rest)

    if (rememberAddress) {
      setUserAddress(rest, session!.user.id)
    } else {
      deleteUserAddress(session!.user.id)
    }

    router.push('/checkout')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombres</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese su nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellidos</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese sus apellidos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese su dirección" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address2"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Dirección 2 (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Apartamento, piso, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código postal</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese código postal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciudad</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese la ciudad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>País</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className='cursor-pointer'>
                    <SelectValue placeholder="[ Seleccione ]" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem className='cursor-pointer' key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese su teléfono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberAddress"
          render={({ field }) => (
            <FormItem className="sm:col-span-2 flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="mb-0 cursor-pointer">¿Recordar dirección?</FormLabel>
            </FormItem>
          )}
        />

        <div className="sm:col-span-2">
          <Button type="submit" disabled={!form.formState.isValid} className="w-full cursor-pointer">
            Siguiente
          </Button>
        </div>

      </form>
    </Form>
  )
}
