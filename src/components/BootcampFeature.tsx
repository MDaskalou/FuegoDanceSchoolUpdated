"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getUpcomingFeaturedEvents, type EventItem } from "@/lib/events";

const parseStartTime = (time?: string) => {
    if (!time) return "18:00:00";
    const match = time.match(/(\d{1,2}):(\d{2})/);
    if (!match) return "18:00:00";
    return `${match[1].padStart(2, "0")}:${match[2]}:00`;
};

const useCountdown = (targetDate: string) => {
    const [timeLeft, setTimeLeft] = React.useState({
        days: 0,
        hours: 0,
        minutes: 0,
    });

    React.useEffect(() => {
        const calc = () => {
            const diff = new Date(targetDate).getTime() - Date.now();

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
            });
        };

        calc();
        const id = setInterval(calc, 60000);
        return () => clearInterval(id);
    }, [targetDate]);

    return timeLeft;
};

export const BootcampFeature = () => {
    const { t, i18n } = useTranslation("eventTranslation");
    const allEvents = t("events", { returnObjects: true }) as unknown as EventItem[];
    const featuredEvents = Array.isArray(allEvents)
        ? getUpcomingFeaturedEvents(allEvents)
        : [];
    const isEnglish = (i18n.language || "sv").startsWith("en");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const autoplay = React.useRef(
        Autoplay({ delay: 7000, stopOnInteraction: true, stopOnMouseEnter: true })
    );

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: featuredEvents.length > 1, align: "start" },
        featuredEvents.length > 1 ? [autoplay.current] : []
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

    if (featuredEvents.length === 0) return null;

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
                            {isEnglish
                                ? "Featured events · August 2026"
                                : "Utvalda event · Augusti 2026"}
                        </span>
                    </div>

                    {featuredEvents.length > 1 && (
                        <div className="hidden items-center gap-2 sm:flex">
                            <button
                                onClick={scrollPrev}
                                aria-label={isEnglish ? "Previous event" : "Föregående event"}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#262626] text-white transition-all duration-200 hover:border-orange-500 hover:bg-orange-500"
                            >
                                <FaChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            <button
                                onClick={scrollNext}
                                aria-label={isEnglish ? "Next event" : "Nästa event"}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#262626] text-white transition-all duration-200 hover:border-orange-500 hover:bg-orange-500"
                            >
                                <FaChevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {featuredEvents.map((event) => (
                            <div key={event.id} className="min-w-0 flex-[0_0_100%]">
                                <FeaturedSlide event={event} isEnglish={isEnglish} />
                            </div>
                        ))}
                    </div>
                </div>

                {featuredEvents.length > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                            onClick={scrollPrev}
                            aria-label={isEnglish ? "Previous event" : "Föregående event"}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#262626] text-white transition-all duration-200 hover:border-orange-500 hover:bg-orange-500 sm:hidden"
                        >
                            <FaChevronLeft className="h-3.5 w-3.5" />
                        </button>

                        <div className="flex justify-center gap-2">
                            {featuredEvents.map((event, index) => (
                                <button
                                    key={event.id}
                                    onClick={() => scrollTo(index)}
                                    aria-label={
                                        isEnglish
                                            ? `Go to event ${index + 1}`
                                            : `Gå till event ${index + 1}`
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
                            onClick={scrollNext}
                            aria-label={isEnglish ? "Next event" : "Nästa event"}
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

const FeaturedSlide = ({
    event,
    isEnglish,
}: {
    event: EventItem;
    isEnglish: boolean;
}) => {
    const countdown = useCountdown(
        `${event.startDate}T${parseStartTime(event.time)}`
    );
    const description = Array.isArray(event.description)
        ? event.description
        : [event.description];
    const imageFit = event.imageFit ?? "cover";

    return (
        <div className="grid grid-cols-1 items-center gap-6 px-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
            <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:mx-0 lg:max-w-[340px]">
                <div
                    className={`relative aspect-[2/3] w-full overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.55)] ${
                        imageFit === "contain" ? "bg-[#f8e9d8]" : "bg-[#1c1c1c]"
                    }`}
                >
                    <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        sizes="(max-width: 1024px) 320px, 340px"
                        className={`${
                            imageFit === "contain" ? "object-contain" : "object-cover"
                        } transition-transform duration-700 hover:scale-105`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                </div>

                <div
                    aria-hidden
                    className="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-2xl border border-orange-500/20"
                />
            </div>

            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="font-serif text-3xl font-extrabold leading-[1.1] text-white sm:text-4xl">
                        {event.title}
                    </h2>
                    {event.subtitle && (
                        <p className="mt-1 font-serif text-xl italic text-orange-400 sm:text-2xl">
                            {event.subtitle}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    <MetaChip label={event.date} />
                    {event.time && <MetaChip label={event.time} />}
                    <MetaChip label={event.location} />
                    {event.price && <MetaChip label={event.price} />}
                </div>

                <ul className="space-y-2">
                    {description.slice(0, 4).map((item, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-300"
                        >
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500" />
                            {item}
                        </li>
                    ))}
                </ul>

                <div className="rounded-xl border border-white/10 bg-[#262626]/90 p-4">
                    <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.25em] text-gray-500">
                        {isEnglish ? "Starts in" : "Startar om"}
                    </p>
                    <div className="flex gap-3">
                        <CountUnit
                            value={countdown.days}
                            label={isEnglish ? "Days" : "Dagar"}
                        />
                        <span className="self-center pb-3 text-xl font-light text-white/20">
                            :
                        </span>
                        <CountUnit
                            value={countdown.hours}
                            label={isEnglish ? "Hours" : "Timmar"}
                        />
                        <span className="self-center pb-3 text-xl font-light text-white/20">
                            :
                        </span>
                        <CountUnit
                            value={countdown.minutes}
                            label={isEnglish ? "Minutes" : "Minuter"}
                        />
                    </div>
                </div>

                <Link
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative mt-1 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-orange-500 px-7 py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_28px_rgba(249,115,22,0.28)] transition-all duration-300 hover:scale-[1.02] hover:bg-orange-600 hover:shadow-[0_0_40px_rgba(249,115,22,0.45)] active:scale-95 sm:w-auto"
                >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative z-10">
                        {isEnglish ? "Book your spot" : "Boka din plats"}
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
    );
};

const MetaChip = ({ label }: { label: string }) => (
    <div className="flex items-center rounded-full border border-white/10 bg-[#262626]/90 px-3 py-1.5 text-[11px] text-gray-200 backdrop-blur-sm sm:text-xs">
        {label}
    </div>
);

const CountUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
        <span className="tabular-nums text-2xl font-black leading-none text-white sm:text-3xl">
            {String(value).padStart(2, "0")}
        </span>
        <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-gray-500">
            {label}
        </span>
    </div>
);

export default BootcampFeature;
