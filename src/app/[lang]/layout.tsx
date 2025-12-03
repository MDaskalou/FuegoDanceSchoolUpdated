import type { Metadata } from "next";
import { Playfair_Display, Lato, Great_Vibes } from "next/font/google";
import '@/app/globals.css';
import dynamic from "next/dynamic";
import Script from "next/script"; // Behövs för GTM
import TranslationProvider from "@/i18n/TranslationProvider";
import { Footer } from "@/components/Footer";
import { ContactSection } from "@/components/Contact"; // Obs: Ändrade till ContactSection (kolla filnamn om det är Contact.tsx eller ContactSection.tsx)
import CookieConsent from "@/components/CookieConsent";

// --- Typsnitt ---
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

// --- METADATA (SEO) ---
export const metadata: Metadata = {
    title: {
        default: "Fuego Dance School | Bachata i Göteborg",
        template: "%s | Fuego Dance School",
    },
    description: "Lär dig dansa Bachata hos Fuego Dance School i Göteborg. Vi erbjuder kurser för alla nivåer.",
    keywords: ["Bachata", "Dansskola", "Göteborg", "Danskurser", "Bachata Sensual", "Dans", "Fuego"],
    authors: [{ name: "Fuego Dance School" }],
    creator: "Fuego Dance School",
    metadataBase: new URL("https://www.fuegodanceschool.se"),
    openGraph: {
        title: "Fuego Dance School | Bachata i Göteborg",
        description: "Gå med i vår dansfamilj! Bachatakurser för alla nivåer i hjärtat av Göteborg.",
        url: "https://www.fuegodanceschool.se",
        siteName: "Fuego Dance School",
        images: [
            {
                url: "/img/Hero/Heromain.jpg",
                width: 1200,
                height: 630,
                alt: "Fuego Dance School Dansgolv",
            },
        ],
        locale: "sv_SE",
        type: "website",
    },
    icons: {
        icon: "/icon.png",
    },
};

// --- Dynamisk Navbar (Din kod) ---
const DynamicNavbar = dynamic(() => import("@/components/Navbar").then(mod => mod.Navbar), {
    ssr: false,
    loading: () => <div style={{ height: 80, backgroundColor: '#1a1a1a' }}></div>
});

interface RootLayoutProps {
    children: React.ReactNode;
    params: {
        lang: string;
    };
}

export default function RootLayout({
                                       children,
                                       params,
                                   }: RootLayoutProps) {
    const GTM_ID = "GTM-5TDBRW66";

    return (
        <html lang={params.lang} className="scroll-smooth">
        <body className={`${playfair.variable} ${lato.variable} ${greatVibes.variable} font-sans bg-[#121212] text-white antialiased`}>

        {/* Google Tag Manager (noscript) - Ska ligga direkt efter body start */}
        <noscript>
            <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
            />
        </noscript>

        {/* Google Tag Manager (Script) */}
        <Script id="google-tag-manager" strategy="afterInteractive">
            {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
                `}
        </Script>

        <TranslationProvider lang={params.lang}>

            <DynamicNavbar />

            <main className="min-h-screen">
                {children}
            </main>

            {/* GLOBAL CTA */}
            <ContactSection />

            {/* GLOBAL FOOTER */}
            <Footer />

            <CookieConsent />

        </TranslationProvider>
        </body>
        </html>
    );
}