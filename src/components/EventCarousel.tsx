"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import {
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaTag,
    FaChevronLeft,
    FaChevronRight,
    FaArrowRight,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { EventItem } from "@/components/Event";

interface EventCarouselProps {
    events: EventItem[];
}

// ─────────────────────────────────────────────
// Portrait Event Card  (tall, image-first)
// ─────────────────────────────────────────────
const PortraitEventCard: React.FC<{ event: EventItem }> = ({ event }) => {
    const { t } = useTranslation("eventTranslation");
    const isExternal =
        event.link &&
        (event.link.startsWith("http://") || event.link.startsWith("https://"));
    const description = Array.isArray(event.description)
        ? event.description.join(" ")
        : event.description;

    return (
        <div className="group relative flex flex-col rounded-3xl overflow-hidden bg-[#1c1c1c] border border-white/8 shadow-2xl h-full transition-transform duration-500 hover:scale-[1.015]">

            {/* ── Image (portrait ratio) ── */}
            <div
                className={`relative w-full overflow-hidden ${event.imageFit === "contain" ? "bg-[#f8e9d8]" : ""}`}
                style={{ aspectRatio: "2/3", minHeight: "260px", maxHeight: "460px" }}
            >
                <Image
                    src={event.imageUrl || "/img/event_placeholder.jpg"}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 90vw, 45vw"
                    className={`${event.imageFit === "contain" ? "object-contain" : "object-cover"} transition-transform duration-700 group-hover:scale-105`}
                />

                {/* Bottom gradient so text floats over image */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-[#1c1c1c]/20 to-transparent" />

                {/* NY badge */}
                {event.isNew && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg tracking-widest uppercase">
                        NY
                    </div>
                )}

                {/* Floating date pill */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/55 backdrop-blur-md border border-white/10 text-white text-sm font-medium px-3 py-1.5 rounded-full">
                    <FaCalendarAlt className="w-3.5 h-3.5 text-orange-400" />
                    {event.date}
                </div>
            </div>

            {/* ── Card body ── */}
            <div className="flex flex-col flex-1 p-6 gap-3">

                {/* Location */}
                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <FaMapMarkerAlt className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                </div>

                {(event.time || event.price) && (
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-300">
                        {event.time && (
                            <span className="flex items-center gap-1.5">
                                <FaClock className="w-3.5 h-3.5 text-orange-500" />
                                {event.time}
                            </span>
                        )}
                        {event.price && (
                            <span className="flex items-center gap-1.5">
                                <FaTag className="w-3.5 h-3.5 text-orange-500" />
                                {event.price}
                            </span>
                        )}
                    </div>
                )}

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-extrabold text-orange-500 leading-tight tracking-tight">
                    {event.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 flex-1">
                    {description}
                </p>

                {/* CTA */}
                <Link
                    href={event.link || "#"}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="
            mt-2 inline-flex items-center justify-center gap-2
            bg-orange-500 hover:bg-orange-600 active:bg-orange-700
            text-white font-bold text-sm px-5 py-3 rounded-2xl
            transition-colors duration-200 shadow-lg shadow-orange-500/20
            group/btn
          "
                >
                    {t("eventsCtaButton", { defaultValue: "Läs mer & Boka" })}
                    <FaArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// Main Carousel
// ─────────────────────────────────────────────
const EventCarousel: React.FC<EventCarouselProps> = ({ events }) => {
    const autoplay = Autoplay({ delay: 5000, stopOnInteraction: true });

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            slidesToScroll: 1,
        },
        [autoplay]
    );

    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback(
        (i: number) => emblaApi?.scrollTo(i),
        [emblaApi]
    );

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

    // 1–2 events → plain grid, no carousel needed
    if (events.length <= 2) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl mx-auto">
                {events.map((event) => (
                    <PortraitEventCard key={event.id} event={event} />
                ))}
            </div>
        );
    }

    return (
        <div className="relative w-full">

            {/* ── Embla viewport with side-mounted arrows ── */}
            <div className="relative">

                {/* Left arrow — vertically centered on the carousel */}
                <button
                    onClick={scrollPrev}
                    aria-label="Föregående event"
                    className="
            absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5
            z-10 hidden md:flex items-center justify-center
            w-11 h-11 rounded-full
            bg-[#262626] border border-white/10 text-white
            hover:bg-orange-500 hover:border-orange-500
            transition-all duration-200 shadow-md
          "
                >
                    <FaChevronLeft className="w-4 h-4" />
                </button>

                {/* Right arrow — vertically centered on the carousel */}
                <button
                    onClick={scrollNext}
                    aria-label="Nästa event"
                    className="
            absolute right-0 top-1/2 -translate-y-1/2 translate-x-5
            z-10 hidden md:flex items-center justify-center
            w-11 h-11 rounded-full
            bg-[#262626] border border-white/10 text-white
            hover:bg-orange-500 hover:border-orange-500
            transition-all duration-200 shadow-md
          "
                >
                    <FaChevronRight className="w-4 h-4" />
                </button>

                {/* Viewport — padding gives room so side arrows don't overlap cards */}
                <div className="overflow-hidden px-2 md:px-8" ref={emblaRef}>
                    <div className="flex gap-6 md:gap-10 touch-pan-y items-stretch">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="flex-none w-[75%] sm:w-[42%] lg:w-[38%] min-w-0"
                            >
                                <PortraitEventCard event={event} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Mobile arrows (centered below, visible only on small screens) ── */}
            <div className="flex md:hidden justify-center gap-4 mt-6">
                <button
                    onClick={scrollPrev}
                    aria-label="Föregående event"
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-[#262626] border border-white/10 text-white hover:bg-orange-500 hover:border-orange-500 transition-all duration-200"
                >
                    <FaChevronLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={scrollNext}
                    aria-label="Nästa event"
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-[#262626] border border-white/10 text-white hover:bg-orange-500 hover:border-orange-500 transition-all duration-200"
                >
                    <FaChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* ── Dot indicators ── */}
            <div className="flex justify-center gap-2 mt-6">
                {events.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollTo(i)}
                        aria-label={`Gå till event ${i + 1}`}
                        className={`
              h-2 rounded-full transition-all duration-300
              ${
                            i === selectedIndex
                                ? "bg-orange-500 w-8"
                                : "bg-white/20 w-2 hover:bg-white/40"
                        }
            `}
                    />
                ))}
            </div>
        </div>
    );
};

export default EventCarousel;
