import type { Metadata } from "next";
import { Playfair_Display, Lato, Great_Vibes } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "@/app/globals.css";
import Script from "next/script";
import TranslationProvider from "@/i18n/TranslationProvider";
import { Footer } from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { Navbar } from "@/components/Navbar";
import initTranslations, { APP_NAMESPACES } from "@/i18n";
import { GTM_ID } from "@/lib/gtm";
import { buildRootMetadata } from "@/lib/seo";

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
});

const lato = Lato({
    weight: ["300", "400", "700"],
    subsets: ["latin"],
    variable: "--font-lato",
    display: "swap",
});

const greatVibes = Great_Vibes({
    weight: ["400"],
    subsets: ["latin"],
    variable: "--font-greatvibes",
    display: "swap",
});

export async function generateMetadata({
    params,
}: {
    params: { lang: string };
}): Promise<Metadata> {
    return buildRootMetadata({ lang: params.lang });
}

interface RootLayoutProps {
    children: React.ReactNode;
    params: {
        lang: string;
    };
}

export default async function RootLayout({
    children,
    params,
}: RootLayoutProps) {
    const { resources } = await initTranslations(params.lang, APP_NAMESPACES);

    return (
        <html lang={params.lang} className="scroll-smooth">
            <GoogleTagManager gtmId={GTM_ID} />
            <body
                className={`${playfair.variable} ${lato.variable} ${greatVibes.variable} font-sans bg-[#121212] text-white antialiased`}
            >
                {/* Default consent måste sättas innan GTM. beforeInteractive körs före afterInteractive i GoogleTagManager. */}
                <Script id="google-consent-mode" strategy="beforeInteractive">
                    {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}

                    gtag('consent', 'default', {
                        'ad_storage': 'denied',
                        'analytics_storage': 'denied',
                        'ad_user_data': 'denied',
                        'ad_personalization': 'denied',
                        'personalization_storage': 'denied',
                        'functionality_storage': 'granted',
                        'security_storage': 'granted',
                        'wait_for_update': 500
                    });

                    gtag('js', new Date());
                `}
                </Script>

                {/*
                  Noscript-innehåll parsas inte som DOM när JS är på.
                  dangerouslySetInnerHTML gör att server och klient renderar samma sträng
                  och undviker hydration mismatch på iframe-elementet.
                */}
                <noscript
                    dangerouslySetInnerHTML={{
                        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
                    }}
                />

                <TranslationProvider
                    namespaces={APP_NAMESPACES}
                    resources={resources}
                    lang={params.lang}
                >
                    <Navbar />

                    <main className="min-h-screen">{children}</main>

                    <Footer />
                    <CookieConsent />
                </TranslationProvider>
            </body>
        </html>
    );
}
