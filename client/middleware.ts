import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
    matcher: ['/articles/:path*', '/'],
};

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    console.log(token);

    const url = request.nextUrl;
    console.log(url);


    if (
        token &&
        (
            url.pathname === '/' ||
            url.pathname === ''
        )
    ) {
        return NextResponse.redirect(new URL('/articles', request.url));
    }

    if (!token && url.pathname.startsWith('/articles')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}