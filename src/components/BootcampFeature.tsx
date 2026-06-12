"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useInView } from "@/hooks/useInView";

interface FeaturedEvent {
    id: number;
    title: string;
    date: string;
    startDate: string;
    location: string;
    link: string;
    description: string | string[];
    imageUrl: string;
    price?: string;
    time?: string;
}

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
    const { ref, inView } = useInView(0.15);
    const allEvents = t("events", { returnObjects: true }) as unknown as FeaturedEvent[];
    const beginnerEvent = Array.isArray(allEvents)
        ? allEvents.find((event) => event.id === 9)
        : undefined;
    const countdown = useCountdown(
        `${beginnerEvent?.startDate ?? "2026-06-27"}T12:00:00`
    );
    const isEnglish = i18n.language.startsWith("en");

    if (!beginnerEvent) return null;

    const description = Array.isArray(beginnerEvent.description)
        ? beginnerEvent.description
        : [beginnerEvent.description];

    return (
        <section
            ref={ref}
            className="relative w-full overflow-hidden bg-transparent py-24 sm:py-32"
        >
            <div
                aria-hidden
                className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px]"
            />

            <div className="container relative mx-auto max-w-7xl px-4">
                <div
                    className={`mb-10 flex items-center gap-3 transition-all duration-700 ${
                        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                    }`}
                >
                    <span className="h-px w-10 bg-orange-500" />
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                        {isEnglish
                            ? "Featured event · June 2026"
                            : "Utvalt event · Juni 2026"}
                    </span>
                </div>

                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    <div
                        className={`relative transition-all duration-1000 ${
                            inView ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                        }`}
                    >
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-[#f8e9d8] shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
                            <Image
                                src={beginnerEvent.imageUrl}
                                alt={beginnerEvent.title}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-contain transition-transform duration-700 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                            <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/60 px-4 py-2 backdrop-blur-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-white">
                                    {isEnglish
                                        ? "No experience required"
                                        : "Inga förkunskaper krävs"}
                                </span>
                            </div>

                            <div className="absolute right-5 top-5 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg">
                                {isEnglish ? "New" : "Nytt"}
                            </div>
                        </div>

                        <div
                            aria-hidden
                            className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-3xl border border-orange-500/20"
                        />
                    </div>

                    <div
                        className={`flex flex-col gap-6 transition-all delay-200 duration-1000 ${
                            inView ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                        }`}
                    >
                        <div>
                            <h2 className="font-serif text-5xl font-extrabold leading-[1.05] text-white sm:text-6xl">
                                {beginnerEvent.title}
                            </h2>
                            <p className="mt-1 font-serif text-3xl italic text-orange-400 sm:text-4xl">
                                {isEnglish
                                    ? "Bachata Sensual · 3 hours"
                                    : "Bachata Sensual · 3 timmar"}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <MetaChip label={beginnerEvent.date} />
                            {beginnerEvent.time && <MetaChip label={beginnerEvent.time} />}
                            <MetaChip label={beginnerEvent.location} />
                            {beginnerEvent.price && <MetaChip label={beginnerEvent.price} />}
                        </div>

                        <ul className="space-y-3">
                            {description.slice(0, 4).map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3 text-sm leading-relaxed text-gray-300 sm:text-base"
                                >
                                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-orange-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="rounded-2xl border border-white/10 bg-[#262626]/90 p-5">
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
                                {isEnglish ? "Starts in" : "Startar om"}
                            </p>
                            <div className="flex gap-4">
                                <CountUnit
                                    value={countdown.days}
                                    label={isEnglish ? "Days" : "Dagar"}
                                />
                                <span className="self-center pb-4 text-2xl font-light text-white/20">:</span>
                                <CountUnit
                                    value={countdown.hours}
                                    label={isEnglish ? "Hours" : "Timmar"}
                                />
                                <span className="self-center pb-4 text-2xl font-light text-white/20">:</span>
                                <CountUnit
                                    value={countdown.minutes}
                                    label={isEnglish ? "Minutes" : "Minuter"}
                                />
                            </div>
                        </div>

                        <Link
                            href={beginnerEvent.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative mt-2 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-orange-500 px-10 py-5 text-base font-black uppercase tracking-widest text-white shadow-[0_0_40px_rgba(249,115,22,0.3)] transition-all duration-300 hover:scale-[1.02] hover:bg-orange-600 hover:shadow-[0_0_60px_rgba(249,115,22,0.5)] active:scale-95 sm:w-auto"
                        >
                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                            <span className="relative z-10">
                                {isEnglish ? "Book your spot" : "Boka din plats"}
                            </span>
                            <svg
                                className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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
        </section>
    );
};

const MetaChip = ({ label }: { label: string }) => (
    <div className="flex items-center rounded-full border border-white/10 bg-[#262626]/90 px-4 py-2 text-xs text-gray-200 backdrop-blur-sm sm:text-sm">
        {label}
    </div>
);

const CountUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
        <span className="tabular-nums text-3xl font-black leading-none text-white sm:text-4xl">
            {String(value).padStart(2, "0")}
        </span>
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-500">
            {label}
        </span>
    </div>
);

export default BootcampFeature;
