import Link from "next/link";
import Image from "next/image";
import { getServerT } from "@/i18n";
import scheduleBg from "../../public/img/Schedule/Scheduleimg.jpg";

interface Course {
    dayKey: string;
    time: string;
    name: string;
    instructors: string;
    noteKey?: string;
    isNew: boolean;
    isDropIn: boolean;
    subtitle?: string;
    fillLabel?: string;
}

const ScheduleItem = ({ time, name, instructors, note, isNew = false, isDropIn = false, subtitle, fillLabel }: {
    time: string;
    name: string;
    instructors: string;
    note?: string;
    isNew?: boolean;
    isDropIn?: boolean;
    subtitle?: string;
    fillLabel?: string;
}) => (
    <div className="
        bg-white/5 border-orange-500/30 p-4 rounded-xl text-center relative shadow-lg backdrop-blur-sm border
        transition-all duration-300 transform
        hover:scale-[1.02] hover:bg-orange-500/20 hover:border-orange-500/60 hover:shadow-orange-500/20
    ">
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

        {fillLabel && !isNew && (
            <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-20 shadow-md">
                {fillLabel}
            </span>
        )}

        <p className="text-xs sm:text-sm font-light text-gray-400 mb-1">{time}</p>
        <h4 className="text-base sm:text-lg font-bold mt-2 text-orange-500">{name}</h4>
        {subtitle && (
            <p className="text-xs sm:text-sm font-medium text-orange-300/80 -mt-1 mb-1">{subtitle}</p>
        )}
        <p className="text-xs sm:text-sm text-gray-300">{instructors}</p>

        {note && (
            <p className="text-[10px] sm:text-xs italic text-orange-200/70 mt-2 leading-tight">
                {note}
            </p>
        )}
    </div>
);

interface ScheduleSectionProps {
    lang: string;
}

export default async function ScheduleSection({ lang }: ScheduleSectionProps) {
    const t = await getServerT(lang, "scheduleTranslation");

    const coursesRaw = t("courses", { returnObjects: true });
    const courses: Course[] = Array.isArray(coursesRaw) ? coursesRaw : [];
    const dayKeys: string[] = ["dayMonday", "dayTuesday", "dayWednesday", "dayThursday", "daySunday"];

    return (
        <section
            id="schedule"
            className="relative py-16 sm:py-24 bg-[#1a1a1a] text-white"
        >
            <div className="absolute inset-0 overflow-hidden">
                <Image
                    src={scheduleBg}
                    alt={t("scheduleImageAlt", { defaultValue: "Bakgrundsbild av dansande par" })}
                    fill
                    sizes="100vw"
                    priority={false}
                    className="object-cover opacity-10"
                    placeholder="blur"
                />
            </div>

            <div className="container mx-auto max-w-7xl px-4 text-center relative z-10">
                <p className="text-xs sm:text-sm text-orange-400/70 mb-3 font-semibold tracking-[0.2em] uppercase">
                    {t("schedulePreamble")}
                </p>

                <h2 className="text-5xl sm:text-6xl font-bold mb-8 font-serif text-white drop-shadow-lg">
                    {t("scheduleTitle")}
                </h2>

                <div className="mb-12 animate-pulse">
                    <p className="text-xl sm:text-2xl font-extrabold text-orange-400 tracking-tight bg-orange-500/10 inline-block px-6 py-2 rounded-full border border-orange-500/30">
                        {t("openHouseInfo")}
                    </p>
                </div>

                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8 justify-center">
                        {dayKeys.map((dayKey) => (
                            <div key={dayKey} className="md:col-span-1 space-y-4">
                                <h3 className="text-xl sm:text-2xl font-bold text-orange-500 mb-6 pb-2 border-b-2 border-orange-500/30">
                                    {t(dayKey)}
                                </h3>

                                {courses
                                    .filter((course) => course.dayKey === dayKey)
                                    .map((course, index) => (
                                        <ScheduleItem
                                            key={index}
                                            time={course.time}
                                            name={course.name}
                                            subtitle={course.subtitle}
                                            instructors={course.instructors}
                                            note={course.noteKey ? t(course.noteKey) : undefined}
                                            isNew={course.isNew}
                                            isDropIn={course.isDropIn}
                                            fillLabel={course.fillLabel}
                                        />
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-xl sm:text-2xl italic font-serif text-gray-300 mt-16 mb-3">
                    {t("scheduleFooter1")}
                </p>
                <p className="text-base sm:text-lg font-light text-gray-400 mb-12">
                    {t("scheduleFooter2")}
                </p>

                <div className="text-center">
                    <Link
                        href={`/${lang}/courses`}
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
}
