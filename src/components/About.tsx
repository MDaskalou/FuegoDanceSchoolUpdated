// src/components/AboutSection.tsx
"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { FaCircle } from "react-icons/fa";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";

// --- Kärnkomponenten ---
export const About = () => {
    const { t, i18n } = useTranslation("aboutTranslation");

    const { ref: sectionRef, inView } = useInView(0.2);

    const currentLang = i18n.language;
    const cardBaseClasses = "p-6 sm:p-8 rounded-xl shadow-xl backdrop-blur-sm";

    // Nya klasser för animeringen
    const baseTransition = "transition-all duration-1000 ease-out";

    const uniquePoints = [ t("uniquePoint1"), t("uniquePoint2") ];
    const studentGoals = [ t("goalPoint1"), t("goalPoint2"), t("goalPoint3"), t("goalPoint4") ];

    return (
        <section
            id="about-section"
            ref={sectionRef}
            // FIX: Använd bg-transparent för att visa body-gradienten
            className="relative py-16 sm:py-24 bg-transparent text-white overflow-x-hidden"
        >
            <div className="container mx-auto max-w-5xl px-4">

                {/* ------------------------------------------------------------- */}
                {/* BILDER FÖR ANIMATION (ABSOLUT POSITIONERADE) */}
                {/* ------------------------------------------------------------- */}

                {/* VÄNSTER BILD: Slide in från vänster + Subtil Rotation */}
                <div className={`
                    absolute left-0 top-1/4 h-80 w-64 md:h-96 md:w-80 hidden md:block z-10 
                    ${baseTransition} 
                    transform -rotate-2 ring-2 ring-offset-2 ring-orange-500 ring-offset-[#1a1a1a]
                    ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}
                `}>
                    <Image
                        src="/img/About/Aboutleft1.jpg"
                        alt={t("aboutImgLeftAlt")}
                        fill
                        className="object-cover rounded-xl"
                        sizes="(max-width: 768px) 0vw, 300px"
                    />
                </div>

                {/* HÖGER BILD: Slide in från höger + Rotation + Delay */}
                <div className={`
                    absolute right-0 top-1/2 h-80 w-64 md:h-96 md:w-80 hidden md:block z-10 
                    ${baseTransition} delay-300 
                    transform rotate-2 ring-2 ring-offset-2 ring-orange-500 ring-offset-[#1a1a1a]
                    ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
                `}>
                    <Image
                        src="/img/About/Aboutright1.jpg"
                        alt={t("aboutImgRightAlt")}
                        fill
                        className="object-cover rounded-xl"
                        sizes="(max-width: 768px) 0vw, 300px"
                    />
                </div>

                {/* === 1. Om Fuego Dance School === */}
                <h2 className="text-4xl sm:text-5xl font-bold text-center mb-10 text-orange-500">
                    {t("aboutTitle")}
                </h2>

                {/* Ge korten ett högre Z-index för att ligga ovanför bilderna */}
                <div className={`bg-[#262626] border border-white/10 ${cardBaseClasses} mb-16 mx-auto max-w-3xl relative z-20`}>
                    <p className="mb-6 leading-relaxed">{t("aboutText1")}</p>
                    <p className="mb-6 leading-relaxed">{t("aboutText2")}</p>
                    <p className="leading-relaxed">{t("aboutText3")}</p>
                </div>

                {/* ... (Resten av sektionerna) ... */}

                <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8">
                    {t("uniqueTitle")}
                </h3>

                <div className={`bg-[#262626] border border-white/10 ${cardBaseClasses} mb-16 mx-auto max-w-3xl relative z-20`}>
                    <ul className="space-y-6">
                        {uniquePoints.map((point, index) => (
                            <li key={index} className="flex items-start">
                                <FaCircle className="w-2 h-2 mt-2 mr-3 flex-shrink-0 text-orange-500" />
                                <span className="text-lg">{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* === 3. Vårt mål är att du som student ska: === */}
                <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8">
                    {t("studentGoalTitle")}
                </h3>

                <div className={`bg-[#262626] border border-white/10 ${cardBaseClasses} mb-16 mx-auto max-w-3xl relative z-20`}>
                    <ul className="space-y-6">
                        {studentGoals.map((goal, index) => (
                            <li key={index} className="flex items-start">
                                <FaCircle className="w-2 h-2 mt-2 mr-3 flex-shrink-0 text-orange-500" />
                                <span className="text-lg">{goal}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* === CTA: Möt våra instruktörer === */}
                <div className="text-center mt-12">
                    <Link
                        href={`/${currentLang}/instructors`}
                        className="
                            rounded-full bg-orange-500 px-10 py-3 text-lg font-bold uppercase
                            tracking-wider text-white shadow-xl transition-all duration-300
                            hover:bg-orange-600 hover:scale-105 active:scale-95
                        "
                    >
                        {t("ctaInstructor")}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default About;