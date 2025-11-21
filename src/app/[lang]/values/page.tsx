// src/app/[lang]/values/page.tsx
"use client";

import React from 'react';
import { useTranslation } from "react-i18next";
import {IconType} from 'react-icons'
import { FaHeart, FaUsers, FaLightbulb, FaSmile} from 'react-icons/fa'; // Importera IconType

// --- Typdefinitioner för Värden ---
interface ValueItem {
    key: string;
    iconKey: 'users' | 'lightbulb' | 'smile' | 'heart'; // Tvinga till kända nycklar
    title: string;
    description: string;
}

// Mappar ikonnyckeln till den faktiska React Icon-komponenten
const ICON_MAP: Record<ValueItem['iconKey'], IconType> = {
    users: FaUsers,
    lightbulb: FaLightbulb,
    smile: FaSmile,
    heart: FaHeart,
};

// --- Huvudkomponent ---
export default function ValuesPage() {
    // VIKTIGT: Byt till det nya namnespacet "valuesTranslation"
    const { t } = useTranslation("valuesTranslation");

    // Laddar värden från JSON
    const values: ValueItem[] = t("valuesData", { returnObjects: true }) as ValueItem[] || [];

    return (
        <div className="pt-24 pb-16 bg-transparent min-h-screen text-white">
            <div className="container mx-auto max-w-4xl px-4">

                <h1 className="text-5xl sm:text-6xl font-bold text-orange-500 mb-16 text-center pt-8">
                    {t('valuesPageTitle', { defaultValue: 'Våra Kärnvärden' })}
                </h1>

                {/* Värden Grid */}
                <div className="space-y-16">
                    {values.map((item, index) => {
                        const isEven = index % 2 === 0;
                        const CardIcon = ICON_MAP[item.iconKey]; // Hämta ikonen baserat på nyckel

                        return (
                            <div
                                key={item.key}
                                className={`
                                    flex flex-col md:flex-row gap-8 items-center 
                                    ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}
                                `}
                            >
                                {/* Ikon / Visuellt element */}
                                <div className="w-full md:w-1/3 flex justify-center flex-col items-center">
                                    <div className="w-24 h-24 bg-[#262626] rounded-full flex items-center justify-center mb-4 border-2 border-orange-500 shadow-xl">
                                        <CardIcon className="w-12 h-12 text-orange-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-orange-500">{item.title}</h2>
                                </div>

                                {/* Textkort */}
                                <div className="w-full md:w-2/3 bg-[#262626] p-6 rounded-xl border border-white/10 shadow-2xl">
                                    <p className="text-gray-300 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}