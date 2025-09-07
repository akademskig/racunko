import { NextRequest, NextResponse } from 'next/server'

const locales = ['en', 'hr']
const defaultLocale = 'en'

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
    // Check if there is any supported locale in the pathname
    const pathname = request.nextUrl.pathname
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        // Get locale from Accept-Language header
        const acceptLanguage = request.headers.get('accept-language')
        let preferredLocale = defaultLocale

        if (acceptLanguage) {
            const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim())
            for (const lang of languages) {
                const locale = lang.split('-')[0] // Extract language code
                if (locales.includes(locale)) {
                    preferredLocale = locale
                    break
                }
            }
        }

        // Redirect to the pathname with the detected locale
        return NextResponse.redirect(
            new URL(`/${preferredLocale}${pathname}`, request.url)
        )
    }
}

export function middleware(request: NextRequest) {
    return getLocale(request)
}

export const config = {
    // Matcher ignoring `/_next/` and `/api/`
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|clients|companies|tax).*)']
}
