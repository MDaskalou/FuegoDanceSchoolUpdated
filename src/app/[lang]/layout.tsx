// src/app/[lang]/layout.tsx
import type { Metadata } from "next";
import '@/app/globals.css';
import dynamic from "next/dynamic";
import TranslationProvider from "@/i18n/TranslationProvider";
import { Footer } from "@/components/Footer";
import { ContactSection } from "@/components/Contact";
import CookieConsent from "@/components/CookieConsent";

// ... (Metadata och RootLayoutProps är oförändrade) ...

const DynamicNavbar = dynamic(() => import("@/components/Navbar"), {
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
    return (
        <html lang={params.lang}>
        <body>
        <TranslationProvider lang={params.lang}>

            <DynamicNavbar />

            <main>
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