"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import heroMainImage from "../../public/img/Hero/HeroMain.jpg";
import heroImage9 from "../../public/img/Hero/Heroimg9.jpg";
import heroImage11 from "../../public/img/Hero/Heroimg11.jpg";
import { filterUpcomingEvents, formatEventDate, type EventItem } from "@/lib/events";
import { FaGoogle, FaStar } from "react-icons/fa";

const heroImages = [heroMainImage, heroImage9, heroImage11];

// ─── Component ────────────────────────────────────────────────────
export const Hero = () => {
    const { t, i18n } = useTranslation("heroTranslation");
    const { t: tEvent } = useTranslation("eventTranslation");
    const currentLang = (i18n.language || "sv").startsWith("en") ? "en" : "sv";

    const [scrollY, setScrollY] = useState(0);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setActiveImageIndex((current) => (current + 1) % heroImages.length);
        }, 6500);

        return () => window.clearInterval(interval);
    }, []);

    const heroTitle = String(t("heroTitle", { defaultValue: "Lär dig Bachata i Göteborg" }));
    const titleWords = heroTitle.split(" ").filter(Boolean);
    const allEvents = tEvent("events", { returnObjects: true }) as unknown as EventItem[];
    const upcomingEvents = filterUpcomingEvents(Array.isArray(allEvents) ? allEvents : []);
    const nextEvent = upcomingEvents[0] ?? null;
    const formatted = nextEvent ? formatEventDate(nextEvent.startDate, currentLang === "en" ? "en-US" : "sv-SE") : null;

    const parallaxOffset = scrollY * 0.4;

    return (
        <section
            id="heroreel"
            ref={sectionRef}
            className="relative min-h-[720px] h-[100svh] w-full overflow-hidden bg-black text-white isolate"
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
                {heroImages.map((image, index) => (
                    <Image
                        key={image.src}
                        src={image}
                        alt={t("heroImageAlt", { defaultValue: "Dansskola bakgrundsbild" })}
                        fill
                        priority={index === 0}
                        sizes="100vw"
                        className={`object-cover object-center transition-opacity duration-[1800ms] ease-in-out ${
                            index === activeImageIndex ? "opacity-100" : "opacity-0"
                        }`}
                    />
                ))}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/50 to-black/70 pointer-events-none" />



            {/* ── Main Content ── */}
            <div className="absolute inset-0 z-20 flex h-full w-full flex-col items-center px-5 pt-28 sm:px-6 sm:pt-36 text-center pointer-events-none">
                <h1
                    className={`
                        font-bold tracking-wide text-white
                        text-[2.45rem] sm:text-5xl md:text-6xl xl:text-7xl
                        mb-3 sm:mb-4 leading-[1.15] sm:leading-[1.05] max-w-4xl
                        [text-shadow:_0_4px_24px_rgb(0_0_0_/_70%)]
                        transition-all duration-1000 ease-out
                        opacity-100 translate-y-0
                    `}
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                    {titleWords.map((word, i, arr) =>
                        i === arr.length - 1
                            ? <em key={i} style={{ fontStyle: "italic" }}> {word}</em>
                            : <span key={i}>{i === 0 ? word : ` ${word}`}</span>
                    )}
                </h1>

                <p className={`
                    mb-3 sm:mb-5 text-lg sm:text-2xl md:text-3xl font-light italic text-orange-200
                    [text-shadow:_0_3px_16px_rgb(0_0_0_/_70%)]
                    transition-all duration-1000 delay-150 ease-out
                    opacity-100 translate-y-0
                `}>
                    {t("heroSubtitle", { defaultValue: "En gemenskap, många minnen." })}
                </p>

                <div className={`
                    hidden sm:flex items-center gap-4 mb-5
                    transition-all duration-700 delay-300 ease-out
                    opacity-100 translate-y-0
                `}>
                    <span className="h-px w-16 bg-orange-500/60" />
                    <span className="text-orange-400 text-base">✦</span>
                    <span className="h-px w-16 bg-orange-500/60" />
                </div>

                <p className={`
                    mb-6 sm:mb-9 max-w-2xl text-xs sm:text-base md:text-lg font-light text-gray-200
                    tracking-[0.07em] sm:tracking-[0.16em] leading-relaxed uppercase
                    [text-shadow:_0_2px_8px_rgb(0_0_0_/_60%)]
                    transition-all duration-1000 delay-200 ease-out
                    opacity-100 translate-y-0
                `}>
                    {t("heroDescription", { defaultValue: "Kurser för nybörjare, fortsättare och erfarna dansare." })}
                </p>

                <div className={`
                    flex w-full max-w-xl flex-col items-center justify-center gap-3 sm:gap-4
                    pointer-events-auto
                    transition-all duration-1000 delay-500 ease-out
                    opacity-100 translate-y-0
                `}>
                    <p className="max-w-sm sm:max-w-xl text-xs sm:text-base font-medium normal-case tracking-normal leading-relaxed text-white/80">
                        {t("heroChoiceHint", { defaultValue: "Redo att boka? Välj kurser. Vill du testa först? Kom på öppet hus." })}
                    </p>

                    <div className="flex w-full flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3">
                        <Link
                            href={`/${currentLang}/courses`}
                            className="
                                group relative rounded-full bg-orange-500 px-8 py-3.5 sm:px-12 sm:py-5 text-sm sm:text-base font-bold uppercase
                                tracking-wider text-white shadow-2xl transition-all duration-300 w-full max-w-[19rem] sm:w-72
                                hover:bg-orange-600 hover:scale-105
                            "
                        >
                            <span className="relative z-10">{t("heroCtaButton", { defaultValue: "SE VÅRA KURSER" })}</span>
                        </Link>

                        <Link
                            href={`/${currentLang}/openhouse`}
                            className="
                                rounded-full border border-white/35 bg-black/25 px-8 py-3.5 sm:py-5 text-sm sm:text-base font-bold uppercase
                                tracking-wider text-white backdrop-blur-sm transition-all duration-300 w-full max-w-[19rem] sm:w-72
                                hover:border-orange-400 hover:bg-orange-500/15 hover:text-orange-200 hover:scale-105
                            "
                        >
                            {t("heroCtaSecondary1", { defaultValue: "Anmäl till öppet hus" })}
                        </Link>
                    </div>
                </div>

                <div className={`
                    hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2
                    flex flex-col items-center gap-2
                    transition-opacity duration-1000 delay-[1200ms]
                    opacity-100 translate-y-0
                `}>
                    <span className="text-[9px] font-bold uppercase tracking-[0.45em] text-white/35">{t("exploreLabel")}</span>
                </div>
            </div>

            {/* ── Rating Badges (Desktop) ── */}
            <div
                className={`
                    hidden sm:flex flex-col gap-3
                    absolute bottom-10 left-6 z-30
                    transition-all duration-700 ease-out
                    opacity-100 translate-y-0
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
                        opacity-100 translate-y-0
                    `}
                    style={{ transitionDelay: '800ms' }}
                >
                    <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-orange-400" />
                    <div className="p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400 mb-2">{t("upcomingEventLabel")}</p>
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
                    hidden items-center gap-3
                    absolute bottom-6 left-4 z-30
                    transition-all duration-700 ease-out
                    opacity-100 translate-y-0
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
                        absolute bottom-5 left-4 right-4 z-30
                        rounded-xl overflow-hidden
                        border border-white/10 backdrop-blur-lg bg-black/60
                        shadow-[0_8px_40px_rgba(0,0,0,0.8)]
                        transition-all duration-700 ease-out pointer-events-auto
                        opacity-100 translate-y-0
                    `}
                    style={{ transitionDelay: '800ms' }}
                >
                    <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-orange-400" />
                    <div className="p-3 flex items-center gap-3">
                        <div className="flex-shrink-0 flex flex-col items-center justify-center bg-orange-500 rounded-lg w-12 h-12 text-white shadow-lg">
                            <span className="text-[10px] font-bold uppercase leading-none">{formatted.month}</span>
                            <span className="text-xl font-black leading-none">{formatted.day}</span>
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-1">{t("upcomingEventLabel")}</p>
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
