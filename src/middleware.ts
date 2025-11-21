// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Dina inställningar
const supportedLngs = ['sv', 'en']
const defaultLng = 'sv'

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // 1. Kolla om URL:en redan har ett språk (t.ex. /sv/...)
    const pathnameHasLocale = supportedLngs.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    // Om den har ett språk, gör ingenting.
    if (pathnameHasLocale) {
        return NextResponse.next()
    }

    // 2. Kolla om sökvägen är för en fil i /public (t.ex. en bild).
    // Om så är fallet, gör ingenting. (Detta är en förbättring)
    if (pathname.includes('.')) { // Filer har oftast en punkt (t.ex. .png)
        return NextResponse.next();
    }

    // 3. Om inget språk finns, omdirigera till standardspråket.
    // Exempel: /instructors -> /sv/instructors
    // Exempel: /            -> /sv
    return NextResponse.redirect(
        new URL(
            `/${defaultLng}${pathname === '/' ? '' : pathname}`, // Bygger den nya URL:en
            request.url // Behåller domänen (localhost:3001)
        )
    )
}

// 4. Konfiguration: Vilka sökvägar ska denna fil köras på?
export const config = {
    matcher: [
        // Kör *inte* på interna filer, API-anrop, eller statiska filer i /public
        '/((?!api|_next/static|_next/image|locales|favicon.ico).*)',
    ],
}