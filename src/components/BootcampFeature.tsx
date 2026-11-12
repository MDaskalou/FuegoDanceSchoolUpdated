"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export const BootcampFeature = () => {
    const { i18n } = useTranslation();
    const isEnglish = (i18n.language || "sv").startsWith("en");
    const lang = isEnglish ? "en" : "sv";

    return (
        <section className="relative w-full overflow-hidden bg-transparent py-14 sm:py-20">
            <div
                aria-hidden
                className="pointer-events-none absolute -top-32 right-0 h-[360px] w-[360px] rounded-full bg-orange-500/10 blur-[100px]"
            />

            <div className="container relative mx-auto max-w-5xl px-4">
                <div className="mb-6 flex items-center gap-3">
                    <span className="h-px w-8 bg-orange-500" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange-500 sm:text-xs">
                        {isEnglish
                            ? "Featured · Week 49–50"
                            : "Utvalt · Vecka 49–50"}
                    </span>
                </div>

                <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#2a0a0f]">
                        <Image
                            src="/img/Feature/TwoWeekIntensiveCourse.jpg"
                            alt={
                                isEnglish
                                    ? "2 Week Intensive Course – Week 49–50"
                                    : "2 Week Intensive Course – Vecka 49–50"
                            }
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 1024px"
                            className="object-contain object-center"
                        />
                    </div>

                    <div className="flex flex-col items-center gap-4 px-5 py-6 text-center sm:px-8 sm:py-8">
                        <div>
                            <h2 className="font-serif text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                                {isEnglish
                                    ? "2 Week Intensive Course"
                                    : "2 Week Intensive Course"}
                            </h2>
                            <p className="mt-2 text-sm text-gray-300 sm:text-base">
                                {isEnglish
                                    ? "Week 49–50 · All classes 18:30–20:30 · Solo 500 KR · Couple 900 KR"
                                    : "Vecka 49–50 · Alla lektioner 18:30–20:30 · Solo 500 KR · Par 900 KR"}
                            </p>
                        </div>

                        <Link
                            href={`/${lang}/courses`}
                            className="group relative inline-flex w-full max-w-xs items-center justify-center gap-2 overflow-hidden rounded-full bg-orange-500 px-7 py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_28px_rgba(249,115,22,0.28)] transition-all duration-300 hover:scale-[1.02] hover:bg-orange-600 hover:shadow-[0_0_40px_rgba(249,115,22,0.45)] active:scale-95 sm:w-auto"
                        >
                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                            <span className="relative z-10">
                                {isEnglish ? "Book a spot" : "Boka en plats"}
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
        </section>
    );
};

export default BootcampFeature;
