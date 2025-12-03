"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const HERO_MAIN_IMAGE_SRC = "/img/Hero/Heromain.jpg";

export const Hero = () => {
    const { t, i18n } = useTranslation("heroTranslation");
    const currentLang = i18n.language;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // En liten fördröjning för att säkerställa att renderingen är stabil innan vi tonar in
        const timer = setTimeout(() => {
            setMounted(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const renderImage = (src: string) => (
        <div className="absolute inset-0 z-0">
            <Image
                src={src}
                alt={t("heroImageAlt", { defaultValue: "Dansskola bakgrundsbild" })}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
            />
        </div>
    );

    return (
        <section
            id="heroreel"
            className="relative h-[calc(100vh-80px)] w-full overflow-hidden bg-black text-white"
        >
            {renderImage(HERO_MAIN_IMAGE_SRC)}

            {/* Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/50 to-black/70 pointer-events-none"></div>

            {/* Innehåll */}
            <div className="absolute inset-0 z-20 flex h-full w-full flex-col items-center justify-center px-6 text-center">

                {/* Huvudrubrik */}
                <h1 className={`
                    text-4xl font-extrabold tracking-wide text-white drop-shadow-2xl
                    sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
                    font-serif mb-8
                    leading-tight max-w-5xl
                    [text-shadow:_0_4px_12px_rgb(0_0_0_/_80%)]
                    transition-all duration-1000 ease-out
                    ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}>
                    {t("heroTitle")}
                </h1>

                {/* Underrubrik - Lite fördröjning (delay-200) */}
                <p className={`
                    mb-20 max-w-3xl text-sm font-light text-gray-200 drop-shadow-xl
                    sm:text-base md:text-lg lg:text-xl
                    tracking-[0.2em] leading-relaxed uppercase
                    [text-shadow:_0_2px_8px_rgb(0_0_0_/_60%)]
                    transition-all duration-1000 delay-200 ease-out
                    ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}>
                    {t("heroSubtitle")}
                </p>

                {/* CTA GRUPPEN - Mer fördröjning (delay-500) */}
                <div className={`
                    flex flex-col items-center justify-center space-y-8
                    transition-all duration-1000 delay-500 ease-out
                    ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}>

                    {/* Primär CTA */}
                    <Link
                        href={`/${currentLang}/courses`}
                        className="
                            group relative rounded-full bg-orange-500 px-12 py-5 text-base sm:text-lg font-bold uppercase
                            tracking-wider text-white shadow-2xl transition-all duration-300 w-72
                            hover:bg-orange-600 hover:scale-105 hover:shadow-orange-500/50
                            active:scale-95 overflow-hidden
                        "
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                        <span className="relative z-10">{t("heroCtaButton")}</span>
                    </Link>

                    {/* Sekundära länkar */}
                    <div className="flex flex-col items-center gap-6 text-center md:flex-row md:gap-12">
                        <Link
                            href={`/${currentLang}/openhouse`}
                            className="
                                group relative text-sm sm:text-base font-semibold uppercase text-white
                                pb-1 transition-all duration-300
                                hover:text-orange-300
                            "
                        >
                            <span className="relative z-10">{t("heroCtaSecondary1")}</span>
                            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-white/50 transition-all duration-300 group-hover:bg-orange-300 group-hover:h-[3px]"></span>
                        </Link>

                        <span className="hidden md:block text-white/30 text-2xl font-light">|</span>

                        <Link
                            href={`/${currentLang}/FAQpage`}
                            className="
                                group relative text-sm sm:text-base font-semibold uppercase text-white
                                pb-1 transition-all duration-300
                                hover:text-orange-300
                            "
                        >
                            <span className="relative z-10">{t("heroCtaSecondary2")}</span>
                            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-white/50 transition-all duration-300 group-hover:bg-orange-300 group-hover:h-[3px]"></span>
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className={`
                    absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce
                    transition-opacity duration-1000 delay-1000
                    ${mounted ? 'opacity-100' : 'opacity-0'}
                `}>
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-white/50 rounded-full"></div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;