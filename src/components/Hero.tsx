// src/components/HeroSection.tsx
"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
// Swiper imports (Swiper, SwiperSlide, Autoplay, EffectFade) ÄR BORTTAGNA
// Swiper CSS imports ÄR BORTTAGNA

// Konstanter för bilder
const HERO_MAIN_IMAGE_SRC = "/img/Hero/Heromain.jpg"; // NYCKEL: Din enda huvudbild

export const Hero = () => {
    const { t, i18n } = useTranslation("heroTranslation");
    const currentLang = i18n.language;
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    // Den statiska bilden som visas under både SSR och Klient.
    const renderImage = (src: string) => (
        <div className="absolute inset-0 z-0">
            <Image
                src={src}
                alt="Dansskola bakgrundsbild"
                fill
                priority
                sizes="100vw"
                // FIX: Använd object-cover för att fylla hela Hero-sektionen
                className="object-cover object-center opacity-70 md:opacity-60 lg:opacity-50"
            />
        </div>
    );

    // Fallback för Server Side Rendering (SSR)
    if (!isMounted) {
        return (
            <section className="relative h-[calc(100vh-80px)] w-full overflow-hidden bg-black text-white">
                {renderImage(HERO_MAIN_IMAGE_SRC)}
                <div className="absolute inset-0 z-10 bg-black/50"></div>

                {/* SSR INNEHÅLL - Animationer måste vara med för att säkerställa samma DOM */}
                <div className="relative z-20 flex h-full w-full flex-col items-center justify-center px-6 text-center">
                    <h1 className="
                        text-4xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-7xl lg:text-8xl
                        font-greatvibes mb-6 animate-hero-title
                    ">
                        {t("heroTitle")}
                    </h1>
                    <p className="
                        mb-12 max-w-3xl text-lg font-light text-gray-200 drop-shadow-md sm:text-xl md:text-2xl
                        animate-hero-subtitle
                    ">
                        {t("heroSubtitle")}
                    </p>

                    {/* CTA GRUPPEN */}
                    <div className="flex flex-col items-center justify-center space-y-6 animate-hero-cta">
                        <Link
                            href={`/${currentLang}/#courses`}
                            className="rounded-full bg-orange-500 px-10 py-4 text-lg font-bold uppercase tracking-wider text-white shadow-xl transition-all duration-300 w-64 text-center hover:bg-orange-600 hover:scale-[1.03] active:scale-95"
                        >
                            {t("heroCtaButton")}
                        </Link>

                        {/* Sekundära CTA (Textlänkar) */}
                        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:gap-10">
                            <Link
                                href={`/${currentLang}/openhouse`}
                                className="text-sm font-medium uppercase text-white border-b border-white/50 pb-0.5 transition-colors duration-200 hover:text-orange-300 hover:border-orange-300"
                            >
                                {t("heroCtaSecondary1")}
                            </Link>
                            <Link
                                href={`/${currentLang}/FAQpage`}
                                className="text-sm font-medium uppercase text-white border-b border-white/50 pb-0.5 transition-colors duration-200 hover:text-orange-300 hover:border-orange-300"
                            >
                                {t("heroCtaSecondary2")}
                            </Link>
                        </div>
                    </div>
                    {/* SLUT CTA GRUPP */}
                </div>
            </section>
        );
    }

    // Klientrenderad version (när komponenten är mounted)
    return (
        <section
            id="heroreel"
            className="relative h-[calc(100vh-80px)] w-full overflow-hidden bg-black text-white"
        >
            {renderImage(HERO_MAIN_IMAGE_SRC)}

            {/* Overlay */}
            <div className="absolute inset-0 z-10 bg-black/50 pointer-events-none"></div>

            {/* === Innehåll (Med Animering & Förbättrat Avstånd) === */}
            <div className="absolute inset-0 z-20 flex h-full w-full flex-col items-center justify-center px-6 text-center">

                {/* Huvudrubrik - ANIME: Börjar ladda först */}
                <h1 className="
                    text-4xl font-extrabold tracking-tight text-white drop-shadow-2xl sm:text-5xl md:text-7xl lg:text-8xl
                    font-greatvibes mb-6 animate-hero-title
                ">
                    {t("heroTitle")}
                </h1>

                {/* Underrubrik / Måttband - ANIME: Fördröjd start */}
                <p className="
                    mb-12 max-w-3xl text-lg font-light text-gray-200 drop-shadow-xl sm:text-xl md:text-2xl
                    animate-hero-subtitle
                ">
                    {t("heroSubtitle")}
                </p>

                {/* CTA GRUPPEN - ANIME: Sist att laddas + Förbättrat Avstånd */}
                <div className="
                    flex flex-col items-center justify-center space-y-6 animate-hero-cta
                ">

                    {/* Primär CTA (Solid Knapp) */}
                    <Link
                        href={`/${currentLang}/#courses`}
                        className="
                            rounded-full bg-orange-500 px-10 py-4 text-lg font-bold uppercase
                            tracking-wider text-white shadow-xl transition-all duration-300 w-64 text-center
                            hover:bg-orange-600 hover:scale-[1.03] active:scale-95
                        "
                    >
                        {t("heroCtaButton")}
                    </Link>

                    {/* Sekundära CTA (Textlänkar) - Mer Avstånd mellan länkarna */}
                    <div className="flex flex-col items-center gap-4 text-center md:flex-row md:gap-10">
                        <Link
                            href={`/${currentLang}/openhouse`}
                            className="
                                text-sm font-medium uppercase text-white border-b border-white/50 pb-0.5
                                transition-colors duration-200 hover:text-orange-300 hover:border-orange-300
                            "
                        >
                            {t("heroCtaSecondary1")}
                        </Link>
                        <Link
                            href={`/${currentLang}/FAQpage`}
                            className="
                                text-sm font-medium uppercase text-white border-b border-white/50 pb-0.5
                                transition-colors duration-200 hover:text-orange-300 hover:border-orange-300
                            "
                        >
                            {t("heroCtaSecondary2")}
                        </Link>
                    </div>
                </div>
                {/* SLUT CTA GRUPP */}
            </div>
        </section>
    );
};

export default Hero;