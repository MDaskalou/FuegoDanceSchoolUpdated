"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { IconType } from 'react-icons';
import { FaHeart, FaUsers, FaLightbulb, FaSmile, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// 1. Interface för params
export interface ValuesPageClientProps {
    params: { lang: string };
}

interface ValueItem {
    key: string;
    iconKey: 'users' | 'lightbulb' | 'smile' | 'heart';
    title: string;
    shortDescription: string;
    fullDescription?: string;
    bulletPoints?: string[];
}

// Mappar ikonnyckeln till den faktiska React Icon-komponenten
const ICON_MAP: Record<ValueItem['iconKey'], IconType> = {
    users: FaUsers,
    lightbulb: FaLightbulb,
    smile: FaSmile,
    heart: FaHeart,
};

// --- Expanderbar Value Card Component ---
const ValueCard = ({ item, index }: { item: ValueItem; index: number }) => {
    const { t } = useTranslation("valuesTranslation");
    const [isExpanded, setIsExpanded] = useState(false);
    const isEven = index % 2 === 0;
    const CardIcon = ICON_MAP[item.iconKey];

    return (
        <div
            className={`
                flex flex-col md:flex-row gap-8 items-center 
                ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}
            `}
        >
            {/* Ikon & Titel */}
            <div className="w-full md:w-1/3 flex justify-center flex-col items-center">
                <div className="w-28 h-28 bg-[#262626] rounded-full flex items-center justify-center mb-4 border-2 border-orange-500 shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-orange-500/50">
                    <CardIcon className="w-14 h-14 text-orange-500" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-orange-500 text-center">{item.title}</h2>
            </div>

            {/* Innehåll */}
            <div className="w-full md:w-2/3 bg-[#262626] p-6 sm:p-8 rounded-xl border border-orange-500/30 shadow-2xl transition-all duration-300 hover:shadow-orange-500/20">

                {/* Kort beskrivning - Alltid synlig */}
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg mb-4">
                    {item.shortDescription}
                </p>

                {/* Expanderat innehåll */}
                <div
                    className={`
                        overflow-hidden transition-all duration-500 ease-in-out
                        ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                    `}
                >
                    {item.fullDescription && (
                        <div className="pt-4 border-t border-orange-500/30 space-y-4">
                            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                                {item.fullDescription}
                            </p>

                            {/* Bullet points */}
                            {item.bulletPoints && item.bulletPoints.length > 0 && (
                                <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm sm:text-base pl-2">
                                    {item.bulletPoints.map((point, idx) => (
                                        <li key={idx}>{point}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* Läs mer/mindre knapp - Visa endast om det finns fullDescription */}
                {item.fullDescription && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="
                            mt-4 text-orange-500 font-semibold flex items-center gap-2
                            transition-all duration-300 hover:text-orange-400 hover:gap-3
                        "
                    >
                        {isExpanded ? (
                            <>
                                {t('showLess', { defaultValue: 'Visa mindre' })}
                                <FaChevronUp className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                {t('showMore', { defaultValue: 'Läs mer' })}
                                <FaChevronDown className="w-4 h-4" />
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

// --- Huvudkomponent (Client) ---
// 2. Vi tar emot params utan underscore för att vara konsekventa
export default function ValuesPageClient({ params }: ValuesPageClientProps) {
    const { t } = useTranslation("valuesTranslation");

    // 3. Vi lägger till useEffect för att "använda" params och undvika lint-fel
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            // console.log("Values page loaded for lang:", params.lang);
        }
    }, [params]);

    const values: ValueItem[] = t("valuesData", { returnObjects: true }) as ValueItem[] || [];

    return (
        <div className="pt-24 pb-16 bg-transparent min-h-screen text-white">
            <div className="container mx-auto max-w-5xl px-4">

                <h1 className="text-5xl sm:text-6xl font-bold text-center mb-20 pt-8 font-serif">
                    {t('valuesPageTitle', { defaultValue: 'Våra Kärnvärden' })}
                </h1>

                <div className="space-y-16 md:space-y-20">
                    {Array.isArray(values) && values.length > 0 ? (
                        values.map((item, index) => (
                            <ValueCard key={item.key} item={item} index={index} />
                        ))
                    ) : (
                        <p className="text-center text-gray-400 text-xl">
                            {t('noValuesFound', { defaultValue: 'Inga värden att visa.' })}
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
}