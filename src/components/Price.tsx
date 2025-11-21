// src/components/PriceSection.tsx
"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useInView } from "@/hooks/useInView"; // FIX: Importera hooken

interface Course {
    count: number;
    price: number;
    popular: boolean;
}

interface DropInItem {
    count: number;
    price: number;
    isSocial: boolean;
    labelKey?: string; // Används för 'Social dans'
}

export const PriceSection = () => {
    const { t, i18n } = useTranslation("priceTranslation");
    const { ref: sectionRef, inView } = useInView(0.15); // NYTT: Använd ref och inView

    const currentLang = i18n.language;

    const courses: Course[] = t("courses", { returnObjects: true }) as Course[] || [];
    const dropInItems: DropInItem[] = t("dropInItems", { returnObjects: true }) as DropInItem[] || [];

    // OBS: bg-[#262626]/80 är fortfarande på korten, vilket ger kontrast mot den transparenta sektionen
    const cardBaseClass = "p-6 rounded-3xl shadow-2xl backdrop-blur-sm bg-[#262626]/80";

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
            ref={sectionRef} // Lägg till ref till sektionen
            className="py-20 sm:py-32 bg-transparent text-white"
        >
            <div className="container mx-auto max-w-6xl px-4 text-center">

                {/* Rubrik och Highlight Banner (Oförändrat) */}
                <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-10">
                    {t("priceTitle")}
                </h2>
                <div className="inline-block bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg mb-16 text-lg font-medium transform transition-all duration-300 hover:scale-[1.03]">
                    {t("priceHighlight")}
                </div>

                {/* === Priskort Container (NYTT GRID) === */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-stretch mb-12">

                    {/* --- KORT 1: KURSER (FIXED COURSES) --- */}
                    <div className={`w-full ${animateCard(0)}`}>
                        <div className={`w-full ${cardBaseClass} border-t-4 border-orange-500`}>
                            <h3 className="text-2xl font-bold mb-6 text-orange-500">
                                {t("cardCourseTitle")}
                            </h3>

                            <ul className="space-y-4">
                                {Array.isArray(courses) && courses.map((course, index) => (
                                    <li
                                        key={index}
                                        className={`
                                            flex justify-between items-center py-2 px-3 rounded-xl relative
                                            ${course.popular ? 'bg-orange-500/10 border border-orange/50' : 'border-b border-white/10'}
                                        `}
                                    >
                                        <span className="text-lg font-medium">
                                            {/* FIX: Använd getCourseLabel för korrekt singular/plural */}
                                            {getCourseLabel(course.count)}
                                        </span>

                                        <div className="flex items-center">
                                            {course.popular && (
                                                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full mr-3 transform -rotate-3 shadow-md">
                                                    {t("tagPopular")}
                                                </span>
                                            )}
                                            <span className="text-xl font-extrabold">{course.price} kr</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* --- KORT 2: RABATTER (DISCOUNTS) --- */}
                    <div className={`w-full ${animateCard(1)}`}>
                        <div className={`w-full ${cardBaseClass}`}>
                            <h3 className="text-2xl font-bold mb-6 text-orange-500">
                                {t("cardDiscountTitle")}
                            </h3>

                            <ul className="space-y-6 text-left">
                                <li className="text-xl">
                                    {t("discountStudent")}
                                </li>
                                <li className="text-xl">
                                    {t("discountCouple")}
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* --- KORT 3: DROP-IN SÖNDAGAR (NYTT KORT) --- */}
                    <div className={`w-full ${animateCard(2)}`}>
                        <div className={`w-full ${cardBaseClass} border-t-4 border-orange-500`}>
                            <h3 className="text-2xl font-bold mb-6 text-orange-500">
                                {t("cardDropInTitle")}
                            </h3>

                            <ul className="space-y-4 mb-4">
                                {Array.isArray(dropInItems) && dropInItems.map((item, index) => (
                                    <li
                                        key={index}
                                        className={`
                                            flex justify-between items-center py-2 px-3 rounded-xl 
                                            ${item.isSocial ? 'border-b border-white/10 text-gray-400' : 'bg-orange-500/10 border border-orange-500'}
                                        `}
                                    >
                                        <span className="text-lg font-medium">
                                            {getCourseLabel(item.count)}
                                        </span>
                                        <span className="text-xl font-extrabold">{item.price} kr</span>
                                    </li>
                                ))}
                            </ul>

                            <p className="text-sm italic text-left text-gray-300 border-t border-white/10 pt-4 mt-4">
                                {t("dropInNote")}
                            </p>
                        </div>
                    </div>

                </div>

                {/* CTA: Boka nu (Oförändrat) */}
                <div className="text-center mt-10">
                    <Link
                        href={`/${currentLang}/booking-link`}
                        className="
                            rounded-full bg-orange-500 px-12 py-4 text-xl font-bold uppercase
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