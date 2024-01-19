import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {

   try {
    const token = await getToken({ req: request });

    if(!token){
        console.log("Error: token")
        return NextResponse.rewrite(
            new URL("/auth", request.url)
        );
    }
    
    if(request.nextUrl.pathname === "/customerCloud" && !token){
        return NextResponse.rewrite(
            new URL("/auth", request.url)
        );
    }

   } catch (error) {
    return NextResponse.rewrite(
        new URL("/auth", request.url)
    );
   }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/customerCloud/:path*'],
}
