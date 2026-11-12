"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export interface PartnerOffer {
    name: string;
    category: string;
    offer: string;
    code?: string;
    href?: string;
    logo?: string;
    logoSurface?: "dark" | "light";
    showName?: boolean;
}

interface PartnersCarouselProps {
    partners: PartnerOffer[];
    labels: {
        copy: string;
        copied: string;
        visit: string;
        code: string;
        previous: string;
        next: string;
        goTo: string;
    };
}

function PartnerCard({
    partner,
    labels,
}: {
    partner: PartnerOffer;
    labels: PartnersCarouselProps["labels"];
}) {
    const [copied, setCopied] = useState(false);

    const copyCode = async () => {
        if (!partner.code) return;

        try {
            await navigator.clipboard.writeText(partner.code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            setCopied(false);
        }
    };

    const logo = partner.logo ? (
        <div className={`relative mb-5 h-36 overflow-hidden rounded-xl ${partner.logoSurface === "light" ? "bg-white" : "bg-black"}`}>
            <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 80vw, 320px"
            />
        </div>
    ) : null;

    return (
        <article className="flex h-full flex-col rounded-[1.5rem] border border-white/10 bg-[#1c1c1c] p-6">
            {logo}
            <p className="w-fit rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-orange-300">
                {partner.category}
            </p>
            {(!partner.logo || partner.showName) && (
                <h3 className="mt-4 text-2xl font-semibold">{partner.name}</h3>
            )}
            <p className={`${partner.logo ? "mt-4" : "mt-2"} flex-1 text-sm leading-relaxed text-gray-400`}>{partner.offer}</p>

            {partner.code && (
                <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-dashed border-orange-500/40 bg-orange-500/10 px-4 py-3">
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-300">
                            {labels.code}
                        </p>
                        <p className="mt-1 truncate text-base font-semibold tracking-[0.18em] text-white">
                            {partner.code}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={copyCode}
                        className="shrink-0 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-xs font-semibold text-white transition-colors hover:border-orange-500 hover:bg-orange-500"
                    >
                        {copied ? labels.copied : labels.copy}
                    </button>
                </div>
            )}

            {partner.href && (
                <a
                    href={partner.href}
                    target={partner.href.startsWith("http") ? "_blank" : undefined}
                    rel={partner.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="mt-4 text-sm font-semibold text-orange-400 transition-colors hover:text-orange-300"
                >
                    {labels.visit}
                </a>
            )}
        </article>
    );
}

export default function PartnersCarousel({ partners, labels }: PartnersCarouselProps) {
    const autoplay = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
    );

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: partners.length > 1,
            align: "start",
            dragFree: true,
            containScroll: false,
        },
        partners.length > 1 ? [autoplay.current] : []
    );

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [canScroll, setCanScroll] = useState(partners.length > 1);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setCanScroll(emblaApi.canScrollPrev() || emblaApi.canScrollNext());
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

    // Trackpad horizontal swipe + Shift+wheel → scroll carousel left/right
    useEffect(() => {
        if (!emblaApi) return;
        const viewport = emblaApi.rootNode();

        const onWheel = (event: WheelEvent) => {
            const horizontalDelta =
                Math.abs(event.deltaX) > Math.abs(event.deltaY)
                    ? event.deltaX
                    : event.shiftKey
                      ? event.deltaY
                      : 0;

            if (horizontalDelta === 0) return;

            event.preventDefault();
            if (horizontalDelta > 0) emblaApi.scrollNext();
            else emblaApi.scrollPrev();
        };

        viewport.addEventListener("wheel", onWheel, { passive: false });
        return () => viewport.removeEventListener("wheel", onWheel);
    }, [emblaApi]);

    if (partners.length === 0) return null;

    return (
        <div className="relative mt-10">
            {canScroll && (
                <>
                    <button
                        type="button"
                        onClick={scrollPrev}
                        aria-label={labels.previous}
                        className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-x-3 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#262626] text-white shadow-md transition-all duration-200 hover:border-orange-500 hover:bg-orange-500 md:flex"
                    >
                        <FaChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={scrollNext}
                        aria-label={labels.next}
                        className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 translate-x-3 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#262626] text-white shadow-md transition-all duration-200 hover:border-orange-500 hover:bg-orange-500 md:flex"
                    >
                        <FaChevronRight className="h-4 w-4" />
                    </button>
                </>
            )}

            <div
                className="cursor-grab overflow-hidden active:cursor-grabbing md:px-2"
                ref={emblaRef}
            >
                <div className="flex touch-pan-y">
                    {partners.map((partner) => (
                        <div
                            key={partner.name}
                            className="min-w-0 flex-[0_0_85%] pr-4 sm:flex-[0_0_55%] sm:pr-6 lg:flex-[0_0_38%] lg:pr-8"
                        >
                            <PartnerCard partner={partner} labels={labels} />
                        </div>
                    ))}
                </div>
            </div>

            {canScroll && (
                <>
                    <div className="mt-6 flex justify-center gap-4 md:hidden">
                        <button
                            type="button"
                            onClick={scrollPrev}
                            aria-label={labels.previous}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#262626] text-white transition-all duration-200 hover:border-orange-500 hover:bg-orange-500"
                        >
                            <FaChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={scrollNext}
                            aria-label={labels.next}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#262626] text-white transition-all duration-200 hover:border-orange-500 hover:bg-orange-500"
                        >
                            <FaChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="mt-6 flex justify-center gap-2">
                        {partners.map((partner, index) => (
                            <button
                                key={partner.name}
                                type="button"
                                onClick={() => scrollTo(index)}
                                aria-label={`${labels.goTo} ${partner.name}`}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    index === selectedIndex
                                        ? "w-8 bg-orange-500"
                                        : "w-2 bg-white/20 hover:bg-white/40"
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
