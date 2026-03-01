"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import heroMainImage from "../../public/img/Hero/HeroMain.jpg";
import type { EventItem } from "@/components/Event";

// ─── Event helpers ────────────────────────────────────────────────
const filterUpcomingEvents = (events: EventItem[]): EventItem[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events
        .filter((e) => { const d = new Date(e.startDate); return !Number.isNaN(d.getTime()) && d >= today; })
        .sort((a, b) => {
            const ap = a.priority ?? Infinity, bp = b.priority ?? Infinity;
            if (ap !== bp) return ap - bp;
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        });
};

const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
        day: date.getDate().toString(),
        month: date.toLocaleString("sv-SE", { month: "short" }),
        weekday: date.toLocaleString("sv-SE", { weekday: "long" }),
    };
};

// ─── Component ────────────────────────────────────────────────────
export const Hero = () => {
    const { t, i18n } = useTranslation("heroTranslation");
    const { t: tEvent } = useTranslation("eventTranslation");
    const currentLang = i18n.language;

    const [mounted, setMounted] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);

    // Parallax
    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Event data
    const allEvents = tEvent("events", { returnObjects: true }) as unknown as EventItem[];
    const upcomingEvents = filterUpcomingEvents(Array.isArray(allEvents) ? allEvents : []);
    const nextEvent = upcomingEvents[0] ?? null;
    const formatted = nextEvent ? formatEventDate(nextEvent.startDate) : null;

    // Parallax: bilden rör sig 40% långsammare än scroll
    const parallaxOffset = scrollY * 0.4;

    return (
        <section
            id="heroreel"
            ref={sectionRef}
            className="relative h-[calc(100vh-80px)] w-full overflow-hidden bg-black text-white"
        >
            {/* ── Parallax Background ── */}
            <div
                className="absolute inset-0 z-0 will-change-transform"
                style={{
                    transform: `translateY(${parallaxOffset}px) scale(1.15)`,
                    top: "-7.5%",
                    height: "115%",
                }}
            >
                <Image
                    src={heroMainImage}
                    alt={t("heroImageAlt", { defaultValue: "Dansskola bakgrundsbild" })}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/50 to-black/70 pointer-events-none" />

            {/* ── Main Content ── */}
            <div className="absolute inset-0 z-20 flex h-full w-full flex-col items-center justify-center px-6 text-center">

                {/* Headline — Cormorant Garamond */}
                <h1
                    className={`
                        font-bold tracking-wide text-white
                        text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                        mb-6 leading-[1.1] max-w-4xl
                        [text-shadow:_0_4px_24px_rgb(0_0_0_/_70%)]
                        transition-all duration-1000 ease-out
                        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                    `}
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                    {/* Sista ordet blir kursivt — festivalkänsla */}
                    {t("heroTitle").split(" ").map((word, i, arr) =>
                        i === arr.length - 1
                            ? <em key={i} style={{ fontStyle: "italic" }}> {word}</em>
                            : <span key={i}>{i === 0 ? word : ` ${word}`}</span>
                    )}
                </h1>

                {/* Dekorativ linje med ornament */}
                <div className={`
                    flex items-center gap-4 mb-6
                    transition-all duration-700 delay-300 ease-out
                    ${mounted ? 'opacity-100' : 'opacity-0'}
                `}>
                    <span className="h-px w-16 bg-orange-500/60" />
                    <span className="text-orange-400 text-base">✦</span>
                    <span className="h-px w-16 bg-orange-500/60" />
                </div>

                {/* Subtitle */}
                <p className={`
                    mb-16 max-w-2xl text-sm font-light text-gray-200 drop-shadow-xl
                    sm:text-base md:text-lg
                    tracking-[0.25em] leading-relaxed uppercase
                    [text-shadow:_0_2px_8px_rgb(0_0_0_/_60%)]
                    transition-all duration-1000 delay-200 ease-out
                    ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}>
                    {t("heroSubtitle")}
                </p>

                {/* CTA Group */}
                <div className={`
                    flex flex-col items-center justify-center space-y-8
                    transition-all duration-1000 delay-500 ease-out
                    ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}>
                    <Link
                        href={`/${currentLang}/courses`}
                        className="
                            group relative rounded-full bg-orange-500 px-12 py-5 text-base sm:text-lg font-bold uppercase
                            tracking-wider text-white shadow-2xl transition-all duration-300 w-72
                            hover:bg-orange-600 hover:scale-105 hover:shadow-orange-500/50
                            active:scale-95 overflow-hidden
                        "
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative z-10">{t("heroCtaButton")}</span>
                    </Link>

                    <div className="flex flex-col items-center gap-6 text-center md:flex-row md:gap-12">
                        <Link
                            href={`/${currentLang}/openhouse`}
                            className="group relative text-sm sm:text-base font-semibold uppercase text-white pb-1 transition-all duration-300 hover:text-orange-300"
                        >
                            <span className="relative z-10">{t("heroCtaSecondary1")}</span>
                            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-white/50 transition-all duration-300 group-hover:bg-orange-300 group-hover:h-[3px]" />
                        </Link>

                        <span className="hidden md:block text-white/30 text-2xl font-light">|</span>

                        <Link
                            href={`/${currentLang}/FAQpage`}
                            className="group relative text-sm sm:text-base font-semibold uppercase text-white pb-1 transition-all duration-300 hover:text-orange-300"
                        >
                            <span className="relative z-10">{t("heroCtaSecondary2")}</span>
                            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-white/50 transition-all duration-300 group-hover:bg-orange-300 group-hover:h-[3px]" />
                        </Link>
                    </div>
                </div>

                {/* ── Ny Scroll Indicator ── */}
                <div className={`
                    absolute bottom-8 left-1/2 -translate-x-1/2
                    flex flex-col items-center gap-2
                    transition-opacity duration-1000 delay-[1200ms]
                    ${mounted ? 'opacity-100' : 'opacity-0'}
                `}>
                    <span className="text-[9px] font-bold uppercase tracking-[0.45em] text-white/35">
                        Utforska
                    </span>
                    <div className="flex flex-col items-center -space-y-1.5">
                        {[0, 1, 2].map((i) => (
                            <svg
                                key={i}
                                className="w-5 h-5"
                                style={{
                                    animation: "scrollChevron 1.8s ease-in-out infinite",
                                    animationDelay: `${i * 0.18}s`,
                                    color: `rgba(255,255,255,${0.25 + i * 0.2})`,
                                }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Floating Event Card ── */}
            {nextEvent && formatted && (
                <Link
                    href={nextEvent.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                        group absolute bottom-10 right-6 z-30
                        w-64 sm:w-72 rounded-2xl overflow-hidden
                        border border-white/10
                        shadow-[0_8px_40px_rgba(0,0,0,0.6)]
                        backdrop-blur-md bg-black/40
                        transition-all duration-700 ease-out
                        hover:scale-[1.03] hover:shadow-orange-500/20 hover:border-orange-500/40
                        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                    `}
                    style={{ transitionDelay: '800ms' }}
                >
                    <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-orange-400" />
                    <div className="p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400 mb-2">
                            Kommande event
                        </p>
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-bold text-sm sm:text-base leading-tight line-clamp-2">
                                    {nextEvent.title}
                                </h3>
                                <p className="text-gray-300 text-xs mt-1 capitalize">
                                    {formatted.weekday} {nextEvent.date}
                                </p>
                                <p className="text-gray-400 text-xs truncate mt-0.5">
                                    {nextEvent.location}
                                </p>
                            </div>
                            <div className="flex-shrink-0 flex flex-col items-center justify-center bg-orange-500 rounded-xl w-12 h-12 text-white">
                                <span className="text-[10px] font-semibold uppercase leading-none capitalize">{formatted.month}</span>
                                <span className="text-xl font-extrabold leading-none">{formatted.day}</span>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            {nextEvent.isNew && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
                                    Nytt
                                </span>
                            )}
                            <span className="ml-auto text-[11px] font-semibold uppercase tracking-wider text-white/70 group-hover:text-orange-400 transition-colors duration-300 flex items-center gap-1">
                                Boka nu
                                <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </Link>
            )}

            {/* Keyframes */}
            <style>{`
                @keyframes scrollChevron {
                    0%, 100% { opacity: 0.2; transform: translateY(-4px); }
                    50%       { opacity: 1;   transform: translateY(4px);  }
                }
            `}</style>
        </section>
    );
};

export default Hero;