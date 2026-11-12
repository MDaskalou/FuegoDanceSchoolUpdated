"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GIFT_CARD_IMAGE_PATH } from "@/lib/giftCard";

type FeaturedPromo = {
    id: string;
    eyebrowSv: string;
    eyebrowEn: string;
    titleSv: string;
    titleEn: string;
    subtitleSv: string;
    subtitleEn: string;
    imageSrc: string;
    imageAltSv: string;
    imageAltEn: string;
    imageBg: string;
    ctaSv: string;
    ctaEn: string;
    href: (lang: string) => string;
    external?: boolean;
};

const PROMOS: FeaturedPromo[] = [
    {
        id: "intensive",
        eyebrowSv: "Utvalt · Vecka 49–50",
        eyebrowEn: "Featured · Week 49–50",
        titleSv: "2 Week Intensive Course",
        titleEn: "2 Week Intensive Course",
        subtitleSv: "Vecka 49–50 · Alla lektioner 18:30–20:30 · Solo 500 KR · Par 900 KR",
        subtitleEn: "Week 49–50 · All classes 18:30–20:30 · Solo 500 KR · Couple 900 KR",
        imageSrc: "/img/Feature/TwoWeekIntensiveCourse.jpg",
        imageAltSv: "2 Week Intensive Course – Vecka 49–50",
        imageAltEn: "2 Week Intensive Course – Week 49–50",
        imageBg: "bg-[#2a0a0f]",
        ctaSv: "Boka en plats",
        ctaEn: "Book a spot",
        href: (lang) => `/${lang}/courses`,
    },
    {
        id: "gift-card",
        eyebrowSv: "Presentkort",
        eyebrowEn: "Gift card",
        titleSv: "Ge bort dansglädje",
        titleEn: "Share the joy of dance",
        subtitleSv: "Välj valfritt belopp · Gäller kurser, workshops och fester",
        subtitleEn: "Choose any amount · Valid for courses, workshops and parties",
        imageSrc: GIFT_CARD_IMAGE_PATH,
        imageAltSv: "Fuego Dance School presentkort",
        imageAltEn: "Fuego Dance School gift card",
        imageBg: "bg-[#0a1f16]",
        ctaSv: "Köp presentkort",
        ctaEn: "Buy gift card",
        href: (lang) => `/${lang}/gift-card`,
    },
];

export const BootcampFeature = () => {
    const { i18n } = useTranslation();
    const isEnglish = (i18n.language || "sv").startsWith("en");
    const lang = isEnglish ? "en" : "sv";
    const [selectedIndex, setSelectedIndex] = useState(0);
    const autoplay = React.useRef(
        Autoplay({ delay: 7000, stopOnInteraction: true, stopOnMouseEnter: true })
    );

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: PROMOS.length > 1, align: "start" },
        PROMOS.length > 1 ? [autoplay.current] : []
    );

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    const active = PROMOS[selectedIndex] ?? PROMOS[0];

    return (
        <section className="relative w-full overflow-hidden bg-transparent py-14 sm:py-20">
            <div
                aria-hidden
                className="pointer-events-none absolute -top-32 right-0 h-[360px] w-[360px] rounded-full bg-orange-500/10 blur-[100px]"
            />

            <div className="container relative mx-auto max-w-5xl px-4">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-8 bg-orange-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange-500 sm:text-xs">
                            {isEnglish ? active.eyebrowEn : active.eyebrowSv}
                        </span>
                    </div>

                    {PROMOS.length > 1 && (
                        <div className="hidden items-center gap-2 sm:flex">
                            <button
                                type="button"
                                onClick={scrollPrev}
                                aria-label={isEnglish ? "Previous promo" : "Föregående"}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#262626] text-white transition-all duration-200 hover:border-orange-500 hover:bg-orange-500"
                            >
                                <FaChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={scrollNext}
                                aria-label={isEnglish ? "Next promo" : "Nästa"}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#262626] text-white transition-all duration-200 hover:border-orange-500 hover:bg-orange-500"
                            >
                                <FaChevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {PROMOS.map((promo) => {
                            const href = promo.href(lang);
                            const isExternal = Boolean(promo.external);

                            return (
                                <div key={promo.id} className="min-w-0 flex-[0_0_100%]">
                                    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                                        <div
                                            className={`relative aspect-[16/9] w-full overflow-hidden ${promo.imageBg}`}
                                        >
                                            <Image
                                                src={promo.imageSrc}
                                                alt={isEnglish ? promo.imageAltEn : promo.imageAltSv}
                                                fill
                                                priority={promo.id === "intensive"}
                                                sizes="(max-width: 768px) 100vw, 1024px"
                                                className="object-contain object-center"
                                            />
                                        </div>

                                        <div className="flex flex-col items-center gap-4 px-5 py-6 text-center sm:px-8 sm:py-8">
                                            <div>
                                                <h2 className="font-serif text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                                                    {isEnglish ? promo.titleEn : promo.titleSv}
                                                </h2>
                                                <p className="mt-2 text-sm text-gray-300 sm:text-base">
                                                    {isEnglish ? promo.subtitleEn : promo.subtitleSv}
                                                </p>
                                            </div>

                                            <Link
                                                href={href}
                                                target={isExternal ? "_blank" : undefined}
                                                rel={isExternal ? "noopener noreferrer" : undefined}
                                                className="group relative inline-flex w-full max-w-xs items-center justify-center gap-2 overflow-hidden rounded-full bg-orange-500 px-7 py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_28px_rgba(249,115,22,0.28)] transition-all duration-300 hover:scale-[1.02] hover:bg-orange-600 hover:shadow-[0_0_40px_rgba(249,115,22,0.45)] active:scale-95 sm:w-auto"
                                            >
                                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                                <span className="relative z-10">
                                                    {isEnglish ? promo.ctaEn : promo.ctaSv}
                                                </span>
                                                <svg
                                                    className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2.5}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {PROMOS.length > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={scrollPrev}
                            aria-label={isEnglish ? "Previous promo" : "Föregående"}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#262626] text-white transition-all duration-200 hover:border-orange-500 hover:bg-orange-500 sm:hidden"
                        >
                            <FaChevronLeft className="h-3.5 w-3.5" />
                        </button>

                        <div className="flex justify-center gap-2">
                            {PROMOS.map((promo, index) => (
                                <button
                                    key={promo.id}
                                    type="button"
                                    onClick={() => scrollTo(index)}
                                    aria-label={
                                        isEnglish
                                            ? `Go to promo ${index + 1}`
                                            : `Gå till promo ${index + 1}`
                                    }
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        index === selectedIndex
                                            ? "w-6 bg-orange-500"
                                            : "w-1.5 bg-white/20 hover:bg-white/40"
                                    }`}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={scrollNext}
                            aria-label={isEnglish ? "Next promo" : "Nästa"}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#262626] text-white transition-all duration-200 hover:border-orange-500 hover:bg-orange-500 sm:hidden"
                        >
                            <FaChevronRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BootcampFeature;
