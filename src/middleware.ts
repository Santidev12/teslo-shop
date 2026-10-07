import NextAuth from 'next-auth';
import { auth, authConfig } from './auth.config';
import { NextRequest, NextResponse } from 'next/server';
 
export default NextAuth(authConfig).auth;

export async function middleware(request: NextRequest){
  const session = await auth();

  if(request.nextUrl.pathname.startsWith("/admin") && session?.user.role !== 'admin'){
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next();
}
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};