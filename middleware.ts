import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request });

    if(!token){
        return NextResponse.rewrite(
            new URL("/", request.url)
        );
    }
    
    if(request.nextUrl.pathname === "/customerCloud" && token && token.role !== "userAdmin"){
        return NextResponse.rewrite(
            new URL("/", request.url)
        );
    }

    if(request.nextUrl.pathname === "/customerFront" && token){
        if(token.role !== "userAdmin" && token.role !== "user"){
            return NextResponse.rewrite(
                new URL("/", request.url)
            );
        }
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/customerCloud/:path*','/customerFront/:path*'],
}
