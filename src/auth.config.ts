import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from './lib/prisma';
import bcryptjs from 'bcryptjs';

const authenticatedRoutes = [
  "/checkout/address",
]

export const authConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account'
  },

  callbacks: {
    jwt( {token, user }) {
      if( user ){
        token.data = user
      }

      return token;
    },

    session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token.data as any;
      return session;
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = authenticatedRoutes.includes(nextUrl.pathname);
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return true;
      }
      return true;
    },
  },


  providers: [

    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;


        const { email, password } = parsedCredentials.data;

        // Buscar correo
        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
        if (!user) return null;

        // Comparar contraseñas
        if (!bcryptjs.compareSync(password, user.password)) return null;

        // Regresar el usuario sin el password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _password, ...rest } = user;
        return rest;
      },
    }),

  ]
} satisfies NextAuthConfig;

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);