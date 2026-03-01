"use client";

import Image from "next/image";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { useTranslation } from "react-i18next";

// ─── Data ──────────────────────────────────────────────────────────
// Hämta från eventTranslation med id: 6, eller hårdkoda direkt här.
// Vi hårdkodar för tydlighet — byt ut mot t("events")-lookup om du vill.
const bootcamp = {
    title: "Bachata Bootcamp",
    subtitle: "med Victor & Alba",
    origin: "Direkt från Spanien",
    dates: "9–10 maj 2026",
    location: "Fuego Dance School",
    price: "1 200 kr / person · 2 300 kr / par",
    link: "https://app.coursely.se/activity/0h0k5qw0efa0ut5i",
    imageUrl: "/img/Events/BootcampVictorAlba.jpeg",
    bullets: [
        "Autentisk stil, teknik och energi direkt från Spanien",
        "Djupgående teknik & kraftfulla kombinationer",
        "Detaljerad feedback och dynamiska övningar",
        "Öppet för dansare som vill pusha sin nivå på riktigt",
    ],
};

// ─── Countdown helper ──────────────────────────────────────────────
const useCountdown = (targetDate: string) => {
    const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0 });

    React.useEffect(() => {
        const calc = () => {
            const diff = new Date(targetDate).getTime() - Date.now();
            if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0 });
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

import React from "react";

// ─── Component ────────────────────────────────────────────────────
export const BootcampFeature = () => {
    const { ref, inView } = useInView(0.15);
    const countdown = useCountdown("2026-05-09");

    return (
        <section
            ref={ref}
            className="relative w-full overflow-hidden bg-transparent py-24 sm:py-32"
        >


            {/* Orange glow blob */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px]"
            />

            <div className="container relative mx-auto max-w-7xl px-4">

                {/* ── Label ── */}
                <div
                    className={`mb-10 flex items-center gap-3 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                >
                    <span className="h-px w-10 bg-orange-500" />
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                        Utvalt event · Maj 2026
                    </span>
                </div>

                {/* ── Main grid ── */}
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 items-center">

                    {/* LEFT — Image */}
                    <div
                        className={`relative transition-all duration-1000 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
                    >
                        {/* Image frame */}
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
                            <Image
                                src={bootcamp.imageUrl}
                                alt={`${bootcamp.title} ${bootcamp.subtitle}`}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover object-top transition-transform duration-700 hover:scale-105"
                            />
                            {/* Gradient vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* "Från Spanien" badge */}
                            <div className="absolute top-5 left-5 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 backdrop-blur-sm border border-white/10">
                                <span className="text-lg">🇪🇸</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-white">
                                    {bootcamp.origin}
                                </span>
                            </div>

                            {/* isNew badge */}
                            <div className="absolute top-5 right-5 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg">
                                Nytt
                            </div>
                        </div>

                        {/* Decorative offset border */}
                        <div
                            aria-hidden
                            className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-3xl border border-orange-500/20"
                        />
                    </div>

                    {/* RIGHT — Content */}
                    <div
                        className={`flex flex-col gap-6 transition-all duration-1000 delay-200 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
                    >
                        {/* Title */}
                        <div>
                            <h2 className="font-serif text-5xl sm:text-6xl font-extrabold leading-[1.05] text-white">
                                {bootcamp.title}
                            </h2>
                            <p className="mt-1 font-serif text-3xl sm:text-4xl italic text-orange-400">
                                {bootcamp.subtitle}
                            </p>
                        </div>

                        {/* Meta row */}
                        <div className="flex flex-wrap gap-4">
                            <MetaChip icon="📅" label={bootcamp.dates} />
                            <MetaChip icon="📍" label={bootcamp.location} />
                            <MetaChip icon="🎟️" label={bootcamp.price} />
                        </div>

                        {/* Bullets */}
                        <ul className="space-y-3">
                            {bootcamp.bullets.map((b, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-gray-300 leading-relaxed">
                                    <span className="mt-1 flex-shrink-0 h-2 w-2 rounded-full bg-orange-500" />
                                    {b}
                                </li>
                            ))}
                        </ul>

                        {/* Countdown */}
                        <div className="rounded-2xl border border-white/10 bg-[#262626]/90 p-5">
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
                                Startar om
                            </p>
                            <div className="flex gap-4">
                                <CountUnit value={countdown.days} label="Dagar" />
                                <span className="self-center text-2xl font-light text-white/20 pb-4">:</span>
                                <CountUnit value={countdown.hours} label="Timmar" />
                                <span className="self-center text-2xl font-light text-white/20 pb-4">:</span>
                                <CountUnit value={countdown.minutes} label="Minuter" />
                            </div>
                        </div>

                        {/* CTA */}
                        <Link
                            href={bootcamp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                group relative mt-2 w-full sm:w-auto inline-flex items-center justify-center gap-3
                                rounded-full bg-orange-500 px-10 py-5
                                text-base font-black uppercase tracking-widest text-white
                                shadow-[0_0_40px_rgba(249,115,22,0.3)]
                                transition-all duration-300
                                hover:bg-orange-600 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(249,115,22,0.5)]
                                active:scale-95 overflow-hidden
                            "
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            <span className="relative z-10">Boka din plats</span>
                            <svg className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ─── Sub-components ──────────────────────────────────────────────
const MetaChip = ({ icon, label }: { icon: string; label: string }) => (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#262626]/90 px-4 py-2 text-xs sm:text-sm text-gray-200 backdrop-blur-sm">
        <span>{icon}</span>
        <span>{label}</span>
    </div>
);

const CountUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
        <span className="tabular-nums text-3xl sm:text-4xl font-black text-white leading-none">
            {String(value).padStart(2, "0")}
        </span>
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-500">
            {label}
        </span>
    </div>
);

export default BootcampFeature;