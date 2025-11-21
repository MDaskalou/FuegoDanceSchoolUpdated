// src/components/ScheduleSection.tsx
"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image"; // Import av Image är inte nödvändig här, men skadar inte.

// Definerar strukturen för ett kurs-objekt (för bättre typning)
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
        bg-[#262626] p-4 rounded-xl text-center relative shadow-lg
        border border-white/10 transition-transform duration-300 hover:scale-[1.03]
        ${isDropIn ? 'bg-[#311a18]' : ''}
    `}>
        {/* 'NY'-tagg */}
        {isNew && (
            <span className="absolute top-[-10px] right-[-10px] bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg transform rotate-6">
                NY
            </span>
        )}

        <p className="text-sm font-light text-gray-400">{time}</p>
        <h4 className="text-base font-bold my-1 text-orange-500">{name}</h4>
        <p className="text-xs text-gray-300">{instructors}</p>
        {note && <p className="text-[10px] italic text-red-300 mt-1">{note}</p>}
    </div>
);


// --- Kärnkomponenten ---
export const ScheduleSection = () => {
    // VIKTIGT: Byt till att använda scheduleTranslation
    const { t, i18n } = useTranslation("scheduleTranslation");
    const currentLang = i18n.language;

    // Hämta kurserna från JSON och tvinga typen (alternativt hämta och parsa dem)
    // I en verklig app skulle du ladda dessa asynkront. Här använder vi t()
    const courses: Course[] = t("courses", { returnObjects: true }) as Course[];

    // Definiera dag-nycklarna för att iterera över i rätt ordning
    const dayKeys: string[] = ["dayMonday", "dayTuesday", "dayWednesday", "dayThursday", "daySunday"];

    return (
        <section
            id="schedule"
            // FIX: Byt ut bg-[#1a1a1a] till bg-transparent för att visa body-gradienten
            className="py-16 sm:py-24 bg-transparent text-white"
        >
            <div className="container mx-auto max-w-7xl px-4 text-center">

                {/* Rubrik/Info (Hämtas från JSON) */}
                <p className="text-base text-gray-400 mb-2">{t("schedulePreamble")}</p>
                <h2 className="text-4xl sm:text-5xl font-bold mb-12">
                    {t("scheduleTitle")}
                </h2>

                {/* === SCHEDULE GRID FÖR DESKTOP/MOBIL === */}
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

                        {dayKeys.map((dayKey) => (
                            <div key={dayKey} className="md:col-span-1 space-y-4">
                                {/* Dag-rubrik */}
                                <h3 className="text-lg font-semibold text-gray-300 md:text-orange-500">
                                    {t(dayKey)}
                                </h3>

                                {/* Filtrera och rendera kurser för denna dag */}
                                {courses
                                    .filter(course => course.dayKey === dayKey)
                                    .map((course, index) => (
                                        <ScheduleItem
                                            key={index}
                                            time={course.time}
                                            name={course.name}
                                            instructors={course.instructors}
                                            // Använd noteKey för att hämta översatt anteckning, annars undefined
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

                {/* CTA / Footer Info (Hämtas från JSON) */}
                <p className="text-xl italic font-serif text-gray-400 mt-12 mb-4">{t("scheduleFooter1")}</p>
                <p className="text-base font-light text-gray-500 mb-10">{t("scheduleFooter2")}</p>

                {/* CTA: Se Våra Kurser (Hämtas från JSON) */}
                <div className="text-center">
                    <Link
                        href={`/${currentLang}/#courses`}
                        className="
                            rounded-full bg-orange-500 px-10 py-3 text-lg font-bold uppercase
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