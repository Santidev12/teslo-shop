'use server'

import { signIn } from '@/auth.config';
import { AuthError } from 'next-auth';
 
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    return 'success'
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.name) {
        case 'CredentialsSignin':
          return 'Las credenciales no son válidas.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export const login = async( email: string, password: string ) => {

  try {
    
    await signIn('credentials', { email, password })

    return { ok: true }

  } catch {

    return {
      ok: false,
      message: 'No se pudo iniciar sesión'
    }
    
  }
}