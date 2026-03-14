"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import heroMainImage from "../../public/img/Hero/HeroMain.jpg";
import type { EventItem } from "@/components/Event";
import { FaGoogle, FaStar } from "react-icons/fa";

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

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const allEvents = tEvent("events", { returnObjects: true }) as unknown as EventItem[];
    const upcomingEvents = filterUpcomingEvents(Array.isArray(allEvents) ? allEvents : []);
    const nextEvent = upcomingEvents[0] ?? null;
    const formatted = nextEvent ? formatEventDate(nextEvent.startDate) : null;

    const parallaxOffset = scrollY * 0.4;

    return (
        <section
            id="heroreel"
            ref={sectionRef}
            className="relative h-[calc(100vh-80px)] w-full overflow-hidden bg-black text-white isolate"
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
            <div className="absolute inset-0 z-20 flex h-full w-full flex-col items-center justify-center px-6 text-center pointer-events-none">
                <h1
                    className={`
                        font-bold tracking-wide text-white
                        text-3xl sm:text-5xl md:text-6xl lg:text-7xl
                        mb-4 sm:mb-6 leading-[1.2] sm:leading-[1.1] max-w-4xl
                        [text-shadow:_0_4px_24px_rgb(0_0_0_/_70%)]
                        transition-all duration-1000 ease-out
                        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                    `}
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                    {t("heroTitle").split(" ").map((word, i, arr) =>
                        i === arr.length - 1
                            ? <em key={i} style={{ fontStyle: "italic" }}> {word}</em>
                            : <span key={i}>{i === 0 ? word : ` ${word}`}</span>
                    )}
                </h1>

                <div className={`
                    hidden sm:flex items-center gap-4 mb-6
                    transition-all duration-700 delay-300 ease-out
                    ${mounted ? 'opacity-100' : 'opacity-0'}
                `}>
                    <span className="h-px w-16 bg-orange-500/60" />
                    <span className="text-orange-400 text-base">✦</span>
                    <span className="h-px w-16 bg-orange-500/60" />
                </div>

                <p className={`
                    mb-8 sm:mb-16 max-w-2xl text-xs sm:text-base md:text-lg font-light text-gray-200
                    tracking-[0.15em] sm:tracking-[0.25em] leading-relaxed uppercase
                    [text-shadow:_0_2px_8px_rgb(0_0_0_/_60%)]
                    transition-all duration-1000 delay-200 ease-out
                    ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}>
                    {t("heroSubtitle")}
                </p>

                <div className={`
                    flex flex-col items-center justify-center space-y-6 sm:space-y-8
                    pointer-events-auto
                    transition-all duration-1000 delay-500 ease-out
                    ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}>
                    <Link
                        href={`/${currentLang}/courses`}
                        className="
                            group relative rounded-full bg-orange-500 px-10 py-4 sm:px-12 sm:py-5 text-sm sm:text-lg font-bold uppercase
                            tracking-wider text-white shadow-2xl transition-all duration-300 w-64 sm:w-72
                            hover:bg-orange-600 hover:scale-105
                        "
                    >
                        <span className="relative z-10">{t("heroCtaButton")}</span>
                    </Link>

                    <div className="flex flex-row items-center gap-4 sm:gap-12">
                        <Link href={`/${currentLang}/openhouse`} className="text-[10px] sm:text-base font-semibold uppercase text-white pb-1 border-b border-white/30 transition-all hover:text-orange-300">
                            {t("heroCtaSecondary1")}
                        </Link>
                        <span className="text-white/30 text-xl font-light">|</span>
                        <Link href={`/${currentLang}/FAQpage`} className="text-[10px] sm:text-base font-semibold uppercase text-white pb-1 border-b border-white/30 transition-all hover:text-orange-300">
                            {t("heroCtaSecondary2")}
                        </Link>
                    </div>
                </div>

                <div className={`
                    hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2
                    flex flex-col items-center gap-2
                    transition-opacity duration-1000 delay-[1200ms]
                    ${mounted ? 'opacity-100' : 'opacity-0'}
                `}>
                    <span className="text-[9px] font-bold uppercase tracking-[0.45em] text-white/35">Utforska</span>
                </div>
            </div>

            {/* ── Rating Badges (Desktop) ── */}
            <div
                className={`
                    hidden sm:flex flex-col gap-3
                    absolute bottom-10 left-6 z-30
                    transition-all duration-700 ease-out
                    ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                `}
                style={{ transitionDelay: '900ms' }}
            >
                {/* Google */}
                <a
                    href="https://www.google.com/maps/place/FuegoDanceSchool/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 bg-black/55 backdrop-blur-md px-5 py-4 rounded-2xl
                        border border-white/10
                        transition-all duration-300 hover:scale-[1.03] hover:bg-black/65 hover:border-white/25
                        shadow-[0_4px_24px_rgba(0,0,0,0.6)] w-56"
                >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-md">
                        <FaGoogle className="text-[#4285F4] text-lg" />
                    </div>
                    <div className="flex flex-col items-start leading-none gap-1.5">
                        <span className="text-[11px] text-white/50 font-semibold uppercase tracking-wider">Google</span>
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                            <span className="text-white text-base font-extrabold ml-1.5">4.9</span>
                        </div>
                    </div>
                </a>

                {/* Trustpilot */}
                <a
                    href="https://se.trustpilot.com/review/fuegodanceschool.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 bg-black/55 backdrop-blur-md px-5 py-4 rounded-2xl
                        border border-white/10
                        transition-all duration-300 hover:scale-[1.03] hover:bg-black/65 hover:border-white/25
                        shadow-[0_4px_24px_rgba(0,0,0,0.6)] w-56"
                >
                    <div className="w-10 h-10 bg-[#00B67A] rounded-full flex items-center justify-center shrink-0 shadow-md">
                        <FaStar className="text-white text-lg" />
                    </div>
                    <div className="flex flex-col items-start leading-none gap-1.5">
                        <span className="text-[11px] text-white/50 font-semibold uppercase tracking-wider">Trustpilot</span>
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < 4 ? 'text-[#00B67A]' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                            <span className="text-white text-base font-extrabold ml-1.5">4.5</span>
                        </div>
                    </div>
                </a>
            </div>

            {/* ── Floating Event Card (Desktop) ── */}
            {nextEvent && formatted && (
                <Link
                    href={nextEvent.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                        group hidden sm:block absolute bottom-10 right-6 z-30
                        w-72 rounded-2xl overflow-hidden
                        border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)]
                        backdrop-blur-md bg-black/40
                        transition-all duration-700 ease-out
                        hover:scale-[1.03] hover:shadow-orange-500/20 hover:border-orange-500/40
                        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                    `}
                    style={{ transitionDelay: '800ms' }}
                >
                    <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-orange-400" />
                    <div className="p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400 mb-2">Kommande event</p>
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-bold text-sm sm:text-base leading-tight line-clamp-2">{nextEvent.title}</h3>
                                <p className="text-gray-300 text-xs mt-1 capitalize">{formatted.weekday} {nextEvent.date}</p>
                                <p className="text-gray-400 text-xs truncate mt-0.5">{nextEvent.location}</p>
                            </div>
                            <div className="flex-shrink-0 flex flex-col items-center justify-center bg-orange-500 rounded-xl w-12 h-12 text-white">
                                <span className="text-[10px] font-semibold uppercase leading-none">{formatted.month}</span>
                                <span className="text-xl font-extrabold leading-none">{formatted.day}</span>
                            </div>
                        </div>
                    </div>
                </Link>
            )}

            {/* ── Rating Badges (Mobil) ── */}
            <div
                className={`
                    flex sm:hidden items-center gap-3
                    absolute bottom-6 left-4 z-30
                    transition-all duration-700 ease-out
                    ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                `}
                style={{ transitionDelay: '900ms' }}
            >
                {/* Google */}
                <a
                    href="https://www.google.com/maps/place/FuegoDanceSchool/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl
                        border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                >
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0">
                        <FaGoogle className="text-[#4285F4] text-xs" />
                    </div>
                    <div className="flex flex-col leading-none gap-1">
                        <span className="text-[9px] text-white/50 font-semibold uppercase tracking-wider">Google</span>
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-2.5 h-2.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                            <span className="text-white text-xs font-extrabold ml-1">4.9</span>
                        </div>
                    </div>
                </a>

                {/* Trustpilot */}
                <a
                    href="https://se.trustpilot.com/review/fuegodanceschool.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl
                        border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                >
                    <div className="w-6 h-6 bg-[#00B67A] rounded-full flex items-center justify-center shrink-0">
                        <FaStar className="text-white text-xs" />
                    </div>
                    <div className="flex flex-col leading-none gap-1">
                        <span className="text-[9px] text-white/50 font-semibold uppercase tracking-wider">Trustpilot</span>
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-2.5 h-2.5 ${i < 4 ? 'text-[#00B67A]' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                            <span className="text-white text-xs font-extrabold ml-1">4.5</span>
                        </div>
                    </div>
                </a>
            </div>

            {/* ── Floating Event Card (Mobil) ── */}
            {nextEvent && formatted && (
                <Link
                    href={nextEvent.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                        group block sm:hidden
                        absolute bottom-24 left-4 right-4 z-30
                        rounded-xl overflow-hidden
                        border border-white/10 backdrop-blur-lg bg-black/60
                        shadow-[0_8px_40px_rgba(0,0,0,0.8)]
                        transition-all duration-700 ease-out pointer-events-auto
                        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                    `}
                    style={{ transitionDelay: '800ms' }}
                >
                    <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-orange-400" />
                    <div className="p-4 flex items-center gap-4">
                        <div className="flex-shrink-0 flex flex-col items-center justify-center bg-orange-500 rounded-lg w-14 h-14 text-white shadow-lg">
                            <span className="text-[10px] font-bold uppercase leading-none">{formatted.month}</span>
                            <span className="text-2xl font-black leading-none">{formatted.day}</span>
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-1">Kommande event</p>
                            <h3 className="text-white font-bold text-sm leading-tight line-clamp-1 italic">
                                {nextEvent.title}
                            </h3>
                            <p className="text-gray-300 text-xs mt-1 truncate">
                                {formatted.weekday} • {nextEvent.location}
                            </p>
                        </div>
                        <div className="text-white/40">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </Link>
            )}

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