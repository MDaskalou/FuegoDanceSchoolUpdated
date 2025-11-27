// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Om användaren går till root ("/"), redirecta till /sv
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/sv', request.url));
    }

    // Annars fortsätt som vanligt
    return NextResponse.next();
}

// Konfigurera vilka paths middlewaren ska köras på
export const config = {
    matcher: [
        '/',
        '/((?!_next|api|favicon.ico).*)', // Matcha alla routes utom Next.js internals
    ],
};