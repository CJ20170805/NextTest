import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { verify } from '@/app/utils/auth';



export async function middleware(request: NextRequest) {
  //console.log('midddleeware', request.headers);

  const token = request.cookies.get('token')?.value;
  

  //console.log('tokkkken:', token);

  if (request.nextUrl.pathname.startsWith('/api/') && request.nextUrl.pathname !== '/api/login') {
    if (token) {

      try {
        const decoded = await verify(token);
        //console.log('decoddee:', decoded);

        if (decoded.payload) {
          return NextResponse.next()
        }
      } catch (error) {
        return new Response(`Token Invalid!!`, {
          status: 401,
        })
      }

    } else {
      return new Response(`Unauthorized`, {
        status: 401,
      })
    }
  }

  if (token) {
    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } else {
    if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }






  // if(token){

  //   let token2 = 'hahahahahxxxxxx'
  //     const requestHeaders = new Headers(request.headers)
  //     requestHeaders.set('Authorization', `Bearer ${token2}`);

  //     const response = NextResponse.next({
  //       request: {
  //         // New request headers
  //         headers: requestHeaders,
  //       },
  //     })

  //     console.log('respspsspsp', response);

  //     return response
  // }



}



export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$).*)'],
}