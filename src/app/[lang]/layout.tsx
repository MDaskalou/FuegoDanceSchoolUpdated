import type { Metadata } from "next";
import { Playfair_Display, Lato, Great_Vibes } from "next/font/google";
import "@/app/globals.css";
import Script from "next/script";
import TranslationProvider from "@/i18n/TranslationProvider";
import { Footer } from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { Navbar } from "@/components/Navbar";
import initTranslations, { APP_NAMESPACES } from "@/i18n";
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
    const GTM_ID = "GTM-5TDBRW66";

    const { resources } = await initTranslations(params.lang, APP_NAMESPACES);

    return (
        <html lang={params.lang} className="scroll-smooth">
            <body
                className={`${playfair.variable} ${lato.variable} ${greatVibes.variable} font-sans bg-[#121212] text-white antialiased`}
            >
                {/* VIKTIGT: Detta script sätter Default Consent till 'denied'.
              strategy="beforeInteractive" garanterar att detta körs INNAN GTM laddas.
            */}
                <Script id="google-consent-mode" strategy="beforeInteractive">
                    {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    
                    // Sätt default till 'denied' för att blockera cookies tills godkännande sker
                    gtag('consent', 'default', {
                        'ad_storage': 'denied',
                        'analytics_storage': 'denied',
                        'ad_user_data': 'denied',
                        'ad_personalization': 'denied',
                        'personalization_storage': 'denied',
                        'functionality_storage': 'granted', // Nödvändiga cookies tillåts
                        'security_storage': 'granted',      // Säkerhetscookies tillåts
                        'wait_for_update': 500
                    });
                `}
                </Script>

                <noscript>
                    <iframe
                        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                    />
                </noscript>

                {/* Google Tag Manager - Main Script */}
                <Script id="google-tag-manager" strategy="afterInteractive">
                    {`
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','${GTM_ID}');
                `}
                </Script>

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
