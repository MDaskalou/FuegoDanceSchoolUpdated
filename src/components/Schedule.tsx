// src/components/ScheduleSection.tsx
"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";

interface Course {
    dayKey: string;
    time: string;
    name: string;
    instructors: string;
    noteKey?: string;
    isNew: boolean;
    isDropIn: boolean;
}

// --- Återanvändbar Klasskomponent ---
const ScheduleItem = ({ time, name, instructors, note, isNew = false, isDropIn = false }: {
    time: string;
    name: string;
    instructors: string;
    note?: string;
    isNew?: boolean;
    isDropIn?: boolean;
}) => (
    <div className={`
        /* Bas-styling: Nu identisk för ALLA kort */
        bg-white/5 border-orange-500/30 p-4 rounded-xl text-center relative shadow-lg backdrop-blur-sm border
        transition-all duration-300 transform 
        
        /* Hovring: Samma för alla */
        hover:scale-[1.02] hover:bg-orange-500/20 hover:border-orange-500/60 hover:shadow-orange-500/20
    `}>
        {isNew && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-20 shadow-md">
                NY
            </span>
        )}

        {isDropIn && (
            <span className="absolute -top-2 -left-2 bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-20 shadow-md">
                DROP-IN
            </span>
        )}

        <p className="text-xs sm:text-sm font-light text-gray-400 mb-1">{time}</p>
        <h4 className="text-base sm:text-lg font-bold my-2 text-orange-500">{name}</h4>
        <p className="text-xs sm:text-sm text-gray-300">{instructors}</p>

        {note && (
            <p className="text-[10px] sm:text-xs italic text-orange-200/70 mt-2 leading-tight">
                {note}
            </p>
        )}
    </div>
);


// --- Kärnkomponenten ---
export const ScheduleSection = () => {
    const { t, i18n } = useTranslation("scheduleTranslation");
    const currentLang = i18n.language;

    const courses: Course[] = t("courses", { returnObjects: true }) as Course[] || [];

    const dayKeys: string[] = ["dayMonday", "dayTuesday", "dayWednesday", "dayThursday", "daySunday"];

    return (
        <section
            id="schedule"
            className="relative py-16 sm:py-24 bg-[#1a1a1a] text-white"
        >

            {/* Bakgrundsbild för sektionen */}
            <div className="absolute inset-0">
                <Image
                    src="/img/Schedule/Scheduleimg.jpg"
                    alt={t('scheduleImageAlt', { defaultValue: 'Bakgrundsbild av dansande par' })}
                    fill
                    sizes="100vw"
                    priority={false}
                    className="object-cover opacity-10"
                />
            </div>


            <div className="container mx-auto max-w-7xl px-4 text-center relative z-10">

                {/* Rubrik/Info */}
                <p className="text-sm sm:text-base text-gray-300 mb-2 font-medium tracking-wide uppercase">
                    {t("schedulePreamble")}
                </p>

                <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-serif">
                    {t("scheduleTitle")}
                </h2>

                {/* NYTT: Tydlig info om Öppet Hus */}
                <div className="mb-12 animate-pulse">
                    <p className="text-xl sm:text-2xl font-extrabold text-orange-400 tracking-tight bg-orange-500/10 inline-block px-6 py-2 rounded-full border border-orange-500/30">
                        {t("openHouseInfo")}
                    </p>
                </div>



                {/* === SCHEDULE GRID FÖR DESKTOP/MOBIL === */}
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">

                        {dayKeys.map((dayKey) => (
                            <div key={dayKey} className="md:col-span-1 space-y-4">
                                {/* Dag-rubrik - Förbättrad styling */}
                                <h3 className="text-xl sm:text-2xl font-bold text-orange-500 mb-6 pb-2 border-b-2 border-orange-500/30">
                                    {t(dayKey)}
                                </h3>

                                {/* Filtrera och rendera kurser för denna dag */}
                                {Array.isArray(courses) && courses
                                    .filter(course => course.dayKey === dayKey)
                                    .map((course, index) => (
                                        <ScheduleItem
                                            key={index}
                                            time={course.time}
                                            name={course.name}
                                            instructors={course.instructors}
                                            note={course.noteKey ? t(course.noteKey) : undefined}
                                            isNew={course.isNew}
                                            isDropIn={course.isDropIn}
                                        />
                                    ))
                                }
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA / Footer Info - Förbättrad läsbarhet */}
                <p className="text-xl sm:text-2xl italic font-serif text-gray-300 mt-16 mb-3">
                    {t("scheduleFooter1")}
                </p>
                <p className="text-base sm:text-lg font-light text-gray-400 mb-12">
                    {t("scheduleFooter2")}
                </p>

                {/* CTA: Se Våra Kurser */}
                <div className="text-center">
                    <Link
                        href={`/${currentLang}/courses`}
                        className="
                            inline-block rounded-full bg-orange-500 px-10 py-4 text-lg sm:text-xl font-bold uppercase
                            tracking-wider text-white shadow-xl transition-all duration-300
                            hover:bg-orange-600 hover:scale-105 active:scale-95
                        "
                    >
                        {t("scheduleCta")}
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default ScheduleSection;