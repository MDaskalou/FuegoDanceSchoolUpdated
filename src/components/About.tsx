"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { FaCircle } from "react-icons/fa";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";

export const About = () => {
    const { t, i18n } = useTranslation("aboutTranslation");
    const { ref: sectionRef, inView } = useInView(0.2);

    const currentLang = i18n.language;
    const cardBaseClasses = "p-6 sm:p-8 rounded-xl shadow-xl backdrop-blur-sm";
    const baseTransition = "transition-all duration-1000 ease-out";

    const uniquePoints = [ t("uniquePoint1"), t("uniquePoint2") ];
    const studentGoals = [ t("goalPoint1"), t("goalPoint2"), t("goalPoint3"), t("goalPoint4") ];

    return (
        <section
            id="about-section"
            ref={sectionRef}
            className="relative py-16 sm:py-24 bg-transparent text-white overflow-x-hidden"
        >
            <div className="container mx-auto max-w-5xl px-4">

                {/* 1. VÄNSTER BILD */}
                <div className={`
                    absolute left-0 top-[15%] lg:top-1/4 h-80 w-64 md:h-96 md:w-80 hidden md:block z-10 
                    ${baseTransition} 
                    transform -rotate-2 ring-2 ring-offset-2 ring-orange-500 ring-offset-[#1a1a1a] shadow-2xl
                    ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}
                `}>
                    <Image
                        src="/img/About/Aboutleft1.jpg"
                        alt={t("aboutImgLeftAlt")}
                        fill
                        className="object-cover rounded-xl hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 0vw, 300px"
                    />
                </div>

                {/* 2. MASONRY COLLAGE */}
                <div className={`
                    absolute left-0 top-[65%] w-64 md:w-80 hidden md:grid grid-cols-2 gap-2 z-10 
                    ${baseTransition} delay-500
                    ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}
                `}>
                    <div className="relative row-span-2 h-64 md:h-72 rounded-lg overflow-hidden border-2 border-orange-500/50 shadow-lg transform rotate-[-2deg]">
                        <Image
                            src="/img/About/About8.jpg"
                            alt="Fuego moment large"
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-700"
                            sizes="200px"
                        />
                    </div>
                    <div className="relative h-32 md:h-36 rounded-lg overflow-hidden border-2 border-orange-500/50 shadow-lg transform rotate-[2deg]">
                        <Image
                            src="/img/About/About6.jpg"
                            alt="Fuego moment small 1"
                            fill
                            className="object-cover object-top hover:scale-110 transition-transform duration-700"
                            sizes="150px"
                        />
                    </div>
                    <div className="relative h-32 md:h-36 rounded-lg overflow-hidden border-2 border-orange-500/50 shadow-lg transform rotate-[-1deg]">
                        <Image
                            src="/img/About/About7.jpg"
                            alt="Fuego moment small 2"
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-700"
                            sizes="150px"
                        />
                    </div>
                </div>

                {/* 3. HÖGER BILD */}
                <div className={`
                    absolute right-0 top-1/3 md:top-1/2 h-80 w-64 md:h-96 md:w-80 hidden md:block z-10 
                    ${baseTransition} delay-300 
                    transform rotate-2 ring-2 ring-offset-2 ring-orange-500 ring-offset-[#1a1a1a] shadow-2xl
                    ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
                `}>
                    <Image
                        src="/img/About/Aboutright1.jpg"
                        alt={t("aboutImgRightAlt")}
                        fill
                        className="object-cover rounded-xl hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 0vw, 300px"
                    />
                </div>

                {/* INNEHÅLL (TEXT) */}
                <h2 className="text-4xl sm:text-5xl font-bold text-center mb-10 text-orange-500 drop-shadow-lg">
                    {t("aboutTitle")}
                </h2>

                <div className={`bg-[#262626]/90 border border-white/10 ${cardBaseClasses} mb-16 mx-auto max-w-3xl relative z-20`}>
                    <p className="mb-6 leading-relaxed text-lg text-gray-200">{t("aboutText1")}</p>
                    <p className="mb-6 leading-relaxed text-lg text-gray-200">{t("aboutText2")}</p>
                    <p className="leading-relaxed text-lg text-gray-200">{t("aboutText3")}</p>
                </div>

                {/* Unika punkter och mål */}
                <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 drop-shadow-md">
                    {t("uniqueTitle")}
                </h3>
                <div className={`bg-[#262626]/90 border border-white/10 ${cardBaseClasses} mb-16 mx-auto max-w-3xl relative z-20`}>
                    <ul className="space-y-6">
                        {uniquePoints.map((point, index) => (
                            <li key={index} className="flex items-start">
                                <FaCircle className="w-2 h-2 mt-2 mr-3 flex-shrink-0 text-orange-500" />
                                <span className="text-lg text-gray-200">{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 drop-shadow-md">
                    {t("studentGoalTitle")}
                </h3>
                <div className={`bg-[#262626]/90 border border-white/10 ${cardBaseClasses} mb-16 mx-auto max-w-3xl relative z-20`}>
                    <ul className="space-y-6">
                        {studentGoals.map((goal, index) => (
                            <li key={index} className="flex items-start">
                                <FaCircle className="w-2 h-2 mt-2 mr-3 flex-shrink-0 text-orange-500" />
                                <span className="text-lg text-gray-200">{goal}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CTA */}
                <div className="text-center mt-12 relative z-20">
                    <Link
                        href={`/${currentLang}/instructors`}
                        className="inline-block rounded-full bg-orange-500 px-10 py-4 text-lg font-bold uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:bg-orange-600 hover:scale-105 active:scale-95"
                    >
                        {t("ctaInstructor")}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default About;