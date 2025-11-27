// src/components/PriceSection.tsx
"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { Sparkles, Percent, Calendar } from 'lucide-react';

interface Course {
    count: number;
    price: number;
    popular: boolean;
}

interface DropInItem {
    count: number;
    price: number;
    isSocial: boolean;
    labelKey?: string;
}

export const PriceSection = () => {
    const { t, i18n } = useTranslation("priceTranslation");
    const { ref: sectionRef, inView } = useInView(0.15);

    const currentLang = i18n.language;

    const courses: Course[] = t("courses", { returnObjects: true }) as Course[] || [];
    const dropInItems: DropInItem[] = t("dropInItems", { returnObjects: true }) as DropInItem[] || [];

    const cardBaseClass = "p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-sm bg-[#262626]/80";

    // Funktion för att rendera kursnamn dynamiskt
    const getCourseLabel = (count: number) => {
        if (count === 0) return t("socialDanceLabel");
        return `${count} ${t(count === 1 ? "courseLabelSingular" : "courseLabelPlural")}`;
    };

    // Klassen för animation
    const animateCard = (index: number) =>
        `${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700 ease-out delay-${index * 150}`;

    return (
        <section
            id="prices"
            ref={sectionRef}
            className="py-20 sm:py-32 bg-transparent text-white"
        >
            <div className="container mx-auto max-w-6xl px-4 text-center">

                {/* Rubrik och Highlight Banner */}
                <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-10">
                    {t("priceTitle")}
                </h2>
                <div className="inline-block bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg mb-16 text-lg font-medium transform transition-all duration-300 hover:scale-[1.03]">
                    {t("priceHighlight")}
                </div>

                {/* === Priskort Container === */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-stretch mb-12">

                    {/* --- KORT 1: KURSER --- */}
                    <div className={`w-full ${animateCard(0)}`}>
                        <div className={`w-full ${cardBaseClass} border-t-4 border-orange-500`}>
                            <h3 className="text-2xl font-bold mb-8 text-orange-500 flex items-center justify-center gap-2">
                                <Sparkles className="w-6 h-6" />
                                {t("cardCourseTitle")}
                            </h3>

                            <ul className="space-y-4">
                                {Array.isArray(courses) && courses.map((course, index) => (
                                    <li
                                        key={index}
                                        className={`
                                            flex justify-between items-center py-3 px-4 rounded-xl relative
                                            transition-all duration-300 hover:scale-[1.02]
                                            ${course.popular
                                            ? 'bg-orange-500/10 border border-orange-500/50 hover:bg-orange-500/20'
                                            : 'border-b border-white/10 hover:bg-white/5'}
                                        `}
                                    >
                                        <span className="text-base sm:text-lg font-medium">
                                            {getCourseLabel(course.count)}
                                        </span>

                                        <div className="flex items-center gap-3">
                                            {course.popular && (
                                                <span className="
                                                    bg-gradient-to-r from-red-600 to-red-500
                                                    text-white text-xs font-bold px-3 py-1
                                                    rounded-full transform -rotate-2
                                                    shadow-lg animate-pulse
                                                ">
                                                    {t("tagPopular")}
                                                </span>
                                            )}
                                            <span className="text-xl sm:text-2xl font-bold">{course.price} kr</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* --- KORT 2: RABATTER --- */}
                    <div className={`w-full ${animateCard(1)}`}>
                        <div className={`w-full ${cardBaseClass}`}>
                            <h3 className="text-2xl font-bold mb-8 text-orange-500 flex items-center justify-center gap-2">
                                <Percent className="w-6 h-6" />
                                {t("cardDiscountTitle")}
                            </h3>

                            <ul className="space-y-6 text-left">
                                <li className="text-lg sm:text-xl p-4 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]">
                                    {t("discountStudent")}
                                </li>
                                <li className="text-lg sm:text-xl p-4 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]">
                                    {t("discountCouple")}
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* --- KORT 3: DROP-IN SÖNDAGAR --- */}
                    <div className={`w-full ${animateCard(2)}`}>
                        <div className={`w-full ${cardBaseClass} border-t-4 border-orange-500`}>
                            <h3 className="text-2xl font-bold mb-8 text-orange-500 flex items-center justify-center gap-2">
                                <Calendar className="w-6 h-6" />
                                {t("cardDropInTitle")}
                            </h3>

                            <ul className="space-y-4 mb-4">
                                {Array.isArray(dropInItems) && dropInItems.map((item, index) => (
                                    <li
                                        key={index}
                                        className={`
                                            flex justify-between items-center py-3 px-4 rounded-xl 
                                            transition-all duration-300 hover:scale-[1.02]
                                            ${item.isSocial
                                            ? 'border border-dashed border-gray-600 hover:border-gray-500'
                                            : 'bg-orange-500/10 border border-orange-500 hover:bg-orange-500/20'}
                                        `}
                                    >
                                        <span className={`text-base sm:text-lg font-medium ${item.isSocial ? 'text-gray-400' : ''}`}>
                                            {getCourseLabel(item.count)}
                                        </span>
                                        <span className={`text-xl sm:text-2xl font-bold ${item.isSocial ? 'text-gray-400' : ''}`}>
                                            {item.price} kr
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <p className="text-sm italic text-left text-gray-300 border-t border-white/10 pt-4 mt-4">
                                {t("dropInNote")}
                            </p>
                        </div>
                    </div>

                </div>

                {/* CTA: Boka nu */}
                <div className="text-center mt-10">
                    <Link
                        href={`/${currentLang}/booking-link`}
                        className="
                            inline-block rounded-full bg-orange-500 px-12 py-4 text-xl font-bold uppercase
                            tracking-wider text-white shadow-xl transition-all duration-300
                            hover:bg-orange-600 hover:scale-105 active:scale-95
                        "
                    >
                        {t("ctaBookNow")}
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default PriceSection;