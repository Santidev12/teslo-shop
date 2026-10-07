import { Title } from '@/components';
import { AddressForm } from './ui/AddressForm';
import { getCountries, getUserAddress } from '@/actions';
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function AddressPage() {

  const countries = await getCountries();

  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  const cookieStore = cookies();
  const pendingOrderId = (await cookieStore).get('pendingOrderId')?.value;

  if (pendingOrderId) {
    redirect(`/orders/${pendingOrderId}`);
  }

  const userAddress = await getUserAddress(session.user.id) ?? undefined;


  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">

      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">

        <Title title="Dirección" subTitle="Dirección de entrega" />

        <AddressForm countries={countries} userStoreAddress={userAddress.data ?? undefined} />

      </div>


    </div>
  );
}